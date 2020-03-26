import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UtilsService } from '@shared/services';
import { IGlobalCases } from '@shared/models';

import { DashboardServiceApiModule } from './dashboard-service-api.module';
import { DashboardService } from './dashboard.service';

@Injectable({
	providedIn: DashboardServiceApiModule,
	useClass: DashboardService,
	deps: [UtilsService]
})
export abstract class AbstractDashboardService {
	abstract getGlobalCases(): Observable<IGlobalCases>;
}
