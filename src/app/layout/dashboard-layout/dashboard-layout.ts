import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css']
})
export class DashboardLayoutComponent {

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isSidebarClosed = false;
  username: string | null = localStorage.getItem('username');

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  goToChangePass() {
    this.router.navigate(['change-password'], { relativeTo: this.route });
  }

  goToProducts() {
    this.router.navigate(['products'], { relativeTo: this.route });
  }

  goToAllProducts() {
    this.router.navigate(['all-products'], { relativeTo: this.route });
  }

  goBackToShops() {
    this.router.navigate(['shops'], { relativeTo: this.route });
  }
  goToHome() {
    this.router.navigate(['home'], { relativeTo: this.route });
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}