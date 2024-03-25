import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCustomerModalComponent } from './add-customer-modal.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [AddCustomerModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
  ],
  exports: [AddCustomerModalComponent],
})
export class AddCustomerModalModule {}
