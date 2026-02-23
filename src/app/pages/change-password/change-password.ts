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

  constructor(private http: HttpClient, private router: Router) {}

  changePassword() {

    const body = {
      old_password: this.old_password,
      new_password: this.new_password
    };

    this.http.post('http://127.0.0.1:8000/api/change-password/', body)
      .subscribe({
        next: () => {
          alert('Password changed successfully');
          this.router.navigate(['/shops']);
        },
        error: (err) => {
          console.error(err);
          alert('Error changing password');
        }
      });
  }

}