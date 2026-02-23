import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Shops } from './pages/shops/shops';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout';
import { ChangePasswordComponent } from './pages/change-password/change-password';
import { Signup } from './pages/signup/signup';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [

  
  { path: '', component: Login },
  { path: 'signup', component: Signup },


  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],  
    children: [
      { path: 'shops', component: Shops },
      { path: 'change-password', component: ChangePasswordComponent },
    ]
  },

  {
    path: 'products/:id',
    loadComponent: () =>
      import('./pages/products/products').then(m => m.Products),
    canActivate: [authGuard]  
  }

];