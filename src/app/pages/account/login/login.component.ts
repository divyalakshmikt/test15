import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from "../../../shared/services/product.service";
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  public checkoutForm: FormGroup;


  constructor(private fb: FormBuilder,
    public productService: ProductService,
    private _router: Router,
    private toastrService: ToastrService,) { 
 
    this.checkoutForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }



  ngOnInit(): void {
  }

 

 async login(){
    console.log(this.checkoutForm.value);

    let response = await this.productService.login(this.checkoutForm.value).toPromise();

    console.log("------LOGIN RESPONSE------- :", response)
    if (response.body.status_code === 200) {

      // if already logined in clear all values
      let get_userId = localStorage.getItem("ecommerce_user_id")
      if (get_userId) {
        localStorage.clear();
      }

      let user_id = response.body.user_id
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

      // this._router.navigateByUrl(`/home/ecommerce`);
      this.toastrService.success('You are successfully logged in');


      setTimeout(() => {
        this._router.navigateByUrl(`/home/ecommerce`);
      }, 2000);


    } else {
     
      this.toastrService.error('Incorrect username or password');
    }
  }


  forgotpwd() {
    this._router.navigateByUrl(`/pages/forget/password`);
  }

}
