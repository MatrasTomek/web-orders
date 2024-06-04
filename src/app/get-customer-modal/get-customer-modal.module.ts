import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetCustomerModalComponent } from './get-customer-modal.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [GetCustomerModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
  ],
  exports: [GetCustomerModalComponent],
})
export class GetCustomerModalModule {}
