import {
	Subscription,
	Subject,
	forkJoin,
	Observable,
	interval,
	BehaviorSubject,
	combineLatest,
	of
} from 'rxjs';
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
import { IDetails, IDetailsDailyIncrements } from '../models/details.model';
import { get } from 'lodash';

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
	dailyIncrements$: Observable<IDetailsDailyIncrements>;

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
		this._getDailyIncrements();
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
				this.historical$.next(historical?.timeline);
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

	_getDailyIncrements() {
		this.dailyIncrements$ = combineLatest([
			this.country$,
			this.historical$
		]).pipe(switchMap((data: [ICountryCases, IHistoricalCases]) => {
			const [country, historical] = data;
			const cases = this._calcIncrement(country, historical, 'cases');
			const deaths = this._calcIncrement(country, historical, 'deaths');
			const recovered = this._calcIncrement(country, historical, 'recovered');
			return of({
				cases, deaths, recovered,
				active: cases - (recovered + deaths)
			});
		}));
	}

	_calcIncrement(global: ICountryCases, historical: IHistoricalCases, key: string): number {
		const result = get(global, [key], 0) - get(historical, [
			key,
			Object.keys(get(historical, [key], {})).pop() || ''
		], 0);
		return result < 0 ? 0 : result;
	}

}
