import { Component, EventEmitter, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Produits } from './produits';
declare var bootstrap: any;
import Swal from 'sweetalert2';
import { LocalService } from '../../../services/local/local.service';
import { query } from '@angular/animations';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  produits = Produits;
  dataProduits: any[] = [];
  price: number = 0;
  data: any = this.local.get('cart')
  status: string = 'finish'
  constructor(
    private titlePage: Title,
    private route: ActivatedRoute,
    private router: Router,
    private local: LocalService
  ) {}
  ngOnInit() {
    this.titlePage.setTitle('Produits');
    this.route.queryParams.subscribe(params => {
      this.status = params['status']
      if(this.status == 'valid'){
        Swal.fire({
          title: 'Staut',
          text: 'Commande effectuée avec succès',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.router.navigate([], {queryParams: {status: 'finish'}})
      }
    })
  }
  addToCart(produit: any) {
    this.data = this.local.get('cart')
    this.dataProduits = this.data.produits
    this.data.produits = []
    this.price = 0;
    const card = document.getElementById(produit.nom + '-id')!;

    setTimeout(function () {
      card.style.backgroundColor = 'green';
    }, 1);

    setTimeout(function () {
      card.style.backgroundColor = 'white';
    }, 100);

    var toast = new bootstrap.Toast(document.querySelector('.toast'));
    toast.show();

    const produitInfos = {
      nom: produit.nom,
      quantite: 1,
      prix: produit.prix,
      picture: produit.picture,
    };

    const productIsExist = this.dataProduits.find(
      (product: any) => product.nom == produitInfos.nom
    );
    if (productIsExist) {
      productIsExist.quantite++;
      productIsExist.prix += produitInfos.prix;
    } else {
      this.dataProduits.push(produitInfos);
    }

    this.dataProduits.map((product) => {
      this.price += product.prix;
    });
    document.getElementById('payer')?.removeAttribute('disabled');
    this.data.produits.push(...this.dataProduits)
    this.data.price = this.price
    this.local.set('cart', JSON.stringify(this.data))
  }

  onDataChange(newData: any[]){
    this.data = []
    this.data = newData
    this.local.set('cart', JSON.stringify(this.data))
  }
}
