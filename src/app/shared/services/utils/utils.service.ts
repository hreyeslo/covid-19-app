import { filter, map, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { isEqual, get } from 'lodash';
import { Store } from '@ngrx/store';

import { IAppConfig, ConfigManager, APP_CONFIG } from '@app/core';

import { AbstractUtilsService } from './abstract-utils.service';
import {
	IGlobalCases,
	CountryCases,
	ICountryCases,
	IHistoricalCases,
	ELayoutName,
	ELayoutAlias,
	ILayout,
	IHistoricalTimeline
} from '../../models/shared.model';
import { setLayout } from '../../store/shared.actions';

@Injectable()
export class UtilsService implements AbstractUtilsService {

	private _webWorker: Worker;
	private _countries: any = {};

	constructor(private _injector: Injector) {
		this._initLayoutObserver();
		this._initWebWorker();
	}

	get _config(): IAppConfig {
		return this._injector.get<ConfigManager>(APP_CONFIG).config;
	}

	get _httpClient(): HttpClient {
		return this._injector.get(HttpClient);
	}

	get _mediaObserver(): MediaObserver {
		return this._injector.get(MediaObserver);
	}

	get _store(): Store {
		return this._injector.get(Store);
	}

	// Global

	getGlobalCases(): Observable<IGlobalCases> {
		return this._makeRequest<IGlobalCases>('all');
	}

	getGlobalHistoricalCases(): Observable<IHistoricalTimeline> {
		return this._makeRequest<IHistoricalTimeline>('v2/historical/all');
	}

	// Countries

	getAllCountriesCases(): Observable<CountryCases> {
		return this._makeRequest<CountryCases>('countries?sort=cases')
			.pipe(switchMap((countries: CountryCases) => {
				this._countries = countries.reduce((acc: any, value: ICountryCases) => {
					const key = this._getCountrykey(value?.countryInfo?.lat, value?.countryInfo?.long);
					acc = {
						...acc,
						[key]: value.country
					};
					return acc;
				}, {});
				return of(countries.map((country, index) => {
					return {
						...country,
						countryInfo: {
							...country.countryInfo,
							position: index + 1
						}
					};
				}));
			}));
	}

	getCountryCases(country: string): Observable<ICountryCases> {
		return this._makeRequest<ICountryCases>(`countries/${country}`);
	}

	getCountryHistoricalCases(country: string): Observable<IHistoricalCases> {
		return this._makeRequest<IHistoricalCases>(`v2/historical/${country}`);
	}

	getMyCountry(): Promise<string> {
		return new Promise<string>(resolve => {
			if ('geolocation' in navigator) {
				navigator.geolocation.getCurrentPosition(position => {
					const key = this._getCountrykey(position?.coords?.latitude, position?.coords?.longitude);
					resolve(get(this._countries, key, null));
				}, error => {
					console.error(error);
					resolve(null);
				});
			} else {
				/* la geolocalización NO está disponible */
			}
		});
	}

	getWorker(): Worker {
		return this._webWorker;
	}

	// Private

	_makeRequest<T>(path: string): Observable<T> {
		return this._httpClient.get<T>(`${this._config?.api?.host}/${path}`, {responseType: 'json'});
	}

	_initLayoutObserver(): void {
		this._mediaObserver.asObservable().pipe(
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
						type = ELayoutName.mobile;
				}
				return of({
					type,
					alias: changes.mqAlias as ELayoutAlias || ELayoutAlias.xs
				});
			})
		).subscribe((layout: ILayout) => this._store.dispatch(setLayout({layout})));
	}

	_initWebWorker() {
		if (typeof Worker !== 'undefined') {
			this._webWorker = new Worker('../charts-manager.worker', {type: 'module'});
		}
	}

	_getCountrykey(lat: number, long: number): string {
		return `${Math.round(lat)},${Math.round(long)}`;
	}

}
