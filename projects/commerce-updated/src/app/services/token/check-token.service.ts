import { Injectable } from '@angular/core';
import { FortressService } from '../local/local.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CheckTokenService {
  constructor(private fortress: FortressService, private route: Router) {}
  verifyToken(): boolean {
    if (this.fortress.get('token')) {
      return true;
    } else {
      return false;
    }
  }

  tokenValidator(api: Observable<any>) {
    api.subscribe(
      (response) => console.log(response),
      (error) => {
        if (error.status == 401) {
          this.fortress.remove('token');
          this.route.navigateByUrl('novashop/marketplace/login');
        }
      }
    );
  }
}
