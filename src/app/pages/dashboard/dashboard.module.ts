import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { I18nModule } from '@app/core';

import { DashboardServiceApiModule } from './service/dashboard-service-api.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './component/dashboard.component';
import { featureStoreName } from './store/dashboard.state';
import { DashboardEffects } from './store/dashboard.effects';
import { dashboardReducer } from './store/dashboard.reducer';

@NgModule({
	declarations: [
		DashboardComponent
	],
	imports: [
		CommonModule,
		DashboardRoutingModule,
		EffectsModule.forFeature([DashboardEffects]),
		StoreModule.forFeature(featureStoreName, dashboardReducer),
		I18nModule.forChild('dashboard'),
		DashboardServiceApiModule,
		FlexLayoutModule
	]
})
export class DashboardModule {}
