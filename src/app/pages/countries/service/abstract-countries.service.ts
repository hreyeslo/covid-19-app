import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UtilsService } from '@shared/services';
import { IGlobalCases } from '@shared/models';

import { CountriesServiceApiModule } from './countries-service-api.module';
import { CountriesService } from './countries.service';

@Injectable({
	providedIn: CountriesServiceApiModule,
	useClass: CountriesService,
	deps: [UtilsService]
})
export abstract class AbstractCountriesService {
	abstract getGlobalCases(): Observable<IGlobalCases>;
}
