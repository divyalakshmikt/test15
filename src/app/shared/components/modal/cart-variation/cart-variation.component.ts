import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from "../../../services/product.service";
import { Product } from "../../../classes/product";
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-variation',
  templateUrl: './cart-variation.component.html',
  styleUrls: ['./cart-variation.component.scss']
})
export class CartVariationComponent implements OnInit, OnDestroy {

  @Input() direction: string = 'right'; // Default Direction Right

  public products: Product[] = [];

  constructor(
    public productService: ProductService,
    private _router: Router,
  ) {
    this.productService.cartItems.subscribe(response => this.products = response);
  }

  ngOnInit(): void {
    this.productService.OpenCart = false;
  }

  closeCart() {
    this.productService.OpenCart = false;
  }

  get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  async removeItem(product: any) {
    this.productService.removeCartItem(product);

    // get cart list 
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

  ngOnDestroy(): void {
    this.closeCart();
  }

  getOneProduct(value) {
    console.log("=====Click value======== :", value)
    this._router.navigateByUrl(`/shop/product/left/sidebar/${value}`);

  }

}
