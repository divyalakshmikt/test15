import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, startWith, delay } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../classes/product';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { CommonService } from './common.service';

const state = {
  products: JSON.parse(localStorage['products'] || '[]'),
  wishlist: JSON.parse(localStorage['wishlistItems'] || '[]'),
  compare: JSON.parse(localStorage['compareItems'] || '[]'),
  cart: JSON.parse(localStorage['cartItems'] || '[]')
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {


  public Currency = { name: 'Rupees', currency: 'INR', price: 1 } // Default Currency
  public OpenCart: boolean = false;
  public Products
  public product_list;
  public serverURL = '';

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private commonService: CommonService,
   
  ) {
    this.serverURL = this.commonService.getBmrServerURL();
  }


  public getHeader() {
    // var token = localStorage.getItem("currentToken");
    var headerDict = {
      "Content-Type": "application/x-www-form-urlencoded",
      // 'Accept': "application/x-www-form-urlencoded",
      // 'Access-Control-Allow-Origin': 'http://localhost:4200'
      // "Authorization": "Bearer " + token
    }
    var httpHeader: HttpHeaders = new HttpHeaders(headerDict);
    const httpOptions = { headers: httpHeader };
    return httpOptions;
  }





  /*
    ---------------------------------------------
    ---------------  Product  -------------------
    ---------------------------------------------
  */

  // Product
  private get products(): Observable<Product[]> {
    let httpOptions = this.getHeader();
    this.http.get(`${this.serverURL}/users/product-list`).subscribe(res => {
      console.log("--- IN SERVICE this.Products---- :", res["info"])
      this.Products = res["info"]
      return this.Products;
    });
    return this.Products
  }

  // Get Products
  public get getProducts(): Observable<Product[]> {
    let httpOptions = this.getHeader();
    return this.http.get<Product[]>(`${this.serverURL}/users/product-list`, httpOptions);

  }

  // // // Get Products By Slug
  // public getProductBySlug(slug: string): Observable<Product> {
  //   return this.products.pipe(map(items => {
  //     return items.find((item: any) => {
  //       return item.name.replace(' ', '-') === slug;
  //     });
  //   }));
  // }

  // // Get Products By Slug
  public getProductBySlug(slug: any): Observable<Product> {
    console.log("=======getProductBySlug======= :", slug)

    // let product_id = slug.replace('-', ' ')
    let product_id = slug
    let httpOptions = this.getHeader();
    return this.http.get<any>(`${this.serverURL}/users/product/getone/${product_id}`, httpOptions);
  }




  /*
    ---------------------------------------------
    ---------------  Wish List  -----------------
    ---------------------------------------------
  */

  // Get Wishlist Items
  public get wishlistItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.wishlist);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // Add to Wishlist
  public async addToWishlist(product): Promise<any> {

    let get_userId = localStorage.getItem("ecommerce_user_id")
    console.log("---------get_userId------- :", get_userId)
    if (get_userId) {

      const wishlistItem = state.wishlist.find(item => item.id === product.id)
      if (!wishlistItem) {
        state.wishlist.push({
          ...product
        })
      }
      this.toastrService.success('Product has been added in wishlist.');
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
      return true

    } else {
      this.toastrService.error('Please login');

    }

  }

  // Remove Wishlist items
  public removeWishlistItem(product: Product): any {
    const index = state.wishlist.indexOf(product);
    state.wishlist.splice(index, 1);
    localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist));
    return true
  }

  /*
    ---------------------------------------------
    -------------  Compare Product  -------------
    ---------------------------------------------
  */

  // Get Compare Items
  public get compareItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.compare);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // Add to Compare
  public addToCompare(product): any {
    const compareItem = state.compare.find(item => item.id === product.id)
    if (!compareItem) {
      state.compare.push({
        ...product
      })
    }
    this.toastrService.success('Product has been added in compare.');
    localStorage.setItem("compareItems", JSON.stringify(state.compare));
    return true
  }

  // Remove Compare items
  public removeCompareItem(product: Product): any {
    const index = state.compare.indexOf(product);
    state.compare.splice(index, 1);
    localStorage.setItem("compareItems", JSON.stringify(state.compare));
    return true
  }

  /*
    ---------------------------------------------
    -----------------  Cart  --------------------
    ---------------------------------------------
  */

  // Get Cart Items
  public get cartItems(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(state.cart);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // Add to Cart
  public addToCart(product): any {

    const cartItem = state.cart.find(item => item.id === product.id);
    const qty = product.quantity ? product.quantity : 1;
    const items = cartItem ? cartItem : product;
    const stock = this.calculateStockCounts(items, qty);

    if (!stock) return false

    if (cartItem) {
      cartItem.quantity += qty
    } else {
      state.cart.push({
        ...product,
        quantity: qty
      })
    }

    this.OpenCart = true; // If we use cart variation modal
    this.toastrService.success('Product has been added in cart.');

    localStorage.setItem("cartItems", JSON.stringify(state.cart));
    return true;
  }

  // Update Cart Quantity
  public updateCartQuantity(product: Product, quantity: number): Product | boolean {
    return state.cart.find((items, index) => {
      if (items.id === product.id) {
        const qty = state.cart[index].quantity + quantity
        const stock = this.calculateStockCounts(state.cart[index], quantity)
        if (qty !== 0 && stock) {
          state.cart[index].quantity = qty
        }
        localStorage.setItem("cartItems", JSON.stringify(state.cart));
        return true
      }
    })
  }

  // Calculate Stock Counts
  public calculateStockCounts(product, quantity) {
    const qty = product.quantity + quantity
    const stock = product.stock
    if (stock < qty || stock == 0) {
      this.toastrService.error('You can not add more items than available. In stock ' + stock + ' items.');
      return false
    }
    return true
  }

  // Remove Cart items
  public removeCartItem(product: Product): any {
    const index = state.cart.indexOf(product);
    state.cart.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(state.cart));
    return true
  }

  // Total amount 
  public cartTotalAmount(): Observable<number> {
    return this.cartItems.pipe(map((product: Product[]) => {
      return product.reduce((prev, curr: Product) => {
        let price = curr.price;
        if (curr.discount) {
          // price = curr.price - (curr.price * curr.discount / 100)
          price = curr.price;
        }
        return (prev + price * curr.quantity) * this.Currency.price;
      }, 0);
    }));
  }

  /*
    ---------------------------------------------
    ------------  Filter Product  ---------------
    ---------------------------------------------
  */


  private async getProductList() {
    const data = await this.http.get(`${this.serverURL}/users/product-list`).toPromise();
    console.log("-----stringfy_data------ :", data["info"])
    this.product_list = data["info"]
    return this.product_list
  }

  // Get Product Filter
  public filterProducts(filter: any, data: any): Observable<Product[]> {
    let info = this.http.get(`${this.serverURL}/users/product-list`);
    let products_list = data;
    console.log("*******************:", filter)
    return info.pipe(map(product =>
      product["info"].filter((item: Product) => {

        if (!filter.length) return data
        else data
      })
    ));
  }

  // Sorting Filter
  public sortProducts(products: any, payload: string): any {
    console.log("-------get_productlist in sorting ----- :", products)

    if (payload === 'ascending') {
      return products.sort((a, b) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'a-z') {
      return products.sort((a, b) => {

        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'z-a') {
      return products.sort((a, b) => {
        if (a.name > b.name) {
          return -1;
        } else if (a.name < b.name) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'low') {
      return products.sort((a, b) => {
        if (parseFloat(a.price) < parseFloat(b.price)) {
          return -1;
        } else if (parseFloat(a.price) > parseFloat(b.price)) {
          return 1;
        }
        return 0;
      })
    } else if (payload === 'high') {
      return products.sort((a, b) => {
        if (parseFloat(a.price) > parseFloat(b.price)) {
          return -1;
        } else if (parseFloat(a.price) < parseFloat(b.price)) {
          return 1;
        }
        return 0;
      })
    }
  }

  /*
    ---------------------------------------------
    ------------- Product Pagination  -----------
    ---------------------------------------------
  */
  public getPager(totalItems: number, currentPage: number = 1, pageSize: number = 16) {
    // calculate total pages
    let totalPages = Math.ceil(totalItems / pageSize);

    // Paginate Range
    let paginateRange = 3;

    // ensure current page isn't out of range
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage < paginateRange - 1) {
      startPage = 1;
      endPage = startPage + paginateRange - 1;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }

    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }




  /*
  ---------------------------------------------
  ------------- Product form server  -----------
  ---------------------------------------------
*/

  public sliderList(): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.get<any>(`${this.serverURL}/user/slider/List`, httpOptions);
  }

  public bannerList(): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.get<any>(`${this.serverURL}/user/banner/List`, httpOptions);
  }

  public categoryList(): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.get<any>(`${this.serverURL}/users/category-list`, httpOptions);
  }

  public brandList(): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.get<any>(`${this.serverURL}/users/brand-list`, httpOptions);
  }

  public productList(): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.get<any>(`${this.serverURL}/users/product-list`, httpOptions);
  }

  public getOneproduct(id): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.get<any>(`${this.serverURL}/users/product/getone/${id}`, httpOptions);
  }

  public getSearchProductList(search): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.get<any>(`${this.serverURL}/users/product/getbyname/'${search}'`, httpOptions);
  }

  public createOrder(data): Observable<any> {

    console.log("--------DATA------ :", data)
    let httpOptions = this.getHeader();
    return this.http.post<any>(`${this.serverURL}/users/createorder`, data, { observe: 'response' });
  }

  public addToWhishlist(data): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.post<any>(`${this.serverURL}/users/wishlist/add`, data, { observe: 'response' });
  }


  public removeWhishProduct(data): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.post<any>(`${this.serverURL}/users/wish/remove`, data, { observe: 'response' });
  }

  public getWhishlist(data): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.get<any>(`${this.serverURL}/users/wish-list/${data}`, { observe: 'response' });
  }

  public getPaymentHistory(data): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.get<any>(`${this.serverURL}/user/payment_history/${data}`, httpOptions);
  }






  public addToCartItems(data): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.post<any>(`https://13.232.171.175:3000/api/users/cart/add`, data, { observe: 'response' });
  }


  public updateToCartItems(data): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.put<any>(`https://13.232.171.175:3000/api/users/cart/update`, data, { observe: 'response' });
  }

  public removeToCartItems(data): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.post<any>(`https://13.232.171.175:3000/api/users/cart/remove`, data, { observe: 'response' });
  }

  public getCartItems(user_id): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.get<any>(`https://13.232.171.175:3000/api/users/addtocart-list/${user_id}`, { observe: 'response' });
  }

  /*
    ---------------------------------------------
    ------------- Auth form server  -----------
    ---------------------------------------------
  */

  public login(data): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.post<any>(`https://13.232.171.175:3000/api/user/login`, data, { observe: 'response' });
  }

  public register(data): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.post<any>(`${this.serverURL}/user/register`, data, { observe: 'response' });
  }

  public forgotpassword(data): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.post<any>(`${this.serverURL}/user/forget_password`, data, { observe: 'response' });
  }


  public getUser(data): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.get<any>(`${this.serverURL}/user/getone/${data}`, httpOptions);
  }


  public updateUser(data): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.put<any>(`${this.serverURL}/user/update/${data.user_id}`, data, { observe: 'response' });
  }


  /*
    ---------------------------------------------
    ------------- Home form server  -----------
    ---------------------------------------------
  */
  public getSliders(data): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.get<any>(`${this.serverURL}/user/getone/${data}`, httpOptions);
  }

  public specialBannerList(): Observable<any> {
    let httpOptions = this.getHeader();
    return this.http.get<any>(`${this.serverURL}/user/specialoffer/List`, httpOptions);
  }
}


