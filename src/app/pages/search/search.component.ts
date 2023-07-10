import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from "../../shared/services/product.service";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public checkoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public productService: ProductService,
    private toastrService: ToastrService,
    private _router: Router,
  ) {
    this.checkoutForm = this.fb.group({
      product_name: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
  }

}