import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  username = '';
  password = '';
  errorMessage = '';

  private baseUrl = 'http://127.0.0.1:8000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {

  this.http.post(
    `${this.baseUrl}/dj-rest-auth/login/`,
    {
      username: this.username,
      password: this.password
    }
  ).subscribe({
    next: (res: any) => {

      console.log("Login success:", res);

      localStorage.setItem('authToken', res.key);

      localStorage.setItem('username', this.username);

      this.router.navigate(['/shops']);
    },
    error: (err) => {
      console.error("Login failed:", err);
      this.errorMessage = "Invalid username or password";
    }
  });
}

  loginWithGoogle() {
    window.location.href =
      'http://localhost:8000/accounts/google/login/';
  }
  
}