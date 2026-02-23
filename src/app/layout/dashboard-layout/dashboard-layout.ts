import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) {}

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  goToChangePass() {
    this.router.navigate(['/change-password']);
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    this.router.navigate(['/']);
  }
}