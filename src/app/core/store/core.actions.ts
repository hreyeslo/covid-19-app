import { createAction, props } from '@ngrx/store';

import { ECoreActions } from './core.state';

export const setLang = createAction(ECoreActions.SET_LANG, props<{lang: string}>());
