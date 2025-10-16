import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit, AfterViewInit  {

  constructor(private titleService: Title, private metaService: Meta, private el: ElementRef) { }

  ngOnInit(): void {
    // Meta Tags
    this.titleService.setTitle('סטנדרים מעץ – איכותיים, מהודרים ומתנות מיוחדות');
    this.metaService.updateTag({
      name: 'description',
      content: 'סטנדרים מעץ מלא לבית, לבית הכנסת, לחזן ולמרצה. מתנה לאדמו"ר, ראש ישיבה, ר"מ, סבא, חתן או בן. סטנדרים חזקים, יפים ומהודרים.'
    });

    // JSON-LD Schema
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": "סטנדר מעץ איכותי",
      "image": [
        "https://miler.onrender.com/uploads/moshe.png",
        "https://miler.onrender.com/uploads/nevel.png",
        "https://miler.onrender.com/uploads/moshe.png"
      ],
      "description": "סטנדר יפה, חזק ומהודר לבית, לבית הכנסת וללימוד תורה. מתאים למתנה לאדמו\"ר, ראש ישיבה, ר\"מ, סבא, חתן או בן.",
      "brand": {
        "@type": "Brand",
        "name": "המפעל שלנו"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://miler.co.il/home",
        "priceCurrency": "ILS",
        "price": "670"
      }
    });
    document.head.appendChild(script);
  }
 ngAfterViewInit() {
    const images = this.el.nativeElement.querySelectorAll('.gallery img');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    images.forEach((img: HTMLElement) => observer.observe(img));
  }
}
