import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { QueryDataFromApiService } from '../../../services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FortressService } from '../../../services/local/local.service';
import Swal from 'sweetalert2';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  login: FormGroup = new FormGroup({});
  login$!: Observable<any>;
  continue: boolean = true;
  data: any = {
    produits: [],
    price: 0,
  };
  constructor(
    private fb: FormBuilder,
    private title: Title,
    private httpService: QueryDataFromApiService,
    private route: Router,
    private getRoute: ActivatedRoute,
    private fortress: FortressService,
    private cookieService: CookieService
  ) {
    title.setTitle('Connexion');
  }
  ngOnInit(): void {
    if (this.fortress.get('cart')) {
      this.data = this.fortress.get('cart');
    }
    this.login = this.fb.group({
      email: [null],
      secretCode: [null],
    });

    this.getRoute.queryParams.subscribe((params) => {
      let status = params['status'];
      if (status == 'false') {
        Swal.fire({
          title: '',
          html: `
          <p>Désolé. Vous ne pouvez pas accéder à la page demandée car vous n'êtes pas connecté.</p>
          <p>Veuillez vous authentifier s'il vous plait !</p>
          `,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    });
  }

  onSubmit(event: Event): void {
    this.continue = true;
    const btn = document.getElementById('btnSubmit');
    btn?.classList.add('btn-warning', 'disabled');
    setTimeout(() => {
      this.httpService
        .postDataFromApi('/api/login', this.login.value)
        .subscribe(
          (response) => {
            if (response.valid) {
              this.fortress.set('token', String(response.token));
              this.fortress.set('email', String(response.email));
              if (response.admin) {
                this.cookieService.set(
                  'admin',
                  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
                );
              }
              this.route.navigateByUrl('/novashop/marketplace/dashboard');
              return;
            }
            this.continue = false;
          },

          (error) => (this.continue = false)
        );
      btn?.classList.remove('btn-warning', 'disabled');
    }, 2000);
  }

  onDataChange(newData: any[]) {
    this.data = [];
    this.data = newData;
    this.fortress.set('cart', this.data);
  }
}
