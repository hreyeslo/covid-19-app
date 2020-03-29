import { ICountryCases, HistoricalCases } from '@shared/models';

export interface IDetails {
	cases: ICountryCases;
	historical: HistoricalCases;
	cards: IDetailsCard[];
}

export interface IDetailsCard {
	title: string;
	value: number;
}
