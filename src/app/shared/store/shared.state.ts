import { IGlobalCases, HistoricalCases, CountryCases } from '../models/shared.model';

export const featureStoreName = 'Shared';

export enum ESharedActions {
	GET_GLOBAL_CASES = '[CORE] - Getting global cases',
	GET_HISTORICAL_CASES = '[CORE] - Getting historical cases',
	GET_COUNTRIES_CASES = '[CORE] - Getting countries cases'
}

export enum EPrivateSharedActions {
	GET_GLOBAL_CASES_SUCCESSFULLY = '[CORE] - Getting global cases successfully',
	GET_GLOBAL_CASES_ERROR = '[CORE] - Error getting global cases',
	GET_HISTORICAL_CASES_SUCCESSFULLY = '[CORE] - Getting historical cases successfully',
	GET_HISTORICAL_CASES_ERROR = '[CORE] - Error getting historical cases',
	GET_COUNTRIES_CASES_SUCCESSFULLY = '[CORE] - Getting countries cases successfully',
	GET_COUNTRIES_CASES_ERROR = '[CORE] - Error getting countries cases'
}

export interface ISharedStore {
	cases: {
		global: IGlobalCases;
		historical: HistoricalCases;
		countries: CountryCases;
	};
}
