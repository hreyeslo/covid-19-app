import { createReducer, on, Action } from '@ngrx/store';

import { detailsInit } from './details.actions';
import { IDetailsStore } from './details.state';

export const initialState: IDetailsStore = {};

const _detailsReducer = createReducer(initialState,
	on(detailsInit, (state, {payload}) => ({...state, dashboard: payload}))
);

export function detailsReducer(state: IDetailsStore | undefined, action: Action) {
	return _detailsReducer(state, action as any);
}
