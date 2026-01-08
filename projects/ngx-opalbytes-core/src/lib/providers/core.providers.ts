import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EnvironmentProviders, LOCALE_ID, makeEnvironmentProviders, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';

import {
  provideNgxWebstorage,
  withNgxWebstorageConfig,
  withSessionStorage,
} from "ngx-webstorage";

import { APP_CONFIG, ENVIRONMENT, getConfigByEnvironment } from '../config/index';
import { CaoApiInterceptor } from '../interceptors/api.interceptor';
import { CaoLoadingInterceptor } from '../interceptors/loading.interceptor';
import { IApiConfig } from '../interfaces/apiUrl-config.interface';
import { IEnvironmentConfig } from '../interfaces/environment-config.interface';

export interface IProvideConfig {
  routes: Routes,
  enviroment: IEnvironmentConfig,
  apiConfig: IApiConfig;
}

export function caoProvideCore(provideConfig: IProvideConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(provideConfig.routes),
    { provide: LOCALE_ID, useValue: "pt-BR" },
    // provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideNgxWebstorage(
      withSessionStorage(),
      withNgxWebstorageConfig({ separator: ":", caseSensitive: true })
    ),
    {
      provide: ENVIRONMENT,
      useValue: provideConfig.enviroment,
    },
    {
      provide: APP_CONFIG,
      useFactory: () => getConfigByEnvironment(provideConfig.enviroment.name),
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CaoApiInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CaoLoadingInterceptor,
      multi: true,
    },
    DatePipe
  ]);
}
