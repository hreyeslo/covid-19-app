import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { I18nModule } from '@app/core';

import { DetailsServiceApiModule } from './service/details-service-api.module';
import { DetailsRoutingModule } from './details-routing.module';
import { DetailsComponent } from './component/details.component';
import { featureStoreName } from './store/details.state';
import { DetailsEffects } from './store/details.effects';
import { detailsReducer } from './store/details.reducer';

@NgModule({
	declarations: [
		DetailsComponent
	],
	imports: [
		CommonModule,
		DetailsRoutingModule,
		EffectsModule.forFeature([DetailsEffects]),
		StoreModule.forFeature(featureStoreName, detailsReducer),
		I18nModule.forChild('details'),
		DetailsServiceApiModule,
		FlexLayoutModule,
		MatIconModule,
		MatProgressSpinnerModule
	]
})
export class DetailsModule {}
