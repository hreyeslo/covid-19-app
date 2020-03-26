import { createAction, props } from '@ngrx/store';

import { ECountriesActions } from './countries.state';

export const countriesInit = createAction(ECountriesActions.INIT, props<{payload: any}>());

