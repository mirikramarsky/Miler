import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent {
 orderId: string | null = null;
  amount: number | null = null;
  products: any[] = [];

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // מקבלים פרמטרים מ‑Query Params
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || null;
      this.amount = params['amount'] ? +params['amount'] : null;
      this.products = params['products'] ? JSON.parse(params['products']) : [];
    });
  }
}
