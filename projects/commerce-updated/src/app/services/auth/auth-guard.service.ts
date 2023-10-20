import { Injectable } from '@angular/core';
import { CheckTokenService } from '../token/check-token.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private authService: CheckTokenService,
    private route: Router,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.verifyToken()) {
      return true
    } else {
      this.route.navigate(['/novashop/marketplace/login'], {queryParams: {status: false}})
      return false
    }
  }
}
