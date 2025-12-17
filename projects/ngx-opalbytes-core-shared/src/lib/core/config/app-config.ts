import { InjectionToken } from "@angular/core";

import { IAppConfig } from './../../shared/interfaces/app-config.interface';

import { productionConfig, homologationConfig, localConfig, developmentConfig } from "./index";

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
