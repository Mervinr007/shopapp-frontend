
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-oauth-callback',
  template: '<p>Logging you in...</p>'
})
export class OauthCallback implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const access = params['access'];
      const refresh = params['refresh'];

      if (access && refresh) {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        const payload = JSON.parse(atob(access.split('.')[1]));
        const username = payload.username || payload.user_id || 'User';
        localStorage.setItem('username', username);       
        this.router.navigate(['/home']); 
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}