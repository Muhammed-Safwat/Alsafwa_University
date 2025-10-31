import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from './language.service';

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  robots: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  structuredData?: any;
}

@Injectable({
  providedIn: 'root'
})
export class SEOService {
  private readonly baseUrl = 'https://alsafwa-university.com';
  private readonly defaultImage = '/assets/img/logo.webp';

  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  updateSEO(seoData: Partial<SEOData>): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentLang = this.languageService.getCurrentLanguage();
    const isArabic = currentLang === 'ar';

    // Update title
    if (seoData.title) {
      this.title.setTitle(seoData.title);
    }

    // Update HTML lang attribute
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';

    // Update meta tags
    this.updateMetaTag('description', seoData.description);
    this.updateMetaTag('keywords', seoData.keywords);
    this.updateMetaTag('author', seoData.author);
    this.updateMetaTag('robots', seoData.robots);
    this.updateMetaTag('canonical', seoData.canonicalUrl);
    this.updateMetaTag('language', isArabic ? 'Arabic' : 'English');
    this.updateMetaTag('revisit-after', '7 days');

    // Open Graph tags
    this.updateMetaTag('og:title', seoData.ogTitle);
    this.updateMetaTag('og:description', seoData.ogDescription);
    this.updateMetaTag('og:image', seoData.ogImage);
    this.updateMetaTag('og:url', seoData.ogUrl);
    this.updateMetaTag('og:type', seoData.ogType);
    this.updateMetaTag('og:site_name', isArabic ? 'جامعة صفوت الصفوة الدولية' : 'Safwat Al Safwa International University');
    this.updateMetaTag('og:locale', isArabic ? 'ar_SA' : 'en_US');

    // Twitter Card tags
    this.updateMetaTag('twitter:card', seoData.twitterCard);
    this.updateMetaTag('twitter:title', seoData.twitterTitle);
    this.updateMetaTag('twitter:description', seoData.twitterDescription);
    this.updateMetaTag('twitter:image', seoData.twitterImage);

    // Additional SEO tags
    this.updateMetaTag('theme-color', '#1a365d');
    this.updateMetaTag('msapplication-TileColor', '#1a365d');
    this.updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Add Hreflang tags for multilingual SEO
    this.addHreflangTags(seoData.canonicalUrl);

