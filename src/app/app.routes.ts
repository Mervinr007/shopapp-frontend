import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Shops } from './pages/shops/shops';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout';
import { ChangePasswordComponent } from './pages/change-password/change-password';
import { Signup } from './pages/signup/signup';
import { authGuard } from './guard/auth.guard';
import { Products } from './components/products/products';

export const routes: Routes = [

 
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },

  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [

      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'home', component: Home },
      { path: 'shops', component: Shops },
      { path: 'products', component: Products },

      {
        path: 'all-products',
        loadComponent: () =>
          import('./components/allproducts/allproducts')
            .then(m => m.AllProducts),
      },

      {
        path: 'products/:id',
        loadComponent: () =>
          import('./pages/products/products')
            .then(m => m.Products),
      },

      { path: 'change-password', component: ChangePasswordComponent }

    ]
  },


  { path: '**', redirectTo: 'login' }

];