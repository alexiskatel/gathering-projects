import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataInterface } from '../../../modeles/dataInterface';
import { DataSharingService } from '../../../services/sharing/data-sharing.service';
import { QueryDataFromApiService } from '../../../services/api/api.service';
import { FortressService } from '../../../services/local/local.service';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css'],
})
export class CheckoutFormComponent {
  constructor(
    private route: Router,
    private fb: FormBuilder,
    private title: Title,
    private fortress: FortressService,
    private httpService: QueryDataFromApiService
  ) {
    title.setTitle('Formulaire');
  }

  data: any = this.fortress.get('cart');
  continue: boolean = false;
  public register: FormGroup = new FormGroup({});
  @ViewChild('lastName') lastNameInput!: ElementRef;
  @ViewChild('firstName') firstNameInput!: ElementRef;
  @ViewChild('email') emailInput!: ElementRef;
  @ViewChild('secretCode') codeInput!: ElementRef;

  ngOnInit() {
    if (this.fortress.get('cart')) {
      this.data = this.fortress.get('cart');
    }
    if (this.fortress.get('cart')) this.continue = true;
    this.register = this.fb.group({
      lastName: '',
      firstName: '',
      email: '',
      secretCode: '',
    });
    const fillInput = {
      lastName: '',
      firstName: '',
      email: this.fortress.get('email') ?? '',
      secretCode: this.fortress.get('token') ? '********' : '',
    };
    if (this.fortress.get('email')) {
      const userMail = this.fortress.get('email');
      this.httpService
        .postDataFromApi('/api/obtaindatauser', {
          email: userMail,
        })
        .subscribe(
          (response) => {
            this.fortress.set('user', response);
            const user = this.fortress.get('user');
            fillInput.lastName = user.nom;
            fillInput.firstName = user.prenom;
            this.register.patchValue({
              lastName: fillInput.lastName,
              firstName: fillInput.firstName,
              email: fillInput.email,
              secretCode: fillInput.secretCode,
            });
          },
          (error) => {
            console.log('Non envoyé');
          }
        );
    }

    const inputs = this.register.get('email ');
    console.log(inputs);
  }

  ngAfterViewInit() {
    if (this.fortress.get('token')) {
      this.lastNameInput.nativeElement.setAttribute('readonly', 'true');
      this.firstNameInput.nativeElement.setAttribute('readonly', 'true');
      this.emailInput.nativeElement.setAttribute('readonly', 'true');
      this.codeInput.nativeElement.setAttribute('readonly', 'true');
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.httpService
      .postDataFromApi('/api/store', {
        utilisateur: this.register.value,
        produits: this.data.produits,
      })
      .subscribe(
        (response) => {
          console.log(response);
          this.fortress.set('email', this.register.get('email')?.value);
          this.route.navigate(['novashop/marketplace/products'], {
            queryParams: { status: 'valid' },
          });
        },
        (error) => {
          console.error(error);
        }
      );
  }
}
