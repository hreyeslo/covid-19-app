import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChartsComponent } from './component/charts.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FlexLayoutModule,
		ReactiveFormsModule,
		NgApexchartsModule
	],
	declarations: [ChartsComponent],
	exports: [ChartsComponent]
})
export class ChartsModule {}
