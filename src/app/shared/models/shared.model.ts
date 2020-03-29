export interface IAppStore {
	[key: string]: any;
}

export interface IGlobalCases {
	cases: number;
	deaths: number;
	recovered: number;
	updated: number;
	active: number;
}

export interface ICountryInfo {
	_id: number;
	lat: number;
	long: number;
	flag: string;
	iso3: string;
	iso2: string;
	position?: number;
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

export enum ELayoutName {
	mobile = 'mobile',
	tablet = 'tablet',
	laptop = 'laptop',
	desktop = 'desktop'
}

export enum ELayoutAlias {
	xs = 'xs',
	sm = 'sm',
	md = 'md',
	lg = 'lg',
	xl = 'xl'
}

export interface ILayout {
	type: ELayoutName;
	alias: ELayoutAlias;
}
