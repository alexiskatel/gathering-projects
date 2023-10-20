import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { EssentialsRoutingModule } from './essentials-routing.module';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CheckoutFormComponent } from '../marketplace/checkout-form/checkout-form.component';
@NgModule({
  declarations: [
    HomeComponent,
    ContactUsComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    EssentialsRoutingModule
  ],
  exports: [
    EssentialsRoutingModule,
  ]
})
export class EssentialsModule { }

