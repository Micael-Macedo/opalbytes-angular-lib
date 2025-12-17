import { isPlatformBrowser } from "@angular/common";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";

import { BehaviorSubject, Observable, map } from "rxjs";

import { CookieService } from "./cookie.service";
import { IStorageOptions, IStorageItem } from "../interfaces/storage.interface";

/**
 * Serviço para gerenciar o armazenamento local com recursos avançados
 * como criptografia, expiração e observables
 * Agora utiliza cookies ao invés de localStorage para maior segurança
 */
@Injectable({
  providedIn: "root",
})
export class StorageService {
  /**
   * Subject para emitir mudanças no armazenamento
   */
  private storageChanges = new BehaviorSubject<{ key: string; value: unknown } | null>(null);
  private readonly COOKIE_PREFIX = "app_";
  private readonly DEFAULT_COOKIE_OPTIONS = {
    path: "/",
    secure: environment.production, // HTTPS apenas em produção
    sameSite: (environment.production ? "Strict" : "Lax") as "Strict" | "Lax", // Lax em dev para compatibilidade
    expires: 7, // 7 dias padrão
  };

  constructor(
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  /**
   * Normaliza a chave para maiúsculas
   * @param key Chave a ser normalizada
   * @returns A chave em letras maiúsculas
   */
  private normalizeKey(key: string): string {
    return key.toUpperCase();
  }

  /**
   * Armazena um valor com opções de criptografia e expiração
   * @param key Chave para armazenar o valor (será convertida para maiúsculas)
   * @param value Valor a ser armazenado
   * @param options Opções de armazenamento
   *
   * @example
   * // Armazenamento simples de um objeto usuário
   * // A chave 'usuario' será salva como 'USUARIO'
   * storageService.setItem('usuario', { id: 1, nome: 'João' });
   *
   * @example
   * // Armazenamento com criptografia e expiração de 1 hora
   * // A chave 'tokenAuth' será salva como 'TOKENAUTH'
   * storageService.setItem('tokenAuth', 'abc123xyz', {
   *   encrypt: true,
   *   expiresIn: 3600000 // 1 hora em milissegundos
   * });
   */
  public setItem<T>(key: string, value: T, options: IStorageOptions = {}): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const normalizedKey = this.normalizeKey(key);
    const cookieName = this.getCookieName(normalizedKey);

    const storageItem: IStorageItem<T> = {
      value: options.encrypt ? this.encrypt(value) : value,
      timestamp: Date.now(),
    };

    if (options.expiresIn) {
      storageItem.expiresAt = Date.now() + options.expiresIn;
    }

    // Serializar o objeto para string JSON
    const serializedValue = JSON.stringify(storageItem);

    // Verificar se o valor excede o limite de 4KB para cookies
    const encodedValue = encodeURIComponent(serializedValue);
    const cookieNameWithValue = `${cookieName}=${encodedValue}`;
    const cookieSize = cookieNameWithValue.length;

    // Se o token for muito grande (>4KB), usar sessionStorage como fallback
    // Isso pode acontecer com tokens JWT muito grandes
    if (cookieSize > 4000) {
      console.warn(
        `Cookie ${cookieName} excede 4KB (${cookieSize} bytes). Usando sessionStorage como fallback.`
      );

      // Armazenar em sessionStorage como fallback
      try {
        sessionStorage.setItem(cookieName, serializedValue);
        this.storageChanges.next({ key: normalizedKey, value });
        return;
      } catch (error) {
        console.error(`Erro ao salvar em sessionStorage:`, error);
        throw new Error(`Valor muito grande para armazenar (${cookieSize} bytes)`);
      }
    }

    // Calcular expiração em dias
    const expiresInDays = options.expiresIn
      ? Math.ceil(options.expiresIn / (24 * 60 * 60 * 1000))
      : this.DEFAULT_COOKIE_OPTIONS.expires;

    // Configurações específicas para tokens de autenticação
    const cookieOptions = this.getCookieOptionsForKey(normalizedKey, expiresInDays);

    try {
      this.cookieService.set(cookieName, serializedValue, cookieOptions);

      // Verificar se o cookie foi salvo corretamente
      const savedValue = this.cookieService.get(cookieName);
      if (!savedValue) {
        console.error(`Falha ao salvar cookie ${cookieName}. Cookie não foi criado.`);
        console.error("Cookie options:", cookieOptions);
        console.error("Cookie size:", cookieSize, "bytes");
        console.error("Tentando usar sessionStorage como fallback...");

        // Tentar sessionStorage como fallback se cookie falhar
        try {
          sessionStorage.setItem(cookieName, serializedValue);
          this.storageChanges.next({ key: normalizedKey, value });
          return;
        } catch (sessionError) {
          console.error(`Erro ao salvar em sessionStorage:`, sessionError);
          throw new Error(`Não foi possível salvar o valor (cookie e sessionStorage falharam)`);
        }
      }
    } catch (error) {
      console.error(`Erro ao salvar cookie ${cookieName}:`, error);

      // Tentar sessionStorage como fallback em caso de erro
      try {
        sessionStorage.setItem(cookieName, serializedValue);
        this.storageChanges.next({ key: normalizedKey, value });
        return;
      } catch (sessionError) {
        console.error(`Erro ao salvar em sessionStorage:`, sessionError);
        throw error;
      }
    }

    this.storageChanges.next({ key: normalizedKey, value });
  }

