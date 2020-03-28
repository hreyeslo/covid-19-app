import { ICountryCases, IHistoricalCases } from '@shared/models';

export interface IDetails {
	cases: ICountryCases;
	historical: IHistoricalCases;
}
