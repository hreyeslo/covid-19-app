import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DailyIncrementChartComponent } from './daily-increment-chart.component';

@NgModule({
	declarations: [
		DailyIncrementChartComponent
	],
	exports: [
		DailyIncrementChartComponent
	],
	imports: [
		CommonModule,
		NgApexchartsModule,
		MatCardModule,
		FlexLayoutModule,
		TranslateModule
	]
})
export class DailyIncrementChartModule {}
