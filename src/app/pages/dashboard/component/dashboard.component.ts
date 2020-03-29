import { Subscription, Observable, combineLatest, of } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';

import { selectGlobalCases, selectLastUpdate } from '@shared/store';
import { IGlobalCases } from '@shared/models';

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
		decimal: ','
	};

	_globalCases$: Observable<IGlobalCases>;

	viewData$: Observable<IDashboardViewData>;
	lastUpdate$: Observable<number>;

	constructor(
		private _dashboardService: AbstractDashboardService,
		private _tranlsateService: TranslateService,
		private _store: Store
	) {}

	ngOnInit(): void {
		this._globalCases$ = this._store.pipe(select(selectGlobalCases));
		this.lastUpdate$ = this._store.pipe(select(selectLastUpdate));
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
		this.viewData$ = combineLatest([
			this._globalCases$
		]).pipe(switchMap((data: [IGlobalCases]) => {
				return of({
					cards: this._getCards(data[0])
				});
			})
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