  /**
   * Recupera um valor e verifica se está expirado
   * @param key Chave do item a ser recuperado (será convertida para maiúsculas)
   * @param options Opções como criptografia
   * @returns O valor armazenado ou null se não existir ou estiver expirado
   *
   * @example
   * // Recuperar um objeto usuário (funciona mesmo usando letra minúscula)
   * const usuario = storageService.getItem<{id: number, nome: string}>('usuario');
   * // Na realidade, o sistema busca por 'USUARIO' internamente
   *
   * @example
   * // Recuperar um token criptografado
   * const token = storageService.getItem<string>('tokenAuth', { encrypt: true });
   * // Na realidade, o sistema busca por 'TOKENAUTH' internamente
   */
  public getItem<T>(key: string, options: IStorageOptions = {}): T | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const normalizedKey = this.normalizeKey(key);
    const cookieName = this.getCookieName(normalizedKey);
    let cookieValue = this.cookieService.get(cookieName);

    // Se não encontrar no cookie, tentar sessionStorage (fallback para valores grandes)
    if (!cookieValue) {
      try {
        const sessionValue = sessionStorage.getItem(cookieName);
        if (sessionValue) {
          cookieValue = sessionValue;
        }
      } catch {
        // Ignorar erros de sessionStorage
      }
    }

    if (!cookieValue) {
      return null;
    }

