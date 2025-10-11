import { Injectable } from '@angular/core';
import { SEOService } from './seo.service';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class PageSEOService {
  constructor(
    private seoService: SEOService,
    private languageService: LanguageService
  ) {}

  updatePageSEO(page: string): void {
    // Generate SEO data for the current page and language
    const seoData = this.seoService.generatePageSEO(page);

    // Update SEO with current language context
    this.seoService.updateSEO(seoData);
  }

  // Method to update SEO when language changes
  updateLanguageSEO(): void {
    // Get current page from URL
    const currentUrl = window.location.pathname;
    const urlParts = currentUrl.split('/');
    const page = urlParts[urlParts.length - 1] || 'home';

    // Update SEO for current page with new language
    this.updatePageSEO(page);
  }
}
