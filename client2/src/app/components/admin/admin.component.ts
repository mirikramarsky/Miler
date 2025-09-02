import { Component, OnInit } from "@angular/core";
import { Product } from "src/app/models/Product";
import { ProductService } from "src/app/services/product-service.service";

@Component({ 
  selector: 'app-admin', 
  templateUrl: './admin.component.html', 
  styleUrls: ['./admin.component.css'] 
})

export class AdminComponent implements OnInit {
  BASEURL = 'https://miler.onrender.com/uploads/';
  products: Product[] = [];
  newProduct = { title: '', price: 0, image: '' };
  selectedFile: File | null = null;
  showForm = false;   // הצגת טופס
  editingProduct: Product | null = null; // לעדכון מוצר
editingFile: File | null = null;
selectedImage: string | ArrayBuffer | null = null;

onFileSelected(event: any) {
  const file = event.target.files[0];
  this.selectedFile = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => this.selectedImage = reader.result;
    reader.readAsDataURL(file);
  }
}
  constructor(private ps: ProductService) { }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.ps.getProducts().subscribe(data => this.products = data);
  }

  addProduct() {
    if (!this.selectedFile) {
      alert('בחרי קובץ!');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.newProduct.title);
    formData.append('price', this.newProduct.price.toString());
    formData.append('image', this.selectedFile);

    this.ps.addProduct(formData).subscribe(() => {
      alert('מוצר נוסף!');
      this.newProduct = { title: '', price: 0, image: '' };
      this.selectedFile = null;
      this.showForm = false;
      this.loadProducts();
    });
  }

  deleteProduct(id: number) {
    if (confirm('בטוחה שברצונך למחוק?')) {
      this.ps.deleteProduct(id).subscribe(() => this.loadProducts());
    }
  }

  editProduct(product: Product) {
    this.editingProduct = { ...product }; // פותח מודאל עם הנתונים
  }
onEditFileSelected(event: any) {
  this.editingFile = event.target.files[0];
}

saveEdit() {
    if (!this.editingProduct) return;
  const formData = new FormData();
  formData.append('title', this.editingProduct.title);
  formData.append('price', this.editingProduct.price.toString());

  // אם נבחרה תמונה חדשה
  if(this.editingFile) {
    formData.append('image', this.editingFile);
  }

  this.ps.updateProduct(this.editingProduct.id, formData).subscribe(res => {
    this.loadProducts();
    this.closeModal();
  });
}

closeModal() {
  this.editingProduct = null;
  this.editingFile = null;
}
}
