import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isEqual } from 'lodash';

import { IAppConfig, ConfigManager, APP_CONFIG } from '@app/core';

import { AbstractUtilsService } from './abstract-utils.service';
import {
	IGlobalCases,
	CountryCases,
	ICountryCases,
	HistoricalCases,
	IHistoricalCases,
	ILayout,
	ELayoutName,
	ELayoutAlias
} from '../../models/shared.model';
import { filter, map, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable()
export class UtilsService implements AbstractUtilsService {

	constructor(private _injector: Injector) {}

	get _config(): IAppConfig {
		return this._injector.get<ConfigManager>(APP_CONFIG).config;
	}

	get _httpClient(): HttpClient {
		return this._injector.get(HttpClient);
	}

	get _mediaObserver(): MediaObserver {
		return this._injector.get(MediaObserver);
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

	getLayoutObserver(): Observable<ILayout> {
		return this._mediaObserver.asObservable().pipe(
			filter((changes: MediaChange[]) => changes.length > 0),
			map((changes: MediaChange[]) => changes[0]),
			distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
			switchMap((changes: MediaChange) => {
				let type;
				switch (changes.mqAlias) {
					case ELayoutAlias.xs:
						type = ELayoutName.mobile;
						break;
					case ELayoutAlias.sm:
						type = ELayoutName.tablet;
						break;
					case ELayoutAlias.md:
					case ELayoutAlias.lg:
						type = ELayoutName.laptop;
						break;
					case ELayoutAlias.xl:
						type = ELayoutName.desktop;
						break;
					default:
						type = ELayoutName.desktop;
				}
				return of({
					type,
					alias: changes.mqAlias as ELayoutAlias || ELayoutAlias.lg
				});
			})
		);
	}

	// Private

	_makeRequest<T>(path: string): Observable<T> {
		return this._httpClient.get<T>(`${this._config?.api?.host}/${path}`, {responseType: 'json'});
	}

}
