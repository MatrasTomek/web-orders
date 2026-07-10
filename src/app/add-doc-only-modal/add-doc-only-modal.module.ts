import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AddDocOnlyModalComponent } from './add-doc-only-modal.component';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
	declarations: [AddDocOnlyModalComponent],
	imports: [CommonModule, ReactiveFormsModule, SharedModule, ButtonModule, CalendarModule],
	exports: [AddDocOnlyModalComponent],
})
export class AddDocOnlyModalModule {}
