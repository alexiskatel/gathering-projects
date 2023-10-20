import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EssentialsModule } from './modules/essentials/essentials.module';
import { MarketplaceModule } from './modules/marketplace/marketplace.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    // NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    EssentialsModule,
    MarketplaceModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
