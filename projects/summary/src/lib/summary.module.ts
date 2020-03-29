import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SummaryComponent } from './component/summary.component';

@NgModule({
	imports: [CommonModule],
	declarations: [SummaryComponent],
	exports: [SummaryComponent]
})
export class SummaryModule {}
