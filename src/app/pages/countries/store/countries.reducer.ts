import { createReducer, on, Action } from '@ngrx/store';

import { countriesInit } from './countries.actions';
import { ICountriesStore } from './countries.state';

export const initialState: ICountriesStore = {};

const _countriesReducer = createReducer(initialState,
	on(countriesInit, (state, {payload}) => ({...state, dashboard: payload}))
);

export function countriesReducer(state: ICountriesStore | undefined, action: Action) {
	return _countriesReducer(state, action as any);
}
