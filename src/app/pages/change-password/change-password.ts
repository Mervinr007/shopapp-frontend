import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ChangePasswordComponent {

  old_password: string = '';
  new_password: string = '';

  private baseUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient, private router: Router,
    private snackBar: MatSnackBar
  ) {}

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

      this.snackBar.open(
        'Password changed successfully',
        'OK',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        }
      );

      setTimeout(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('username');
        this.router.navigate(['/login']);
      }, 1500);
    },

    error: (err) => {

      this.snackBar.open(
        err?.error?.error || 'Error changing password',
        'Close',
        {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        }
      );

    }

  });
}
}