import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule
  ],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search {

  query = '';
  results: any[] = [];
  showDropdown = false;

  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSearchChange() {

    if (!this.query.trim()) {
      this.results = [];
      this.showDropdown = false;
      this.cdr.detectChanges();
      return;
    }

    this.http.get<any[]>(`${this.baseUrl}/search/?q=${this.query}`)
      .subscribe({
        next: (data) => {
          this.results = data;
          this.showDropdown = true;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(err);
          this.results = [];
          this.showDropdown = false;
          this.cdr.detectChanges();
        }
      });
  }

selectItem(item: any) {

  this.showDropdown = false;
  this.query = '';

  if (item.type === 'product') {
    this.router.navigate(['/product-detail', item.id]);
  }

  if (item.type === 'shop') {
    this.router.navigate(['/shops'], {
      queryParams: { shopId: item.id }
    });
  }
}
}