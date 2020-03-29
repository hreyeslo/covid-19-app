import { IGlobalCases, HistoricalCases } from '@shared/models';

export interface IDashboardViewData {
	cards: IDashboardCard[];
	global: IGlobalCases;
	historical: HistoricalCases;
}

export interface IDashboardCard {
	title: string;
	value: number;
}
