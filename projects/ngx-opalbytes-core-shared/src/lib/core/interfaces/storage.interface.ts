/**
 * Opções para personalizar o comportamento do armazenamento
 * @property encrypt Define se o valor deve ser criptografado
 * @property expiresIn Tempo em milissegundos até a expiração do item
 */
export interface IStorageOptions {
  encrypt?: boolean;
  expiresIn?: number; // Em milissegundos
}

/**
 * Estrutura para armazenar itens com metadados
 * @property value O valor armazenado
 * @property timestamp Momento da criação/atualização
 * @property expiresAt Momento em que o item expira (opcional)
 */
export interface IStorageItem<T> {
  value: T;
  timestamp: number;
  expiresAt?: number;
}
