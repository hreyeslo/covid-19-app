import { ICountryCases, IHistoricalCases } from '@shared/models';

export interface IDetails {
	cases: ICountryCases;
	historical: IHistoricalCases;
	cards: IDetailsCard[];
}

export interface IDetailsCard {
	title: string;
	value: number;
}
