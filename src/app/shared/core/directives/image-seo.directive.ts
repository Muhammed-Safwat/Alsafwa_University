import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Directive({
  selector: '[appImageSeo]',
  standalone: true
})
export class ImageSeoDirective implements OnInit {
  @Input() appImageSeo: string = '';
  @Input() imageContext: string = '';
  @Input() imageDescription: string = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    this.setImageAttributes();
  }

  private setImageAttributes() {
    const img = this.el.nativeElement as HTMLImageElement;
    const isArabic = this.languageService.getCurrentLanguage() === 'ar';

    // Set alt attribute
    if (!img.alt || img.alt === '') {
      const altText = this.generateAltText();
      this.renderer.setAttribute(img, 'alt', altText);
    }

    // Set title attribute for better accessibility
    if (!img.title) {
      const titleText = this.generateTitleText();
      this.renderer.setAttribute(img, 'title', titleText);
    }

    // Set loading attribute for performance
    if (!img.loading) {
      this.renderer.setAttribute(img, 'loading', 'lazy');
    }

    // Set decoding attribute for better performance
    this.renderer.setAttribute(img, 'decoding', 'async');
  }

  private generateAltText(): string {
    const isArabic = this.languageService.getCurrentLanguage() === 'ar';

    if (this.imageDescription) {
      return this.imageDescription;
    }

    const altTexts = {
      ar: {
        logo: 'شعار جامعة صفوت الصفوة الدولية - مؤسسة تعليمية رائدة',
        university: 'جامعة صفوت الصفوة الدولية - الصفحة الرئيسية',
        students: 'طلاب جامعة صفوت الصفوة الدولية في الحرم الجامعي',
        campus: 'حرم جامعة صفوت الصفوة الدولية - بيئة تعليمية متميزة',
        library: 'مكتبة جامعة صفوت الصفوة الدولية - مركز المعرفة',
        laboratory: 'مختبر متقدم في جامعة صفوت الصفوة الدولية',
        classroom: 'قاعة دراسية حديثة في جامعة صفوت الصفوة الدولية',
        graduation: 'حفل تخرج طلاب جامعة صفوت الصفوة الدولية',
        faculty: 'أعضاء هيئة التدريس المتميزون في جامعة صفوت الصفوة الدولية',
        research: 'مركز البحوث والدراسات في جامعة صفوت الصفوة الدولية',
        education: 'التعليم المتميز في جامعة صفوت الصفوة الدولية',
        technology: 'التكنولوجيا الحديثة في جامعة صفوت الصفوة الدولية',
        admissions: 'قسم القبول والتسجيل في جامعة صفوت الصفوة الدولية',
        institutes: 'المعاهد والمراكز في جامعة صفوت الصفوة الدولية',
        'remote-learning': 'نظام التعلم عن بعد في جامعة صفوت الصفوة الدولية',
        contact: 'معلومات التواصل مع جامعة صفوت الصفوة الدولية',
        about: 'صفحة عن جامعة صفوت الصفوة الدولية',
        default: 'صورة من جامعة صفوت الصفوة الدولية'
      },
      en: {
        logo: 'Safwat Al Safwa International University Logo - Leading Educational Institution',
        university: 'Safwat Al Safwa International University - Homepage',
        students: 'Students at Safwat Al Safwa International University Campus',
        campus: 'Safwat Al Safwa International University Campus - Distinguished Learning Environment',
        library: 'Safwat Al Safwa International University Library - Knowledge Center',
        laboratory: 'Advanced Laboratory at Safwat Al Safwa International University',
        classroom: 'Modern Classroom at Safwat Al Safwa International University',
        graduation: 'Graduation Ceremony at Safwat Al Safwa International University',
        faculty: 'Distinguished Faculty Members at Safwat Al Safwa International University',
        research: 'Research and Studies Center at Safwat Al Safwa International University',
        education: 'Excellence in Education at Safwat Al Safwa International University',
        technology: 'Modern Technology at Safwat Al Safwa International University',
        admissions: 'Admissions and Registration Department at Safwat Al Safwa International University',
        institutes: 'Institutes and Centers at Safwat Al Safwa International University',
        'remote-learning': 'Distance Learning System at Safwat Al Safwa International University',
        contact: 'Contact Information for Safwat Al Safwa International University',
        about: 'About Safwat Al Safwa International University Page',
        default: 'Image from Safwat Al Safwa International University'
      }
    };

    const context = this.imageContext || this.appImageSeo || 'default';
    const texts = isArabic ? altTexts.ar : altTexts.en;

    return texts[context as keyof typeof texts] || texts.default;
  }

  private generateTitleText(): string {
    const isArabic = this.languageService.getCurrentLanguage() === 'ar';

    if (this.imageDescription) {
      return this.imageDescription;
    }

    const titleTexts = {
      ar: {
        logo: 'شعار جامعة صفوت الصفوة الدولية - مؤسسة تعليمية رائدة',
        university: 'جامعة صفوت الصفوة الدولية - الصفحة الرئيسية',
        students: 'طلاب جامعة صفوت الصفوة الدولية في الحرم الجامعي',
        campus: 'حرم جامعة صفوت الصفوة الدولية - بيئة تعليمية متميزة',
        library: 'مكتبة جامعة صفوت الصفوة الدولية - مركز المعرفة',
        laboratory: 'مختبر متقدم في جامعة صفوت الصفوة الدولية',
        classroom: 'قاعة دراسية حديثة في جامعة صفوت الصفوة الدولية',
        graduation: 'حفل تخرج طلاب جامعة صفوت الصفوة الدولية',
        faculty: 'أعضاء هيئة التدريس المتميزون في جامعة صفوت الصفوة الدولية',
        research: 'مركز البحوث والدراسات في جامعة صفوت الصفوة الدولية',
        education: 'التعليم المتميز في جامعة صفوت الصفوة الدولية',
        technology: 'التكنولوجيا الحديثة في جامعة صفوت الصفوة الدولية',
        default: 'صورة من جامعة صفوت الصفوة الدولية'
      },
      en: {
        logo: 'Safwat Al Safwa International University Logo - Leading Educational Institution',
        university: 'Safwat Al Safwa International University - Homepage',
        students: 'Students at Safwat Al Safwa International University Campus',
        campus: 'Safwat Al Safwa International University Campus - Distinguished Learning Environment',
        library: 'Safwat Al Safwa International University Library - Knowledge Center',
        laboratory: 'Advanced Laboratory at Safwat Al Safwa International University',
        classroom: 'Modern Classroom at Safwat Al Safwa International University',
        graduation: 'Graduation Ceremony at Safwat Al Safwa International University',
        faculty: 'Distinguished Faculty Members at Safwat Al Safwa International University',
        research: 'Research and Studies Center at Safwat Al Safwa International University',
        education: 'Excellence in Education at Safwat Al Safwa International University',
        technology: 'Modern Technology at Safwat Al Safwa International University',
        default: 'Image from Safwat Al Safwa International University'
      }
    };

    const context = this.imageContext || this.appImageSeo || 'default';
    const texts = isArabic ? titleTexts.ar : titleTexts.en;

    return texts[context as keyof typeof texts] || texts.default;
  }
}
