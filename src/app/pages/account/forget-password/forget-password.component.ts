import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from "../../../shared/services/product.service";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  public checkoutForm: FormGroup;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";


  constructor(
    private fb: FormBuilder,
    public productService: ProductService,
    private _router: Router,
    private toastrService: ToastrService,
  ) {
    this.checkoutForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    })
  }

  ngOnInit(): void {
  }


  forgotpwd() {
    // console.log("====this.checkoutForm.value========== :", this.checkoutForm.value.email)

    let info = {
      username: this.checkoutForm.value.email
    }

    this.productService.forgotpassword(info).subscribe(response => {
      console.log("==== response ====== :", response)
      if (response.body.status_code === 200) {
        let user_id = response.body.user_id
        this._router.navigateByUrl(`/pages/login`);
        this.toastrService.success(`${response.body.message}`);

      } else {
        this.toastrService.error(`${response.body.message}`);
      }

    });

  }

}

