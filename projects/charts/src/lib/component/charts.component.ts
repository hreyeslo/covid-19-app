import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { RequestIdle } from 'ngx-request-idle';
import { BehaviorSubject } from 'rxjs';
import { each } from 'lodash';
import { format } from 'date-fns';

import { HistoricalCases, IGlobalCases, ICountryCases } from '@shared/models';

import { defaultChartLinear } from '../charts.defaults';
import { IChartsLiterals } from '../charts.model';

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
	@Input() literals: IChartsLiterals;

	totalCasesChart$: BehaviorSubject<Partial<any>> = new BehaviorSubject<Partial<any>>(defaultChartLinear);

	constructor(private _requestIdle: RequestIdle) {}

	ngOnChanges(changes: SimpleChanges) {
		if (!!changes?.historical?.currentValue && changes?.historical?.previousValue !== changes?.historical?.currentValue) {
			this._updateTotlaCasesChart('cases');
		}
	}

	_updateTotlaCasesChart(key: string) {
		this._getTotalSeriesByKey(key).then(data => {
			this.totalCasesChart$.next({
				...defaultChartLinear,
				series: [
					{
						name: this.literals?.totalCases,
						data: Object.values(data)
					}
				],
				title: {
					text: this.literals?.totalCases,
					align: 'left'
				},
				xaxis: {
					categories: Object.keys(data).map(date => format(new Date(date), 'DD-MM-YYYY'))
				}
			});
		});
	}

	_getTotalSeriesByKey(key: string): Promise<any> {
		return Promise.resolve(this.historical.reduce((acc: any, country: any) => {
			const data = country?.timeline[key] || {};
			each(data, (value, date) => {
				if (acc[date]) {
					acc[date] = acc[date] + value;
				} else {
					acc[date] = value;
				}
			});
			return acc;
		}, {}));
	}

}
