import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { UtilsApiModule } from './utils-api.module';
import { UtilsService } from './utils.service';
import {
	IGlobalCases,
	CountryCases,
	ICountryCases,
	IHistoricalCases,
	IHistoricalTimeline
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

	abstract getMyCountry(): Observable<string>;

	abstract getWorker(): Worker;
}
