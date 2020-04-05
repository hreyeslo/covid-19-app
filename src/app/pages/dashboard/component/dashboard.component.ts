import { Subscription, Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, first, tap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { isEmpty, omit } from 'lodash';

import { selectGlobalCases, selectLastUpdate, selectHistoricalCases } from '@shared/store';
import {
	IGlobalCases,
	IHistoricalTimeline,
	ISharedTomorrowData,
	ISharedTodayData,
	ISummaryViewData
} from '@shared/models';
import { UtilsService } from '@shared/services';
import { IChartsLiterals } from '@ui/charts';

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

	viewData$: Observable<ISummaryViewData>;
	lastUpdate$: Observable<number>;

	literals$: BehaviorSubject<IChartsLiterals | object> = new BehaviorSubject<IChartsLiterals | object>({});
	tests$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
	historicalCases$: Observable<IHistoricalTimeline>;
	globalCases$: Observable<IGlobalCases>;

	todayData$: BehaviorSubject<Partial<ISharedTodayData>> = new BehaviorSubject<Partial<ISharedTodayData>>(null);
	tomorrowData$: BehaviorSubject<ISharedTomorrowData> = new BehaviorSubject<ISharedTomorrowData>(null);

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
					const [cases, historical] = data;
					this.tests$.next(cases?.tests || 0);
					return of({cases, cards: this._utilsService.getViewData(cases, historical)});
				}
			),
			tap((data: ISummaryViewData) => this._setTodayData(data))
		);
	}

	_setTodayData(data: ISummaryViewData): void {
		this.historicalCases$.pipe(
			first((historical: IHistoricalTimeline) => !isEmpty(historical)),
			switchMap((historical: IHistoricalTimeline) => {
				return of({
					historical,
					...this._utilsService.getTodayData(data?.cases, historical)
				});
			}),
			tap((today: ISharedTodayData) => this._setTomorrow(today))
		).subscribe((today: ISharedTodayData) => this.todayData$.next(omit(today, ['historical'])));
	}

	_setTomorrow(today: ISharedTodayData): void {
		this.tomorrowData$.next(this._utilsService.getTomorrowData(today));
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
