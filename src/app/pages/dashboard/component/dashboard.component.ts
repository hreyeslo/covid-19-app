import { Subscription, Observable, of } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';

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

	literals$: Observable<IChartsLiterals>;
	globalCases$: Observable<IGlobalCases>;
	historicalCases$: Observable<HistoricalCases>;

	viewData$: Observable<IDashboardViewData>;
	lastUpdate$: Observable<number>;

	constructor(
		private _dashboardService: AbstractDashboardService,
		private _tranlsateService: TranslateService,
		private _store: Store
	) {}

	ngOnInit(): void {
		this.globalCases$ = this._store.pipe(select(selectGlobalCases));
		this.historicalCases$ = this._store.pipe(select(selectHistoricalCases));
		this.lastUpdate$ = this._store.pipe(select(selectLastUpdate));
		this.literals$ = this._tranlsateService.get('charts');
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
