import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterModalComponent } from './register-modal.component';

@NgModule({
  declarations: [RegisterModalComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, FormsModule],
  exports: [RegisterModalComponent],
})
export class RegisterModalModule {}
