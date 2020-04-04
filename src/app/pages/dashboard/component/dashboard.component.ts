import { Subscription, Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, first } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { selectGlobalCases, selectLastUpdate, selectHistoricalCases } from '@shared/store';
import { IGlobalCases, IHistoricalTimeline } from '@shared/models';
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

	literals$: BehaviorSubject<IChartsLiterals | object> = new BehaviorSubject<IChartsLiterals | object>({});
	globalCases$: Observable<IGlobalCases>;
	historicalCases$: Observable<IHistoricalTimeline>;

	viewData$: Observable<IDashboardViewData>;
	lastUpdate$: Observable<number>;

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
					return of({
						cards: [
							{title: 'cases', value: global?.cases, increment: cases || 0},
							{title: 'active', value: global?.active, increment: cases - (recovered + deaths) || 0},
							{title: 'deaths', value: global?.deaths, increment: deaths || 0},
							{title: 'recovered', value: global?.recovered, increment: recovered || 0}
						]
					});
				}
			)
		);
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
