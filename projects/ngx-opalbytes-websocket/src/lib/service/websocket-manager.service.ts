/* eslint-disable no-console */
import { Injectable } from '@angular/core';

import { CaoWebSocketService } from './base-websocket.service';

/**
 * Singleton para gerenciar múltiplas conexões WebSocket
 *
 * Responsabilidades:
 * - Registrar/desregistrar serviços WebSocket
 * - Obter referência a serviços registrados
 * - Desconectar todos os serviços de uma vez
 *
 * Casos de uso:
 * - Múltiplos WebSockets ativos na aplicação (biometria, chat, notificações)
 * - Cleanup global na destruição do app
 * - Debugging e monitoramento centralizado
 *
 * @example
 * ```typescript
 * // Registrar serviço
 * this.wsManager.register('capture', this.captureService);
 *
 * // Obter serviço
 * const captureService = this.wsManager.get<CaptureWebSocketService>('capture');
 *
 * // Desconectar todos
 * this.wsManager.disconnectAll();
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class CaoWebSocketManagerService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private connections = new Map<string, CaoWebSocketService<any, any>>();

  /**
   * Registra um serviço WebSocket
   * @param key Identificador único do serviço
   * @param service Instância do serviço
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register<T extends CaoWebSocketService<any, any>>(key: string, service: T): void {
    if (this.connections.has(key)) {
      console.warn(`[WebSocketManager] Service '${key}' already registered, replacing...`);
      const existingService = this.connections.get(key);
      existingService?.disconnect();
    }

    this.connections.set(key, service);
    console.log(`[WebSocketManager] Registered service: ${key}`);
  }

  /**
   * Remove um serviço WebSocket do manager
   * Desconecta automaticamente antes de remover
   * @param key Identificador do serviço
   */
  unregister(key: string): void {
    const service = this.connections.get(key);

    if (service) {
      service.disconnect();
      this.connections.delete(key);
      console.log(`[WebSocketManager] Unregistered service: ${key}`);
    } else {
      console.warn(`[WebSocketManager] Service '${key}' not found`);
    }
  }

  /**
   * Obtém referência a um serviço registrado
   * @param key Identificador do serviço
   * @returns Serviço ou undefined se não encontrado
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get<T extends CaoWebSocketService<any, any>>(key: string): T | undefined {
    return this.connections.get(key) as T | undefined;
  }

  /**
   * Verifica se um serviço está registrado
   * @param key Identificador do serviço
   */
  has(key: string): boolean {
    return this.connections.has(key);
  }

  /**
   * Retorna lista de chaves de serviços registrados
   */
  getRegisteredKeys(): string[] {
    return Array.from(this.connections.keys());
  }

  /**
   * Desconecta todos os serviços registrados
   * Útil para cleanup global (ex: logout, destroy do app)
   */
  disconnectAll(): void {
    console.log('[WebSocketManager] Disconnecting all services...');

    this.connections.forEach((service, key) => {
      console.log(`[WebSocketManager] Disconnecting: ${key}`);
      service.disconnect();
    });

    this.connections.clear();
    console.log('[WebSocketManager] All services disconnected');
  }

  /**
   * Obtém quantidade de serviços registrados
   */
  get count(): number {
    return this.connections.size;
  }

  /**
   * Obtém estatísticas dos serviços registrados
   */
  getStats(): {
    total: number;
    connected: number;
    disconnected: number;
    error: number;
    keys: string[];
  } {
    let connected = 0;
    let disconnected = 0;
    let error = 0;

    this.connections.forEach((service) => {
      const state = service.currentState;
      if (state === 'Connected') {
        connected++;
      } else if (state === 'Disconnected') {
        disconnected++;
      } else if (state === 'Error') {
        error++;
      }
    });

    return {
      total: this.connections.size,
      connected,
      disconnected,
      error,
      keys: this.getRegisteredKeys(),
    };
  }
}
