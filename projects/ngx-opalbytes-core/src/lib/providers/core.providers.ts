import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EnvironmentProviders, LOCALE_ID, makeEnvironmentProviders, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideRouter, Routes } from '@angular/router';

import { provideNgxMask } from 'ngx-mask';
import {
  provideNgxWebstorage,
  withNgxWebstorageConfig,
  withSessionStorage,
} from "ngx-webstorage";

import { APP_CONFIG, ENVIRONMENT, getConfigByEnvironment } from '../config/index';
import { CaoApiInterceptor } from '../interceptors/api.interceptor';
import { CaoLoadingInterceptor } from '../interceptors/loading.interceptor';
import { ICaoEnvironmentConfig } from '../interfaces/environment-config.interface';

export class Teste extends CaoApiInterceptor {}

export interface ICaoProvideConfig {
  routes: Routes,
  environment: ICaoEnvironmentConfig,
}

export function caoProvideCore(provideConfig: ICaoProvideConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(provideConfig.routes),
    { provide: LOCALE_ID, useValue: "pt-BR" },
    { provide: MAT_DATE_LOCALE, useValue: "pt-BR" },
    // provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideNgxMask(),
    provideNgxWebstorage(
      withSessionStorage(),
      withNgxWebstorageConfig({ separator: ":", caseSensitive: true })
    ),
    {
      provide: ENVIRONMENT,
      useValue: provideConfig.environment,
    },
    {
      provide: APP_CONFIG,
      useFactory: () => getConfigByEnvironment(provideConfig.environment.name),
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
