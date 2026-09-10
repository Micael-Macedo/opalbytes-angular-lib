import { InjectionToken } from "@angular/core";

import { developmentConfig } from "./config.dev";
import { homologationConfig } from "./config.hmg";
import { localConfig } from "./config.local";
import { productionConfig } from "./config.prod";
import { EnvironmentEnum } from "../enums";
import { ICaoAppUrlsRecord, AppPaths, HttpMethods, AppAuth } from "../interfaces";

export interface ICaoAppConfig {
  production: boolean;
  environment: EnvironmentEnum;
  urls: ICaoAppUrlsRecord;
  paths: AppPaths;
  httpMethods?: HttpMethods;
  auth?: AppAuth;
}

// Token de injeção para o environment
export const ENVIRONMENT = new InjectionToken<{ name: string }>("ENVIRONMENT");

// Token de injeção para a configuração do app
export const APP_CONFIG = new InjectionToken<ICaoAppConfig>("APP_CONFIG");

// Função auxiliar para obter a config baseada no environment
export function getConfigByEnvironment(envName: string): ICaoAppConfig {
  switch (envName) {
    case "prod":
      return productionConfig;
    case "hmg":
      return homologationConfig;
    case "local":
      return localConfig;
    case "dev":
    default:
      return developmentConfig;
  }
}
