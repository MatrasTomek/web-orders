import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';


import { ShowOrderModalComponent } from './show-order-modal.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [ShowOrderModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    ButtonModule,
  ],
  exports: [ShowOrderModalComponent],
})
export class ShowOrderModalModule {}
