import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../classes/product';

@Component({
  selector: 'app-footer-one',
  templateUrl: './footer-one.component.html',
  styleUrls: ['./footer-one.component.scss']
})
export class FooterOneComponent implements OnInit {


  public categoryList: any[] = [];


  @Input() class: string = 'footer-light' // Default class 
  @Input() themeLogo: string = 'assets/images/icon/logo.png'; // Default Logo
  @Input() newsletter: boolean = true; // Default True

  public today: number = Date.now();

  constructor(
    public productService: ProductService
  ) {
    // to get category list
    this.getCategoryList()
  }

  ngOnInit(): void {
  }

  // Product Tab collection
  getCategoryList() {
    this.productService.categoryList()
      .subscribe(response => {
        console.log("---- response ------- :", response)

        if (response.status_code === 200) {
          this.categoryList = response.info
        } else {
          this.categoryList = []
        }
      });
  }

}
