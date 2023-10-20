import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { CheckTokenService } from '../../../services/token/check-token.service';
import { FortressService } from '../../../services/local/local.service';
import { QueryDataFromApiService } from '../../../services//api/api.service';
import { CookieService } from 'ngx-cookie-service';
declare var bootstrap: any;

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent {
  allData!: Observable<any>;
  hasToken: boolean = false;
  data: any = {
    produits: [],
    price: 0,
  };
  isAdmin: boolean = false;
  constructor(
    private title: Title,
    private httpService: QueryDataFromApiService,
    private route: Router,
    private tokenService: CheckTokenService,
    private fortress: FortressService,
    private cookieService: CookieService
  ) {
    title.setTitle('Tableau de bord');
  }
  ngOnInit(): void {
    if (this.fortress.get('cart')) {
      this.data = this.fortress.get('cart');
    }
    this.hasToken = this.tokenService.verifyToken();
    if (this.cookieService.get('admin')) {
      this.isAdmin = true;
      this.allData = this.httpService.getDataFromApi('/api/alldata');
    } else {
      if (this.hasToken) {
        this.allData = this.httpService.postDataFromApi(
          '/api/getAllDataUserByMAil',
          {
            email: this.fortress.get('email'),
          }
        );
        this.tokenService.tokenValidator(this.allData);
      }
    }
    if (this.fortress.get('email') != 'admin@admin.com') {
      var toast = new bootstrap.Toast(document.querySelector('.toast'));
      toast.show();
    }
  }

  onDetailClcik(id: number) {
    this.route.navigateByUrl(`novashop/marketplace/detail/${id}`);
  }

  onDataChange(newData: any[]) {
    this.data = [];
    this.data = newData;
    this.fortress.set('cart', this.data);
  }
}
