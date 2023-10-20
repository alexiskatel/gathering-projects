import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Produits } from '../../modules/marketplace/product-list/produits';
import { Product } from '../../modeles/productInterface';
import { Router } from '@angular/router';
import { DataSharingService } from '../../services/sharing/data-sharing.service';
import { FortressService } from '../../services/local/local.service';
import { CheckTokenService } from '../../services/token/check-token.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(
    private route: Router,
    private dataSharing: DataSharingService,
    private fortress: FortressService,
    private tokenService: CheckTokenService,
    private cookieService: CookieService
  ) {}

  produits = Produits;
  @Input('cartUpdateSelf')
  cartUpdateSelf = true;
  @Input('data')
  data: any = this.fortress.get('cart');
  @Input('cartIsActive')
  cartIsActive = false;
  @Output() public dataChange: EventEmitter<any[]> = new EventEmitter<any[]>();
  hasToken: boolean = false;
  isAdmin: boolean = false;

  ngOnInit() {
    if (!this.cartIsActive) {
      if (this.fortress.get('cart')) {
        this.data = this.fortress.get('cart');
      } else {
        this.data = {
          produits: [],
          price: 0,
        };
      }
    }
    this.hasToken = this.tokenService.verifyToken();
    if (this.cookieService.get('admin')) {
      this.isAdmin = true;
    }
    console.log(this.hasToken);
  }

  onClickMinus(quantityProduit: string) {
    let newPrice = 0;
    const id = document.getElementById(quantityProduit)!;
    const idValue = Number(id?.outerText);
    idValue > 0 ? (id.innerText = String(idValue - 1)) : '';
    const produitInProduits = this.produits.find(
      (element) => element.nom == quantityProduit
    );

    const produitInData = this.data.produits.find(
      (element: Product) => element.nom == quantityProduit
    );
    if (produitInProduits != null && idValue > 0) {
      newPrice =
        Math.round((produitInData.prix - produitInProduits.prix) * 100) / 100;
      produitInData.quantite = Number(id?.outerText);
      produitInData.prix = newPrice;
      this.data.price > 0 ? (this.data.price -= produitInProduits.prix) : '';
    }

    if (Number(id?.outerText) == 0) {
      this.data.produits = this.data.produits.filter(
        (obj: Product) => obj.nom !== produitInData.nom
      );
    }

    if (this.data.produits.length == 0) {
      document.getElementById('payer')?.setAttribute('disabled', 'true');
    }
    this.dataChange.emit(this.data);
  }
  onClickPlus(quantityProduit: string) {
    let newPrice = 0;
    const id = document.getElementById(quantityProduit)!;
    const idValue = Number(id?.outerText);
    id.innerText = String(idValue + 1);
    const produitInData = this.data.produits.find(
      (element: Product) => element.nom == quantityProduit
    );
    const produitInProduits = this.produits.find(
      (element) => element.nom == quantityProduit
    );
    if (produitInProduits != null) {
      newPrice = produitInProduits.prix * Number(idValue + 1);
      produitInData.quantite = Number(id?.outerText);
      produitInData.prix = newPrice;
      this.data.price += produitInProduits.prix;
    }
    this.dataChange.emit(this.data);
  }
  onDelete(produit: string) {
    this.data.produits = this.data.produits.filter(
      (obj: Product) => obj.nom !== produit
    );
    if (this.data.produits.length == 0) {
      document.getElementById('payer')?.setAttribute('disabled', 'true');
    }
    this.data.price = 0;
    this.data.produits.map((produitObj: Product) => {
      this.data.price += produitObj.prix;
    });
    this.dataChange.emit(this.data);
  }

  OnValidCart() {
    // this.dataSharing.sendData(this.data)
    this.route.navigateByUrl('/novashop/marketplace/form');
  }

  logout() {
    if (this.cookieService.get('admin')) {
      this.cookieService.delete('admin');
    }
    this.fortress.remove('token');
    this.hasToken = false;
    this.route.navigate(['/novashop/marketplace/products'], {
      queryParams: { logout: 'true' },
    });
  }

  onTrash() {
    this.data = {
      produits: [],
      price: 0
    }
    this.dataChange.emit(this.data);
  }
}
