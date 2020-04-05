import { Subscription, forkJoin, Observable, interval, BehaviorSubject, of } from 'rxjs';
import { startWith, switchMap, first, tap } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { last, isEmpty, round } from 'lodash';
import { Store, select } from '@ngrx/store';

import { IHistoricalCases, ICountryCases, IHistoricalTimeline } from '@shared/models';
import { selectLastUpdate } from '@shared/store';
import { UtilsService } from '@shared/services';
import { IChartsLiterals } from '@ui/charts';

import { IDetails, IDetailsTodayData, IDetailsTomorrowData } from '../models/details.model';
import { AbstractDetailsService } from '../service/abstract-details.service';
import { environment } from '../../../../environments/environment';
import { AppTabsAnimations } from '../../../app-animations';

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

	lastUpdate$: Observable<number>;
	viewData$: Observable<IDetails>;

	historical$: BehaviorSubject<IHistoricalTimeline | object> = new BehaviorSubject<IHistoricalTimeline | object>({});
	literals$: BehaviorSubject<IChartsLiterals | object> = new BehaviorSubject<IChartsLiterals | object>({});
	country$: BehaviorSubject<ICountryCases | object> = new BehaviorSubject<ICountryCases | object>({});

	tomorrowData$: BehaviorSubject<IDetailsTomorrowData> = new BehaviorSubject<IDetailsTomorrowData>(null);
	todayData$: BehaviorSubject<IDetailsTodayData> = new BehaviorSubject<IDetailsTodayData>(null);

	constructor(
		private _dashboardService: AbstractDetailsService,
		private _tranlsateService: TranslateService,
		private _store: Store,
		private _route: ActivatedRoute,
		private _utilsService: UtilsService
	) {}

	ngOnInit(): void {
		this._subscriptions.push(
			this._route.params.subscribe(params => this._getViewInfo(params?.country))
		);
		this.lastUpdate$ = this._store.pipe(select(selectLastUpdate));
		this._setChartsLiterals();
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

	_getViewInfo(country: string) {
		this.viewData$ = interval(environment.pooling).pipe(
			startWith(0),
			switchMap(() => forkJoin([
				this._utilsService.getCountryCases(country),
				this._utilsService.getCountryHistoricalCases(country)
			]))
		).pipe(switchMap((response: [ICountryCases, IHistoricalCases]) => {
			const [countryCases, historical] = response;
			this.historical$.next(historical?.timeline);
			this.country$.next(countryCases);
			const cases = this._utilsService.calcIncrement(countryCases, historical?.timeline, 'cases');
			const deaths = this._utilsService.calcIncrement(countryCases, historical?.timeline, 'deaths');
			const recovered = this._utilsService.calcIncrement(countryCases, historical?.timeline, 'recovered');
			const {lastTotalCases, lastTotalDeaths, lastTotalRecovered, lastTotalActive} = this._getLatestData(historical?.timeline);
			const totalCases = countryCases?.cases || 0;
			const totalDeaths = countryCases?.deaths || 0;
			const totalRecovered = countryCases?.recovered || 0;
			const totalActive = countryCases?.active || 0;
			const newCasesPercent = round(((totalCases - lastTotalCases) / totalCases) * 100, 2);
			const newDeathsPercent = round(((totalDeaths - lastTotalDeaths) / totalDeaths) * 100, 2);
			const newRecoveredPercent = round(((totalRecovered - lastTotalRecovered) / totalRecovered) * 100, 2);
			const newActivePercent = round(((totalActive - lastTotalActive) / totalActive) * 100, 2);
			const incrementActiveCases = cases - (recovered + deaths) || 0;
			return of({
				cases: countryCases,
				cards: [
					{
						title: 'cases', value: countryCases?.cases, increment: cases || 0,
						absIncrement: Math.abs(cases || 0),
						percent: newCasesPercent > 0 ? newCasesPercent : 0
					},
					{
						title: 'active', value: countryCases?.active,
						increment: incrementActiveCases,
						absIncrement: Math.abs(incrementActiveCases),
						percent: incrementActiveCases === 0 ? 0 : newActivePercent
					},
					{
						title: 'deaths', value: countryCases?.deaths, increment: deaths || 0,
						absIncrement: Math.abs(deaths || 0),
						percent: newDeathsPercent > 0 ? newDeathsPercent : 0
					},
					{
						title: 'recovered', value: countryCases?.recovered, increment: recovered || 0,
						absIncrement: Math.abs(recovered || 0),
						percent: newRecoveredPercent > 0 ? newRecoveredPercent : 0
					}
				]
			});
		}), tap((data: IDetails) => this._setTodayData(data)));
	}

	_setTodayData(data: IDetails): void {
		this.historical$.pipe(
			first(historical => !isEmpty(historical)),
			switchMap((historical: IHistoricalTimeline) => {
				return of({
					...this._calcActiveData(data?.cases),
					...this._calcClosedData(data?.cases),
					...this._calcPercentData(data?.cases, historical)
				} as IDetailsTodayData);
			}),
			tap((today: IDetailsTodayData) => this._setTomorrow(today, data))
		).subscribe((today: IDetailsTodayData) => this.todayData$.next(today));
	}

	_setTomorrow(today: IDetailsTodayData, data: IDetails): void {
		const totalCases = data?.cases?.cases || 0;
		const totalDeaths = data?.cases?.deaths || 0;
		const totalRecovered = data?.cases?.recovered || 0;
		const cases = Math.round(totalCases * today?.propagationIndex);
		const deaths = Math.round(totalDeaths * today?.deathsIndex);
		const recovered = Math.round(totalRecovered * today?.recoveredIndex);
		this.tomorrowData$.next({cases, deaths, recovered});
	}

	_calcPercentData(data: ICountryCases, historical: IHistoricalTimeline): Partial<IDetailsTodayData> {
		const cases = data?.cases || 0;
		const deaths = data?.deaths || 0;
		const recovered = data?.recovered || 0;
		const {lastTotalCases, lastTotalDeaths, lastTotalRecovered} = this._getLatestData(historical);
		const propagationIndex = cases / lastTotalCases;
		const deathsIndex = deaths / lastTotalDeaths;
		const recoveredIndex = recovered / lastTotalRecovered;
		return {propagationIndex, deathsIndex, recoveredIndex};
	}

	_calcActiveData(data: ICountryCases): Partial<IDetailsTodayData> {
		const active = data?.active || 0;
		const critical = data?.critical || 0;
		const moderate = active - critical;
		const moderatePercent = Math.round((moderate * 100) / active);
		const criticalPercent = Math.round((critical * 100) / active);
		const activePercent = Math.round((active * 100) / data?.cases || 0);
		return {active, moderate, moderatePercent, critical, criticalPercent, activePercent};
	}

	_calcClosedData(data: ICountryCases): Partial<IDetailsTodayData> {
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
