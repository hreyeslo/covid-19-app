import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { AbstractDetailsService } from '../service/abstract-details.service';

@Injectable()
export class DetailsEffects {

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
		private _detailsService: AbstractDetailsService
	) {}
}
