import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UtilsService } from '@shared/services';
import { IGlobalCases } from '@shared/models';

import { AbstractCountriesService } from './abstract-countries.service';

@Injectable()
export class CountriesService implements AbstractCountriesService {

	constructor(private _utilsService: UtilsService) { }

	getGlobalCases(): Observable<IGlobalCases> {
		return this._utilsService.getGlobalCases();
	}

}
