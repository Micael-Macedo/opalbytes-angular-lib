/**
 * Modelo padronizado de erro WebSocket
 * Facilita tratamento consistente de erros
 */
export interface IWebSocketError {
  /**
   * Código numérico do erro
   * Pode ser usado para tratamento programático
   */
  code: number;

  /**
   * Mensagem descritiva do erro
   * Adequada para exibição ao usuário
   */
  message: string;

  /**
   * Detalhes adicionais do erro (opcional)
   * Ex: stack trace, contexto adicional
   */
  details?: unknown;
}
