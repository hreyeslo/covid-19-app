import { Subscription, forkJoin, Observable, interval, BehaviorSubject, of } from 'rxjs';
import { startWith, switchMap, tap, first } from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { isEmpty, omit } from 'lodash';

import {
	IHistoricalCases,
	ICountryCases,
	IHistoricalTimeline,
	ISharedTodayData,
	ISharedTomorrowData,
	ISummaryViewData
} from '@shared/models';
import { selectLastUpdate } from '@shared/store';
import { UtilsService } from '@shared/services';
import { IChartsLiterals } from '@ui/charts';

import { AbstractDetailsService } from '../service/abstract-details.service';
import { environment } from '../../../../environments/environment';
import { AppTabsAnimations } from '../../../app-animations';

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

	lastUpdate$: Observable<number>;
	viewData$: Observable<ISummaryViewData>;

	historical$: BehaviorSubject<IHistoricalTimeline | object> = new BehaviorSubject<IHistoricalTimeline | object>({});
	literals$: BehaviorSubject<IChartsLiterals | object> = new BehaviorSubject<IChartsLiterals | object>({});
	country$: BehaviorSubject<ICountryCases | object> = new BehaviorSubject<ICountryCases | object>({});
	tests$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	todayData$: BehaviorSubject<Partial<ISharedTodayData>> = new BehaviorSubject<Partial<ISharedTodayData>>(null);
	tomorrowData$: BehaviorSubject<ISharedTomorrowData> = new BehaviorSubject<ISharedTomorrowData>(null);

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

	_getViewInfo(country: string) {
		this.viewData$ = interval(environment.pooling).pipe(
			startWith(0),
			switchMap(() => forkJoin([
				this._utilsService.getCountryCases(country),
				this._utilsService.getCountryHistoricalCases(country)
			]))
		).pipe(switchMap((response: [ICountryCases, IHistoricalCases]) => {
			const [countryCases, historical] = response;
			this.historical$.next(historical?.timeline);
			this.country$.next(countryCases);
			this.tests$.next(countryCases?.tests || 0);
			return of({
				cases: countryCases,
				cards: this._utilsService.getViewData(countryCases, historical?.timeline)
			});
		}), tap((data: ISummaryViewData) => this._setTodayData(data)));
	}

	_setTodayData(data: ISummaryViewData): void {
		this.historical$.pipe(
			first(historical => !isEmpty(historical)),
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
