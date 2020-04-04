import { Subscription, forkJoin, Observable, interval, BehaviorSubject, of } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { startWith, switchMap, first } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';

import { IHistoricalCases, ICountryCases, IHistoricalTimeline } from '@shared/models';
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

	viewData$: Observable<IDetails>;
	lastUpdate$: Observable<number>;

	historical$: BehaviorSubject<IHistoricalTimeline | object> = new BehaviorSubject<IHistoricalTimeline | object>({});
	literals$: BehaviorSubject<IChartsLiterals | object> = new BehaviorSubject<IChartsLiterals | object>({});
	country$: BehaviorSubject<ICountryCases | object> = new BehaviorSubject<ICountryCases | object>({});

	constructor(
		private _dashboardService: AbstractDetailsService,
		private _tranlsateService: TranslateService,
		private _store: Store,
		private _route: ActivatedRoute,
		private _utilsService: UtilsService
	) {}

	ngOnInit(): void {
		this._subscriptions.push(
			this._route.params.subscribe(params => this._getViewInfo(params?.country))
		);
		this.lastUpdate$ = this._store.pipe(select(selectLastUpdate));
		this._setChartsLiterals();
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
		this.viewData$ = interval(environment.pooling).pipe(
			startWith(0),
			switchMap(() => forkJoin([
				this._utilsService.getCountryCases(country),
				this._utilsService.getCountryHistoricalCases(country)
			]))
		).pipe(switchMap((response: [ICountryCases, IHistoricalCases]) => {
			const [countryCases, historical] = response;
			const cases = this._utilsService.calcIncrement(countryCases, historical?.timeline, 'cases');
			const deaths = this._utilsService.calcIncrement(countryCases, historical?.timeline, 'deaths');
			const recovered = this._utilsService.calcIncrement(countryCases, historical?.timeline, 'recovered');
			this.historical$.next(historical?.timeline);
			this.country$.next(countryCases);
			return of({
				cases: countryCases,
				cards: [
					{
						title: 'cases', value: countryCases?.cases, increment: cases || 0,
						absIncrement: Math.abs(cases || 0)
					},
					{
						title: 'active', value: countryCases?.active,
						increment: cases - (recovered + deaths) || 0,
						absIncrement: Math.abs(cases - (recovered + deaths) || 0)
					},
					{
						title: 'deaths', value: countryCases?.deaths, increment: deaths || 0,
						absIncrement: Math.abs(deaths || 0)
					},
					{
						title: 'recovered', value: countryCases?.recovered, increment: recovered || 0,
						absIncrement: Math.abs(recovered || 0)
					}
				]
			});
		}));
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
