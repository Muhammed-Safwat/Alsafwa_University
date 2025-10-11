import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { PreloaderComponent } from './shared/components/preloader/preloader.component';
import { LanguageService } from './shared/core/services/language.service';
import { SEOService } from './shared/core/services/seo.service';
import { PageSEOService } from './shared/core/services/page-seo.service';
import { SearchOptimizationService } from './shared/core/services/search-optimization.service';
import { PerformanceService } from './shared/core/services/performance.service';
import { filter } from 'rxjs/operators';

declare var AOS: any;
declare var PureCounter: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PreloaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Alsafwa University';
  private routerSubscription: any;

  constructor(
    private router: Router,
    private languageService: LanguageService,
    private seoService: SEOService,
    private pageSEOService: PageSEOService,
    private searchOptimizationService: SearchOptimizationService,
    private performanceService: PerformanceService
  ) {
    console.log('AppComponent: Constructor called');
  }

  ngOnInit() {
    console.log('AppComponent: Initializing...');
    console.log('AppComponent: Current language:', this.languageService.getCurrentLanguage());

    // Initialize performance optimizations
    this.performanceService.addResourceHints();
    this.performanceService.preloadCriticalResources();
    this.performanceService.optimizeThirdPartyScripts();
    this.performanceService.measureCoreWebVitals();

    this.waitForPureCounter();
    this.initializeAOS();

    // Listen to route changes
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        console.log('AppComponent: Route changed to:', event.url);
        this.updatePageSEO(event.url);
        this.performanceService.preloadNextPageResources(event.url);
        setTimeout(() => {
          this.refreshAOS();
        }, 100);
      });
  }

  ngAfterViewInit() {
    console.log('AppComponent: After view init...');
    setTimeout(() => {
      this.waitForPureCounter();
      this.initializeAOS();
    }, 500);
  }

  ngOnDestroy() {
    console.log('AppComponent: Destroying...');
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private waitForPureCounter() {
    console.log('AppComponent: Waiting for PureCounter...');
    const checkPureCounter = () => {
      if (typeof PureCounter !== 'undefined') {
        console.log('AppComponent: PureCounter found, initializing...');
        new PureCounter();
      } else {
        setTimeout(checkPureCounter, 100);
      }
    };
    checkPureCounter();
  }

  private initializeAOS() {
    console.log('AppComponent: Initializing AOS...');
    const checkAOS = () => {
      if (typeof AOS !== 'undefined') {
        console.log('AppComponent: AOS found, initializing...');
        AOS.init({
          duration: 1000,
          once: true,
          offset: 100,
          easing: 'ease-in-out',
          mirror: false
        });
      } else {
        setTimeout(checkAOS, 100);
      }
    };
    checkAOS();
  }

  private refreshAOS() {
    console.log('AppComponent: Refreshing AOS...');
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  private updatePageSEO(url: string) {
    // Extract page name from URL
    const urlParts = url.split('/');
    const page = urlParts[urlParts.length - 1] || 'home';

    // Wait for language service to be ready
    setTimeout(() => {
      // Update page SEO using the specialized service
      this.pageSEOService.updatePageSEO(page);

      // Optimize search results appearance
      this.searchOptimizationService.optimizeSearchResults(page);
    }, 100);
  }
}
