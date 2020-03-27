import { switchMap, map, catchError, startWith } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, interval } from 'rxjs';

import { AbstractUtilsService } from '../services/utils/abstract-utils.service';
import { ESharedActions, EPrivateSharedActions } from './shared.state';
import { environment } from '../../../environments/environment';

@Injectable()
export class SharedEffects {

	getGlobalCases$ = createEffect(() =>
		this._actions$.pipe(
			ofType(ESharedActions.GET_GLOBAL_CASES),
			switchMap(() => interval(environment.pooling).pipe(
				startWith(0),
				switchMap(() => this._utilsService.getGlobalCases()
					.pipe(
						map(cases => ({
							type: EPrivateSharedActions.GET_GLOBAL_CASES_SUCCESSFULLY,
							global: cases
						})),
						catchError(() => of({type: EPrivateSharedActions.GET_GLOBAL_CASES_ERROR}))
					)
				))
			)
		)
	);

	getHistoricalCases$ = createEffect(() =>
		this._actions$.pipe(
			ofType(ESharedActions.GET_HISTORICAL_CASES),
			switchMap(() => interval(environment.pooling).pipe(
				startWith(0),
				switchMap(() => this._utilsService.getGlobalHistoricalCases()
					.pipe(
						map(cases => ({
							type: EPrivateSharedActions.GET_HISTORICAL_CASES_SUCCESSFULLY,
							historical: cases
						})),
						catchError(() => of({type: EPrivateSharedActions.GET_HISTORICAL_CASES_ERROR}))
					)
				))
			)
		)
	);

	getCountriesCases$ = createEffect(() =>
		this._actions$.pipe(
			ofType(ESharedActions.GET_COUNTRIES_CASES),
			switchMap(() => interval(environment.pooling).pipe(
				startWith(0),
				switchMap(() => this._utilsService.getAllCountriesCases()
					.pipe(
						map(cases => ({
							type: EPrivateSharedActions.GET_COUNTRIES_CASES_SUCCESSFULLY,
							countries: cases
						})),
						catchError(() => of({type: EPrivateSharedActions.GET_COUNTRIES_CASES_ERROR}))
					)
				))
			)
		)
	);

	constructor(private _actions$: Actions, private _utilsService: AbstractUtilsService) {}
}
