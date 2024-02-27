import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterModalComponent } from './register-modal.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [RegisterModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
  ],
  exports: [RegisterModalComponent],
})
export class RegisterModalModule {}
