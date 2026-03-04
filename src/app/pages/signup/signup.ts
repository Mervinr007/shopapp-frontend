import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatSnackBarModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  username = '';
  password = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  register() {

    if (this.loading) return;

    if (!this.username || !this.password) {
      this.snackBar.open(
        'Please fill all fields',
        'Close',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
          horizontalPosition: 'right'
        }
      );
      return;
    }

    this.loading = true;

    const body = {
      username: this.username,
      password: this.password
    };

    this.http.post('http://127.0.0.1:8000/api/auth/register/', body)
      .subscribe({
        next: () => {

          this.loading = false;
          this.cdr.detectChanges();

          this.snackBar.open(
            'Account created successfully!',
            'OK',
            {
              duration: 3000,
              panelClass: ['success-snackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'right'
            }
          );

          this.router.navigate(['/login']);
        },

        error: () => {

          this.loading = false;
          this.cdr.detectChanges();

          this.snackBar.open(
            'Registration failed',
            'Close',
            {
              duration: 4000,
              panelClass: ['error-snackbar'],
              verticalPosition: 'top',
              horizontalPosition: 'right'
            }
          );
        }
      });
  }
}