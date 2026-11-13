import { isPlatformBrowser } from "@angular/common";
import { Injectable, PLATFORM_ID, inject } from "@angular/core";

/** Opções para armazenamento de um item no LocalStorage. */
export interface ICaoLocalStorageOptions {
  /** Tempo de vida em milissegundos. Após expirar, o item é removido automaticamente no próximo acesso. */
  expiresIn?: number;
}

/** Envelope interno serializado junto ao valor. Não exportado intencionalmente. */
interface IStorageEntry<T> {
  /** Valor original. */
  v: T;
  /** Timestamp de expiração em ms epoch. Ausente = sem expiração. */
  exp?: number;
}

/** Prefixo de isolamento — evita colisões com outros apps no mesmo domínio. */
const PREFIX = "_m_";

/**
 * Serviço de manipulação do `localStorage` do browser.
 *
 * - Todas as **chaves** são ofuscadas com base64 antes de serem gravadas.
 * - Todos os **valores** são serializados em JSON e ofuscados com base64.
 * - Suporte a TTL (time-to-live) com lazy expiration no momento do acesso.
 * - Guard de plataforma: não executa nada fora do browser (SSR safe).
 * - Sem dependências externas — usa apenas APIs nativas.
 *
 * @example
 * ```ts
 * localStorageService.set('token', 'abc123', { expiresIn: 3_600_000 });
 * const token = localStorageService.get<string>('token'); // 'abc123' ou null
 * ```
 */
@Injectable({ providedIn: "root" })
export class CaoLocalStorageService {
  private readonly platformId = inject(PLATFORM_ID);

  // ─── Escrita ────────────────────────────────────────────────────────────────

  /**
   * Armazena um valor associado à chave informada.
   * Sobrescreve qualquer valor existente para a mesma chave.
   *
   * @param key   Identificador legível da entrada (será ofuscado internamente).
   * @param value Valor a armazenar. Qualquer tipo serializável em JSON.
   * @param options Opções de armazenamento, como TTL.
   */
  set<T>(key: string, value: T, options: ICaoLocalStorageOptions = {}): void {
    if (!isPlatformBrowser(this.platformId)) {return;}

    const entry: IStorageEntry<T> = {
      v: value,
      ...(options.expiresIn !== undefined && { exp: Date.now() + options.expiresIn }),
    };

    localStorage.setItem(this.encodeKey(key), this.serialize(entry));
  }

  // ─── Leitura ─────────────────────────────────────────────────────────────────

  /**
   * Recupera o valor associado à chave.
   * Retorna `null` se a chave não existir ou se o item estiver expirado.
   * Itens expirados são removidos automaticamente neste momento (lazy expiration).
   *
   * @param key Identificador legível da entrada.
   * @returns Valor armazenado ou `null`.
   */
  get<T>(key: string): T | null {
    if (!isPlatformBrowser(this.platformId)) {return null;}

    const raw = localStorage.getItem(this.encodeKey(key));
    if (raw === null) {return null;}

    const entry = this.deserialize<T>(raw);
    if (!entry) {return null;}

    if (entry.exp !== undefined && Date.now() > entry.exp) {
      this.remove(key);
      return null;
    }

    return entry.v;
  }

  // ─── Remoção ─────────────────────────────────────────────────────────────────

  /**
   * Remove a entrada associada à chave.
   * Não lança erro se a chave não existir.
   *
   * @param key Identificador legível da entrada.
   */
  remove(key: string): void {
    if (!isPlatformBrowser(this.platformId)) {return;}
    localStorage.removeItem(this.encodeKey(key));
  }

  /**
   * Remove **todas** as entradas gravadas por este serviço (prefixo `_m_`).
   * Entradas de outros apps no mesmo domínio não são afetadas.
   */
  clear(): void {
    if (!isPlatformBrowser(this.platformId)) {return;}

    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX)) {toRemove.push(k);}
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  }

  // ─── Consulta ────────────────────────────────────────────────────────────────

  /**
   * Verifica se existe uma entrada válida (não expirada) para a chave.
   *
   * @param key Identificador legível da entrada.
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Retorna a lista de chaves legíveis armazenadas por este serviço.
   * Chaves de itens expirados **não** são removidas nesta operação.
   */
  keys(): string[] {
    if (!isPlatformBrowser(this.platformId)) {return [];}

    const result: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX)) {
        const decoded = this.decodeKey(k);
        if (decoded !== null) {result.push(decoded);}
      }
    }
    return result;
  }

  /**
   * Retorna a quantidade de entradas armazenadas por este serviço.
   */
  size(): number {
    if (!isPlatformBrowser(this.platformId)) {return 0;}

    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i)?.startsWith(PREFIX)) {count++;}
    }
    return count;
  }

  // ─── Privados ────────────────────────────────────────────────────────────────

  /**
   * Ofusca a chave com prefixo + base64.
   * Formato: `_m_<base64(encodeURIComponent(key))>`
   */
  private encodeKey(key: string): string {
    return PREFIX + btoa(encodeURIComponent(key));
  }

  /**
   * Reverte a ofuscação da chave armazenada.
   * Retorna `null` se a chave não pertencer a este serviço ou estiver corrompida.
   */
  private decodeKey(encodedKey: string): string | null {
    try {
      return decodeURIComponent(atob(encodedKey.slice(PREFIX.length)));
    } catch {
      return null;
    }
  }

  /** Serializa e ofusca o envelope de armazenamento. */
  private serialize<T>(entry: IStorageEntry<T>): string {
    return btoa(encodeURIComponent(JSON.stringify(entry)));
  }

  /** Reverte serialização. Retorna `null` se o dado estiver corrompido. */
  private deserialize<T>(raw: string): IStorageEntry<T> | null {
    try {
      return JSON.parse(decodeURIComponent(atob(raw))) as IStorageEntry<T>;
    } catch {
      return null;
    }
  }
}
