/**
 * Configuração genérica para conexão WebSocket
 * Permite configurar comportamentos de conexão, reconexão e heartbeat
 */
export interface ICaoWebSocketConfig {
  /**
   * URL do endpoint WebSocket (ex: ws://localhost:5001/ws/capture)
   */
  url: string;

  /**
   * Protocolos opcionais suportados pela conexão
   */
  protocols?: string[];

  /**
   * Habilita reconexão automática em caso de desconexão
   * @default false
   */
  reconnect?: boolean;

  /**
   * Intervalo base para reconexão em millisegundos
   * Usado com exponential backoff: base * (2 ^ attempt)
   * @default 3000
   */
  reconnectInterval?: number;

  /**
   * Número máximo de tentativas de reconexão
   * @default 5
   */
  reconnectAttempts?: number;

  /**
   * Habilita heartbeat (ping/pong) para manter conexão ativa
   * @default false
   */
  heartbeat?: boolean;

  /**
   * Intervalo do heartbeat em millisegundos
   * @default 30000
   */
  heartbeatInterval?: number;
}
