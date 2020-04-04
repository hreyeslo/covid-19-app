import { Component, Input, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { eachDayOfInterval, subDays, format } from 'date-fns';
import { takeRight, merge, capitalize } from 'lodash';
import { switchMap } from 'rxjs/operators';
import esLocale from 'date-fns/locale/es';
import { Observable, of } from 'rxjs';

import { IHistoricalTimeline } from '@shared/models';

import { environment } from '../../../../environments/environment';
import { chartConfig } from './chart.model';

@Component({
	selector: 'covid-daily-increment-chart',
	templateUrl: './daily-increment-chart.component.html',
	styleUrls: ['./daily-increment-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyIncrementChartComponent implements OnChanges {

	@Input() historicalData$: Observable<IHistoricalTimeline>;

	chartData$: Observable<any>;

	lastdays = environment.summaryLastDays;

	constructor() { }

	ngOnChanges(): void {
		this._setChartData();
	}

	_setChartData() {
		this.chartData$ = this.historicalData$.pipe(
			switchMap((historical: IHistoricalTimeline) => {
				if (historical?.cases) {
					const lastWeekCases = this._calcPercents(takeRight(Object.values(historical?.cases || {}), this.lastdays + 1));
					const lastWeekDeaths = this._calcPercents(takeRight(Object.values(historical?.deaths || {}), this.lastdays + 1));
					const lastWeekRecovered = this._calcPercents(takeRight(Object.values(historical?.recovered || {}), this.lastdays + 1));
					return of(merge(chartConfig, {
						series: [
							{data: lastWeekCases},
							{data: lastWeekRecovered},
							{data: lastWeekDeaths}
						],
						xaxis: {
							categories: eachDayOfInterval({
								start: subDays(new Date(), this.lastdays),
								end: subDays(new Date(), 1)
							}).map(date => capitalize(format(date, 'E\',\' d \'de\' MMMM', {locale: esLocale})))
						}
					}));
				} else {
					return of(chartConfig);
				}
			})
		);
	}

	_calcPercents(collection: number[]): number[] {
		const percents = [];
		for (let i = 0; i < collection.length - 1; i++) {
			const percent = ((collection[i + 1] - collection[i]) / collection[i]) * 100;
			percents.push(Math.round(percent + Number.EPSILON));
		}
		return percents;
	}

}
