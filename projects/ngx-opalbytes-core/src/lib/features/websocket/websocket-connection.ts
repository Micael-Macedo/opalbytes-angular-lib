import { Observable, Subject } from 'rxjs';

import { IWebSocketConfig } from '../../services/models/websocket-config.model';

/**
 * Wrapper para WebSocket nativo do browser
 * Encapsula a API do WebSocket em um objeto orientado a objetos mais amigável
 *
 * Responsabilidades:
 * - Gerenciar conexão WebSocket nativa
 * - Expor eventos como Observables RxJS
 * - Fornecer métodos type-safe para envio de mensagens
 */
export class WebSocketConnection {
  private ws: WebSocket | null = null;
  private messageSubject = new Subject<MessageEvent>();
  private openSubject = new Subject<Event>();
  private closeSubject = new Subject<CloseEvent>();
  private errorSubject = new Subject<Event>();

  constructor(private config: IWebSocketConfig) { }

  /**
   * Abre a conexão WebSocket
   * @returns Observable que emite quando a conexão é estabelecida
   */
  connect(): Observable<Event> {
    this.ws = new WebSocket(this.config.url, this.config.protocols);

    this.ws.onopen = (event: Event) => {
      this.openSubject.next(event);
    };

    this.ws.onmessage = (event: MessageEvent) => {
      this.messageSubject.next(event);
    };

    this.ws.onclose = (event: CloseEvent) => {
      this.closeSubject.next(event);
    };

    this.ws.onerror = (event: Event) => {
      this.errorSubject.next(event);
    };

    return this.openSubject.asObservable();
  }

  /**
   * Envia mensagem pelo WebSocket
   * @param data Dados para enviar (string, ArrayBuffer, Blob)
   */
  send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.error('[WebSocketConnection] Cannot send message: WebSocket is not open');
    }
  }

  /**
   * Fecha a conexão WebSocket
   * @param code Código de fechamento (padrão 1000 = normal closure)
   * @param reason Motivo do fechamento (opcional)
   */
  close(code = 1000, reason?: string): void {
    if (this.ws) {
      this.ws.close(code, reason);
      this.ws = null;
    }
  }

  /**
   * Verifica se a conexão está aberta
   */
  get isOpen(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Retorna o estado atual da conexão
   */
  get readyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  /**
   * Observable de mensagens recebidas
   */
  get messages$(): Observable<MessageEvent> {
    return this.messageSubject.asObservable();
  }

  /**
   * Observable de evento de conexão estabelecida
   */
  get open$(): Observable<Event> {
    return this.openSubject.asObservable();
  }

  /**
   * Observable de evento de desconexão
   */
  get close$(): Observable<CloseEvent> {
    return this.closeSubject.asObservable();
  }

  /**
   * Observable de erros
   */
  get error$(): Observable<Event> {
    return this.errorSubject.asObservable();
  }

  /**
   * Limpa todos os observables
   * Deve ser chamado no destroy do serviço
   */
  destroy(): void {
    this.close();
    this.messageSubject.complete();
    this.openSubject.complete();
    this.closeSubject.complete();
    this.errorSubject.complete();
  }
}
