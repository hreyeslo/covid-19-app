import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UtilsService } from '@shared/services';
import { IGlobalCases } from '@shared/models';

import { AbstractDashboardService } from './abstract-dashboard.service';

@Injectable()
export class DashboardService implements AbstractDashboardService {

	constructor(private _utilsService: UtilsService) { }

	getGlobalCases(): Observable<IGlobalCases> {
		return this._utilsService.getGlobalCases();
	}

}
