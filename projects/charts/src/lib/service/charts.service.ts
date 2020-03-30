import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { isEqual } from 'lodash';

import { UtilsService } from '@shared/services';

import { AbstractChartsService } from './abstract-charts.service';
import { IChartsData, EWorkertTypes } from '../charts.model';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable()
export class ChartsService implements AbstractChartsService {

	_totalCases$: Subject<any> = new Subject<any>();
	_totalDeaths$: Subject<any> = new Subject<any>();

	constructor(private _utilsService: UtilsService) {
		if (this._webWorker) {
			this._webWorker.onmessage = ({data}) => this._sendMessageResponse(data);
		}
	}

	get _webWorker(): Worker | null {
		return this._utilsService.getWorker() || null;
	}

	calcTotalCases(chartData: IChartsData): void {
		if (this._webWorker) {
			this._webWorker.postMessage({
				type: EWorkertTypes.TOTAL_CASES,
				charts: chartData
			});
		}
	}

	calcTotalDeaths(chartData: IChartsData): void {
		if (this._webWorker) {
			this._webWorker.postMessage({
				type: EWorkertTypes.TOTAL_DEATHS,
				charts: chartData
			});
		}
	}

	// Getters
	getTotalCases(): Observable<any> {
		return this._totalCases$.pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr)));
	}

	getTotalDeaths(): Observable<any> {
		return this._totalDeaths$.pipe(distinctUntilChanged((prev, curr) => isEqual(prev, curr)));
	}

	// Private
	_sendMessageResponse(response: any): void {
		switch (response?.type) {
			case EWorkertTypes.TOTAL_CASES:
				return this._totalCases$.next(response?.charts);
			case EWorkertTypes.TOTAL_DEATHS:
				return this._totalDeaths$.next(response?.charts);
			default:
				return;
		}
	}

}
