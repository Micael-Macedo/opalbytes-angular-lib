/**
 * Envelope genérico para mensagens WebSocket
 * Adiciona metadados úteis para rastreamento e debug
 *
 * @template TPayload Tipo do payload da mensagem
 */
export interface IWebSocketMessage<TPayload = unknown> {
  /**
   * Tipo da mensagem (opcional)
   * Útil para roteamento de mensagens no servidor
   */
  type?: string;

  /**
   * ID único para correlacionar request/response
   * Gerado automaticamente se não fornecido
   */
  correlationId: string;

  /**
   * Timestamp da criação da mensagem
   */
  timestamp: Date;

  /**
   * Dados da mensagem
   */
  payload: TPayload;
}
