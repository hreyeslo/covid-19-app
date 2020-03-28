import { IGlobalCases, HistoricalCases, CountryCases, ILayout } from '../models/shared.model';

export const featureStoreName = 'Shared';

export enum ESharedActions {
	GET_GLOBAL_CASES = '[SHARED] - Getting global cases',
	GET_HISTORICAL_CASES = '[SHARED] - Getting historical cases',
	GET_COUNTRIES_CASES = '[SHARED] - Getting countries cases'
}

export enum EPrivateSharedActions {
	SET_LAYOUT = '[SHARED] - Setting current layout',
	GET_GLOBAL_CASES_SUCCESSFULLY = '[SHARED] - Getting global cases successfully',
	GET_GLOBAL_CASES_ERROR = '[SHARED] - Error getting global cases',
	GET_HISTORICAL_CASES_SUCCESSFULLY = '[SHARED] - Getting historical cases successfully',
	GET_HISTORICAL_CASES_ERROR = '[SHARED] - Error getting historical cases',
	GET_COUNTRIES_CASES_SUCCESSFULLY = '[SHARED] - Getting countries cases successfully',
	GET_COUNTRIES_CASES_ERROR = '[SHARED] - Error getting countries cases'
}

export interface ISharedStore {
	layout: ILayout;
	cases: {
		global: IGlobalCases;
		historical: HistoricalCases;
		countries: CountryCases;
	};
}
