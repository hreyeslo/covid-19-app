import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UtilsService } from '@shared/services';

import { ChartsServiceApiModule } from './charts-service-api.module';
import { ChartsService } from './charts.service';
import { IChartData } from '../charts.model';

@Injectable({
	providedIn: ChartsServiceApiModule,
	useClass: ChartsService,
	deps: [UtilsService]
})
export abstract class AbstractChartsService {

	abstract calcTotalCases(chartData: IChartData): void;

	abstract calcTotalDeaths(chartData: IChartData): void;

	abstract getTotalCases(): Observable<any>;

	abstract getTotalDeaths(): Observable<any>;

}
