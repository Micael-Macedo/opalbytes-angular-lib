import { Injectable, inject } from "@angular/core";

import { IAppConfig } from "../../shared/interfaces/app-config.interface";
import { APP_CONFIG, ApiUrl, ApiPath, HttpMethod } from "../config";

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  private readonly config: IAppConfig = inject(APP_CONFIG);

  getConfig(): IAppConfig {
    return this.config;
  }

  getApiUrl(): string {
    return this.getUrl(ApiUrl.API);
  }

  getUrl(urlKey: ApiUrl | string): string {
    const url = this.config.urls[urlKey];
    return url ? this.normalizeUrl(url) : "";
  }

  getPath(pathKey: ApiPath | string): string {
    const path = this.config.paths[pathKey];
    if (!path) {
      return "";
    }

    const cleanPath = path.trim();
    const normalizedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return normalizedPath.endsWith("/") ? normalizedPath.slice(0, -1) : normalizedPath;
  }

  buildUrl(pathKey: ApiPath | string, baseUrlKey: ApiUrl | string = ApiUrl.API): string {
    const baseUrl = this.getUrl(baseUrlKey);
    const path = this.getPath(pathKey);

    if (!baseUrl) {
      console.warn(`Base URL '${baseUrlKey}' not found in config`);
      return path;
    }

    if (!path) {
      console.warn(`Path '${pathKey}' not found in config`);
      return baseUrl;
    }

    return `${baseUrl}${path}`;
  }

  buildUrlWithParams(
    pathKey: ApiPath | string,
    params: Record<string, string | number>,
    baseUrlKey: ApiUrl | string = ApiUrl.API
  ): string {
    let path = this.getPath(pathKey);

    Object.entries(params).forEach(([key, value]) => {
      path = path.replace(`:${key}`, String(value));
    });

    const baseUrl = this.getUrl(baseUrlKey);
    return `${baseUrl}${path}`;
  }

  getHttpMethod(method: HttpMethod | string): string {
    return this.config.httpMethods?.[method] || method.toLowerCase();
  }

  isProduction(): boolean {
    return this.config.production;
  }

  getEnvironment(): string {
    return this.config.environment;
  }

  private normalizeUrl(url: string): string {
    return url.endsWith("/") ? url.slice(0, -1) : url;
  }
}
