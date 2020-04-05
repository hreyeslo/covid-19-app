import { IGlobalCases } from '@shared/models';

export interface IDashboardViewData {
	cards: IDashboardCard[];
	global: IGlobalCases;
}

export interface IDashboardCard {
	title: string;
	value: number;
	increment: number;
	absIncrement: number;
	percent: number;
}

export interface IDashboardDailyIncrements {
	cases: number;
	deaths: number;
	recovered: number;
	active: number;
}

export interface IDashboardTodayData {
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

export interface IDashboardTomorrowData {
	cases: number;
	deaths: number;
	recovered: number;
	improving: boolean;
}
