import { ApplicationConfig, ErrorHandler, Provider, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { TokenInterceptors } from './interceptors/token.interceptors';
import { GlobalErrorHandler } from './errors/error.handle';

const tokenInterceptorProvider : Provider = {
  provide : HTTP_INTERCEPTORS, useClass: TokenInterceptors, multi: true
};

const errorHandle : Provider =
{ provide: ErrorHandler, useClass: GlobalErrorHandler};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideHttpClient(withFetch()),
    tokenInterceptorProvider,
    provideClientHydration(),
    importProvidersFrom(HttpClientModule),
  
  ]
};
