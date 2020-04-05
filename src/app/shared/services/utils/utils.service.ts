import { filter, map, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isEqual, get, round } from 'lodash';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { IAppConfig, ConfigManager, APP_CONFIG } from '@app/core';

import { AbstractUtilsService } from './abstract-utils.service';
import { setLayout } from '../../store/shared.actions';
import {
	IGlobalCases,
	CountryCases,
	ICountryCases,
	IHistoricalCases,
	ELayoutName,
	ELayoutAlias,
	ILayout,
	IHistoricalTimeline,
	ISharedTodayData,
	ILatestData,
	ISharedTomorrowData,
	SharedDetailsCards
} from '../../models/shared.model';

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

	getViewData(data: ICountryCases | IGlobalCases, historical: IHistoricalTimeline): SharedDetailsCards {
		const cases = this.calcIncrement(data, historical, 'cases');
		const deaths = this.calcIncrement(data, historical, 'deaths');
		const recovered = this.calcIncrement(data, historical, 'recovered');
		const latestData = this.getLatestData(historical);
		const totalCases = data?.cases || 0;
		const totalDeaths = data?.deaths || 0;
		const totalRecovered = data?.recovered || 0;
		const totalActive = data?.active || 0;
		const newCasesPercent = round(((totalCases - latestData?.lastTotalCases) / totalCases) * 100, 2);
		const newDeathsPercent = round(((totalDeaths - latestData?.lastTotalDeaths) / totalDeaths) * 100, 2);
		const newRecoveredPercent = round(((totalRecovered - latestData?.lastTotalRecovered) / totalRecovered) * 100, 2);
		const newActivePercent = round(((totalActive - latestData?.lastTotalActive) / totalActive) * 100, 2);
		const incrementActiveCases = cases - (recovered + deaths) || 0;
		return [
			{
				title: 'cases', value: data?.cases, increment: cases || 0,
				absIncrement: Math.abs(cases || 0),
				percent: newCasesPercent > 0 ? newCasesPercent : 0
			},
			{
				title: 'active', value: data?.active,
				increment: incrementActiveCases,
				absIncrement: Math.abs(incrementActiveCases),
				percent: incrementActiveCases === 0 ? 0 : newActivePercent
			},
			{
				title: 'deaths', value: data?.deaths, increment: deaths || 0,
				absIncrement: Math.abs(deaths || 0),
				percent: newDeathsPercent > 0 ? newDeathsPercent : 0
			},
			{
				title: 'recovered', value: data?.recovered, increment: recovered || 0,
				absIncrement: Math.abs(recovered || 0),
				percent: newRecoveredPercent > 0 ? newRecoveredPercent : 0
			}
		];
	}

	calcIncrement(global: IGlobalCases | ICountryCases, historical: IHistoricalTimeline, key: string): number {
		const result = get(global, [key], 0) - get(historical, [
			key,
			Object.keys(get(historical, [key], {})).pop() || ''
		], 0);
		return result < 0 ? 0 : result;
	}

	getTodayData(data: ICountryCases | IGlobalCases, historical: IHistoricalTimeline): Partial<ISharedTodayData> {
		return {
			...this.calcActiveData(data),
			...this.calcClosedData(data),
			...this.calcPercentData(historical)
		};
	}

	calcPercentData(historical: IHistoricalTimeline): Partial<ISharedTodayData> {
		const lastDayCases = this.getLatestData(historical);
		const lastTwoDaysCases = this.getLatestData(historical, true);
		const propagationIndex = lastDayCases?.lastTotalCases / lastTwoDaysCases?.lastTotalCases;
		const deathsIndex = lastDayCases?.lastTotalDeaths / lastTwoDaysCases?.lastTotalDeaths;
		const recoveredIndex = lastDayCases?.lastTotalRecovered / lastTwoDaysCases?.lastTotalRecovered;
		return {propagationIndex, deathsIndex, recoveredIndex};
	}

	calcActiveData(data: ICountryCases | IGlobalCases): Partial<ISharedTodayData> {
		const active = data?.active || 0;
		const critical = data?.critical || 0;
		const moderate = active - critical;
		const moderatePercent = Math.round((moderate * 100) / active);
		const criticalPercent = Math.round((critical * 100) / active);
		const activePercent = Math.round((active * 100) / data?.cases || 0);
		return {active, moderate, moderatePercent, critical, criticalPercent, activePercent};
	}

	calcClosedData(data: ICountryCases | IGlobalCases): Partial<ISharedTodayData> {
		const recovered = data?.recovered || 0;
		const deaths = data?.deaths || 0;
		const closed = recovered + deaths;
		const recoveredPercent = Math.round((recovered * 100) / closed);
		const deathsPercent = Math.round((deaths * 100) / closed);
		const closedPercent = Math.round((closed * 100) / data?.cases || 0);
		return {closed, deaths, deathsPercent, recovered, recoveredPercent, closedPercent};
	}

	getLatestData(historical: IHistoricalTimeline, beforeYesterday?: boolean): ILatestData {
		let lastTotalCases: any = Object.values(historical?.cases || {});
		let lastTotalDeaths: any = Object.values(historical?.deaths || {});
		let lastTotalRecovered: any = Object.values(historical?.recovered || {});
		const days = beforeYesterday ? -2 : -1;
		lastTotalCases = (lastTotalCases.slice(days)).shift() || 0;
		lastTotalDeaths = (lastTotalDeaths.slice(days)).shift() || 0;
		lastTotalRecovered = (lastTotalRecovered.slice(days)).shift() || 0;
		const lastTotalActive = lastTotalCases - (lastTotalRecovered + lastTotalDeaths);
		return {lastTotalCases, lastTotalDeaths, lastTotalRecovered, lastTotalActive};
	}

	getTomorrowData(today: ISharedTodayData, data: ICountryCases | IGlobalCases): ISharedTomorrowData {
		const totalCases = data?.cases || 0;
		const totalDeaths = data?.deaths || 0;
		const totalRecovered = data?.recovered || 0;
		const cases = Math.round(totalCases * today?.propagationIndex);
		const deaths = Math.round(totalDeaths * today?.deathsIndex);
		const recovered = Math.round(totalRecovered * today?.recoveredIndex);
		const improving = totalCases <= cases;
		const propagationIndex = today?.propagationIndex;
		return {cases, deaths, recovered, improving, propagationIndex};
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