    try {
      const item = JSON.parse(cookieValue) as IStorageItem<T>;

      // Verifica se o item expirou
      if (item.expiresAt && item.expiresAt < Date.now()) {
        this.removeItem(normalizedKey);
        return null;
      }

      return options.encrypt ? this.decrypt(item.value) : item.value;
    } catch (error) {
      console.error(`Erro ao parsear cookie ${cookieName}:`, error);
      return null;
    }
  }

  /**
   * Remove um item específico
   * @param key Chave do item a ser removido (será convertida para maiúsculas)
   *
   * @example
   * // Remover o token de autenticação ao fazer logout
   * storageService.removeItem('tokenAuth');
   * // Na realidade, o sistema remove 'TOKENAUTH' internamente
   */
  public removeItem(key: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const normalizedKey = this.normalizeKey(key);
    const cookieName = this.getCookieName(normalizedKey);

    // Remover do cookie
    this.cookieService.remove(cookieName, { path: "/" });

    // Remover do sessionStorage também (caso tenha sido usado como fallback)
    try {
      sessionStorage.removeItem(cookieName);
    } catch {
      // Ignorar erros de sessionStorage
    }

    this.storageChanges.next({ key: normalizedKey, value: null });
  }

  /**
   * Limpa todo o armazenamento
   *
   * @example
   * // Limpar todos os dados ao fazer logout completo
   * storageService.clear();
   */
  public clear(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Remover apenas cookies da aplicação
    const allCookies = this.cookieService.getAll();
    for (const name in allCookies) {
      if (name.startsWith(this.COOKIE_PREFIX)) {
        this.cookieService.remove(name, { path: "/" });
      }
    }

    // Limpar sessionStorage também (caso tenha sido usado como fallback)
    try {
      const sessionKeys: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith(this.COOKIE_PREFIX)) {
          sessionKeys.push(key);
        }
      }
      sessionKeys.forEach((key) => sessionStorage.removeItem(key));
    } catch {
      // Ignorar erros de sessionStorage
    }

    this.storageChanges.next({ key: "all", value: null });
  }

  /**
   * Verifica se um item existe e não está expirado
   * @param key Chave do item a verificar (será convertida para maiúsculas)
   * @returns true se o item existir e não estiver expirado
   *
   * @example
   * // Verificar se o usuário está autenticado
   * if (storageService.hasItem('tokenAuth')) {
   *   // Usuário está autenticado
   *   // Na realidade, o sistema verifica por 'TOKENAUTH' internamente
   * } else {
   *   // Redirecionar para login
   * }
   */
  public hasItem(key: string): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const normalizedKey = this.normalizeKey(key);
    const cookieName = this.getCookieName(normalizedKey);
    const item = this.getItem(normalizedKey);

    if (!item) {
      return false;
    }

    // Verifica se expirou (verificar tanto cookie quanto sessionStorage)
    let storageValue: string | null = this.cookieService.get(cookieName);

    if (!storageValue) {
      // Tentar sessionStorage
      try {
        storageValue = sessionStorage.getItem(cookieName);
      } catch {
        // Ignorar erros
      }
    }

    if (storageValue) {
      try {
        const parsed = JSON.parse(storageValue) as IStorageItem<unknown>;
        if (parsed.expiresAt && parsed.expiresAt < Date.now()) {
          this.removeItem(normalizedKey);
          return false;
        }
      } catch {
        return false;
      }
    }

    return true;
  }

  /**
   * Observa mudanças no armazenamento para uma chave específica
   * @param key Chave a ser observada (será convertida para maiúsculas)
   * @returns Observable com o valor atual (ou null)
   *
   * @example
   * // Reagir a mudanças no perfil do usuário
   * storageService.observe<PerfilUsuario>('perfilUsuario')
   *   // Na realidade, o sistema observa 'PERFILUSUARIO' internamente
   *   .subscribe(perfil => {
   *     if (perfil) {
   *       this.atualizarInterface(perfil);
   *     } else {
   *       this.limparInterface();
   *     }
   *   });
   */
  public observe<T>(key: string): Observable<T | null> {
    const normalizedKey = this.normalizeKey(key);
    return this.storageChanges.pipe(
      map(() => {
        return this.getItem<T>(normalizedKey);
      })
    );
  }

  /**
   * Retorna uma lista de todas as chaves armazenadas
   * @returns Array com todas as chaves
   *
   * @example
   * // Obter todas as chaves armazenadas
   * const chaves = storageService.getKeys();
   * // Resultado: ['USUARIO', 'TOKENAUTH', 'CONFIGURACOES']
   */
  public getKeys(): string[] {
    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    const keys: string[] = [];
    const allCookies = this.cookieService.getAll();

    for (const name in allCookies) {
      if (name.startsWith(this.COOKIE_PREFIX)) {
        const key = name.replace(this.COOKIE_PREFIX, "");
        keys.push(key);
      }
    }

    return keys;
  }

  /**
   * Retorna opções de cookie específicas baseadas na chave
   */
  private getCookieOptionsForKey(key: string, expiresInDays: number) {
    // Tokens de autenticação requerem configurações mais restritivas
    if (key === "TOKEN" || key === "REFRESH_TOKEN") {
      return {
        ...this.DEFAULT_COOKIE_OPTIONS,
        expires: expiresInDays,
        sameSite: (environment.production ? "Strict" : "Lax") as "Strict" | "Lax", // Lax em dev
        secure: environment.production, // HTTPS apenas em produção
      };
    }

    // Dados do usuário podem ter expiração mais longa
    if (key === "USER") {
      return {
        ...this.DEFAULT_COOKIE_OPTIONS,
        expires: 30, // 30 dias
        sameSite: "Lax" as const,
        secure: environment.production, // HTTPS apenas em produção
      };
    }

    // Configuração padrão
    return {
      ...this.DEFAULT_COOKIE_OPTIONS,
      expires: expiresInDays,
    };
  }

  /**
   * Obtém o nome do cookie baseado na chave normalizada
   */
  private getCookieName(key: string): string {
    return `${this.COOKIE_PREFIX}${this.normalizeKey(key)}`;
  }

  /**
   * Implementação simples de criptografia (substitua por solução mais robusta em produção)
   * @param value Valor a ser criptografado
   * @returns Valor criptografado
   */
  private encrypt<T>(value: T): string {
    try {
      const stringValue = JSON.stringify(value);
      return btoa(stringValue);
    } catch (_error) {
      return (value + String(_error)) as unknown as string;
    }
  }

  /**
   * Implementação simples de descriptografia (substitua por solução mais robusta em produção)
   * @param value Valor a ser descriptografado
   * @returns Valor descriptografado
   */
  private decrypt<T>(value: string): T {
    try {
      const stringValue = atob(value as string);
      return JSON.parse(stringValue) as T;
    } catch (_error) {
      return (value + _error) as unknown as T;
    }
  }
}
