import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { RequestIdle } from 'ngx-request-idle';
import { BehaviorSubject } from 'rxjs';

import { HistoricalCases, IGlobalCases, ICountryCases } from '@shared/models';

import { defaultChartLinear } from '../charts.defaults';

@Component({
	selector: 'covid-charts',
	templateUrl: './charts.component.html',
	styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnChanges {

	@ViewChild('total', {static: false}) _totalCasesChart: ChartComponent;

	@Input() historical: HistoricalCases = [];
	@Input() global: IGlobalCases;
	@Input() country: ICountryCases;
	@Input() loading = true;

	totalCasesChart$: BehaviorSubject<Partial<any>> = new BehaviorSubject<Partial<any>>(defaultChartLinear);

	constructor(private _requestIdle: RequestIdle) {}

	ngOnChanges(changes: SimpleChanges) {
		if (!!changes?.historical?.currentValue && changes?.historical?.previousValue !== changes?.historical?.currentValue) {
			this._updateTotlaCasesChart();
		}
	}

	_updateTotlaCasesChart() {
		this.totalCasesChart$.next({
			...defaultChartLinear,
			series: [
				{
					name: 'series-1',
					data: [23, 44, 1, 22]
				}
			]
		});
	}

}
