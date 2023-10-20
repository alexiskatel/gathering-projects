import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { ProductListComponent } from './product-list/product-list.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { OrderListComponent } from './order-list/order-list.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DetailListComponent } from './detail-list/detail-list.component';
import { LoginComponent } from './login/login.component';
import { CookieService } from 'ngx-cookie-service';
import { AuthInterceptor } from '../../services/Intercepteur/auth.service';

@NgModule({
  declarations: [
    ProductListComponent,
    CheckoutFormComponent,
    OrderListComponent,
    NavbarComponent,
    DetailListComponent,
    LoginComponent,
  ],
  providers: [
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  imports: [
    CommonModule,
    MarketplaceRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
})
export class MarketplaceModule {}
