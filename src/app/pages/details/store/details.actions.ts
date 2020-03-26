import { createAction, props } from '@ngrx/store';

import { EDetailsActions } from './details.state';

export const detailsInit = createAction(EDetailsActions.INIT, props<{payload: any}>());

