import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from "../../shared/services/product.service";
import { Product } from "../../shared/classes/product";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  public products: Product[] = [];

  constructor(private router: Router,
    public productService: ProductService,
    private toastrService: ToastrService,
  ) {
    // this.productService.wishlistItems.subscribe(response => this.products = response);

    this.getWhistlist()
  }

  ngOnInit(): void {
  }



  getWhistlist() {
    let get_userId = localStorage.getItem("ecommerce_user_id")
    this.products = []
    if (get_userId) {
      // get wishlist items from DB
      this.productService.getWhishlist(get_userId).subscribe(response => {
        // console.log("===== whish list ===== :", response)
        if (response.body.status_code === 200) {
          this.products = response.body.info
        } else {
          this.toastrService.error(`${response.body.message}`);
        }
      });
    }
  }



  async addToCart(product: any) {

    // add values to localhost
    const status = await this.productService.addToCart(product);



    // add values to DB
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
      console.log("--------Add to cart--------- :", info)
      // save to db
      await this.productService.addToCartItems(info).subscribe(response => {
        console.log("===== add to cart response  ===== :", response)

      });
    }




    if (status) {
      this.router.navigate(['/shop/cart']);
      this.removeItem(product);
    }
  }

  removeItem(product: any) {
    console.log("====Which list Remove======= :", product)
    // this.productService.removeWishlistItem(product);
    console.log("=== produt id ==== :", product.id)
    let get_userId = localStorage.getItem("ecommerce_user_id")

    let info = {
      product_id: product.id,
      user_id: get_userId
    }

    this.productService.removeWhishProduct(info).subscribe(response => {
      console.log("===== whish list ===== :", response)
      if (response.body.status_code === 200) {
        // this.products = response.body.info
        this.getWhistlist()
        // localStorage.setItem("wishlistItems", JSON.stringify(response.body.info));
      } else {
        this.toastrService.error(`${response.body.message}`);
      }
    });
  }

}
