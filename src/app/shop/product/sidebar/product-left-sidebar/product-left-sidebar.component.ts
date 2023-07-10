import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailsMainSlider, ProductDetailsThumbSlider } from '../../../../shared/data/slider';
import { Product } from '../../../../shared/classes/product';
import { ProductService } from '../../../../shared/services/product.service';
import { SizeModalComponent } from "../../../../shared/components/modal/size-modal/size-modal.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-left-sidebar',
  templateUrl: './product-left-sidebar.component.html',
  styleUrls: ['./product-left-sidebar.component.scss']
})
export class ProductLeftSidebarComponent implements OnInit {

  public product: Product = {};
  public counter: number = 1;
  public activeSlide: any = 0;
  public selectedSize: any;
  public mobileSidebar: boolean = false;
  public active = 1;

  @ViewChild("sizeChart") SizeChart: SizeModalComponent;

  public ProductDetailsMainSliderConfig: any = ProductDetailsMainSlider;
  public ProductDetailsThumbConfig: any = ProductDetailsThumbSlider;

  constructor(
    private route: ActivatedRoute, private router: Router,
    public productService: ProductService,
    private toastrService: ToastrService,
  ) {

    this.route.data.subscribe(response => {
      const queryString = window.location.href;
      // let produt_id = queryString.replace("http://localhost:4200/shop/product/left/sidebar/", "")
      let produt_id = queryString.replace("https://wellness-ecommerce-website.vercel.app/shop/product/left/sidebar/", "")

      this.productService.getOneproduct(produt_id)
        .subscribe(response => {
          this.product = response.info[0]
        });
    });


  }

  ngOnInit(): void {
  }

  // Get Product Color
  Color(variants) {
    const uniqColor = []
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqColor.indexOf(variants[i].color) === -1 && variants[i].color) {
        uniqColor.push(variants[i].color)
      }
    }
    return uniqColor
  }

  // Get Product Size
  Size(variants) {
    const uniqSize = []
    for (let i = 0; i < Object.keys(variants).length; i++) {
      if (uniqSize.indexOf(variants[i].size) === -1 && variants[i].size) {
        uniqSize.push(variants[i].size)
      }
    }
    return uniqSize
  }

  selectSize(size) {
    this.selectedSize = size;
  }

  // Increament
  increment() {
    this.counter++;
  }

  // Decrement
  decrement() {
    if (this.counter > 1) this.counter--;
  }

  // Add to cart
  async addToCart(product: any) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart(product);
    if (status)
      this.router.navigate(['/shop/cart']);
  }

  // Buy Now
  async buyNow(product: any) {
    product.quantity = this.counter || 1;
    const status = await this.productService.addToCart(product);
    if (status)
      this.router.navigate(['/shop/checkout']);
  }

  // Add to Wishlist
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

  // Toggle Mobile Sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }

  async getProduct(produt_id) {
    await this.productService.getOneproduct(produt_id)
      .subscribe(response => {
        console.log("======ONE PRODUCT======== :", response)

        this.product = response.info

      });
  }

}
