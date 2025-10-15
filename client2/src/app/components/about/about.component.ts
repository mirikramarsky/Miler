import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private titleService: Title, private metaService: Meta) { }

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
        "https://yourwebsite.com/assets/images/stander-main.jpg",
        "https://yourwebsite.com/assets/images/stander1.jpg",
        "https://yourwebsite.com/assets/images/stander2.jpg"
      ],
      "description": "סטנדר יפה, חזק ומהודר לבית, לבית הכנסת וללימוד תורה. מתאים למתנה לאדמו\"ר, ראש ישיבה, ר\"מ, סבא, חתן או בן.",
      "brand": {
        "@type": "Brand",
        "name": "המפעל שלנו"
      },
      "offers": {
        "@type": "Offer",
        "url": "https://yourwebsite.com/standers/wood",
        "priceCurrency": "ILS",
        "price": "250"
      }
    });
    document.head.appendChild(script);
  }

}
