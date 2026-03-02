import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private baseUrl = 'http://127.0.0.1:8000/api/shops/';

  constructor(private http: HttpClient) {}

  getShops() {
    return this.http.get<any[]>(this.baseUrl);
  }

  addShop(data: FormData) {
    return this.http.post(this.baseUrl, data);
  }

  updateShop(id: number, data: FormData) {
    return this.http.put(`${this.baseUrl}${id}/`, data);
  }

  deleteShop(id: number) {
    return this.http.delete(`${this.baseUrl}${id}/`);
  }
}