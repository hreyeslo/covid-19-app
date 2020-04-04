export interface IDashboardViewData {
	cards: IDashboardCard[];
}

export interface IDashboardCard {
	title: string;
	value: number;
	increment: number;
}

export interface IDashboardDailyIncrements {
	cases: number;
	deaths: number;
	recovered: number;
	active: number;
}
