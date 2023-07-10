import { Component, OnInit, Input, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header-one',
  templateUrl: './header-one.component.html',
  styleUrls: ['./header-one.component.scss']
})
export class HeaderOneComponent implements OnInit {

  @Input() class: string;
  @Input() themeLogo: string = 'assets/images/icon/logo.png'; // Default Logo
  @Input() topbar: boolean = true; // Default True
  @Input() sticky: boolean = false; // Default false

  public stick: boolean = false;

  constructor(
    private _router: Router,
    private toastrService: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }

  // @HostListener Decorator
  @HostListener("window:scroll", [])
  onWindowScroll() {
    let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (number >= 150 && window.innerWidth > 400) {
      this.stick = true;
    } else {
      this.stick = false;
    }
  }


  async logout() {
    // alert("logout")

    this.toastrService.success('You have successfully logged out...! ', null, { timeOut: 2000 });


    // let get_userId = localStorage.getItem("ecommerce_user_id")
    // if (get_userId) {
    //   localStorage.clear();
    // }
    // this._router.navigateByUrl(`/home/ecommerce`);

    // if (get_userId) {
    //   window.location.reload();
    // }


    setTimeout(() => {

      let get_userId = localStorage.getItem("ecommerce_user_id")
      if (get_userId) {
        localStorage.clear();
      }
      this._router.navigateByUrl(`/home/ecommerce`);

      if (get_userId) {
        window.location.reload();
      }
    }, 2000);


  }

}