    // Add structured data
    if (seoData.structuredData) {
      this.addStructuredData(seoData.structuredData);
    }
  }

  private updateMetaTag(property: string, content: string | undefined): void {
    if (content) {
      if (property.startsWith('og:') || property.startsWith('twitter:')) {
        this.meta.updateTag({ property, content });
      } else {
        this.meta.updateTag({ name: property, content });
      }
    }
  }

  private addHreflangTags(canonicalUrl: string | undefined): void {
    if (!canonicalUrl) return;

    // Remove existing hreflang tags
    const existingHreflangTags = document.querySelectorAll('link[hreflang]');
    existingHreflangTags.forEach(tag => tag.remove());

    // Extract current page path
    const url = new URL(canonicalUrl);
    const pathParts = url.pathname.split('/');
    const currentLang = pathParts[1] || 'ar';
    const pagePath = pathParts.slice(2).join('/') || '';

    // Create hreflang tags
    const hreflangTags = [
      { hreflang: 'ar', href: `${this.baseUrl}/ar/${pagePath}` },
      { hreflang: 'en', href: `${this.baseUrl}/en/${pagePath}` },
      { hreflang: 'x-default', href: `${this.baseUrl}/ar/${pagePath}` }
    ];

    hreflangTags.forEach(tag => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = tag.hreflang;
      link.href = tag.href;
      document.head.appendChild(link);
    });
  }

  private addStructuredData(data: any): void {
    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  }

  generatePageSEO(page: string, customData?: Partial<SEOData>): SEOData {
    const currentLang = this.languageService.getCurrentLanguage();
    const isArabic = currentLang === 'ar';

    const baseData = this.getBaseSEOData(page, isArabic);
    const seoData = { ...baseData, ...customData };

    // Ensure URL is properly formatted
    if (seoData.canonicalUrl) {
      seoData.canonicalUrl = this.formatCanonicalUrl(seoData.canonicalUrl, page, isArabic);
    }

    return seoData;
  }

  private formatCanonicalUrl(url: string, page: string, isArabic: boolean): string {
    const langCode = isArabic ? 'ar' : 'en';
    const baseUrl = this.baseUrl;

    // If URL doesn't contain language code, add it
    if (!url.includes('/ar/') && !url.includes('/en/')) {
      return `${baseUrl}/${langCode}/${page}`;
    }

    return url;
  }

  private getBaseSEOData(page: string, isArabic: boolean): SEOData {
    const currentUrl = `${this.baseUrl}/${isArabic ? 'ar' : 'en'}/${page}`;

    const seoData = {
      ar: {
        home: {
          title: 'جامعة صفوت الصفوة الدولية - الصفحة الرئيسية',
          description: 'جامعة صفوت الصفوة الدولية - مؤسسة تعليمية رائدة تقدم برامج أكاديمية متميزة في مختلف التخصصات. تعرف على برامجنا الأكاديمية والخدمات التعليمية.',
          keywords: 'جامعة صفوت الصفوة, تعليم عالي, برامج أكاديمية, جامعات السعودية, تعليم عن بعد, كليات, معاهد'
        },
        about: {
          title: 'عن جامعة صفوت الصفوة الدولية - رؤيتنا ورسالتنا',
          description: 'تعرف على رؤية ورسالة جامعة صفوت الصفوة الدولية، تاريخنا، ومبادئنا التعليمية. نحن ملتزمون بتقديم تعليم متميز يواكب متطلبات العصر.',
          keywords: 'عن الجامعة, رؤية الجامعة, رسالة الجامعة, تاريخ الجامعة, مبادئ تعليمية'
        },
        admissions: {
          title: 'القبول والتسجيل - جامعة صفوت الصفوة الدولية',
          description: 'تعرف على شروط القبول في جامعة صفوت الصفوة الدولية، متطلبات التسجيل، والبرامج المتاحة. ابدأ رحلتك الأكاديمية معنا اليوم.',
          keywords: 'القبول, التسجيل, شروط القبول, متطلبات التسجيل, برامج أكاديمية'
        },
        faculty: {
          title: 'الكليات والأقسام - جامعة صفوت الصفوة الدولية',
          description: 'استكشف كليات وأقسام جامعة صفوت الصفوة الدولية المتنوعة. نقدم برامج تعليمية متخصصة في مختلف المجالات الأكاديمية.',
          keywords: 'كليات, أقسام أكاديمية, برامج تعليمية, تخصصات, هيئة تدريس'
        },
        institutes: {
          title: 'المعاهد والمراكز - جامعة صفوت الصفوة الدولية',
          description: 'اكتشف معاهد ومراكز جامعة صفوت الصفوة الدولية المتخصصة. نقدم برامج تدريبية وتطويرية في مختلف المجالات المهنية.',
          keywords: 'معاهد, مراكز تدريب, برامج مهنية, تطوير مهني, تدريب متخصص'
        },
        research: {
          title: 'مركز البحوث والدراسات - جامعة صفوت الصفوة الدولية',
          description: 'مركز البحوث والدراسات في جامعة صفوت الصفوة الدولية يهدف إلى دعم البحث العلمي والابتكار في مختلف المجالات الأكاديمية.',
          keywords: 'مركز البحوث, دراسات علمية, بحث أكاديمي, ابتكار, مجلات علمية'
        },
        'remote-learning': {
          title: 'التعلم عن بعد - جامعة صفوت الصفوة الدولية',
          description: 'نظام التعلم عن بعد في جامعة صفوت الصفوة الدولية يوفر مرونة في التعليم مع الحفاظ على جودة التعليم الأكاديمي.',
          keywords: 'تعلم عن بعد, تعليم إلكتروني, مرونة تعليمية, منصات تعليمية'
        },
        contact: {
          title: 'اتصل بنا - جامعة صفوت الصفوة الدولية',
          description: 'تواصل مع جامعة صفوت الصفوة الدولية للحصول على المعلومات والاستفسارات. نحن هنا لمساعدتك في رحلتك الأكاديمية.',
          keywords: 'اتصل بنا, تواصل, استفسارات, معلومات, دعم طلابي'
        }
      },
      en: {
        home: {
          title: 'Safwat Al Safwa International University - Home',
          description: 'Safwat Al Safwa International University - A leading educational institution offering distinguished academic programs in various specializations. Discover our academic programs and educational services.',
          keywords: 'Safwat Al Safwa University, higher education, academic programs, Saudi universities, Online Learning, faculties, institutes'
        },
        about: {
          title: 'About Safwat Al Safwa International University - Our Vision & Mission',
          description: 'Learn about the vision and mission of Safwat Al Safwa International University, our history, and educational principles. We are committed to providing distinguished education that meets modern requirements.',
          keywords: 'about university, university vision, university mission, university history, educational principles'
        },
        admissions: {
          title: 'Admissions & Registration - Safwat Al Safwa International University',
          description: 'Learn about admission requirements at Safwat Al Safwa International University, registration requirements, and available programs. Start your academic journey with us today.',
          keywords: 'admissions, registration, admission requirements, registration requirements, academic programs'
        },
        faculty: {
          title: 'Faculties & Departments - Safwat Al Safwa International University',
          description: 'Explore the diverse faculties and departments of Safwat Al Safwa International University. We offer specialized educational programs in various academic fields.',
          keywords: 'faculties, academic departments, educational programs, specializations, faculty members'
        },
        institutes: {
          title: 'Institutes & Centers - Safwat Al Safwa International University',
          description: 'Discover the specialized institutes and centers of Safwat Al Safwa International University. We offer training and development programs in various professional fields.',
          keywords: 'institutes, training centers, professional programs, professional development, specialized training'
        },
        research: {
          title: 'Research & Studies Center - Safwat Al Safwa International University',
          description: 'The Research and Studies Center at Safwat Al Safwa International University aims to support scientific research and innovation in various academic fields.',
          keywords: 'research center, scientific studies, academic research, innovation, scientific journals'
        },
        'remote-learning': {
          title: 'Online Learning - Safwat Al Safwa International University',
          description: 'The Online Learning system at Safwat Al Safwa International University provides educational flexibility while maintaining academic quality.',
          keywords: 'Online Learning, e-learning, educational flexibility, learning platforms'
        },
        contact: {
          title: 'Contact Us - Safwat Al Safwa International University',
          description: 'Contact Safwat Al Safwa International University for information and inquiries. We are here to help you in your academic journey.',
          keywords: 'contact us, communication, inquiries, information, student support'
        }
      }
    };

    const languageData = seoData[isArabic ? 'ar' : 'en'];
    const pageData = languageData[page as keyof typeof languageData] || languageData.home;

    return {
      title: pageData.title,
      description: pageData.description,
      keywords: pageData.keywords,
      author: isArabic ? 'جامعة صفوت الصفوة الدولية' : 'Safwat Al Safwa International University',
      robots: 'index, follow',
      canonicalUrl: currentUrl,
      ogTitle: pageData.title,
      ogDescription: pageData.description,
      ogImage: `${this.baseUrl}${this.defaultImage}`,
      ogUrl: currentUrl,
      ogType: 'website',
      twitterCard: 'summary_large_image',
      twitterTitle: pageData.title,
      twitterDescription: pageData.description,
      twitterImage: `${this.baseUrl}${this.defaultImage}`,
      structuredData: this.generateStructuredData(page, isArabic)
    };
  }

  private generateStructuredData(page: string, isArabic: boolean): any {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": isArabic ? "جامعة صفوت الصفوة الدولية" : "Safwat Al Safwa International University",
      "alternateName": isArabic ? "Safwat Al Safwa International University" : "جامعة صفوت الصفوة الدولية",
      "url": this.baseUrl,
      "logo": `${this.baseUrl}${this.defaultImage}`,
      "description": isArabic
        ? "جامعة صفوت الصفوة الدولية - مؤسسة تعليمية رائدة تقدم برامج أكاديمية متميزة في مختلف التخصصات. تعرف على برامجنا الأكاديمية والخدمات التعليمية."
        : "Safwat Al Safwa International University - A leading educational institution offering distinguished academic programs in various specializations. Discover our academic programs and educational services.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": isArabic ? "شارع الملك فهد" : "King Fahd Street",
        "addressLocality": isArabic ? "الرياض" : "Riyadh",
        "addressRegion": isArabic ? "منطقة الرياض" : "Riyadh Region",
        "addressCountry": isArabic ? "المملكة العربية السعودية" : "Saudi Arabia",
        "postalCode": "12345"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["Arabic", "English"],
        "telephone": "+966-XX-XXX-XXXX",
        "email": "info@alsafwa-university.com"
      },
      "foundingDate": "2020",
      "founder": {
        "@type": "Person",
        "name": isArabic ? "صفوت الصفوة" : "Safwat Al Safwa"
      },
      "sameAs": [
        "https://www.facebook.com/alsafwauniversity",
        "https://www.twitter.com/alsafwauniversity",
        "https://www.linkedin.com/company/alsafwauniversity",
        "https://www.instagram.com/alsafwauniversity",
        "https://www.youtube.com/alsafwauniversity"
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": isArabic ? "البرامج الأكاديمية" : "Academic Programs",
        "itemListElement": [
          {
            "@type": "Course",
            "name": isArabic ? "برامج البكالوريوس" : "Bachelor Programs",
            "description": isArabic ? "برامج البكالوريوس في مختلف التخصصات" : "Bachelor programs in various specializations"
          },
          {
            "@type": "Course",
            "name": isArabic ? "برامج الماجستير" : "Master Programs",
            "description": isArabic ? "برامج الماجستير المتخصصة" : "Specialized master programs"
          },
          {
            "@type": "Course",
            "name": isArabic ? "برامج الدكتوراه" : "PhD Programs",
            "description": isArabic ? "برامج الدكتوراه البحثية" : "Research-based PhD programs"
          }
        ]
      }
    };

    // Add page-specific structured data
    if (page === 'home') {
      return {
        ...baseStructuredData,
        "@type": "CollegeOrUniversity",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": isArabic ? "البرامج الأكاديمية" : "Academic Programs",
          "itemListElement": [
            {
              "@type": "Course",
              "name": isArabic ? "برامج البكالوريوس" : "Bachelor Programs"
            },
            {
              "@type": "Course",
              "name": isArabic ? "برامج الماجستير" : "Master Programs"
            },
            {
              "@type": "Course",
              "name": isArabic ? "برامج الدكتوراه" : "PhD Programs"
            }
          ]
        }
      };
    }

    return baseStructuredData;
  }
}
