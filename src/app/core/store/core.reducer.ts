import { createReducer, on, Action } from '@ngrx/store';

import { ICoreStore } from './core.state';
import { setLang } from './core.actions';

export const initialState: ICoreStore = {
	i18n: {
		currentLang: undefined
	}
};

const _coreReducer = createReducer(initialState,
	on(setLang, (state, {lang}) => ({
		...state,
		i18n: {
			...state?.i18n,
			currentLang: lang
		}
	}))
);

export function coreReducer(state: ICoreStore | undefined, action: Action) {
	return _coreReducer(state, action as any);
}
