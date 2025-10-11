import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideClientHydration } from '@angular/platform-browser';

// Translation imports
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

// Routes
import { routes } from './app.routes';

// Services
import { LanguageService } from './shared/core/services/language.service';
import { LanguageStoreService } from './shared/core/services/language-store.service';
import { LanguageHandlerService } from './shared/core/services/language-handler.service';
import { RoutingService } from './shared/core/services/routing.service';
import { SEOService } from './shared/core/services/seo.service';
import { PageSEOService } from './shared/core/services/page-seo.service';
import { SearchOptimizationService } from './shared/core/services/search-optimization.service';
import { PerformanceService } from './shared/core/services/performance.service';
import { PreloaderService } from './shared/core/services/preloader.service';

// Translation loader factory
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Angular core providers
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
    provideAnimations(),
    provideClientHydration(),

    // Translation configuration
    {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient]
    },
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'ar',
      useDefaultLang: true
    }).providers!,

    // Language configuration
    {
      provide: LOCALE_ID,
      useValue: 'ar-SA'
    },

    // Custom services
    LanguageService,
    LanguageStoreService,
    LanguageHandlerService,
    RoutingService,
    SEOService,
    PageSEOService,
    SearchOptimizationService,
    PerformanceService,
    PreloaderService
  ],
};
