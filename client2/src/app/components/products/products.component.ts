import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product-service.service';
import { Product } from '../../models/Product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  cart: Product[] = [];

  constructor(private ps: ProductService, private router: Router) {}

  ngOnInit() {
    this.ps.getProducts().subscribe((data: Product[]) => {
      this.products = data.map((p: Product) => ({ ...p, quantity: 1 }));
    });
    const saved = localStorage.getItem('cart');
    if (saved) this.cart = JSON.parse(saved);
  }

  addToCart(product: Product) {
    const existing = this.cart.find(p => p.id === product.id);
    if (existing) {
      existing.quantity! += 1;   // מוסיף אחד
    } else {
      this.cart.push({ ...product, quantity: 1 }); // מתחיל מכמות 1
    }
    localStorage.setItem('cart', JSON.stringify(this.cart));

    // 👇 אחרי הוספה – מעבר לסל הקניות
    this.router.navigate(['/cart']);
  }
}
