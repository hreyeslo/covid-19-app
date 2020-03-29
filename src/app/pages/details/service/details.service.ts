import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UtilsService } from '@shared/services';
import { IGlobalCases } from '@shared/models';

import { AbstractDetailsService } from './abstract-details.service';

@Injectable()
export class DetailsService implements AbstractDetailsService {

	constructor(private _utilsService: UtilsService) { }

	getGlobalCases(): Observable<IGlobalCases> {
		return this._utilsService.getGlobalCases();
	}

}
