import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePasswordComponent {

  old_password: string = '';
  new_password: string = '';

  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient, private router: Router) {}

 changePassword() {

  const body = {
    old_password: this.old_password,
    new_password: this.new_password
  };

  this.http.post(
    `http://127.0.0.1:8000/api/auth/change_password/`,
    body
  ).subscribe({
    next: () => {
      alert('Password changed successfully');

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');

      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error(err);
      alert(err?.error?.error || 'Error changing password');
    }
  });
}
}