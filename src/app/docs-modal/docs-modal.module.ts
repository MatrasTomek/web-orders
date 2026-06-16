import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DocsModalComponent } from './docs-modal.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
	declarations: [DocsModalComponent],
	imports: [CommonModule, SharedModule, ButtonModule],
	exports: [DocsModalComponent],
})
export class DocsModalModule {}
