
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css']
})
export class DashboardLayoutComponent {
  isSidebarClosed = false;
  username: string | null = localStorage.getItem('username');
  constructor(
    private router: Router,
    private http: HttpClient
  ) {}
   toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }
    goToChangePass() {
    this.router.navigate(['/change-password']);
  }
  logout() {

    const csrfToken = this.getCookie('csrftoken');

    this.http.post(
      'http://localhost:8000/dj-rest-auth/logout/',
      {},
      {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken || ''
        }
      }
    ).subscribe(() => {
      localStorage.clear();
      this.router.navigate(['/']);
    });

  }

  
  private getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  }

}