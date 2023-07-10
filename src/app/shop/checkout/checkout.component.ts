import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from '../../../environments/environment';
import { Product } from "../../shared/classes/product";
import { ProductService } from "../../shared/services/product.service";
import { OrderService } from "../../shared/services/order.service";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public checkoutForm: FormGroup;
  public products: Product[] = [];
  public payPalConfig?: IPayPalConfig;
  public payment: string = 'Stripe';
  public amount: any;
  public user_id;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";

  constructor(private fb: FormBuilder,
    public productService: ProductService,
    private orderService: OrderService,
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

    // if already logined then patch the user details values
    this.user_id = localStorage.getItem("ecommerce_user_id");
    if (this.user_id) {
      this.productService.getUser(this.user_id).subscribe(response => {

        if (response.status_code === 200) {
          this.checkoutForm.patchValue({
            user_name: response["info"][0].user_name,
            phone: response["info"][0].phone,
            email: response["info"][0].email,
            address: response["info"][0].address,
            country: response["info"][0].country,
            city: response["info"][0].city,
            state: response["info"][0].state,
            zip_code: response["info"][0].zip_code,
          });
        }
      });
    }



  }

  ngOnInit(): void {
    this.productService.cartItems.subscribe(response => this.products = response);
    this.getTotal.subscribe(amount => this.amount = amount);
    this.initConfig();


    console.log("-----in Checkout products---------- :", this.products)
  }

  public get getTotal(): Observable<number> {
    return this.productService.cartTotalAmount();
  }



  async stripeCheckout() {

    console.log("====this.checkoutForm.value===== :", this.checkoutForm.value)

    let user_info = [this.checkoutForm.value]
    let info = {
      user_details: user_info,
      amount: this.amount,
      product_details: this.products,
      user_id: localStorage.getItem("ecommerce_user_id") ? localStorage.getItem("ecommerce_user_id") : 0
    }

    console.log("====info===== :", info)


    let response = await this.productService.createOrder(info).toPromise();

    if (response.body.status_code === 200) {
      // save user_id to local storage.
      let user_id = JSON.parse(response.body.info)

      localStorage.setItem("ecommerce_user_id", JSON.stringify(user_id));

      this.toastrService.success('Your order has been placed successfully. We will contact you soon');


      await this.toClearLocalStorage(this.products.length);

      this._router.navigateByUrl(`pages/order/success`);

      setTimeout(() => {
        window.location.reload();
      }, 2000);


    } else {
      this.toastrService.error('Oops.. Something went wrong.. Please try again');
    }


  }


  async toClearLocalStorage(length) {

    let get_userId = localStorage.getItem("ecommerce_user_id")

    localStorage.removeItem('cartItems')

    for (let i = 0; i < length; i++) {

      // remove from DB
      if (get_userId) {

        let info = {
          product_id: this.products[i].id,
          user_id: get_userId,
        }
        // console.log("--------remove to cart info--------- :", info)
        // save to db
        await this.productService.removeToCartItems(info).toPromise();

      }

    }

    return true
  }

  // Stripe Payment Gateway
  // stripeCheckout() {

  // var handler = (<any>window).StripeCheckout.configure({
  //   key: environment.stripe_token, // publishble key
  //   locale: 'auto',
  //   token: (token: any) => {
  //     // You can access the token ID with `token.id`.
  //     // Get the token ID to your server-side code for use.
  //     this.orderService.createOrder(this.products, this.checkoutForm.value, token.id, this.amount);
  //   }
  // });
  // handler.open({
  //   name: 'Multikart',
  //   description: 'Online Fashion Store',
  //   amount: this.amount * 100
  // }) 
  // }

  // Paypal Payment Gateway
  private initConfig(): void {
    this.payPalConfig = {
      currency: this.productService.Currency.currency,
      clientId: environment.paypal_token,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: this.productService.Currency.currency,
            value: this.amount,
            breakdown: {
              item_total: {
                currency_code: this.productService.Currency.currency,
                value: this.amount
              }
            }
          }
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        // size: 'small', // small | medium | large | responsive
        shape: 'rect', // pill | rect
      },
      onApprove: (data, actions) => {
        this.orderService.createOrder(this.products, this.checkoutForm.value, data.orderID, this.getTotal);
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    };
  }



}
