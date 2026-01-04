import { Injectable } from "@angular/core";

import { Observable, of } from "rxjs";
import { shareReplay, tap } from "rxjs/operators";

interface ICacheEntry<T> {
  data: T;
  timestamp: number;
}

/**
 * Serviço de cache HTTP para reduzir requisições repetidas
 */
@Injectable({ providedIn: "root" })
export class HttpCacheService {
  private cache = new Map<string, ICacheEntry<unknown>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Obtém dados do cache ou executa a requisição se expirado
   * @param key - Chave única para o cache
   * @param request - Observable da requisição HTTP
   * @param ttl - Time to live em milissegundos (opcional)
   */
  get<T>(key: string, request: Observable<T>, ttl?: number): Observable<T> {
    const cached = this.cache.get(key);
    const now = Date.now();
    const cacheTTL = ttl || this.DEFAULT_TTL;

    if (cached && now - cached.timestamp < cacheTTL) {
      return of(cached.data as T);
    }

    return request.pipe(
      shareReplay(1),
      tap((data) => {
        this.cache.set(key, { data, timestamp: now });
      })
    );
  }

  /**
   * Invalida uma entrada específica do cache ou limpa todo o cache
   * @param key - Chave a ser invalidada (opcional, se não fornecido limpa tudo)
   */
  invalidate(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Limpa todas as entradas expiradas do cache
   */
  clearExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp >= this.DEFAULT_TTL) {
        this.cache.delete(key);
      }
    }
  }
}
