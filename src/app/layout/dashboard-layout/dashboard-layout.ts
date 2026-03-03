import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MatSnackBarModule],
  templateUrl: './dashboard-layout.html',
  styleUrls: ['./dashboard-layout.css']
})
export class DashboardLayoutComponent {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

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
  goToSearch() {
  this.router.navigate(['search'], { relativeTo: this.route });
}

logout() {

  this.snackBar.open(
    'Logged out successfully',
    'OK',
    {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    }
  );

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('username');

  setTimeout(() => {
    this.router.navigate(['/login']);
  }, 800);
}
}