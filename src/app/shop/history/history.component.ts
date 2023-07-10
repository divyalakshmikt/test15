import { Component, OnInit } from '@angular/core';
import { ProductService } from "../../shared/services/product.service";
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  public user_id;
  public orders = [];
  constructor(
    public productService: ProductService,
    private toastrService: ToastrService,
    private _router: Router,
  ) {
    this.user_id = localStorage.getItem("ecommerce_user_id");
    if (this.user_id) {
      this.productService.getPaymentHistory(this.user_id).subscribe(response => {
        console.log("===RESPONSE======= :", response)
        if (response.status_code === 200) {
          this.orders = response.info
        }
      });
    }
  }

  ngOnInit(): void {
  }

}
