// src/app/models/product.model.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity?: number;
}
