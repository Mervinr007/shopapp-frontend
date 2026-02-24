// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';

// export const authGuard: CanActivateFn = () => {

//   const router = inject(Router);
//   const token = localStorage.getItem('authToken');

//   if (token) {
//     return true;
//   } else {
//     router.navigate(['/']);
//     return false;
//   }
// };

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const http = inject(HttpClient);

  return http.get(
    'http://localhost:8000/myapp/check-auth/',
    { withCredentials: true }
  ).pipe(
    map(() => true),
    catchError(() => {
      router.navigate(['/']);
      return of(false);
    })
  );
};