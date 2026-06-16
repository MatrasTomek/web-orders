import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AddDocsUserModalComponent } from './add-docs-user-modal.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [AddDocsUserModalComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, ButtonModule],
  exports: [AddDocsUserModalComponent],
})
export class AddDocsUserModalModule {}
