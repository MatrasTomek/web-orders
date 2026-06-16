import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { LoginModalComponent } from './login-modal.component';

@NgModule({
	declarations: [LoginModalComponent],
	imports: [CommonModule, SharedModule, FormsModule, ButtonModule],
	exports: [LoginModalComponent],
})
export class LoginModalModule {}
