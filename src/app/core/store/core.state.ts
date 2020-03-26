export const featureStoreName = 'Core';

export enum ECoreActions {
	SET_LANG = 'SET_LANG'
}

export interface ICoreStore {
	i18n?: {
		currentLang: string;
	};
}
