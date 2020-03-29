import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { FormsModule } from '@angular/forms';
import { CountUpModule } from 'ngx-countup';
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
		I18nModule.forChild('countries'),
		CountriesServiceApiModule,
		FlexLayoutModule,
		FormsModule,
		MatIconModule,
		MatCardModule,
		CountUpModule,
		MatInputModule,
		MatFormFieldModule,
		MatProgressSpinnerModule
	]
})
export class CountriesModule {}
