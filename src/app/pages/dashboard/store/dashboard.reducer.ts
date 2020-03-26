import { createReducer, on, Action } from '@ngrx/store';

import { dashboardInit } from './dashboard.actions';
import { IDashboardStore } from './dashboard.state';

export const initialState: IDashboardStore = {};

const _dashboardReducer = createReducer(initialState,
	on(dashboardInit, (state, {payload}) => ({...state, dashboard: payload}))
);

export function dashboardReducer(state: IDashboardStore | undefined, action: Action) {
	return _dashboardReducer(state, action as any);
}
