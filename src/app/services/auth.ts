import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

 
  loginRequest(data: any) {
    return this.http.post(this.baseUrl + '/token/', data);
  }

  
  register(data: any) {
    return this.http.post(this.baseUrl + '/auth/register/', data);
  }

  
  login(access: string, refresh: string, username: string) {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    localStorage.setItem('username', username);
  }


    refreshToken() {
  const refresh = localStorage.getItem('refreshToken');
  return this.http.post<any>(this.baseUrl + '/token/refresh/', {
    refresh: refresh
  });
}
  logout() {
  const refresh = localStorage.getItem('refreshToken');

  if (refresh) {
    this.http.post(this.baseUrl + '/auth/logout/', {
      refresh: refresh
    }).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');

  this.router.navigate(['/login']);
}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }


  getUsername(): string {
    return localStorage.getItem('username') || 'User';
  }
}