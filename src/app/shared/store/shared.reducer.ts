import { createReducer, on, Action } from '@ngrx/store';

import { ISharedStore } from './shared.state';
import {
	getGlobalCasesSuccess,
	getGlobalCasesError,
	getHistoricalCasesSuccess,
	getHistoricalCasesError,
	getCountriesCasesSuccess,
	getCountriesCasesError
} from './shared.actions';

export const initialState: ISharedStore = {
	cases: {
		global: {
			cases: 0,
			deaths: 0,
			recovered: 0,
			updated: Number(new Date().toString())
		},
		historical: [],
		countries: []
	}
};

const _sharedReducer = createReducer(initialState,
	on(getGlobalCasesSuccess, (state, {global}) => ({...state, cases: {...state?.cases, global}})),
	on(getGlobalCasesError, (state) => state),
	on(getHistoricalCasesSuccess, (state, {historical}) => ({
		...state, cases: {...state?.cases, historical}
	})),
	on(getHistoricalCasesError, (state) => state),
	on(getCountriesCasesSuccess, (state, {countries}) => ({
		...state, cases: {...state?.cases, countries}
	})),
	on(getCountriesCasesError, (state) => state)
);

export function sharedReducer(state: ISharedStore | undefined, action: Action) {
	return _sharedReducer(state, action);
}
