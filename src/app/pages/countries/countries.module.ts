import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { I18nModule } from '@app/core';

import { CountriesServiceApiModule } from './service/countries-service-api.module';
import { CountriesRoutingModule } from './countries-routing.module';
import { CountriesComponent } from './component/countries.component';
import { featureStoreName } from './store/countries.state';
import { CountriesEffects } from './store/countries.effects';
import { countriesReducer } from './store/countries.reducer';

@NgModule({
	declarations: [
		CountriesComponent
	],
	imports: [
		CommonModule,
		CountriesRoutingModule,
		EffectsModule.forFeature([CountriesEffects]),
		StoreModule.forFeature(featureStoreName, countriesReducer),
		I18nModule.forChild('dashboard'),
		CountriesServiceApiModule,
		FlexLayoutModule
	]
})
export class CountriesModule {}
