import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products implements OnInit {

  products: any[] = [];
  shop: any = null;

  shopId!: number;
  currentUser: string | null = localStorage.getItem('username');
  shopOwner: string | null = null;
  isAdmin: boolean = false;

  showForm = false;
  showViewModal = false;
  selectedProduct: any = null;

  isEditing = false;
  editingId: number | null = null;
  selectedFile: File | null = null;

  loading = true;

  formData: any = {
    name: '',
    price: '',
    stock: ''
  };

  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const token = localStorage.getItem('accessToken');

    if (token) {
      const decoded: any = jwtDecode(token);
      this.isAdmin = decoded.is_superuser || decoded.is_staff;
    }

    this.route.paramMap.subscribe(params => {
      this.shopId = Number(params.get('id'));
      this.loadData();
    });
  }


  loadData() {
    this.loading = true;

    forkJoin({
      products: this.http.get<any[]>(`${this.baseUrl}/products/?shop=${this.shopId}`),
      shop: this.http.get<any>(`${this.baseUrl}/shops/${this.shopId}/`)
    }).subscribe({
      next: (res) => {
        this.products = res.products;
        this.shop = res.shop;
        this.shopOwner = res.shop.owner;
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading data', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }


  viewProduct(product: any) {
    this.selectedProduct = product;
    this.showViewModal = true;
    this.cdr.detectChanges();
  }

  

  openAdd() {
    this.showForm = true;
    this.isEditing = false;
    this.selectedFile = null;
    this.formData = { name: '', price: '', stock: '' };
  }

  openEdit(product: any) {
    this.showForm = true;
    this.isEditing = true;
    this.editingId = product.id;
    this.selectedFile = null;
    this.formData = {
      name: product.name,
      price: product.price,
      stock: product.stock
    };
  }

  deleteProduct(id: number) {
    if (!confirm("Delete this product?")) return;

    this.http.delete(`${this.baseUrl}/products/${id}/`)
      .subscribe(() => {
        this.loadData();
      });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveProduct() {

  if (!this.shopId) {
    console.error("Shop ID missing!");
    return;
  }

  const formData = new FormData();
  formData.append('name', this.formData.name);
  formData.append('price', this.formData.price);
  formData.append('stock', this.formData.stock);

  
  formData.append('shop', String(this.shopId));

  if (this.selectedFile) {
    formData.append('image', this.selectedFile);
  }

  if (this.isEditing && this.editingId) {

    this.http.put(
      `${this.baseUrl}/products/${this.editingId}/`,
      formData
    ).subscribe({
      next: () => {
        this.loadData();
        this.showForm = false;
      },
      error: (err) => {
        console.error("UPDATE ERROR:", err);
      }
    });

  } else {

    this.http.post(
      `${this.baseUrl}/products/`,
      formData
    ).subscribe({
      next: () => {
        this.loadData();
        this.showForm = false;
      },
      error: (err) => {
        console.error("CREATE ERROR:", err);
      }
    });
  }
}
}