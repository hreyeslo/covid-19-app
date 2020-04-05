import { Subscription, Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, first, tap } from 'rxjs/operators';
import { isEmpty, last, round } from 'lodash';
import { Store, select } from '@ngrx/store';

import { selectGlobalCases, selectLastUpdate, selectHistoricalCases } from '@shared/store';
import { IGlobalCases, IHistoricalTimeline } from '@shared/models';
import { UtilsService } from '@shared/services';
import { IChartsLiterals } from '@ui/charts';

import { AbstractDashboardService } from '../service/abstract-dashboard.service';
import { AppTabsAnimations } from '../../../app-animations';
import {
	IDashboardViewData,
	IDashboardTodayData,
	IDashboardTomorrowData
} from '../models/dashboard.model';

@Component({
	selector: 'covid-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
	animations: [AppTabsAnimations]
})
export class DashboardComponent implements OnInit, OnDestroy {

	private readonly _subscriptions: Subscription[] = [];
	readonly countUpOptions = {
		separator: '.',
		decimal: ',',
		duration: 1
	};

	currentTabIndex = 0;

	viewData$: Observable<IDashboardViewData>;
	lastUpdate$: Observable<number>;

	literals$: BehaviorSubject<IChartsLiterals | object> = new BehaviorSubject<IChartsLiterals | object>({});
	historicalCases$: Observable<IHistoricalTimeline>;
	globalCases$: Observable<IGlobalCases>;

	tomorrowData$: BehaviorSubject<IDashboardTomorrowData> = new BehaviorSubject<IDashboardTomorrowData>(null);
	todayData$: BehaviorSubject<IDashboardTodayData> = new BehaviorSubject<IDashboardTodayData>(null);

	constructor(
		private _dashboardService: AbstractDashboardService,
		private _tranlsateService: TranslateService,
		private _utilsService: UtilsService,
		private _store: Store
	) {}

	ngOnInit(): void {
		this.globalCases$ = this._store.pipe(select(selectGlobalCases));
		this.historicalCases$ = this._store.pipe(select(selectHistoricalCases));
		this.lastUpdate$ = this._store.pipe(select(selectLastUpdate));
		this._setChartsLiterals();
		this._mapViewData();
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

	_mapViewData(): void {
		this.viewData$ = combineLatest([this.globalCases$, this.historicalCases$]).pipe(
			switchMap((data: [IGlobalCases, IHistoricalTimeline]) => {
					const [global, historical] = data;
					const cases = this._utilsService.calcIncrement(global, historical, 'cases');
					const deaths = this._utilsService.calcIncrement(global, historical, 'deaths');
					const recovered = this._utilsService.calcIncrement(global, historical, 'recovered');
					const {lastTotalCases, lastTotalDeaths, lastTotalRecovered, lastTotalActive} = this._getLatestData(historical);
					const totalCases = global?.cases || 0;
					const totalDeaths = global?.deaths || 0;
					const totalRecovered = global?.recovered || 0;
					const totalActive = global?.active || 0;
					const newCasesPercent = round(((totalCases - lastTotalCases) / totalCases) * 100, 2);
					const newDeathsPercent = round(((totalDeaths - lastTotalDeaths) / totalDeaths) * 100, 2);
					const newRecoveredPercent = round(((totalRecovered - lastTotalRecovered) / totalRecovered) * 100, 2);
					const newActivePercent = round(((totalActive - lastTotalActive) / totalActive) * 100, 2);
					return of({
						global,
						cards: [
							{
								title: 'cases', value: global?.cases, increment: cases || 0,
								absIncrement: Math.abs(cases || 0),
								percent: newCasesPercent
							},
							{
								title: 'active', value: global?.active, increment: cases - (recovered + deaths) || 0,
								absIncrement: Math.abs(cases - (recovered + deaths) || 0),
								percent: newActivePercent
							},
							{
								title: 'deaths', value: global?.deaths, increment: deaths || 0,
								absIncrement: Math.abs(deaths || 0),
								percent: newDeathsPercent
							},
							{
								title: 'recovered', value: global?.recovered, increment: recovered || 0,
								absIncrement: Math.abs(recovered || 0),
								percent: newRecoveredPercent
							}
						]
					});
				}
			),
			tap((data: IDashboardViewData) => this._setTodayData(data))
		);
	}

	_setTodayData(data: IDashboardViewData): void {
		this.historicalCases$.pipe(
			first((historical: IHistoricalTimeline) => !isEmpty(historical)),
			switchMap((historical: IHistoricalTimeline) => {
				return of({
					...this._calcActiveData(data?.global),
					...this._calcClosedData(data?.global),
					...this._calcPercentData(data?.global, historical)
				} as IDashboardTodayData);
			}),
			tap((today: IDashboardTodayData) => this._setTomorrow(today, data?.global))
		).subscribe((today: IDashboardTodayData) => this.todayData$.next(today));
	}

	_setTomorrow(today: IDashboardTodayData, data: IGlobalCases): void {
		const totalCases = data?.cases || 0;
		const totalDeaths = data?.deaths || 0;
		const totalRecovered = data?.recovered || 0;
		const cases = Math.round(totalCases * today?.propagationIndex);
		const deaths = Math.round(totalDeaths * today?.deathsIndex);
		const recovered = Math.round(totalRecovered * today?.recoveredIndex);
		this.tomorrowData$.next({cases, deaths, recovered});
	}

	_calcPercentData(data: IGlobalCases, historical: IHistoricalTimeline): Partial<IDashboardTodayData> {
		const cases = data?.cases || 0;
		const deaths = data?.deaths || 0;
		const recovered = data?.recovered || 0;
		const {lastTotalCases, lastTotalDeaths, lastTotalRecovered} = this._getLatestData(historical);
		const propagationIndex = cases / lastTotalCases;
		const deathsIndex = deaths / lastTotalDeaths;
		const recoveredIndex = recovered / lastTotalRecovered;
		return {propagationIndex, deathsIndex, recoveredIndex};
	}

	_calcActiveData(data: IGlobalCases): Partial<IDashboardTodayData> {
		const active = data?.active || 0;
		const critical = data?.critical || 0;
		const moderate = active - critical;
		const moderatePercent = Math.round((moderate * 100) / active);
		const criticalPercent = Math.round((critical * 100) / active);
		const activePercent = Math.round((active * 100) / data?.cases || 0);
		return {active, moderate, moderatePercent, critical, criticalPercent, activePercent};
	}

	_calcClosedData(data: IGlobalCases): Partial<IDashboardTodayData> {
		const recovered = data?.recovered || 0;
		const deaths = data?.deaths || 0;
		const closed = recovered + deaths;
		const recoveredPercent = Math.round((recovered * 100) / closed);
		const deathsPercent = Math.round((deaths * 100) / closed);
		const closedPercent = Math.round((closed * 100) / data?.cases || 0);
		return {closed, deaths, deathsPercent, recovered, recoveredPercent, closedPercent};
	}

	_getLatestData(historical: IHistoricalTimeline): any {
		const lastTotalCases = (last(Object.values(historical?.cases || {})) || 0);
		const lastTotalDeaths = (last(Object.values(historical?.deaths || {})) || 0);
		const lastTotalRecovered = (last(Object.values(historical?.recovered || {})) || 0);
		const lastTotalActive = lastTotalCases - (lastTotalRecovered + lastTotalDeaths);
		return {lastTotalCases, lastTotalDeaths, lastTotalRecovered, lastTotalActive};
	}

	// Review

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
}
