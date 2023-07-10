import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';


// Widgest Components
import { SliderComponent } from './widgets/slider/slider.component';
import { BlogComponent } from './widgets/blog/blog.component';
import { LogoComponent } from './widgets/logo/logo.component';
import { ServicesComponent } from './widgets/services/services.component';
import { CollectionComponent } from './widgets/collection/collection.component';
import { EcommerceComponent } from './ecommerce/ecommerce.component';
import { FashionOneComponent } from './fashion/fashion-one/fashion-one.component';

@NgModule({
  declarations: [
 
    // Widgest Components
    SliderComponent,
    BlogComponent,
    LogoComponent,
    ServicesComponent,
    CollectionComponent,
    EcommerceComponent,
    FashionOneComponent,

  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ]
})
export class HomeModule { }
