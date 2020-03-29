import { Subscription, Observable, of, BehaviorSubject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { includes } from 'lodash';

import { selectGlobalCountries, selectLastUpdate } from '@shared/store';
import { CountryCases, ICountryCases } from '@shared/models';

import { AbstractCountriesService } from '../service/abstract-countries.service';

@Component({
	selector: 'covid-dashboard',
	templateUrl: './countries.component.html',
	styleUrls: ['./countries.component.scss']
})
export class CountriesComponent implements OnInit, OnDestroy {

	private readonly _subscriptions: Subscription[] = [];
	private readonly _maxItemsToShow = 20;
	readonly countUpOptions = {
		separator: '.',
		decimal: ','
	};

	_filter$: BehaviorSubject<string> = new BehaviorSubject<string>('');
	viewData$: Observable<CountryCases>;
	lastUpdate$: Observable<number>;
	filterValue: string;

	constructor(
		private _dashboardService: AbstractCountriesService,
		private _tranlsateService: TranslateService,
		private _store: Store,
		private _router: Router,
		private _route: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.viewData$ = this._filter$.pipe(switchMap(this._getCountriesByFilter.bind(this)));
		this.lastUpdate$ = this._store.pipe(select(selectLastUpdate));
	}

	ngOnDestroy() {
		this._subscriptions.forEach(subscription => {
			if (subscription.unsubscribe) {
				subscription.unsubscribe();
			}
		});
	}

	trackByIndex(index: number, element: ICountryCases): number {
		return element.countryInfo._id;
	}

	goToCountry(country: ICountryCases): void {
		this._router.navigate([country?.country?.toLowerCase()], {
			relativeTo: this._route
		});
	}

	filter(country: string) {
		this._filter$.next(country);
	}

	_getCountriesByFilter(filter: string): Observable<CountryCases> {
		return this._store.pipe(
			select(selectGlobalCountries),
			switchMap(countries => {
				return of(countries.filter(country => {
					if (!filter || filter === '') {
						return true;
					} else {
						return includes(country?.country.toLowerCase(), filter.toLowerCase());
					}
				}).slice(0, this._maxItemsToShow));
			})
		);
	}

}
