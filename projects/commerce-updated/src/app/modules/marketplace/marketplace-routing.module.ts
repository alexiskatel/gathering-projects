import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ProductListComponent } from './product-list/product-list.component';
import { DetailListComponent } from './detail-list/detail-list.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from '../../services/auth/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'form', component: CheckoutFormComponent },
      { path: 'dashboard', component: OrderListComponent, canActivate: [AuthGuardService] },
      { path: 'products', component: ProductListComponent },
      { path: 'detail/:id', component: DetailListComponent },
      { path: 'login', component: LoginComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketplaceRoutingModule { }
