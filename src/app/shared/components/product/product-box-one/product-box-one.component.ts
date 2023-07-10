import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuickViewComponent } from "../../modal/quick-view/quick-view.component";
import { CartModalComponent } from "../../modal/cart-modal/cart-modal.component";
import { Product } from "../../../classes/product";
import { ProductService } from "../../../services/product.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-box-one',
  templateUrl: './product-box-one.component.html',
  styleUrls: ['./product-box-one.component.scss']
})
export class ProductBoxOneComponent implements OnInit {

  @Input() product: Product;
  @Input() currency: any = this.productService.Currency; // Default Currency 
  @Input() thumbnail: boolean = false; // Default False 
  @Input() onHowerChangeImage: boolean = false; // Default False
  @Input() cartModal: boolean = false; // Default False
  @Input() loader: boolean = false;

  @ViewChild("quickView") QuickView: QuickViewComponent;
  @ViewChild("cartModal") CartModal: CartModalComponent;

  public ImageSrc: string

  constructor(
    private productService: ProductService,
    private _router: Router,
    private toastrService: ToastrService,

  ) { }

  ngOnInit(): void {
    if (this.loader) {
      setTimeout(() => { this.loader = false; }, 2000); // Skeleton Loader
    }
  }

  // Get Product Color
  // Color(variants) {
  //   const uniqColor = [];
  //   for (let i = 0; i < Object.keys(variants).length; i++) {
  //     if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
  //       uniqColor.push(variants[i].color)
  //     }
  //   }
  //   return uniqColor
  // }

  // // Change Variants
  // ChangeVariants(color, product) {
  //   product.variants.map((item) => {
  //     if (item.color === color) {
  //       product.images.map((img) => {
  //         if (img.image_id === item.image_id) {
  //           this.ImageSrc = img.src;
  //         }
  //       })
  //     }
  //   })
  // }

  // Change Variants Image
  ChangeVariantsImage(src) {
    this.ImageSrc = src;
  }

  async addToCart(product: any) {

    this.productService.addToCart(product);

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
  }

  addToWishlist(product: any) {
    let get_userId = localStorage.getItem("ecommerce_user_id")

    if (get_userId) {
      let info = {
        user_id: get_userId,
        product_id: product.id
      }
      console.log("=== info ----- :", info)
      this.productService.addToWhishlist(info).subscribe(response => {
        console.log("===== whish list ===== :", response)
        if (response.body.status_code === 200) {
          this.productService.addToWishlist(product)
        } else {
          this.toastrService.error(`${response.body.message}`);
        }
      });
    } else {
      this.toastrService.error('Please login');

    }

  }

  addToCompare(product: any) {
    this.productService.addToCompare(product);
  }

  getOneProduct(value) {
    console.log("=====Click value======== :", value)
    this._router.navigateByUrl(`/shop/product/left/sidebar/${value}`);

  }

}
