import { UtilsApiModule } from '@shared/services';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { featureStoreName } from './store/shared.state';
import { sharedReducer } from './store/shared.reducer';
import { SharedEffects } from './store/shared.effects';

@NgModule({
	imports: [
		UtilsApiModule,
		StoreModule.forFeature(featureStoreName, sharedReducer),
		EffectsModule.forFeature([SharedEffects])
	]
})
export class SharedModule {}
