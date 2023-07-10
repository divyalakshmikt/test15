import { Component, OnInit } from '@angular/core';
import { HomeSlider } from '../../../shared/data/slider';
import { ProductService } from '../../../shared/services/product.service';

@Component({
  selector: 'app-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.scss']
})
export class HomeSliderComponent implements OnInit {

  public HomeSliderConfig: any = HomeSlider;

  constructor(
    public productService: ProductService
  ) { }

  ngOnInit(): void {

    this.getCategoryList()
  }


  // Product Tab collection
  getCategoryList() {
    this.productService.categoryList()
      .subscribe(response => {
        console.log("---- response ------- :", response)
      });
  }

}

