import { Subscription, Subject, forkJoin, Observable, interval } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { startWith, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { IHistoricalCases, ICountryCases } from '@shared/models';
import { selectLastUpdate } from '@shared/store';
import { UtilsService } from '@shared/services';
import { IChartsLiterals } from '@ui/charts';

import { AbstractDetailsService } from '../service/abstract-details.service';
import { environment } from '../../../../environments/environment';
import { IDetails } from '../models/details.model';

@Component({
	selector: 'covid-dashboard',
	templateUrl: './details.component.html',
	styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

	private readonly _subscriptions: Subscription[] = [];
	readonly countUpOptions = {
		separator: '.',
		decimal: ',',
		duration: 1
	};

	viewData$: Subject<IDetails> = new Subject<IDetails>();
	lastUpdate$: Observable<number>;
	chartLiterals$: Observable<IChartsLiterals>;
	tabSelected = 0;

	constructor(
		private _dashboardService: AbstractDetailsService,
		private _tranlsateService: TranslateService,
		private _store: Store,
		private _route: ActivatedRoute,
		private _utilsService: UtilsService
	) {}

	ngOnInit(): void {
		this.lastUpdate$ = this._store.pipe(select(selectLastUpdate));
		this.chartLiterals$ = this._tranlsateService.get('charts');
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
				this.viewData$.next({
					cases,
					historical: [historical],
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
}
