import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { LanguageService } from './language.service';

@Injectable({
  providedIn: 'root'
})
export class SearchOptimizationService {
  constructor(
    private meta: Meta,
    private title: Title,
    private languageService: LanguageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Optimize search results appearance
  optimizeSearchResults(page: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const currentLang = this.languageService.getCurrentLanguage();
    const isArabic = currentLang === 'ar';

    // Update HTML attributes for better search engine understanding
    this.updateHTMLAttributes(isArabic);

    // Add rich snippets for better search appearance
    this.addRichSnippets(page, isArabic);

    // Optimize meta tags for search engines
    this.optimizeMetaTags(page, isArabic);
  }

  private updateHTMLAttributes(isArabic: boolean): void {
    // Update document language and direction
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';

    // Add language-specific classes
    document.body.className = document.body.className.replace(/lang-\w+/g, '');
    document.body.classList.add(`lang-${isArabic ? 'ar' : 'en'}`);
  }

  private addRichSnippets(page: string, isArabic: boolean): void {
    // Remove existing rich snippets
    const existingSnippets = document.querySelectorAll('script[type="application/ld+json"]');
    existingSnippets.forEach(snippet => snippet.remove());

    // Add page-specific rich snippets
    const richSnippet = this.generateRichSnippet(page, isArabic);
    if (richSnippet) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(richSnippet);
      document.head.appendChild(script);
    }
  }

  private generateRichSnippet(page: string, isArabic: boolean): any {
    const baseData = {
      "@context": "https://schema.org",
      "@type": "EducationalOrganization",
      "name": isArabic ? "جامعة صفوت الصفوة الدولية" : "Safwat Al Safwa International University",
      "alternateName": isArabic ? "Safwat Al Safwa International University" : "جامعة صفوت الصفوة الدولية",
      "url": `https://alsafwa-university.com/${isArabic ? 'ar' : 'en'}`,
      "logo": "https://alsafwa-university.com/assets/img/logo.webp",
      "description": isArabic
        ? "جامعة صفوت الصفوة الدولية - مؤسسة تعليمية رائدة تقدم برامج أكاديمية متميزة في مختلف التخصصات"
        : "Safwat Al Safwa International University - A leading educational institution offering distinguished academic programs in various specializations",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": isArabic ? "شارع الملك فهد" : "King Fahd Street",
        "addressLocality": isArabic ? "الرياض" : "Riyadh",
        "addressCountry": isArabic ? "المملكة العربية السعودية" : "Saudi Arabia"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": ["Arabic", "English"]
      },
      "sameAs": [
        "https://www.facebook.com/alsafwauniversity",
        "https://www.twitter.com/alsafwauniversity",
        "https://www.linkedin.com/company/alsafwauniversity",
        "https://www.instagram.com/alsafwauniversity"
      ]
    };

    // Add page-specific data
    switch (page) {
      case 'home':
        return {
          ...baseData,
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

      case 'about':
        return {
          ...baseData,
          "description": isArabic
            ? "تعرف على رؤية ورسالة جامعة صفوت الصفوة الدولية، تاريخنا، ومبادئنا التعليمية"
            : "Learn about the vision and mission of Safwat Al Safwa International University, our history, and educational principles"
        };

      case 'admissions':
        return {
          ...baseData,
          "description": isArabic
            ? "تعرف على شروط القبول في جامعة صفوت الصفوة الدولية، متطلبات التسجيل، والبرامج المتاحة"
            : "Learn about admission requirements at Safwat Al Safwa International University, registration requirements, and available programs"
        };

      case 'faculty':
        return {
          ...baseData,
          "description": isArabic
            ? "استكشف كليات وأقسام جامعة صفوت الصفوة الدولية المتنوعة"
            : "Explore the diverse faculties and departments of Safwat Al Safwa International University"
        };

      case 'institutes':
        return {
          ...baseData,
          "description": isArabic
            ? "اكتشف معاهد ومراكز جامعة صفوت الصفوة الدولية المتخصصة"
            : "Discover the specialized institutes and centers of Safwat Al Safwa International University"
        };

      case 'research':
        return {
          ...baseData,
          "description": isArabic
            ? "مركز البحوث والدراسات في جامعة صفوت الصفوة الدولية يهدف إلى دعم البحث العلمي والابتكار"
            : "The Research and Studies Center at Safwat Al Safwa International University aims to support scientific research and innovation"
        };

      case 'remote-learning':
        return {
          ...baseData,
          "description": isArabic
            ? "نظام التعلم عن بعد في جامعة صفوت الصفوة الدولية يوفر مرونة في التعليم"
            : "The distance learning system at Safwat Al Safwa International University provides educational flexibility"
        };

      case 'contact':
        return {
          ...baseData,
          "description": isArabic
            ? "تواصل مع جامعة صفوت الصفوة الدولية للحصول على المعلومات والاستفسارات"
            : "Contact Safwat Al Safwa International University for information and inquiries"
        };

      default:
        return baseData;
    }
  }

