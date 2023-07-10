import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from "../../../shared/services/product.service";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public checkoutForm: FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(
    private fb: FormBuilder,
    public productService: ProductService,
    private toastrService: ToastrService,
    private _router: Router,
  ) {
    this.checkoutForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(9)]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip_code: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }


  async register() {
    let info = {
      ...this.checkoutForm.value
    }

    // this.productService.register(info).subscribe(response => {

    //   if (response.body.status_code === 200) {
    //     let user_id = response.body["info"].user_id
    //     localStorage.setItem("ecommerce_user_id", JSON.stringify(user_id));
    //     this._router.navigateByUrl(`/home/ecommerce`);
    //     this.toastrService.success('Your account was successfully created...! ');

    //   } else {
    //     this.toastrService.error('Oops.. Something went wrong.. Please try again');
    //   }
    // });

    let response = await this.productService.register(info).toPromise();
    if (response.body.status_code === 200) {

      // if already logined in clear all values
      let get_userId = localStorage.getItem("ecommerce_user_id")
      if (get_userId) {
        localStorage.clear();
      }


      let user_id = response.body["info"].user_id
      localStorage.setItem("ecommerce_user_id", JSON.stringify(user_id));



      // save cart items to DB
      let cartItems = JSON.parse(localStorage.getItem("cartItems"));

      get_userId = localStorage.getItem("ecommerce_user_id")

      if (get_userId) {
        if (cartItems) {
          for (let i = 0; i < cartItems.length; i++) {
            let info = {
              product_id: cartItems[i].id,
              user_id: get_userId,
              quantity: cartItems[i].quantity
            }
            await this.productService.addToCartItems(info).toPromise();
          }
        }
        // else {
        let getCartItems = await this.productService.getCartItems(get_userId).toPromise();
        if (getCartItems.body.status_code === 200) {
          localStorage.setItem("cartItems", JSON.stringify(getCartItems.body.info));
        }

        // }
      }





      this._router.navigateByUrl(`/home/ecommerce`);
      this.toastrService.success('Your account was successfully created...! ');

    } else {
      this.toastrService.error(`${response.body.message}`);
    }


  }

}
