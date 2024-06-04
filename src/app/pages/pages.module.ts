import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from './login-page/login-page.component';
import { StartPageComponent } from './start-page/start-page.component';
import { OrdersPageComponent } from './orders-page/orders-page.component';
import { StepsModule } from 'primeng/steps';
import { PagesRoutingModule } from './pages-routing.module';
import { CustomersPageComponent } from './customers-page/customers-page.component';
import { AboutComponent } from './about/about.component';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AddCustomerModalModule } from '../add-customer-modal/add-customer-modal.module';
import { EditCustomerModalModule } from '../edit-customer-modal/edit-customer-modal.module';
import { ConfirmationModalModule } from '../confirmation-modal/confirmation-modal.module';
import { AddOrderPageComponent } from './add-order-page/add-order-page.component';
import { GetCustomerModalModule } from '../get-customer-modal/get-customer-modal.module';

@NgModule({
  declarations: [
    LoginPageComponent,
    StartPageComponent,
    OrdersPageComponent,
    CustomersPageComponent,
    AboutComponent,
    AddOrderPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    PagesRoutingModule,
    TableModule,
    TooltipModule,
    AddCustomerModalModule,
    GetCustomerModalModule,
    EditCustomerModalModule,
    ConfirmationModalModule,
    StepsModule,
  ],
  exports: [LoginPageComponent, AboutComponent],
})
export class PagesModule {}
