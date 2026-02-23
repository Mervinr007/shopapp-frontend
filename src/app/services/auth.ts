import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private baseUrl = 'http://127.0.0.1:8000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  loginRequest(data: any) {
    return this.http.post(this.baseUrl + '/dj-rest-auth/login/', data);
  }

  register(data: any) {
    return this.http.post(this.baseUrl + '/dj-rest-auth/registration/', data);
  }

  login(token: string, username: string) {
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username);
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getUsername(): string {
    return localStorage.getItem('username') || 'User';
  }
}