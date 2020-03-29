import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { UtilsApiModule } from './utils-api.module';
import { UtilsService } from './utils.service';
import {
	IGlobalCases,
	HistoricalCases,
	CountryCases,
	ICountryCases,
	IHistoricalCases
} from '../../models/shared.model';

@Injectable({
	providedIn: UtilsApiModule,
	useClass: UtilsService,
	deps: [Injector]
})
export abstract class AbstractUtilsService {
	abstract getGlobalCases(): Observable<IGlobalCases>;

	abstract getGlobalHistoricalCases(): Observable<HistoricalCases>;

	abstract getAllCountriesCases(): Observable<CountryCases>;

	abstract getCountryCases(country: string): Observable<ICountryCases>;

	abstract getCountryHistoricalCases(country: string): Observable<IHistoricalCases>;

	abstract getMyCountry(): Observable<string>;
}
