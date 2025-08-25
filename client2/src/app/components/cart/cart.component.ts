import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any[] = [];

  constructor(private ps: ProductService, private router: Router) { }

  ngOnInit() {
    const saved = localStorage.getItem('cart');
    if (saved) this.cart = JSON.parse(saved);
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
    this.router.navigate(['/checkout']); // 👈 עובר לדף התשלום
  }
}
