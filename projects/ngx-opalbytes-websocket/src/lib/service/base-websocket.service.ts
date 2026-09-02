/* eslint-disable no-console */
import { BehaviorSubject, Observable, Subject, timer } from 'rxjs';
import { map, take, takeUntil } from 'rxjs/operators';


import { CaoWebSocketConnection } from '../class/websocket-connection';
import { CaoWebSocketState } from '../enum/websocket-state.enum';
import { ICaoWebSocketConfig } from '../interface/websocket-config.model';
import { ICaoWebSocketResponse } from '../interface/websocket-response.model';


/**
 * Classe base abstrata para serviços WebSocket
 * Implementa Template Method Pattern para extensibilidade
 *
 * Funcionalidades:
 * - Gerenciamento de conexão/desconexão
 * - Reconnection automática com exponential backoff
 * - Envio e recebimento de mensagens
 * - Stream de estado da conexão
 *
 * SOLID Principles:
 * - S: Responsável apenas pela gestão de conexão WebSocket
 * - O: Extensível via métodos abstratos, sem modificar código base
 * - L: Subclasses podem substituir sem quebrar funcionalidade
 * - D: Depende de abstrações (ConfigService) não de implementações concretas
 *
 * @template TRequest Tipo da requisição enviada
 * @template TResponse Tipo da resposta recebida
 */
export abstract class CaoWebSocketService<TRequest, TResponse> {
  protected connection$ = new BehaviorSubject<CaoWebSocketConnection | null>(null);
  protected messages$ = new Subject<ICaoWebSocketResponse<TResponse>>();
  protected state$ = new BehaviorSubject<CaoWebSocketState>(CaoWebSocketState.Disconnected);
  protected config!: ICaoWebSocketConfig;
  protected reconnectAttempt = 0;
  protected reconnectTimer?: ReturnType<typeof setTimeout>;
  protected destroy$ = new Subject<void>();

  /**
   * Conecta ao WebSocket
   * @param configOverride Sobrescrever configuração padrão parcialmente
   */
  connect(configOverride?: Partial<ICaoWebSocketConfig>): Observable<boolean> {
    // Merge config padrão com override
    this.config = {
      ...this.getDefaultConfig(),
      ...configOverride,
    };

    // Limpar tentativas de reconexão anteriores
    this.clearReconnectTimer();

    this.state$.next(CaoWebSocketState.Connecting);

    const connection = new CaoWebSocketConnection(this.config);

    return new Observable<boolean>((observer) => {
      // Aguardar conexão aberta
      connection.open$.pipe(take(1)).subscribe(() => {
        this.connection$.next(connection);
        this.state$.next(CaoWebSocketState.Connected);
        this.reconnectAttempt = 0; // Reset attempts on successful connection

        // Escutar mensagens
        connection.messages$.pipe(takeUntil(this.destroy$)).subscribe({
          next: (event: MessageEvent) => {
            try {
              const rawData = JSON.parse(event.data);
              const transformedData = this.transformResponse(rawData);

              this.messages$.next({
                success: true,
                data: transformedData,
                metadata: {},
              });
            } catch (error) {
              console.error('[BaseWebSocket] Error parsing message:', error);
              this.handleError(error);
            }
          },
        });

        // Escutar desconexão
        connection.close$.pipe(takeUntil(this.destroy$)).subscribe((event: CloseEvent) => {
          console.log('[BaseWebSocket] Connection closed:', event.code, event.reason);
          this.state$.next(CaoWebSocketState.Disconnected);

          // Tentar reconectar se configurado
          if (this.config.reconnect && event.code !== 1000) {
            // 1000 = normal closure
            this.scheduleReconnect();
          }
        });

        // Escutar erros
        connection.error$.pipe(takeUntil(this.destroy$)).subscribe((event: Event) => {
          console.error('[BaseWebSocket] Connection error:', event);
          this.handleError(event);
        });

        observer.next(true);
        observer.complete();
      });

      // Tratar erro na conexão inicial
      connection.error$.pipe(take(1)).subscribe((event: Event) => {
        observer.error(event);
      });

      // Iniciar conexão
      connection.connect();
    });
  }

