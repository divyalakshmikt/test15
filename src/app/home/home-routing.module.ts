import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { FashionOneComponent } from './fashion/fashion-one/fashion-one.component';


const routes: Routes = [
  {
    path: 'ecommerce',
    component: EcommerceComponent
  },
  {
    path: 'fashion',
    component: FashionOneComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
