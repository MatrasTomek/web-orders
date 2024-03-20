import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from './login-page/login-page.component';
import { StartPageComponent } from './start-page/start-page.component';
import { OrdersPageComponent } from './orders-page/orders-page.component';
import { NewOrderPageComponent } from './new-order-page/new-order-page.component';
import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  declarations: [
    LoginPageComponent,
    StartPageComponent,
    OrdersPageComponent,
    NewOrderPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PagesRoutingModule,
  ],
  exports: [LoginPageComponent, StartPageComponent],
})
export class PagesModule {}
