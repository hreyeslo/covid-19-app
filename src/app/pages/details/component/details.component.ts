import { Subscription, Subject, forkJoin, Observable, interval, BehaviorSubject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { startWith, switchMap, first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { IHistoricalCases, ICountryCases } from '@shared/models';
import { selectLastUpdate } from '@shared/store';
import { UtilsService } from '@shared/services';
import { IChartsLiterals } from '@ui/charts';

import { AbstractDetailsService } from '../service/abstract-details.service';
import { environment } from '../../../../environments/environment';
import { AppTabsAnimations } from '../../../app-animations';
import { IDetails } from '../models/details.model';

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

	historical$: BehaviorSubject<IHistoricalCases | object> = new BehaviorSubject<IHistoricalCases | object>({});
	country$: BehaviorSubject<ICountryCases | object> = new BehaviorSubject<ICountryCases | object>({});
	literals$: BehaviorSubject<IChartsLiterals | object> = new BehaviorSubject<IChartsLiterals | object>({});

	viewData$: Subject<IDetails> = new Subject<IDetails>();
	lastUpdate$: Observable<number>;
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
		this._setChartsLiterals();
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
				this.historical$.next([historical]);
				this.country$.next(cases);
				this.viewData$.next({
					cases,
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
