import { Directive, ElementRef, OnInit, Renderer2, Input } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Directive({
  selector: '[appSearchOptimization]',
  standalone: true
})
export class SearchOptimizationDirective implements OnInit {
  @Input() appSearchOptimization: string = '';
  @Input() contentType: 'heading' | 'paragraph' | 'list' | 'link' = 'paragraph';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private languageService: LanguageService
  ) { }

  ngOnInit() {
    this.optimizeElementForSearch();
  }

  private optimizeElementForSearch(): void {
    const element = this.el.nativeElement;
    const isArabic = this.languageService.getCurrentLanguage() === 'ar';

    // Add language-specific attributes
    this.renderer.setAttribute(element, 'lang', isArabic ? 'ar' : 'en');
    this.renderer.setAttribute(element, 'dir', isArabic ? 'rtl' : 'ltr');

    // Add semantic attributes based on content type
    this.addSemanticAttributes(element);

    // Add structured data attributes
    this.addStructuredDataAttributes(element);

    // Optimize for search engines
    this.optimizeForSearchEngines(element);
  }

  private addSemanticAttributes(element: HTMLElement): void {
    switch (this.contentType) {
      case 'heading':
        this.renderer.setAttribute(element, 'itemprop', 'headline');
        this.renderer.setAttribute(element, 'role', 'heading');
        break;
      case 'paragraph':
        this.renderer.setAttribute(element, 'itemprop', 'description');
        break;
      case 'list':
        this.renderer.setAttribute(element, 'itemprop', 'itemListElement');
        break;
      case 'link':
        this.renderer.setAttribute(element, 'itemprop', 'url');
        break;
    }
  }

  private addStructuredDataAttributes(element: HTMLElement): void {
    // Add microdata attributes for better search understanding
    this.renderer.setAttribute(element, 'itemscope', '');
    this.renderer.setAttribute(element, 'itemtype', 'https://schema.org/EducationalOrganization');

    // Add specific attributes based on content
    if (this.appSearchOptimization) {
      this.renderer.setAttribute(element, 'data-search-keyword', this.appSearchOptimization);
    }
  }

  private optimizeForSearchEngines(element: HTMLElement): void {
    // Add keywords for better search indexing
    const keywords = this.generateKeywords();
    if (keywords.length > 0) {
      this.renderer.setAttribute(element, 'data-keywords', keywords.join(','));
    }

    // Add content relevance score
    this.renderer.setAttribute(element, 'data-relevance', 'high');

    // Add content freshness indicator
    this.renderer.setAttribute(element, 'data-freshness', 'current');
  }

  private generateKeywords(): string[] {
    const isArabic = this.languageService.getCurrentLanguage() === 'ar';

    const keywords = {
      ar: [
        'جامعة صفوت الصفوة',
        'تعليم عالي',
        'برامج أكاديمية',
        'جامعات السعودية',
        'تعليم عن بعد',
        'كليات ومعاهد',
        'بحوث علمية',
        'التعليم الجامعي',
        'الدراسات العليا',
        'البحث العلمي'
      ],
      en: [
        'Safwat Al Safwa University',
        'higher education',
        'academic programs',
        'Saudi universities',
        'Online Learning',
        'faculties and institutes',
        'scientific research',
        'university education',
        'graduate studies',
        'scientific research'
      ]
    };

    return keywords[isArabic ? 'ar' : 'en'];
  }
}
