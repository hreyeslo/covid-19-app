import { Subscription, Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, first } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { get } from 'lodash';

import { selectGlobalCases, selectLastUpdate, selectHistoricalCases } from '@shared/store';
import { IGlobalCases, IHistoricalTimeline } from '@shared/models';
import { IChartsLiterals } from '@ui/charts';

import {
	IDashboardViewData,
	IDashboardCard,
	IDashboardDailyIncrements
} from '../models/dashboard.model';
import { AbstractDashboardService } from '../service/abstract-dashboard.service';
import { AppTabsAnimations } from '../../../app-animations';

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

	globalCases$: Observable<IGlobalCases>;
	historicalCases$: Observable<IHistoricalTimeline>;
	dailyIncrements$: Observable<IDashboardDailyIncrements>;

	viewData$: Observable<IDashboardViewData>;
	lastUpdate$: Observable<number>;
	literals$: BehaviorSubject<IChartsLiterals | object> = new BehaviorSubject<IChartsLiterals | object>({});

	constructor(
		private _dashboardService: AbstractDashboardService,
		private _tranlsateService: TranslateService,
		private _store: Store
	) {}

	ngOnInit(): void {
		this.globalCases$ = this._store.pipe(select(selectGlobalCases));
		this.historicalCases$ = this._store.pipe(select(selectHistoricalCases));
		this.lastUpdate$ = this._store.pipe(select(selectLastUpdate));
		this._setChartsLiterals();
		this._mapViewData();
		this._getDailyIncrements();
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

	_mapViewData(): void {
		this.viewData$ = this.globalCases$
			.pipe(
				switchMap((data: IGlobalCases) => of({cards: this._getCards(data)})
				)
			);
	}

	_getCards(data: IGlobalCases): IDashboardCard[] {
		return [
			{
				title: 'cases',
				value: data?.cases
			},
			{
				title: 'active',
				value: data?.active
			},
			{
				title: 'deaths',
				value: data?.deaths
			},
			{
				title: 'recovered',
				value: data?.recovered
			}
		];
	}

	_getDailyIncrements() {
		this.dailyIncrements$ = combineLatest([
			this.globalCases$,
			this.historicalCases$
		]).pipe(switchMap((data: [IGlobalCases, IHistoricalTimeline]) => {
			const [global, historical] = data;
			const cases = this._calcIncrement(global, historical, 'cases');
			const deaths = this._calcIncrement(global, historical, 'deaths');
			const recovered = this._calcIncrement(global, historical, 'recovered');
			return of({
				cases, deaths, recovered,
				active: cases - (recovered + deaths)
			});
		}));
	}

	_calcIncrement(global: IGlobalCases, historical: IHistoricalTimeline, key: string): number {
		const result = get(global, [key], 0) - get(historical, [
			key,
			Object.keys(get(historical, [key], {})).pop() || ''
		], 0);
		return result < 0 ? 0 : result;
	}
}
