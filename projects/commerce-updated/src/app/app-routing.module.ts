import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './modules/essentials/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'novashop/marketplace/products', pathMatch: 'full' },
  {
    path: '',
    children: [
      {
        path: 'novashop',
        loadChildren: () => import('./modules/essentials/essentials.module').then(m => m.EssentialsModule)
      },
      {
        path: 'novashop/marketplace',
        loadChildren: () => import('./modules/marketplace/marketplace.module').then(m => m.MarketplaceModule)
      }
    ],
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
