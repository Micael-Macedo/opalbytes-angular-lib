import { isPlatformBrowser, DOCUMENT } from "@angular/common";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";

export interface ICookieOptions {
  expires?: number | Date; // Dias ou data específica
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  httpOnly?: boolean; // Nota: HttpOnly só pode ser definido pelo servidor
}

@Injectable({
  providedIn: "root",
})
export class CookieService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  /**
   * Define um cookie
   */
  set(name: string, value: string, options: ICookieOptions = {}): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Verificar tamanho do cookie antes de tentar salvar
    const encodedValue = this.encode(value);
    const cookieSize = `${this.encode(name)}=${encodedValue}`.length;

    if (cookieSize > 4096) {
      console.error(`Cookie ${name} excede 4KB (${cookieSize} bytes). Não será salvo.`);
      throw new Error(`Cookie muito grande: ${cookieSize} bytes (limite: 4096 bytes)`);
    }

    let cookieString = `${this.encode(name)}=${encodedValue}`;

    if (options.expires) {
      if (typeof options.expires === "number") {
        const date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
        cookieString += `; expires=${date.toUTCString()}`;
      } else {
        cookieString += `; expires=${options.expires.toUTCString()}`;
      }
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += `; secure`;
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    try {
      this.document.cookie = cookieString;

      // Verificar se o cookie foi salvo (apenas para debug)
      if (!this.has(name)) {
        console.warn(
          `Cookie ${name} pode não ter sido salvo. Verifique configurações (secure, sameSite, etc).`
        );
        console.warn("Cookie string:", `${cookieString.substring(0, 200)}...`);
        console.warn("Options:", options);
      }
    } catch (error) {
      console.error(`Erro ao definir cookie ${name}:`, error);
      throw error;
    }
  }

  /**
   * Obtém um cookie
   */
  get(name: string): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const nameEQ = `${this.encode(name)}=`;
    const cookies = this.document.cookie.split(";");

    for (const cookie of cookies) {
      let trimmedCookie = cookie;
      while (trimmedCookie.charAt(0) === " ") {
        trimmedCookie = trimmedCookie.substring(1, trimmedCookie.length);
      }
      if (trimmedCookie.indexOf(nameEQ) === 0) {
        return this.decode(trimmedCookie.substring(nameEQ.length, trimmedCookie.length));
      }
    }

    return null;
  }

  /**
   * Remove um cookie
   */
  remove(name: string, options: Pick<ICookieOptions, "path" | "domain"> = {}): void {
    this.set(name, "", {
      ...options,
      expires: new Date(0),
    });
  }

  /**
   * Verifica se um cookie existe
   */
  has(name: string): boolean {
    return this.get(name) !== null;
  }

  /**
   * Obtém todos os cookies
   */
  getAll(): Record<string, string> {
    if (!isPlatformBrowser(this.platformId)) {
      return {};
    }

    const cookies: Record<string, string> = {};
    const cookieArray = this.document.cookie.split(";");

    for (const cookie of cookieArray) {
      const [name, value] = cookie.trim().split("=");
      if (name && value) {
        cookies[this.decode(name)] = this.decode(value);
      }
    }

    return cookies;
  }

  /**
   * Remove todos os cookies
   */
  clear(): void {
    const cookies = this.getAll();
    for (const name in cookies) {
      this.remove(name);
    }
  }

  /**
   * Codifica valor para cookie (trata caracteres especiais)
   */
  private encode(value: string): string {
    return encodeURIComponent(value);
  }

  /**
   * Decodifica valor do cookie
   */
  private decode(value: string): string {
    return decodeURIComponent(value);
  }
}
