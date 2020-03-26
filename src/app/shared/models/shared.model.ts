export interface IAppStore {
	[key: string]: any;
}

export interface IGlobalCases {
	cases: number;
	deaths: number;
	recovered: number;
	updated: number;
}
