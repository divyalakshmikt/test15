import { Component, OnInit, Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ProductService } from "../../services/product.service";
import { Product } from "../../classes/product";
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public checkoutForm: FormGroup;

  public products: Product[] = [];
  public search: boolean = false;

  public languages = [{
    name: 'English',
    code: 'en'
  }, {
    name: 'French',
    code: 'fr'
  }];

  public currencies = [{
    name: 'Euro',
    currency: 'EUR',
    price: 0.90 // price of euro
  }, {
    name: 'Rupees',
    currency: 'INR',
    price: 70.93 // price of inr
  }, {
    name: 'Pound',
    currency: 'GBP',
    price: 0.78 // price of euro
  }, {
    name: 'Dollar',
    currency: 'USD',
    price: 1 // price of usd
  }]

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private translate: TranslateService,
    public productService: ProductService,
    private _router: Router,
    private fb: FormBuilder,
  ) {
    this.checkoutForm = this.fb.group({
      product_name: ['', [Validators.required]]
    });


    this.productService.cartItems.subscribe(response => this.products = response);
  }

  ngOnInit(): void {
  }

  searchToggle() {
    this.search = !this.search;
  }

  changeLanguage(code) {
    if (isPlatformBrowser(this.platformId)) {
      this.translate.use(code)
    }
  }

  get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  async removeItem(product: any) {
    this.productService.removeCartItem(product);
    this.productService.cartItems.subscribe(response => this.products = response);




    // remove from DB
    let get_userId = localStorage.getItem("ecommerce_user_id")
    if (get_userId) {

      let info = {
        product_id: product.id,
        user_id: get_userId,
      }
      console.log("--------remove to cart info--------- :", info)
      // save to db
      await this.productService.removeToCartItems(info).subscribe(response => {
        console.log("=====remove to cart  response  ===== :", response)
      });
    }




  }

  changeCurrency(currency: any) {
    this.productService.Currency = currency
  }

  getOneProduct(value) {
    this._router.navigateByUrl(`/shop/product/left/sidebar/${value}`);

  }

  searchProduct() {

    localStorage.setItem("search", JSON.stringify(this.checkoutForm.value.product_name));
    this.search = !this.search;
    // this._router.navigateByUrl(`shop/collection/left/sidebar`);
    this._router.navigate([`shop/collection/left/sidebar`], { queryParams: { search: this.checkoutForm.value.product_name } });

  }

}
