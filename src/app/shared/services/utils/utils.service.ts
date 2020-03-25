import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IAppConfig, ConfigManager, APP_CONFIG } from '@app/core';

import { AbstractUtilsService } from './abstract-utils.service';

@Injectable()
export class UtilsService implements AbstractUtilsService {

	constructor(private _injector: Injector) {}

	get _config(): IAppConfig {
		return this._injector.get<ConfigManager>(APP_CONFIG).config;
	}

	get _httpClient(): HttpClient {
		return this._injector.get(HttpClient);
	}

}
