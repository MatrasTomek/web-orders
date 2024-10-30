import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './input/input.component';
import { provideEnvironmentNgxMask, NgxMaskDirective } from 'ngx-mask';
import { ModalComponent } from './modal/modal.component';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { AlertComponent } from './alert/alert.component';
import { TruncateTextModule } from './truncate-text/truncated-text.module';

@NgModule({
	declarations: [InputComponent, ModalComponent, AlertComponent],
	imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxMaskDirective, InputTextModule, TooltipModule, TruncateTextModule],
	exports: [InputComponent, ModalComponent, AlertComponent],
	providers: [provideEnvironmentNgxMask()],
})
export class SharedModule {}
