import { createAction, props } from '@ngrx/store';

import { IGlobalCases, CountryCases, ILayout, IHistoricalTimeline } from '../models/shared.model';
import { ESharedActions, EPrivateSharedActions } from './shared.state';

// Public

export const getGlobalCases = createAction(ESharedActions.GET_GLOBAL_CASES);
export const getHistoricalCases = createAction(ESharedActions.GET_HISTORICAL_CASES);
export const getCountryCases = createAction(ESharedActions.GET_COUNTRIES_CASES);

// Private

export const setLayout = createAction(
	EPrivateSharedActions.SET_LAYOUT,
	props<{layout: ILayout}>()
);
export const getGlobalCasesSuccess = createAction(
	EPrivateSharedActions.GET_GLOBAL_CASES_SUCCESSFULLY,
	props<{global: IGlobalCases}>()
);
export const getGlobalCasesError = createAction(EPrivateSharedActions.GET_GLOBAL_CASES_ERROR);
export const getHistoricalCasesSuccess = createAction(
	EPrivateSharedActions.GET_HISTORICAL_CASES_SUCCESSFULLY,
	props<{historical: IHistoricalTimeline}>()
);
export const getHistoricalCasesError = createAction(EPrivateSharedActions.GET_HISTORICAL_CASES_ERROR);
export const getCountriesCasesSuccess = createAction(
	EPrivateSharedActions.GET_COUNTRIES_CASES_SUCCESSFULLY,
	props<{countries: CountryCases}>()
);
export const getCountriesCasesError = createAction(EPrivateSharedActions.GET_COUNTRIES_CASES_ERROR);
