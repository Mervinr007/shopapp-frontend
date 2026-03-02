import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit {

  products: any[] = [];
  shopList: any[] = [];

  loading = true;

  
  showAddModal = false;
  selectedProduct: any = null;
  selectedShopId: number | null = null;
  sellingPrice: number | null = null;
  stockCount: number | null = null;
  currentPage = 1;
  itemsPerPage = 8;
  totalPages: number[] = [];

  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadInitialData();
  }

 

  loadInitialData() {
    this.loading = true;

    this.http.get<any[]>(`${this.baseUrl}/products/`)
      .subscribe({
        next: (res) => {
          this.products = res;
          this.calculatePages();
          this.loadShops();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  loadShops() {
    this.http.get<any[]>(`${this.baseUrl}/shops/`)
      .subscribe({
        next: (res) => {
          this.shopList = res;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }



  calculatePages() {
    const total = Math.ceil(this.products.length / this.itemsPerPage);
    this.totalPages = Array(total).fill(0).map((_, i) => i + 1);
  }

  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages.length) {
      this.currentPage++;
    }
  }

 

  openAddToShop(product: any) {
    this.selectedProduct = product;
    this.selectedShopId = null;
    this.sellingPrice = null;
    this.stockCount = null;
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  addToShop() {

  if (!this.selectedShopId || 
      this.sellingPrice === null || 
      this.stockCount === null) {
    alert('Fill all fields');
    return;
  }

  if (this.sellingPrice > this.selectedProduct.mrp) {
    alert('Selling price cannot exceed MRP');
    return;
  }

  if (this.sellingPrice < 0 || this.stockCount < 0) {
    alert('Values must be positive');
    return;
  }

 const payload = {
  product_id: this.selectedProduct.id, 
  shop: this.selectedShopId,
  selling_price: this.sellingPrice,
  stock_count: this.stockCount
};

  this.http.post(`${this.baseUrl}/inventory/`, payload)
    .subscribe({
      next: () => {
        alert('Product added with stock successfully');
        this.showAddModal = false;
      },
      error: (err) => {
        console.error(err);
        alert('Error adding product');
      }
    });
}

}