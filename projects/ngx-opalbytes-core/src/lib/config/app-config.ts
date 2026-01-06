import { InjectionToken } from "@angular/core";

import { productionConfig, homologationConfig, localConfig, developmentConfig } from "./index";

export interface IAppUrls {
    [key: string]: string;
}

export type AppPaths = Record<string, string>;
export type HttpMethods = Record<string, string>;
export type AppAuth = Record<string, string>;

export enum EnvironmentEnum {
    production = "production",
    homologation = "homologation",
    development = "development",
    local = "local"
}

export interface IAppConfig {
    production: boolean;
    environment: EnvironmentEnum;
    urls: IAppUrls;
    paths: AppPaths;
    httpMethods?: HttpMethods;
    auth?: AppAuth;
}

// Token de injeção para o environment
export const ENVIRONMENT = new InjectionToken<{ name: string }>("ENVIRONMENT");

// Token de injeção para a configuração do app
export const APP_CONFIG = new InjectionToken<IAppConfig>("APP_CONFIG");

// Função auxiliar para obter a config baseada no environment
export function getConfigByEnvironment(envName: string): IAppConfig {
  switch (envName) {
    case "production":
      return productionConfig;
    case "homologation":
      return homologationConfig;
    case "local":
      return localConfig;
    case "development":
    default:
      return developmentConfig;
  }
}
