import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { CountUpModule } from 'ngx-countup';
import { NgModule } from '@angular/core';

import { SummaryComponent } from './summary.component';

@NgModule({
	declarations: [
		SummaryComponent
	],
	exports: [
		SummaryComponent
	],
	imports: [
		CommonModule,
		MatCardModule,
		FlexLayoutModule,
		TranslateModule,
		CountUpModule
	]
})
export class SummaryModule {}
