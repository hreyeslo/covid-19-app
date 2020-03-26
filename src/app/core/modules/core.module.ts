import { HttpClientModule, HttpClient } from '@angular/common/http';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RequestIdleModule } from 'ngx-request-idle';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { IAppEnv, IAppConfig, APP_ENVIRONMENT, APP_CONFIG } from '../models/core.model';
import { environment } from '../../../environments/environment';
import { CoreEffects } from '../store/core.effects';
import { coreReducer } from '../store/core.reducer';
import { ConfigManager } from '../config/config';

@NgModule({
	imports: [
		HttpClientModule,
		RequestIdleModule.forRoot(),
		EffectsModule.forRoot([CoreEffects]),
		StoreModule.forRoot({
			Core: coreReducer
		}, {
			runtimeChecks: {
				strictStateImmutability: true,
				strictActionImmutability: true,
				strictStateSerializability: true,
				strictActionSerializability: true
			}
		}),
		StoreDevtoolsModule.instrument({
			maxAge: 25,
			logOnly: environment.production
		})
	],
	providers: [
		{
			provide: APP_CONFIG,
			useClass: ConfigManager
		},
		{
			provide: APP_ENVIRONMENT,
			useValue: environment
		},
		{
			provide: APP_INITIALIZER,
			useFactory: appInitializer,
			deps: [HttpClient, APP_CONFIG, APP_ENVIRONMENT],
			multi: true
		}
	],
	exports: [
		RequestIdleModule,
		EffectsModule,
		StoreModule,
		StoreDevtoolsModule
	]
})
export class CoreModule {}

export function appInitializer(httpClient: HttpClient, configManager: ConfigManager, env: IAppEnv) {
	return (): Promise<boolean> => {
		return httpClient.get<IAppConfig>(env.configFile)
			.toPromise()
			.then(_config => {
				configManager.config = _config;
				return true;
			});
	};
}
