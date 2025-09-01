// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/Product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private API = 'https://miler.onrender.com';

  constructor(private http: HttpClient) { }

  // קבלת מוצרים עם טיפוס Product
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API}/products`);
  }

  // הוספת מוצר (השרת מחזיר מוצר חדש)
  addProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.API}/products`, formData);
  }
  // עדכון מוצר
  updateProduct(id: number, product: Product | FormData): Observable<Product> {
    return this.http.put<Product>(`${this.API}/products/${id}`, product);
  }
  // מחיקת מוצר
  deleteProduct(id: number): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.API}/products/${id}`);
  }
  createPayment(amount: number): Observable<{ paymentUrl: string }> {
    return this.http.post<{ paymentUrl: string }>(`${this.API}/payment/create`, { amount });
  }
  // שליחת הזמנה
  checkout(order: any): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.API}/checkout`, order);
  }
}
