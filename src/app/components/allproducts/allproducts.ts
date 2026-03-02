import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  standalone: true,
  selector: 'app-all-products',
  imports: [CommonModule],
  templateUrl: './allproducts.html',
  styleUrls: ['./allproducts.css']
})
export class AllProducts implements OnInit {

  products: any[] = [];
  loading = true;

  private baseUrl = 'http://127.0.0.1:8000/api/products/';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<any[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}