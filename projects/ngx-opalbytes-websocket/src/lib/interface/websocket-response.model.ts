import { ICaoWebSocketError } from './websocket-error.model';

/**
 * Resposta padronizada do WebSocket
 * Encapsula sucesso, dados e erros de forma consistente
 *
 * @template TData Tipo dos dados retornados em caso de sucesso
 */
export interface ICaoWebSocketResponse<TData = unknown> {
  /**
   * Indica se a operação foi bem-sucedida
   */
  success: boolean;

  /**
   * Dados retornados (presente se success = true)
   */
  data?: TData;

  /**
   * Informações do erro (presente se success = false)
   */
  error?: ICaoWebSocketError;

  /**
   * Metadados adicionais da resposta
   */
  metadata?: Record<string, unknown>;
}
