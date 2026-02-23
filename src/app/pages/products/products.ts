
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
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
  shopId!: number;

  showForm = false;
  isEditing = false;
  editingId: number | null = null;
  selectedFile: File | null = null;

  formData: any = {
    name: '',
    price: '',
    stock: ''
  };

  private baseUrl = 'http://127.0.0.1:8000/myapp';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.shopId = Number(params.get('id'));
      this.loadProducts();
    });
  }

  loadProducts() {
    this.http.get<any[]>(
      `${this.baseUrl}/products/?shop=${this.shopId}`
    ).subscribe(data => {
      this.products = data;
      this.cdr.detectChanges();
    });
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

  viewProduct(product: any) {
    alert(`Product: ${product.name}\nPrice: ₹${product.price}\nStock: ${product.stock}`);
  }

  deleteProduct(id: number) {
    if (!confirm("Delete this product?")) return;

    this.http.delete(`${this.baseUrl}/products/${id}/`)
      .subscribe(() => {
        this.loadProducts();
      });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveProduct() {

    const formData = new FormData();
    formData.append('name', this.formData.name);
    formData.append('price', this.formData.price);
    formData.append('stock', this.formData.stock);
    formData.append('shop', this.shopId.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditing && this.editingId) {
      this.http.put(
        `${this.baseUrl}/products/${this.editingId}/`,
        formData
      ).subscribe(() => {
        this.loadProducts();
        this.showForm = false;
      });
    } else {
      this.http.post(
        `${this.baseUrl}/products/`,
        formData
      ).subscribe(() => {
        this.loadProducts();
        this.showForm = false;
      });
    }
  }
}