import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { Shops } from './pages/shops/shops';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout';
import { ChangePasswordComponent } from './pages/change-password/change-password';
import { Signup } from './pages/signup/signup';
import { authGuard } from './guard/auth.guard';
import { Products } from './components/products/products';
import { ProductDetail } from './components/product-detail/product-detail';
import { Search } from './components/search/search';
import { OauthCallback } from './pages/oauth-callback/oauth-callback';
export const routes: Routes = [

 
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'oauth/callback', component: OauthCallback },

  {
    path: '',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [

      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'home', component: Home },
      { path: 'shops', component: Shops },
      { path: 'products', component: Products },
      { path: 'product-detail/:id', component: ProductDetail },
      { path: 'search', component: Search },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./components/products/products')
            .then(m => m.Products),
      },

      { path: 'change-password', component: ChangePasswordComponent }

    ]
  },


  { path: '**', redirectTo: 'login' }

];