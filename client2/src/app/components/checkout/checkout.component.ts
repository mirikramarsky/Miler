import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cart: any[] = [];
  customer = {
    firstName: '',
    lastName: '',
    address: '',
    phone: ''
  };

  constructor(private ps: ProductService, private router: Router) {}

  ngOnInit() {
    const saved = localStorage.getItem('cart');
    if (saved) this.cart = JSON.parse(saved);
  }

  getTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  checkout() {
    const order = {
      customer: this.customer,
      cart: this.cart,
      total: this.getTotal()
    };

    this.ps.checkout(order).subscribe({
      next: () => {
        alert('הזמנה נשלחה בהצלחה!');
        this.cart = [];
        localStorage.removeItem('cart');
        this.router.navigate(['/']); // חזרה לדף הבית אחרי התשלום
      },
      error: err => {
        console.error(err);
        alert('אירעה שגיאה בשליחת ההזמנה');
      }
    });
  }
}
