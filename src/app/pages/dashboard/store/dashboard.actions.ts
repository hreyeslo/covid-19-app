import { createAction, props } from '@ngrx/store';

import { EDashboardActions } from './dashboard.state';

export const dashboardInit = createAction(EDashboardActions.INIT, props<{payload: any}>());

