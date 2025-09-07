import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];
 BASEURL = 'https://miler.onrender.com/uploads/';
 
  constructor(
    private ps: ProductService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta

  ) { }

  ngOnInit() {
    const saved = localStorage.getItem('cart');
    if (saved) this.cart = JSON.parse(saved);

    // Meta Title
    this.titleService.setTitle('עגלת הקניות – מילר סטנדרים');

    // Meta Description
    this.metaService.updateTag({
      name: 'description',
      content: 'צפי לעגלת הקניות שלך – בדוק את המוצרים שבחרת והמשך לתשלום בקלות באתר מילר סטנדרים.'
    });
  }

  removeFromCart(id: number) {
    this.cart = this.cart.filter(p => p.id !== id);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
  updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  continueShopping() {
    this.router.navigate(['/']); // 👈 חוזר למסך המוצרים
  }

  goToCheckout() {
  const total = this.getTotal();

  // שליחת בקשה לשרת לקבל לינק תשלום
  this.ps.createPayment(total).subscribe((res: any) => {
    if (res && res.paymentUrl) {
      window.location.href = res.paymentUrl; // הפניה לדף התשלום של HYP
    }
  });
}

}
