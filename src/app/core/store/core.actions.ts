import { createAction } from '@ngrx/store';

import { ECoreActions } from './core.state';

export const setLang = createAction(ECoreActions.SET_LANG, (payload: string) => ({payload}));
