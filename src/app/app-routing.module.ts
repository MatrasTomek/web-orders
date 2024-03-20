import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartPageComponent } from './pages/start-page/start-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { NewOrderPageComponent } from './pages/new-order-page/new-order-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { CustomersPageComponent } from './pages/customers-page/customers-page.component';
import { AddCustomerComponent } from './pages/add-customer/add-customer.component';
import { AboutComponent } from './pages/about/about.component';

const routes: Routes = [
  {
    path: '',
    component: StartPageComponent,
  },
  {
    path: 'orders',
    component: OrdersPageComponent,
    data: {
      isAuth: true,
    },
  },
  {
    path: 'new-order',
    component: NewOrderPageComponent,
    data: {
      isAuth: true,
    },
  },
  {
    path: 'customers',
    component: CustomersPageComponent,
    data: {
      isAuth: true,
    },
  },
  {
    path: 'add-customer',
    component: AddCustomerComponent,
    data: {
      isAuth: true,
    },
  },
  {
    path: 'about',
    component: AboutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
