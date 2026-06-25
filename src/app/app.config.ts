import {ApplicationConfig} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors, withXhr} from "@angular/common/http";
import {AuthInterceptor} from "./auth.interceptor";
import {provideAnimations} from "@angular/platform-browser/animations";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withXhr(), withInterceptors([AuthInterceptor])),
    provideAnimations(),
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};
