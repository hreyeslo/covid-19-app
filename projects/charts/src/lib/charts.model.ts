import { HistoricalCases, IGlobalCases, ICountryCases } from '@shared/models';

export interface IChartsLiterals {
	totalCases: string;
	totalDeath: string;
}

export interface IChartData {
	literals: IChartsLiterals;
	historical: HistoricalCases;
	global?: IGlobalCases;
	country?: ICountryCases;
}
