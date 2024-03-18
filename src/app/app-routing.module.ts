import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartPageComponent } from './pages/start-page/start-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { NewOrderPageComponent } from './pages/new-order-page/new-order-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

const routes: Routes = [
  {
    path: 'start',
    component: StartPageComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'orders',
    component: OrdersPageComponent,
  },
  {
    path: 'new-order',
    component: NewOrderPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
