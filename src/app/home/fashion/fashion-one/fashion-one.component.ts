import { Component, OnInit } from '@angular/core';
import { ProductSlider } from '../../../shared/data/slider';
import { Product } from '../../../shared/classes/product';
import { ProductService } from '../../../shared/services/product.service';
import { CollectionSlider } from '../../../shared/data/slider';
import { HomeSlider } from '../../../shared/data/slider';

import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-fashion-one',
  templateUrl: './fashion-one.component.html',
  styleUrls: ['./fashion-one.component.scss']
})
export class FashionOneComponent implements OnInit {

  public products: Product[] = [];
  public productCollections: any[] = [];
  public categoryList: any[] = [];
  public brandList: any[] = [];

  public sliders: any[] = [];
  public category_collections: any[] = [];
  public brand_collections: any[] = [];
  public product_collections: any[] = [];
  public specialBanner_collections: any[] = [];


  public collectionSliderConfig: any = CollectionSlider;
  public HomeSliderConfig: any = HomeSlider;

  constructor(
    public productService: ProductService,
  ) {


    // if (!window.location.hash) {
    //   window.location.href = window.location.href + '#loaded';
    //   window.location.reload();
    // }




    this.getSliderList();   // to get slider list
    this.getBannerList();   // to get banner list
    this.getSpecialOfferBannerList()  // to get special offer list

    this.productService.getProducts.subscribe(response => {
      this.products = response["info"].filter(item => item.type == 'fashion');
      // Get Product Collection
      this.products.filter((item) => {
        item.collection.filter((collection) => {
          const index = this.productCollections.indexOf(collection);
          if (index === -1) this.productCollections.push(collection);
        })
      })
    });

    this.getCategoryList()
    this.getBrandList()
  }

  public ProductSliderConfig: any = ProductSlider;

  // public sliders = [{
  //   title: 'welcome to online pharmacy',
  //   subTitle: 'Always there to care.',
  //   image: 'https://wellnessecommerce.s3.ap-south-1.amazonaws.com/banner2.jpg'
  // }, {

  //   title: 'welcome to online pharmacy',
  //   subTitle: 'Your health. Our expertise.',
  //   image: 'https://wellnessecommerce.s3.ap-south-1.amazonaws.com/banner1.jpg'
  // }]

  // Collection banner
  // public collections = [{
  //   image: 'assets/images/collection/fashion/1.jpg',
  //   save: 'save 50%',
  //   title: 'men'
  // }, {
  //   image: 'assets/images/collection/fashion/2.jpg',
  //   save: 'save 50%',
  //   title: 'women'
  // }];

  // Blog
  public blog = [{
    image: 'assets/images/blog/1.jpg',
    date: '25 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/2.jpg',
    date: '26 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/3.jpg',
    date: '27 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }, {
    image: 'assets/images/blog/4.jpg',
    date: '28 January 2018',
    title: 'Lorem ipsum dolor sit consectetur adipiscing elit,',
    by: 'John Dio'
  }];

  // Logo
  public logo = [{
    image: 'assets/images/logos/1.png',
  }, {
    image: 'assets/images/logos/2.png',
  }, {
    image: 'assets/images/logos/3.png',
  }, {
    image: 'assets/images/logos/4.png',
  }, {
    image: 'assets/images/logos/5.png',
  }, {
    image: 'assets/images/logos/6.png',
  }, {
    image: 'assets/images/logos/7.png',
  }, {
    image: 'assets/images/logos/8.png',
  }];

  ngOnInit(): void {


  }

  // // Product Tab collection
  // getCollectionProducts(collection) {
  //   console.log("--------collection------------ :", collection)
  //   return this.products.filter((item) => {
  //     if (item.collection.find(i => i === collection)) {
  //       return item
  //     }
  //   })
  // }

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

  // Product Tab collection
  getBrandList() {
    this.productService.brandList()
      .subscribe(response => {
        console.log("---- response ------- :", response)

        if (response.status_code === 200) {
          this.brandList = response.info
        } else {
          this.brandList = []
        }
      });
  }

  // Product Tab collection
  getSliderList() {
    this.productService.sliderList()
      .subscribe(response => {
        console.log("---- slider response ------- :", response)

        if (response.status_code === 200) {
          this.sliders = response.info
        } else {
          this.sliders = []
        }
      });
  }

  // Product Tab collection
  getBannerList() {
    this.productService.bannerList()
      .subscribe(response => {
        console.log("---- banner response ------- :", response)

        if (response.status_code === 200) {
          this.category_collections = response.info[0].category;
          this.brand_collections = response.info[0].brand;
          this.product_collections = response.info[0].product;
        } else {
          this.category_collections = [];
          this.brand_collections = [];
          this.product_collections = [];
        }
      });
  }


  // Product Tab collection
  getSpecialOfferBannerList() {
    this.productService.specialBannerList()
      .subscribe(response => {
        console.log("---- SPecial Banner response ------- :", response)

        if (response.status_code === 200) {
          this.specialBanner_collections = response.info;

        } else {
          this.specialBanner_collections = [];

        }
      });
  }

}

