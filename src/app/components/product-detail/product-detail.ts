import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-product-detail',
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css']
})
export class ProductDetail implements OnInit {

  product: any = null;
  inventory: any[] = [];
  loading = true;

  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {

    const id = this.route.snapshot.params['id'];

    if (!id) return;

    this.http.get(`${this.baseUrl}/products/${id}/`)
      .subscribe({
        next: (data) => {
          this.product = data;
          this.loadInventory(id);
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  loadInventory(productId: number) {

    this.http.get<any[]>(`${this.baseUrl}/inventory/?product_id=${productId}`)
      .subscribe({
        next: (data) => {
          this.inventory = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  getTotalValue(item: any) {
    return item.selling_price * item.stock_count;
  }
}