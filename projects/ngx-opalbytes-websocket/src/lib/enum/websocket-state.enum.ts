/**
 * Estados possíveis da conexão WebSocket
 * Permite rastrear o ciclo de vida da conexão
 */
export enum CaoWebSocketState {
  /**
   * WebSocket desconectado e não há tentativas de reconexão
   */
  Disconnected = 'Disconnected',

  /**
   * Tentando estabelecer conexão inicial
   */
  Connecting = 'Connecting',

  /**
   * WebSocket conectado e pronto para enviar/receber mensagens
   */
  Connected = 'Connected',

  /**
   * Tentando reconectar após perda de conexão
   */
  Reconnecting = 'Reconnecting',

  /**
   * Erro na conexão (máximo de tentativas atingido ou erro fatal)
   */
  Error = 'Error',
}
