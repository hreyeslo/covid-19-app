import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChartsComponent } from './component/charts.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgApexchartsModule
	],
	declarations: [ChartsComponent],
	exports: [ChartsComponent]
})
export class ChartsModule {}
