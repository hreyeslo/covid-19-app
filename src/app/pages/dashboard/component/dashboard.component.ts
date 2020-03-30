import { Subscription, Observable, of, BehaviorSubject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { switchMap, first } from 'rxjs/operators';

import { selectGlobalCases, selectLastUpdate, selectHistoricalCases } from '@shared/store';
import { IGlobalCases, HistoricalCases } from '@shared/models';
import { IChartsLiterals } from '@ui/charts';

import { AbstractDashboardService } from '../service/abstract-dashboard.service';
import { IDashboardViewData, IDashboardCard } from '../models/dashboard.model';

@Component({
	selector: 'covid-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

	private readonly _subscriptions: Subscription[] = [];
	readonly countUpOptions = {
		separator: '.',
		decimal: ',',
		duration: 1
	};

	globalCases$: Observable<IGlobalCases>;
	historicalCases$: Observable<HistoricalCases>;

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
}
