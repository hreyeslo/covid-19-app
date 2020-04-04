import {
	Component,
	Input,
	OnChanges,
	ChangeDetectionStrategy,
	OnDestroy,
	OnInit
} from '@angular/core';
import { Observable, of, combineLatest, Subscription, BehaviorSubject } from 'rxjs';
import { takeRight, merge, capitalize, isEqual } from 'lodash';
import { eachDayOfInterval, subDays, format } from 'date-fns';
import { Store, select } from '@ngrx/store';
import { switchMap, skipWhile } from 'rxjs/operators';
import esLocale from 'date-fns/locale/es';

import { IHistoricalTimeline } from '@shared/models';
import { selectLang } from '@app/core';

import { environment } from '../../../../environments/environment';
import { chartConfig, ILiterals } from './daily-increment-chart.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'covid-daily-increment-chart',
	templateUrl: './daily-increment-chart.component.html',
	styleUrls: ['./daily-increment-chart.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyIncrementChartComponent implements OnInit, OnChanges, OnDestroy {

	private readonly _subscriptions: Subscription[] = [];

	@Input() historicalData$: Observable<IHistoricalTimeline>;

	translations$: BehaviorSubject<ILiterals> = new BehaviorSubject<ILiterals>(null);
	chartData$: Observable<any>;

	lastdays = environment.summaryLastDays;
	_currentLiterals: ILiterals;

	constructor(private _store: Store, private _translateService: TranslateService) { }

	ngOnInit() {
		this._watchTranslations();
	}

	ngOnChanges(): void {
		this._setChartData();
	}

	ngOnDestroy() {
		this._subscriptions.forEach(subscription => {
			if (subscription.unsubscribe) {
				subscription.unsubscribe();
			}
		});
	}

	_watchTranslations() {
		this._subscriptions.push(
			this._store.pipe(
				select(selectLang),
				switchMap(() => this._translateService.get('charts.daily'))
			).subscribe(literals => this.translations$.next(literals))
		);
	}

	_setChartData() {
		this.chartData$ = combineLatest([this.historicalData$, this.translations$]).pipe(
			skipWhile((data: [IHistoricalTimeline, ILiterals]) => !data[1]),
			switchMap((data: [IHistoricalTimeline, ILiterals]) => {
				const [historical, translations] = data;
				const newLiterals = !isEqual(translations, this._currentLiterals);
				this._currentLiterals = translations;
				if (historical?.cases) {
					const lastWeekCases = this._calcPercents(takeRight(Object.values(historical?.cases || {}), this.lastdays + 1));
					const lastWeekDeaths = this._calcPercents(takeRight(Object.values(historical?.deaths || {}), this.lastdays + 1));
					const lastWeekRecovered = this._calcPercents(takeRight(Object.values(historical?.recovered || {}), this.lastdays + 1));
					const newData = merge(chartConfig, {
						series: [
							{name: translations?.new || '', data: lastWeekCases},
							{name: translations?.recovered || '', data: lastWeekRecovered},
							{name: translations?.death || '', data: lastWeekDeaths}
						],
						xaxis: {
							categories: eachDayOfInterval({
								start: subDays(new Date(), this.lastdays),
								end: subDays(new Date(), 1)
							}).map(date => capitalize(format(date, 'E\',\' d \'de\' MMMM', {locale: esLocale})))
						}
					});
					return newLiterals ? of(merge({}, newData)) : of(newData);
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
