import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IAppConfig, ConfigManager, APP_CONFIG } from '@app/core';

import {
	IGlobalCases,
	CountryCases,
	ICountryCases,
	HistoricalCases,
	IHistoricalCases
} from '../../models/shared.model';
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

	// Global

	getGlobalCases(): Observable<IGlobalCases> {
		return this._makeRequest<IGlobalCases>('all');
	}

	getGlobalHistoricalCases(): Observable<HistoricalCases> {
		return this._makeRequest<HistoricalCases>('v2/historical');
	}

	// Countries

	getAllCountriesCases(): Observable<CountryCases> {
		return this._makeRequest<CountryCases>('countries?sort=cases');
	}

	getCountryCases(country: string): Observable<ICountryCases> {
		return this._makeRequest<ICountryCases>(`countries/${country}?strict=true`);
	}

	getCountryHistoricalCases(country: string): Observable<IHistoricalCases> {
		return this._makeRequest<IHistoricalCases>(`v2/historical/${country}`);
	}

	// Private

	_makeRequest<T>(path: string): Observable<T> {
		return this._httpClient.get<T>(`${this._config?.api?.host}/${path}`, {responseType: 'json'});
	}

}