  private optimizeMetaTags(page: string, isArabic: boolean): void {
    // Add additional meta tags for better search engine understanding
    this.meta.updateTag({ name: 'geo.region', content: 'SA' });
    this.meta.updateTag({ name: 'geo.country', content: 'Saudi Arabia' });
    this.meta.updateTag({ name: 'geo.placename', content: isArabic ? 'الرياض' : 'Riyadh' });
    this.meta.updateTag({ name: 'ICBM', content: '24.7136,46.6753' });

    // Add educational institution specific tags
    this.meta.updateTag({ name: 'institution', content: isArabic ? 'جامعة صفوت الصفوة الدولية' : 'Safwat Al Safwa International University' });
    this.meta.updateTag({ name: 'category', content: 'Education' });
    this.meta.updateTag({ name: 'audience', content: 'Students, Faculty, Researchers' });

    // Add page-specific meta tags
    this.addPageSpecificMetaTags(page, isArabic);
  }

  private addPageSpecificMetaTags(page: string, isArabic: boolean): void {
    const pageMetaTags = {
      home: {
        ar: {
          'page-topic': 'الجامعة',
          'page-type': 'الرئيسية',
          'audience': 'الطلاب، أعضاء هيئة التدريس، الباحثين'
        },
        en: {
          'page-topic': 'University',
          'page-type': 'Homepage',
          'audience': 'Students, Faculty, Researchers'
        }
      },
      about: {
        ar: {
          'page-topic': 'عن الجامعة',
          'page-type': 'معلومات',
          'audience': 'الطلاب، أولياء الأمور، المجتمع'
        },
        en: {
          'page-topic': 'About University',
          'page-type': 'Information',
          'audience': 'Students, Parents, Community'
        }
      },
      admissions: {
        ar: {
          'page-topic': 'القبول',
          'page-type': 'خدمة',
          'audience': 'الطلاب الجدد، أولياء الأمور'
        },
        en: {
          'page-topic': 'Admissions',
          'page-type': 'Service',
          'audience': 'New Students, Parents'
        }
      },
      faculty: {
        ar: {
          'page-topic': 'الكليات',
          'page-type': 'أكاديمي',
          'audience': 'الطلاب، أعضاء هيئة التدريس'
        },
        en: {
          'page-topic': 'Faculties',
          'page-type': 'Academic',
          'audience': 'Students, Faculty Members'
        }
      },
      institutes: {
        ar: {
          'page-topic': 'المعاهد',
          'page-type': 'أكاديمي',
          'audience': 'الطلاب، الباحثين'
        },
        en: {
          'page-topic': 'Institutes',
          'page-type': 'Academic',
          'audience': 'Students, Researchers'
        }
      },
      research: {
        ar: {
          'page-topic': 'البحث العلمي',
          'page-type': 'أكاديمي',
          'audience': 'الباحثين، أعضاء هيئة التدريس'
        },
        en: {
          'page-topic': 'Research',
          'page-type': 'Academic',
          'audience': 'Researchers, Faculty Members'
        }
      },
      'remote-learning': {
        ar: {
          'page-topic': 'التعلم عن بعد',
          'page-type': 'تعليمي',
          'audience': 'الطلاب، المعلمين'
        },
        en: {
          'page-topic': 'Distance Learning',
          'page-type': 'Educational',
          'audience': 'Students, Teachers'
        }
      },
      contact: {
        ar: {
          'page-topic': 'التواصل',
          'page-type': 'خدمة',
          'audience': 'الجميع'
        },
        en: {
          'page-topic': 'Contact',
          'page-type': 'Service',
          'audience': 'Everyone'
        }
      }
    };

    const currentLang = isArabic ? 'ar' : 'en';
    const pageTags = pageMetaTags[page as keyof typeof pageMetaTags]?.[currentLang as keyof typeof pageMetaTags[keyof typeof pageMetaTags]];

    if (pageTags) {
      Object.entries(pageTags).forEach(([key, value]) => {
        this.meta.updateTag({ name: key, content: value });
      });
    }
  }
}
