import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

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

  private baseUrl = 'http://127.0.0.1:8000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {

    if (!this.username || !this.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please enter username and password'
      });
      return;
    }

    this.http.post(
      `${this.baseUrl}/api/token/`,
      {
        username: this.username,
        password: this.password
      }
    ).subscribe({
      next: (res: any) => {

        localStorage.setItem('accessToken', res.access);
        localStorage.setItem('refreshToken', res.refresh);
        localStorage.setItem('username', this.username);

        Swal.fire({
          icon: 'success',
          title: 'Welcome Back 👋',
          text: 'Login Successful',
          timer: 1000,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/home']);
        });

      },
      error: () => {

        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: 'Invalid username or password',
          timer: 1000,
          confirmButtonText: 'Try Again'
        });

      }
    });
  }

  loginWithGoogle() {
    window.location.href =
      'http://localhost:8000/accounts/google/login/';
  }
}