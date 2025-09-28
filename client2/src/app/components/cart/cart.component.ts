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
  // goToCheckout() {
  //    const total = this.getTotal();
  //    console.log( this.cart);
  //   this.ps.createPayment(total, this.cart)
  //     .subscribe(res => {
  //       window.location.href = res.url; // מפנה ל-HYP
  //     });
  // }
  goToCheckout() {
  const total = this.getTotal();
  console.log("Cart:", this.cart);

  this.ps.createPayment(total, this.cart).subscribe(res => {
  const { signature, ordernum } = res; // תדאגי שהשרת יחזיר גם ordernum
  const HYP_TERMINAL = '4502081530'; // החליפי בקוד הטרמינל שלך
  const payUrl = new URL("https://pay.hyp.co.il/p/");
  payUrl.searchParams.set("Order", ordernum);
  payUrl.searchParams.set("Masof", HYP_TERMINAL);
  payUrl.searchParams.set("Amount", total.toString());
  payUrl.searchParams.set("UTF8", "True");
  payUrl.searchParams.set("UTF8out", "True");
  payUrl.searchParams.set("Info", "רכישה באתר מילר סטנדרים");
  payUrl.searchParams.set("SendHesh", "True");
  payUrl.searchParams.set("Pritim", "True");
  payUrl.searchParams.set("MoreData", "True");
  payUrl.searchParams.set("heshDesc", JSON.stringify(this.cart));
  payUrl.searchParams.set("Sign", "True");
  payUrl.searchParams.set("action", "pay");
  payUrl.searchParams.set("signature", signature);

  window.location.href = payUrl.toString();
});

}

}
