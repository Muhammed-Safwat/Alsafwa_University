import { Directive, ElementRef, OnInit, Renderer2, Input } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Directive({
  selector: '[appInternalLinkOptimization]',
  standalone: true
})
export class InternalLinkOptimizationDirective implements OnInit {
  @Input() appInternalLinkOptimization: string = '';
  @Input() linkType: 'navigation' | 'content' | 'footer' = 'content';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.optimizeInternalLink();
  }

  private optimizeInternalLink(): void {
    const element = this.el.nativeElement as HTMLAnchorElement;
    const isArabic = this.languageService.getCurrentLanguage() === 'ar';

    // Ensure proper URL structure
    this.ensureProperURL(element, isArabic);

    // Add SEO-friendly attributes
    this.addSEOAttributes(element);

    // Add language-specific attributes
    this.addLanguageAttributes(element, isArabic);

    // Add structured data attributes
    this.addStructuredDataAttributes(element);

    // Optimize anchor text
    this.optimizeAnchorText(element, isArabic);
  }

  private ensureProperURL(element: HTMLAnchorElement, isArabic: boolean): void {
    const href = element.getAttribute('href');
    if (!href) return;

    // If it's a relative URL, add language prefix
    if (href.startsWith('/') && !href.startsWith('/ar/') && !href.startsWith('/en/')) {
      const langPrefix = isArabic ? '/ar' : '/en';
      const newHref = `${langPrefix}${href}`;
      this.renderer.setAttribute(element, 'href', newHref);
    }
  }

  private addSEOAttributes(element: HTMLAnchorElement): void {
    // Add rel attributes for better SEO
    const relAttributes = ['nofollow', 'noopener', 'noreferrer'];
    const existingRel = element.getAttribute('rel') || '';
    const newRel = [...new Set([...existingRel.split(' '), ...relAttributes])].join(' ').trim();
    this.renderer.setAttribute(element, 'rel', newRel);

    // Add title attribute for better accessibility and SEO
    if (!element.getAttribute('title')) {
      const title = this.generateTitle(element);
      this.renderer.setAttribute(element, 'title', title);
    }

    // Add data attributes for tracking
    this.renderer.setAttribute(element, 'data-link-type', this.linkType);
    this.renderer.setAttribute(element, 'data-optimized', 'true');
  }

  private addLanguageAttributes(element: HTMLAnchorElement, isArabic: boolean): void {
    // Add language attribute
    this.renderer.setAttribute(element, 'lang', isArabic ? 'ar' : 'en');

    // Add hreflang for internal links
    const href = element.getAttribute('href');
    if (href && (href.includes('/ar/') || href.includes('/en/'))) {
      const lang = href.includes('/ar/') ? 'ar' : 'en';
      this.renderer.setAttribute(element, 'hreflang', lang);
    }
  }

  private addStructuredDataAttributes(element: HTMLAnchorElement): void {
    // Add microdata attributes
    this.renderer.setAttribute(element, 'itemprop', 'url');
    this.renderer.setAttribute(element, 'itemtype', 'https://schema.org/WebPage');

    // Add content type
    this.renderer.setAttribute(element, 'data-content-type', 'internal-link');
  }

  private optimizeAnchorText(element: HTMLAnchorElement, isArabic: boolean): void {
    const text = element.textContent?.trim();
    if (!text) return;

    // Add keywords to anchor text if needed
    const optimizedText = this.optimizeTextForSEO(text, isArabic);
    if (optimizedText !== text) {
      element.textContent = optimizedText;
    }
  }

  private generateTitle(element: HTMLAnchorElement): string {
    const isArabic = this.languageService.getCurrentLanguage() === 'ar';
    const text = element.textContent?.trim() || '';
    const href = element.getAttribute('href') || '';

    // Generate descriptive title based on link type and content
    const titles = {
      ar: {
        navigation: `انتقل إلى ${text}`,
        content: `اقرأ المزيد عن ${text}`,
        footer: `معلومات إضافية: ${text}`
      },
      en: {
        navigation: `Go to ${text}`,
        content: `Read more about ${text}`,
        footer: `Additional information: ${text}`
      }
    };

    return titles[isArabic ? 'ar' : 'en'][this.linkType] || text;
  }

  private optimizeTextForSEO(text: string, isArabic: boolean): string {
    // Add relevant keywords to anchor text for better SEO
    const keywords = {
      ar: {
        'الرئيسية': 'الصفحة الرئيسية - جامعة صفوت الصفوة الدولية',
        'عن الجامعة': 'عن جامعة صفوت الصفوة الدولية',
        'القبول': 'القبول والتسجيل - جامعة صفوت الصفوة',
        'الكليات': 'كليات جامعة صفوت الصفوة الدولية',
        'المعاهد': 'معاهد جامعة صفوت الصفوة الدولية',
        'البحوث': 'مركز البحوث - جامعة صفوت الصفوة',
        'التعلم عن بعد': 'التعلم عن بعد - جامعة صفوت الصفوة',
        'اتصل بنا': 'تواصل مع جامعة صفوت الصفوة الدولية'
      },
      en: {
        'Home': 'Home - Safwat Al Safwa International University',
        'About': 'About Safwat Al Safwa International University',
        'Admissions': 'Admissions - Safwat Al Safwa University',
        'Faculty': 'Faculties - Safwat Al Safwa International University',
        'Institutes': 'Institutes - Safwat Al Safwa International University',
        'Research': 'Research Center - Safwat Al Safwa University',
        'Remote Learning': 'Distance Learning - Safwat Al Safwa University',
        'Contact': 'Contact Safwat Al Safwa International University'
      }
    };

    const langKeywords = keywords[isArabic ? 'ar' : 'en'];
    return langKeywords[text as keyof typeof langKeywords] || text;
  }
}
