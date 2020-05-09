export interface IAppStore {
	[key: string]: any;
}

export interface IGlobalCases {
	cases: number;
	deaths: number;
	recovered: number;
	updated: number;
	active: number;
	affectedCountries: number;
	todayCases: number;
	todayDeaths: number;
	critical: number;
	casesPerOneMillion: number;
	deathsPerOneMillion: number;
	tests: number;
	testsPerOneMillion: number;
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
	updated: number;
	tests: number;
	testsPerOneMillion: number;
	continent: string;
}

export type CountryCases = ICountryCases[];

export interface IHistoricalDateCase {
	[date: string]: number;
}

export interface IHistoricalTimeline {
	cases: IHistoricalDateCase;
	deaths: IHistoricalDateCase;
	recovered: IHistoricalDateCase;
}

export interface IHistoricalCases {
	country: string;
	province?: any[];
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

export interface ISharedBasicViewData {
	cases: number;
	deaths: number;
	recovered: number;
	newCasesPercent: number;
	newDeathsPercent: number;
	newRecoveredPercent: number;
	newActivePercent: number;
	incrementActiveCases: number;
}

export interface ISharedTodayData {
	historical: IHistoricalTimeline;
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

export interface ISharedTomorrowData {
	cases: number;
	deaths: number;
	recovered: number;
	improving: boolean;
	propagationIndex: number;
}

export interface ILatestData {
	lastTotalCases: number;
	lastTotalDeaths: number;
	lastTotalRecovered: number;
	lastTotalActive: number;
}

export interface ISharedDetailsCard {
	title: string;
	value: number;
	increment: number;
	absIncrement: number;
	percent: number;
}

export type SharedDetailsCards = ISharedDetailsCard[];
