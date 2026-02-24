
import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

    const token = localStorage.getItem('authToken');

    if (!token) {
      alert('Not authenticated');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    const body = {
      old_password: this.old_password,
      new_password: this.new_password
    };

    this.http.post(
      `${this.baseUrl}/myapp/change-password/`,
      body,
      { headers }
    ).subscribe({
      next: () => {
        alert('Password changed successfully');

      
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');

        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error(err);
        alert('Error changing password');
      }
    });
  }

}