import { Injectable } from '@angular/core';

import { UtilsService } from '@shared/services';

import { AbstractDashboardService } from './abstract-dashboard.service';

@Injectable()
export class DashboardService implements AbstractDashboardService {

	constructor(private _utilsService: UtilsService) { }

}
