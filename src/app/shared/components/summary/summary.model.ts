import { ICountryCases, SharedDetailsCards, IGlobalCases } from '@shared/models';

export interface ISummaryViewData {
	cases: ICountryCases | IGlobalCases;
	cards: SharedDetailsCards;
}
