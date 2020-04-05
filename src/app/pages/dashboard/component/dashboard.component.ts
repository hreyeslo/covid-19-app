import { Subscription, Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, first, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { isEmpty } from 'lodash';

import { selectGlobalCases, selectLastUpdate, selectHistoricalCases } from '@shared/store';
import {
	IGlobalCases,
	IHistoricalTimeline,
	ISharedTomorrowData,
	ISharedTodayData
} from '@shared/models';
import { UtilsService } from '@shared/services';
import { IChartsLiterals } from '@ui/charts';

import { AbstractDashboardService } from '../service/abstract-dashboard.service';
import { IDashboardViewData } from '../models/dashboard.model';
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

	viewData$: Observable<IDashboardViewData>;
	lastUpdate$: Observable<number>;

	literals$: BehaviorSubject<IChartsLiterals | object> = new BehaviorSubject<IChartsLiterals | object>({});
	historicalCases$: Observable<IHistoricalTimeline>;
	globalCases$: Observable<IGlobalCases>;

	tomorrowData$: BehaviorSubject<ISharedTomorrowData> = new BehaviorSubject<ISharedTomorrowData>(null);
	todayData$: BehaviorSubject<ISharedTodayData> = new BehaviorSubject<ISharedTodayData>(null);

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
					return of({global, cards: this._utilsService.getViewData(global, historical)});
				}
			),
			tap((data: IDashboardViewData) => this._setTodayData(data))
		);
	}

	_setTodayData(data: IDashboardViewData): void {
		this.historicalCases$.pipe(
			first((historical: IHistoricalTimeline) => !isEmpty(historical)),
			switchMap((historical: IHistoricalTimeline) => {
				return of(this._utilsService.getTodayData(data?.global, historical));
			}),
			tap((today: ISharedTodayData) => this._setTomorrow(today, data?.global))
		).subscribe((today: ISharedTodayData) => this.todayData$.next(today));
	}

	_setTomorrow(today: ISharedTodayData, data: IGlobalCases): void {
		const tomorrowData = this._utilsService.getTomorrowData(today, data);
		this.tomorrowData$.next(tomorrowData);
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
