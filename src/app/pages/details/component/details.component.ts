import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject, forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';

import { IHistoricalCases, ICountryCases } from '@shared/models';
import { UtilsService } from '@shared/services';

import { AbstractDetailsService } from '../service/abstract-details.service';
import { IDetails } from '../models/details.model';

@Component({
	selector: 'covid-dashboard',
	templateUrl: './details.component.html',
	styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {

	private readonly _subscriptions: Subscription[] = [];

	viewData$: Subject<IDetails> = new Subject<IDetails>();

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
	}

	ngOnDestroy() {
		this._subscriptions.forEach(subscription => {
			if (subscription.unsubscribe) {
				subscription.unsubscribe();
			}
		});
	}

	_getViewInfo(country: string) {
		forkJoin([
			this._utilsService.getCountryCases(country),
			this._utilsService.getCountryHistoricalCases(country)
		]).subscribe((response: [ICountryCases, IHistoricalCases]) => {
			const [cases, historical] = response;
			this.viewData$.next({cases, historical});
		});
	}
}
