import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ProductService } from "../../../shared/services/product.service";
import { Product } from '../../../shared/classes/product';

@Component({
  selector: 'app-collection-left-sidebar',
  templateUrl: './collection-left-sidebar.component.html',
  styleUrls: ['./collection-left-sidebar.component.scss']
})
export class CollectionLeftSidebarComponent implements OnInit {

  public productList;

  public grid: string = 'col-xl-3 col-md-6';
  public layoutView: string = 'grid-view';
  public products: Product[] = [];
  public brands: any[] = [];
  public colors: any[] = [];
  public size: any[] = [];
  public minPrice: number = 0;
  public maxPrice: number = 1200;
  public tags: any[] = [];
  public category: string;
  public pageNo: number = 1;
  public paginate: any = {}; // Pagination use only
  public sortBy: string; // Sorting Order
  public mobileSidebar: boolean = false;
  public loader: boolean = true;
  public get_search;
  public search;

  constructor(private route: ActivatedRoute, private router: Router,
    private viewScroller: ViewportScroller, public productService: ProductService) {

    this.products = []


    // Get Query params..
    this.route.queryParams.subscribe(params => {
      console.log("========params========= :", params)
      this.brands = params.brand ? params.brand.split(",") : [];
      // this.minPrice = params.minPrice ? params.minPrice : this.minPrice;
      // this.maxPrice = params.maxPrice ? params.maxPrice : this.maxPrice;
      this.tags = [...this.brands]; // All Tags Array

      this.category = params.category ? params.category : null;
      this.sortBy = params.sortBy ? params.sortBy : 'ascending';
      this.pageNo = params.page ? params.page : this.pageNo;
      this.search = params.search ? params.search : null;
      // console.log("---- This producrts collection left ---- :", this.brands)

      // console.log("---- Brand Length ---- :", this.brands.length)

      if (this.search) {
        this.get_search = JSON.stringify(this.search);
      }

      // console.log("------get_search-------:", this.get_search)
      if (this.get_search) {
        // get product list
        this.productService.getSearchProductList(this.get_search)
          .subscribe(response => {
            // console.log("------SEARCH RESPONSE----:", response)
            if (response.status_code === 200) {
              this.products = response.info;
            } else {
              this.products = [];
            }
          });
      } else {
        // get product list
        this.productService.productList()
          .subscribe(response => {
            if (response.status_code === 200) {
              this.products = response.info;
            } else {
              this.products = [];
            }
          });
      }




      // // Get Filtered Products..
      this.productService.filterProducts(this.tags, this.products).subscribe(response => {
        // Sorting Filter
        this.products = this.productService.sortProducts(this.products, this.sortBy);

        console.log("---------Sorting Products--------- :", this.products)

        let flitered_products = this.products

        // Category Filter
        if (params.category) {
         
          this.products = this.products.filter(item => item.category.toString() == this.category.toString());
        } else {
         
          this.products = flitered_products
        }

        // console.log("---- Brand Length ---- :", this.brands.length)
        // console.log("---- Brand ---- :", this.brands)

        if (this.brands.length) {
          this.products = this.products.filter((item) => this.brands.includes(item.brand));
        }


        // console.log("---- This producrts 4---- :", this.products)
        // Price Filter
        // this.products = this.products.filter(item => item.price >= this.minPrice && item.price <= this.maxPrice)

        // console.log("---- This producrts 5---- :", this.products)

        // Paginate Products
        this.paginate = this.productService.getPager(this.products.length, +this.pageNo);     // get paginate object from service
        this.products = this.products.slice(this.paginate.startIndex, this.paginate.endIndex + 1); // get current page of items

        // console.log("---- This producrts 6---- :", this.products)

      })
    })



  }

  ngOnInit(): void {
  }


  // Append filter value to Url
  updateFilter(tags: any) {

    console.log("======Filter ======= :", tags)
    tags.page = null; // Reset Pagination
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: tags,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // SortBy Filter
  sortByFilter(value) {

    console.log("====== sorting ======= :", value)
    console.log("------sortByFilter------- :", this.products)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        products: this.products,
        sortBy: value ? value : null
      },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Remove Tag
  removeTag(tag) {

    this.brands = this.brands.filter(val => val !== tag);
    this.colors = this.colors.filter(val => val !== tag);
    this.size = this.size.filter(val => val !== tag);

    let params = {
      brand: this.brands.length ? this.brands.join(",") : null,
      color: this.colors.length ? this.colors.join(",") : null,
      size: this.size.length ? this.size.join(",") : null

    }


    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }

  // Clear Tags
  async removeAllTags() {

    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });

    // call removeSearch 
    await this.removeSearch()

    // delete brand params

    let params = { ...this.route.snapshot.queryParams };

    console.log("======REMOVE BRAND IN ALL======= :", params.brand)
    delete params.brand;

    this.brands = [];
    this.tags = [];


    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      skipLocationChange: true  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });

    // this.router.navigate([], { replaceUrl: true });


    // remove category
    await this.removeCategory();
    location.reload()
  }

  removeSearch() {
    // location.reload()

    this.get_search = null
    let params = { ...this.route.snapshot.queryParams };
    delete params.search;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }


  removeCategory() {

    this.category = null
    let params = { ...this.route.snapshot.queryParams };
    delete params.category;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });
  }





  // product Pagination
  setPage(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation
    }).finally(() => {
      this.viewScroller.setOffset([120, 120]);
      this.viewScroller.scrollToAnchor('products'); // Anchore Link
    });

  }


  // Change Grid Layout
  updateGridLayout(value: string) {
    this.grid = value;
  }

  // Change Layout View
  updateLayoutView(value: string) {
    this.layoutView = value;
    if (value == 'list-view')
      this.grid = 'col-lg-12';
    else
      this.grid = 'col-xl-3 col-md-6';
  }

  // Mobile sidebar
  toggleMobileSidebar() {
    this.mobileSidebar = !this.mobileSidebar;
  }




}
