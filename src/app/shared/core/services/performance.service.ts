import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Preload critical resources
  preloadCriticalResources(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Preload critical CSS
    this.preloadResource('/styles.css', 'style');

    // Preload critical fonts
    this.preloadResource('https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap', 'style');
    this.preloadResource('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap', 'style');

    // Preload critical images
    this.preloadResource('/assets/img/logo.webp', 'image');
    this.preloadResource('/assets/img/apple-touch-icon.png', 'image');
  }

  // Preload next page resources
  preloadNextPageResources(route: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Preload page-specific resources based on route
    switch (route) {
      case 'about':
        this.preloadResource('/assets/img/misc/signature-1.webp', 'image');
        break;
      case 'faculty':
        this.preloadResource('/assets/img/person/', 'image');
        break;
      case 'institutes':
        this.preloadResource('/assets/img/education/', 'image');
        break;
      case 'research':
        this.preloadResource('/assets/img/education/', 'image');
        break;
    }
  }

  // Optimize images for better performance
  optimizeImage(img: HTMLImageElement): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Set loading attribute
    img.loading = 'lazy';

    // Set decoding attribute
    img.decoding = 'async';

    // Add error handling
    img.onerror = () => {
      console.warn('Failed to load image:', img.src);
      // You can set a fallback image here
    };
  }

  // Add resource hints for better performance
  addResourceHints(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // DNS prefetch for external domains
    this.addDNSPrefetch('https://fonts.googleapis.com');
    this.addDNSPrefetch('https://fonts.gstatic.com');
    this.addDNSPrefetch('https://cdn.jsdelivr.net');

    // Preconnect to critical external domains
    this.addPreconnect('https://fonts.googleapis.com');
    this.addPreconnect('https://fonts.gstatic.com');
  }

  // Measure Core Web Vitals
  measureCoreWebVitals(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Measure Largest Contentful Paint (LCP)
    this.measureLCP();

    // Measure First Input Delay (FID)
    this.measureFID();

    // Measure Cumulative Layout Shift (CLS)
    this.measureCLS();
  }

  // Optimize third-party scripts loading
  optimizeThirdPartyScripts(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Load non-critical scripts after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.loadNonCriticalScripts();
      }, 2000);
    });
  }

  private preloadResource(href: string, as: string): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;

    if (as === 'style') {
      link.onload = () => {
        link.rel = 'stylesheet';
      };
    }

    document.head.appendChild(link);
  }

  private addDNSPrefetch(domain: string): void {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  }

  private addPreconnect(domain: string): void {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  private measureLCP(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }

  private measureFID(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('FID:', (entry as any).processingStart - entry.startTime);
        });
      });

      observer.observe({ entryTypes: ['first-input'] });
    }
  }

  private measureCLS(): void {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS:', clsValue);
      });

      observer.observe({ entryTypes: ['layout-shift'] });
    }
  }

  private loadNonCriticalScripts(): void {
    // Load AOS after critical content
    if (!document.querySelector('script[src*="aos.js"]')) {
      const script = document.createElement('script');
      script.src = 'assets/vendor/aos/aos.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }
}
