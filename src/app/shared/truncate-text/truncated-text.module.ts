import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { TruncateTextComponent } from './truncate-text.component';

@NgModule({
	declarations: [TruncateTextComponent],
	imports: [CommonModule, TooltipModule],
	exports: [TruncateTextComponent],
})
export class TruncateTextModule {}
