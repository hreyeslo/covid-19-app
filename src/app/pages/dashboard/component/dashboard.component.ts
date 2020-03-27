import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import { selectGlobalCases } from '@shared/store';
import { IGlobalCases } from '@shared/models';

import { AbstractDashboardService } from '../service/abstract-dashboard.service';

@Component({
	selector: 'covid-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

	private readonly _subscriptions: Subscription[] = [];

	data$: Observable<IGlobalCases>;

	constructor(
		private _dashboardService: AbstractDashboardService,
		private _tranlsateService: TranslateService,
		private _store: Store
	) {}

	ngOnInit(): void {
		this._loadLiterals();
		this.data$ = this._store.pipe(select(selectGlobalCases));
	}

	_loadLiterals() {
		// const literalsSubscription = this._tranlsateService.onLangChange
		// 	.pipe(switchMap(() => forkJoin([
		// 		this._tranlsateService.get('select'),
		// 		this._tranlsateService.get('photo')
		// 	])))
		// 	.subscribe(([selectLiterals, photoLiterals]) => {
		// 		this.selectLiterals$.next(selectLiterals);
		// 		this.photoLiterals$.next(photoLiterals);
		// 	});
		// this._subscriptions.push(literalsSubscription);
	}

	ngOnDestroy() {
		this._subscriptions.forEach(subscription => {
			if (subscription.unsubscribe) {
				subscription.unsubscribe();
			}
		});
	}
}
