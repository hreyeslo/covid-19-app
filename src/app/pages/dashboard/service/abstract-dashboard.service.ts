import { Injectable } from '@angular/core';

import { UtilsService } from '@shared/services';

import { DashboardServiceApiModule } from './dashboard-service-api.module';
import { DashboardService } from './dashboard.service';

@Injectable({
	providedIn: DashboardServiceApiModule,
	useClass: DashboardService,
	deps: [UtilsService]
})
export abstract class AbstractDashboardService {

}
