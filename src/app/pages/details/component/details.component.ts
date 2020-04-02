import {
	Subscription,
	Subject,
	forkJoin,
	Observable,
	interval,
	BehaviorSubject,
	combineLatest,
	of
} from 'rxjs';
import { eachDayOfInterval, subDays, format } from 'date-fns';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { startWith, switchMap, first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { get, takeRight, merge, capitalize } from 'lodash';
import { Store, select } from '@ngrx/store';
import esLocale from 'date-fns/locale/es';

import { IHistoricalCases, ICountryCases, IHistoricalTimeline } from '@shared/models';
import { selectLastUpdate } from '@shared/store';
import { UtilsService } from '@shared/services';
import { IChartsLiterals } from '@ui/charts';

import { AbstractDetailsService } from '../service/abstract-details.service';
import { IDetails, IDetailsDailyIncrements } from '../models/details.model';
import { environment } from '../../../../environments/environment';
import { AppTabsAnimations } from '../../../app-animations';
import { chartConfig } from '../models/chart.model';

@Component({
	selector: 'covid-dashboard',
	templateUrl: './details.component.html',
	styleUrls: ['./details.component.scss'],
	animations: [AppTabsAnimations]
})
export class DetailsComponent implements OnInit, OnDestroy {

	private readonly _subscriptions: Subscription[] = [];
	readonly countUpOptions = {
		separator: '.',
		decimal: ',',
		duration: 1
	};

	currentTabIndex = 0;

	historical$: BehaviorSubject<IHistoricalCases | object> = new BehaviorSubject<IHistoricalCases | object>({});
	country$: BehaviorSubject<ICountryCases | object> = new BehaviorSubject<ICountryCases | object>({});
	literals$: BehaviorSubject<IChartsLiterals | object> = new BehaviorSubject<IChartsLiterals | object>({});
	dailyIncrements$: Observable<IDetailsDailyIncrements>;
	chartData: any = chartConfig;

	viewData$: Subject<IDetails> = new Subject<IDetails>();
	lastUpdate$: Observable<number>;
	tabSelected = 0;
	lastdays = environment.summaryLastDays;

	constructor(
		private _dashboardService: AbstractDetailsService,
		private _tranlsateService: TranslateService,
		private _store: Store,
		private _route: ActivatedRoute,
		private _utilsService: UtilsService
	) {}

	ngOnInit(): void {
		this.lastUpdate$ = this._store.pipe(select(selectLastUpdate));
		this._setChartsLiterals();
		this._getDailyIncrements();
		this._setChartData();
		this._subscriptions.push(
			this._route.params.subscribe(params => this._getViewInfo(params?.country))
		);
	}

	ngOnDestroy() {
		this._subscriptions.forEach(subscription => {
			if (subscription.unsubscribe) {
				subscription.unsubscribe();
			}
		});
	}

	trackByIndex(index: number): number {
		return index;
	}

	_setChartsLiterals(): void {
		this._tranlsateService.get('charts')
			.pipe(
				first()
			).subscribe(literals => {
			this.literals$.next(literals);
			this._subscriptions.push(
				this._tranlsateService.onLangChange
					.pipe(
						switchMap(() => this._tranlsateService.get('charts'))
					).subscribe(changedLiterals => {
					this.literals$.next(changedLiterals);
				})
			);
		});
	}

	_getViewInfo(country: string) {
		this._subscriptions.push(
			interval(environment.pooling).pipe(
				startWith(0),
				switchMap(() => forkJoin([
					this._utilsService.getCountryCases(country),
					this._utilsService.getCountryHistoricalCases(country)
				]))
			).subscribe((response: [ICountryCases, IHistoricalCases]) => {
				const [cases, historical] = response;
				this.historical$.next(historical?.timeline);
				this.country$.next(cases);
				this.viewData$.next({
					cases,
					cards: [
						{
							title: 'cases',
							value: cases?.cases
						},
						{
							title: 'active',
							value: cases?.active
						},
						{
							title: 'deaths',
							value: cases?.deaths
						},
						{
							title: 'recovered',
							value: cases?.recovered
						}
					]
				});
			})
		);
	}

	_getDailyIncrements() {
		this.dailyIncrements$ = combineLatest([
			this.country$,
			this.historical$
		]).pipe(switchMap((data: [ICountryCases, IHistoricalTimeline]) => {
			const [country, historical] = data;
			const cases = this._calcIncrement(country, historical, 'cases');
			const deaths = this._calcIncrement(country, historical, 'deaths');
			const recovered = this._calcIncrement(country, historical, 'recovered');
			return of({
				cases, deaths, recovered,
				active: cases - (recovered + deaths)
			});
		}));
	}

	_calcIncrement(global: ICountryCases, historical: IHistoricalTimeline, key: string): number {
		const result = get(global, [key], 0) - get(historical, [
			key,
			Object.keys(get(historical, [key], {})).pop() || ''
		], 0);
		return result < 0 ? 0 : result;
	}

	_setChartData() {
		this._subscriptions.push(
			combineLatest([
				this.country$,
				this.historical$
			]).subscribe((data: [ICountryCases, IHistoricalTimeline]) => {
				const [country, historical] = data;
				if (country?.cases) {
					const lastWeekCases = this._calcPercents(
						takeRight(Object.values(historical?.cases || {}), this.lastdays).concat(country?.cases || 0)
					);
					const lastWeekDeaths = this._calcPercents(
						takeRight(Object.values(historical?.deaths || {}), this.lastdays).concat(country?.deaths || 0)
					);
					const lastWeekRecovered = this._calcPercents(
						takeRight(Object.values(historical?.recovered || {}), this.lastdays).concat(country?.recovered || 0)
					);
					this.chartData = merge({}, this.chartData, {
						series: [
							{data: lastWeekCases},
							{data: lastWeekRecovered},
							{data: lastWeekDeaths}
						],
						xaxis: {
							categories: eachDayOfInterval({
								start: subDays(new Date(), this.lastdays - 1),
								end: new Date()
							}).map(date => capitalize(format(date, 'E\',\' d \'de\' MMMM', {locale: esLocale})))
						}
					});
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
