import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { UtilsApiModule } from './utils-api.module';
import { UtilsService } from './utils.service';
import {
	IGlobalCases,
	CountryCases,
	ICountryCases,
	IHistoricalCases,
	IHistoricalTimeline,
	ISharedTodayData,
	ILatestData,
	ISharedTomorrowData,
	SharedDetailsCards
} from '../../models/shared.model';

@Injectable({
	providedIn: UtilsApiModule,
	useClass: UtilsService,
	deps: [Injector]
})
export abstract class AbstractUtilsService {
	abstract getGlobalCases(): Observable<IGlobalCases>;

	abstract getGlobalHistoricalCases(): Observable<IHistoricalTimeline>;

	abstract getAllCountriesCases(): Observable<CountryCases>;

	abstract getCountryCases(country: string): Observable<ICountryCases>;

	abstract getCountryHistoricalCases(country: string): Observable<IHistoricalCases>;

	abstract getMyCountry(): Promise<string>;

	abstract getWorker(): Worker;

	abstract getViewData(data: ICountryCases | IGlobalCases, historical: IHistoricalTimeline): SharedDetailsCards;

	abstract calcIncrement(global: IGlobalCases | ICountryCases, historical: IHistoricalTimeline, key: string): number;

	abstract getTodayData(data: ICountryCases | IGlobalCases, historical: IHistoricalTimeline): Partial<ISharedTodayData>;

	abstract calcPercentData(historical: IHistoricalTimeline): Partial<ISharedTodayData>;

	abstract calcActiveData(data: ICountryCases | IGlobalCases): Partial<ISharedTodayData>;

	abstract calcClosedData(data: ICountryCases | IGlobalCases): Partial<ISharedTodayData>;

	abstract getLatestData(historical: IHistoricalTimeline, beforeYesterday?: boolean): ILatestData;

	abstract getTomorrowData(today: ISharedTodayData, data: IGlobalCases | ICountryCases): ISharedTomorrowData;
}
