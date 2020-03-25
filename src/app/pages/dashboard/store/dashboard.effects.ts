import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { AbstractDashboardService } from '../service/abstract-dashboard.service';

@Injectable()
export class DashboardEffects {

	// loadBreeds$ = createEffect(() =>
	// 	this._actions$.pipe(
	// 		ofType(EFinderActions.LOAD_BREEDS),
	// 		switchMap(() => this._finderService.loadBreeds()
	// 			.pipe(
	// 				map(breeds => ({type: EFinderActions.LOAD_BREEDS_SUCCESS, payload: breeds})),
	// 				catchError(() => of({type: EFinderActions.LOAD_BREEDS_ERROR}))
	// 			)
	// 		)
	// 	)
	// );

	constructor(
		private _actions$: Actions,
		private _dashboardService: AbstractDashboardService
	) {}
}
