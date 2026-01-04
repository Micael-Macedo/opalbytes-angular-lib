import { Injectable } from "@angular/core";

import { jwtDecode } from "jwt-decode";
import { Observable } from "rxjs";

import { StorageService } from "./storage.service";
import { Variables } from "../constants/variaveis.enum";
import { IJwtPayload } from "../interfaces/jwt-interface";

@Injectable({
  providedIn: "root",
})
export class TokenService {
  constructor(private storageService: StorageService) {}

  hasToken(): boolean {
    return !!this.getToken();
  }

  setToken(token: string): void {
    this.storageService.setItem(Variables.STORAGE_AUTH, token);
  }

  getToken(): string | null {
    const token = this.storageService.getItem<string>(Variables.STORAGE_AUTH);
    if (!token) {
      return null;
    }
    return token;
  }

  getDecodedToken(): IJwtPayload | null {
    const token = this.storageService.getItem<string>(Variables.STORAGE_AUTH);
    if (!token) {
      return null;
    }
    return jwtDecode(token);
  }

  getRole(): string | null {
    const token = this.storageService.getItem<string>(Variables.STORAGE_AUTH);
    if (!token) {
      return null;
    }

    try {
      const decodedToken = jwtDecode<IJwtPayload>(token);

      // Buscar role em todos os recursos de forma genérica
      if (decodedToken.resource_access) {
        for (const resource of Object.values(decodedToken.resource_access)) {
          if (resource?.roles && resource.roles.length > 0) {
            return resource.roles[0];
          }
        }
      }

      // Se não encontrou em resource_access, tenta realm_access
      if (decodedToken.realm_access?.roles && decodedToken.realm_access.roles.length > 0) {
        return decodedToken.realm_access.roles[0];
      }

      return null;
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      return null;
    }
  }
  removeToken(): void {
    this.storageService.removeItem(Variables.STORAGE_AUTH);
  }

  /**
   * Verifica se o token está expirado
   */
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    try {
      const decoded = jwtDecode<IJwtPayload>(token);
      if (!decoded.exp) {
        return true;
      }

      // Adicionar margem de segurança de 60 segundos antes da expiração real
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp <= now + 60;
    } catch (error) {
      console.error("Erro ao verificar expiração do token:", error);
      return true;
    }
  }

  /**
   * Verifica se o token está próximo de expirar (dentro de 5 minutos)
   */
  isTokenExpiringSoon(): boolean {
    const token = this.getToken();
    if (!token) {
      return true;
    }

    try {
      const decoded = jwtDecode<IJwtPayload>(token);
      if (!decoded.exp) {
        return true;
      }

      const now = Math.floor(Date.now() / 1000);
      const fiveMinutes = 5 * 60; // 5 minutos em segundos
      return decoded.exp <= now + fiveMinutes;
    } catch (error) {
      console.error("Erro ao verificar expiração do token:", error);
      return true;
    }
  }

  /**
   * Obtém o refresh token
   */
  getRefreshToken(): string | null {
    return this.storageService.getItem<string>(Variables.REFRESH_TOKEN);
  }

  /**
   * Define o refresh token
   */
  setRefreshToken(refreshToken: string): void {
    this.storageService.setItem(Variables.REFRESH_TOKEN, refreshToken);
  }

  /**
   * Remove o refresh token
   */
  removeRefreshToken(): void {
    this.storageService.removeItem(Variables.REFRESH_TOKEN);
  }

  /**
   * Verifica se existe refresh token
   */
  hasRefreshToken(): boolean {
    return !!this.getRefreshToken();
  }

  /**
   * Remove todos os tokens (access e refresh)
   */
  removeAllTokens(): void {
    this.removeToken();
    this.removeRefreshToken();
  }

  observeToken(): Observable<string | null> {
    return this.storageService.observe<string>(Variables.STORAGE_AUTH);
  }

  /**
   * Extrai e armazena os dados do usuário (name, preferred_username e email) do token no localStorage
   */
  setUserDataFromToken(): void {
    const token = this.getToken();
    if (!token) {
      return;
    }

    try {
      const decodedToken = jwtDecode<IJwtPayload>(token);
      const userData = {
        name: decodedToken.name || null,
        username: decodedToken.preferred_username || null,
        email: decodedToken.email || null,
      };

      this.storageService.setItem(Variables.USER, userData);
    } catch (error) {
      console.error("Erro ao extrair dados do usuário do token:", error);
    }
  }
}