  /**
   * Desconecta do WebSocket
   */
  disconnect(): void {
    this.clearReconnectTimer();

    const connection = this.connection$.value;
    if (connection) {
      connection.close(1000, 'Normal closure');
      connection.destroy();
      this.connection$.next(null);
    }

    this.state$.next(CaoWebSocketState.Disconnected);
  }

  /**
   * Envia mensagem para o WebSocket
   * Aplica transformação antes de enviar
   */
  send(message: TRequest): void {
    const connection = this.connection$.value;
    if (!connection || !connection.isOpen) {
      console.error('[BaseWebSocket] Cannot send: connection not open');
      return;
    }

    const transformed = this.transformRequest(message);
    const serialized = JSON.stringify(transformed);

    connection.send(serialized);
  }

  /**
   * Reconnection com Exponential Backoff
   * Fórmula: delay = min(base * 2^attempt, maxDelay)
   * Exemplo: 3s → 6s → 12s → 24s → 48s → 60s (max)
   */
  protected scheduleReconnect(): void {
    const maxAttempts = this.config.reconnectAttempts || 5;

    if (this.reconnectAttempt >= maxAttempts) {
      console.error('[BaseWebSocket] Max reconnection attempts reached');
      this.state$.next(CaoWebSocketState.Error);
      return;
    }

    const baseInterval = this.config.reconnectInterval || 3000;
    const backoffMultiplier = Math.pow(2, this.reconnectAttempt);
    const delay = Math.min(baseInterval * backoffMultiplier, 60000); // Max 60s

    console.log(
      `[BaseWebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempt + 1}/${maxAttempts})`,
    );

    this.state$.next(CaoWebSocketState.Reconnecting);
    this.reconnectAttempt++;

    this.reconnectTimer = setTimeout(() => {
      this.connect().subscribe({
        next: (connected) => {
          if (connected) {
            console.log('[BaseWebSocket] Reconnected successfully');
          }
        },
        error: (err) => {
          console.error('[BaseWebSocket] Reconnection failed:', err);
          this.scheduleReconnect(); // Tentar novamente
        },
      });
    }, delay);
  }

  /**
   * Limpa timer de reconexão
   */
  protected clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    this.reconnectAttempt = 0;
  }

  /**
   * Gera CorrelationId único para rastreamento
   */
  protected generateCorrelationId(): string {
    return crypto.randomUUID();
  }

  /**
   * Cria observable de timeout
   */
  protected setupTimeoutHandler(timeout: number): Observable<'timeout'> {
    return timer(timeout).pipe(map(() => 'timeout' as const));
  }

  /**
   * Cleanup na destruição do serviço
   */
  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnect();
    this.messages$.complete();
    this.state$.complete();
    this.connection$.complete();
  }

  // ==========================================
  // Template Methods (devem ser implementados pelas subclasses)
  // ==========================================

  /**
   * Retorna configuração padrão do WebSocket
   * Cada subclasse define sua própria config
   */
  protected abstract getDefaultConfig(): ICaoWebSocketConfig;

  /**
   * Transforma requisição antes de enviar
   * Ex: adicionar correlationId, timestamp, etc
   */
  protected abstract transformRequest(data: TRequest): unknown;

  /**
   * Transforma resposta recebida
   * Ex: validar, converter tipos, etc
   */
  protected abstract transformResponse(data: unknown): TResponse;

  /**
   * Trata erros específicos do protocolo
   */
  protected abstract handleError(error: unknown): void;

  // ==========================================
  // Getters públicos
  // ==========================================

  /**
   * Observable de mensagens recebidas
   */
  get messages(): Observable<ICaoWebSocketResponse<TResponse>> {
    return this.messages$.asObservable();
  }

  /**
   * Observable do estado da conexão
   */
  get connectionState(): Observable<CaoWebSocketState> {
    return this.state$.asObservable();
  }

  /**
   * Estado atual da conexão
   */
  get currentState(): CaoWebSocketState {
    return this.state$.value;
  }

  /**
   * Verifica se está conectado
   */
  get isConnected(): boolean {
    return this.state$.value === CaoWebSocketState.Connected;
  }
}
