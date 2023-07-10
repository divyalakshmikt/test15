import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductService } from "../../../shared/services/product.service";
import { Product } from "../../../shared/classes/product";
import { Router } from '@angular/router';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  public products: Product[] = [];

  constructor(
    public productService: ProductService,
    private _router: Router,
  ) {
    this.productService.cartItems.subscribe(response => this.products = response);
  }

  ngOnInit(): void {
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }

  // Increament
  async increment(product, qty = 1) {
    this.productService.updateCartQuantity(product, qty);

    let get_userId = localStorage.getItem("ecommerce_user_id")
    if (get_userId) {

      let product_id = product.id
      let cartItems = JSON.parse(localStorage.getItem("cartItems"));

      let foundItem = cartItems.find((item) => {
        return item.id === product_id
      })

      let info = {
        product_id: foundItem.id,
        user_id: get_userId,
        quantity: foundItem.quantity
      }
      console.log("--------update to cart info--------- :", info)
      // save to db
      await this.productService.updateToCartItems(info).subscribe(response => {
        console.log("=====update to cart  response  ===== :", response)
      });
    }

  }

  // Decrement
  async decrement(product, qty = -1) {
    this.productService.updateCartQuantity(product, qty);

    let get_userId = localStorage.getItem("ecommerce_user_id")
    if (get_userId) {

      let product_id = product.id
      let cartItems = JSON.parse(localStorage.getItem("cartItems"));

      let foundItem = cartItems.find((item) => {
        return item.id === product_id
      })

      let info = {
        product_id: foundItem.id,
        user_id: get_userId,
        quantity: foundItem.quantity
      }
      console.log("--------update to cart info--------- :", info)
      // save to db
      await this.productService.updateToCartItems(info).subscribe(response => {
        console.log("=====update to cart  response  ===== :", response)
      });
    }
  }

  public async removeItem(product: any) {
    this.productService.removeCartItem(product);

    //call cart list
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

  getOneProduct(value) {
    console.log("=====Click value======== :", value)
    this._router.navigateByUrl(`/shop/product/left/sidebar/${value}`);

  }

}

