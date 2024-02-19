import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './input/input.component';
import { provideEnvironmentNgxMask, NgxMaskDirective } from 'ngx-mask';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [InputComponent, ModalComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxMaskDirective],
  exports: [InputComponent, ModalComponent],
  providers: [provideEnvironmentNgxMask()],
})
export class SharedModule {}
