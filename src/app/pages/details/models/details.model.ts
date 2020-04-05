import { ICountryCases } from '@shared/models';

export interface IDetails {
	cases: ICountryCases;
	cards: IDetailsCard[];
}

export interface IDetailsCard {
	title: string;
	value: number;
	increment: number;
	absIncrement: number;
	percent: number;
}

export interface IDetailsDailyIncrements {
	cases: number;
	deaths: number;
	recovered: number;
	active: number;
}

export interface IDetailsTodayData {
	active: number;
	activePercent: number;
	closed: number;
	closedPercent: number;
	moderate: number;
	moderatePercent: number;
	critical: number;
	criticalPercent: number;
	recovered: number;
	recoveredPercent: number;
	deaths: number;
	deathsPercent: number;
	propagationIndex: number;
	deathsIndex: number;
	recoveredIndex: number;
}

export interface IDetailsTomorrowData {
	cases: number;
	deaths: number;
	recovered: number;
	improving: boolean;
}
