import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { reviewReducer } from './component/reviews/states/review.reducer';
import { GlobalInterceptor } from './interceptors/global-interceptor-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(),withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: GlobalInterceptor, multi: true },
    provideStore({ reviews: reviewReducer }),
  ],
};
