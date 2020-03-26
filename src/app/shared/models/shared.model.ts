export interface IAppStore {
	[key: string]: any;
}

export interface IGlobalCases {
	cases: number;
	deaths: number;
	recovered: number;
	updated: number;
}

export interface ICountryInfo {
	_id: number;
	lat: number;
	long: number;
	flag: string;
	iso3: string;
	iso2: string;
}

export interface ICountryCases {
	country: string;
	countryInfo: ICountryInfo;
	cases: number;
	todayCases: number;
	deaths: number;
	todayDeaths: number;
	recovered: number;
	active: number;
	critical: number;
	casesPerOneMillion: number;
	deathsPerOneMillion: number;
}

export type CountryCases = ICountryCases[];

export interface IHistoricalDateCase {
	[date: string]: number;
}

export interface IHistoricalTimeline {
	cases: IHistoricalDateCase;
	deaths: IHistoricalDateCase;
}

export interface IHistoricalCases {
	country: string;
	province?: any;
	timeline: IHistoricalTimeline;
}

export type HistoricalCases = IHistoricalCases[];
