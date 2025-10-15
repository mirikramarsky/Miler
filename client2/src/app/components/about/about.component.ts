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

}
