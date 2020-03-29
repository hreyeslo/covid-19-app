export const featureStoreName = 'Core';

export enum ECoreActions {
	SET_LANG = '[CORE] - Setting language',
}

export interface ICoreStore {
	i18n: {
		currentLang?: string;
	};
}
