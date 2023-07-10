import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from "../../../shared/services/product.service";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public checkoutForm: FormGroup;
  public user_id;
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


    // if already logined then patch the user details values
    this.user_id = localStorage.getItem("ecommerce_user_id");

    console.log("===Profile USER ID===== :", this.user_id)

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
  }

  update() {
    let info = {
      ...this.checkoutForm.value,
      user_id: this.user_id
    }

    this.productService.updateUser(info).subscribe(response => {
      if (response.body.status_code === 200) {
        this._router.navigateByUrl(`/home/ecommerce`);
        this.toastrService.success('User updated successfully.');

      } else {
        this.toastrService.error(`${response.body.message}`);
      }
    });
  }



  forgotpwd() {
    this._router.navigateByUrl(`/pages/forget/password`);
  }


}
