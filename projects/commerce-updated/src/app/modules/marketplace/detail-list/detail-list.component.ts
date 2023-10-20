import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryDataFromApiService } from '../../../services/api/api.service';
import { CookieService } from 'ngx-cookie-service';
import { CheckTokenService } from '../../../services/token/check-token.service';

@Component({
  selector: 'app-detail-list',
  templateUrl: './detail-list.component.html',
  styleUrls: ['./detail-list.component.css'],
})
export class DetailListComponent {
  id!: number;
  allData!: Observable<any>;

  isAdmin: boolean = false;
  constructor(
    private title: Title,
    private httpService: QueryDataFromApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cookiesService: CookieService,
    private tokenService: CheckTokenService
  ) {
    title.setTitle('Détail Panier');
  }
  ngOnInit(): void {
    this.id = +this.route.snapshot.params['id'];
    this.allData = this.httpService.postDataFromApi('/api/detailUser', {
      id: this.id,
    });
    this.tokenService.tokenValidator(this.allData);
    if (this.cookiesService.get('admin')) {
      this.isAdmin = true;
    }
  }

  onBackClick() {
    this.router.navigateByUrl('dashboard');
  }
}
