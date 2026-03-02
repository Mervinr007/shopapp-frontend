import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'

})
export class Signup {

  username = '';
  password = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {

  const body = {
    username: this.username,
    password: this.password
  };

  this.http.post('http://127.0.0.1:8000/api/auth/register/', body)
    .subscribe({
      next: () => {
        alert("Account created successfully!");
        this.router.navigate(['/login']); 
      },
      error: (err) => {
        console.error(err);
        alert("Registration failed");
      }
    });
}
}