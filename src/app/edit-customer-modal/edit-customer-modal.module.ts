import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCustomerModalComponent } from './edit-customer-modal.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [EditCustomerModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
  ],
  exports: [EditCustomerModalComponent],
})
export class EditCustomerModalModule {}
