import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {HttpClient, HttpClientModule, provideHttpClient} from "@angular/common/http";
import {tokenInterceptorProvider} from "./auth.interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(HttpClientModule),
    tokenInterceptorProvider,
    provideAnimations(),
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};
