import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { each, get } from 'lodash';
import { format } from 'date-fns';

import { AbstractChartsService } from '../service/abstract-charts.service';
import { totalCasesChart, totalDeathsChart } from '../charts.defaults';
import { IChartData } from '../charts.model';

@Component({
	selector: 'covid-charts',
	templateUrl: './charts.component.html',
	styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnChanges {

	@Input() chartData: IChartData;

	totalCasesChart$: BehaviorSubject<Partial<any>> = new BehaviorSubject<Partial<any>>(totalCasesChart);
	totalDeaths$: BehaviorSubject<Partial<any>> = new BehaviorSubject<Partial<any>>(totalDeathsChart);

	constructor(private _chartsService: AbstractChartsService) {}

	ngOnChanges(changes: SimpleChanges) {
		if (
			!!changes?.chartData?.currentValue
			&& changes?.chartData?.previousValue?.historical !== changes?.chartData?.currentValue?.historical
		) {
			this._updateTotalCasesChart();
			this._updateTotalDeathsChart();
			this._chartsService.calcTotalCases(this.chartData);
		}
	}

	_updateTotalCasesChart() {
		this._getTotalSeriesByKey('cases').then(data => {
			this.totalCasesChart$.next({
				...totalCasesChart,
				series: [
					{
						name: this.chartData?.literals?.totalCases,
						data: Object.values(data)
					}
				],
				title: {
					text: this.chartData?.literals?.totalCases,
					align: 'left'
				},
				xaxis: {
					categories: Object.keys(data).map(date => format(new Date(date), 'dd-MM-yyyy'))
				}
			});
		});
	}

	_updateTotalDeathsChart() {
		this._getTotalSeriesByKey('deaths').then(data => {
			this.totalDeaths$.next({
				...totalDeathsChart,
				series: [
					{
						name: this.chartData?.literals?.totalDeath,
						data: Object.values(data)
					}
				],
				title: {
					text: this.chartData?.literals?.totalDeath,
					align: 'left'
				},
				xaxis: {
					categories: Object.keys(data).map(date => format(new Date(date), 'dd-MM-yyyy'))
				}
			});
		});
	}

	_getTotalSeriesByKey(key: string): Promise<any> {
		return new Promise(resolve => {
			const countries: any[] = get(this.chartData, 'historical', []);
			const results = countries.reduce((acc: any, country: any) => {
				const data = country?.timeline[key] || {};
				each(data, (value, date) => {
					if (acc[date]) {
						acc[date] = acc[date] + value;
					} else {
						acc[date] = value;
					}
				});
				return acc;
			}, {});
			resolve(results);
		});
	}

}
