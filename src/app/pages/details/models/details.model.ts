import { ICountryCases } from '@shared/models';

export interface IDetails {
	cases: ICountryCases;
	cards: IDetailsCard[];
}

export interface IDetailsCard {
	title: string;
	value: number;
	increment: number;
}

export interface IDetailsDailyIncrements {
	cases: number;
	deaths: number;
	recovered: number;
	active: number;
}
