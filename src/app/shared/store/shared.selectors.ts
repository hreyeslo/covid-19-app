import { createSelector } from '@ngrx/store';

import { IAppStore, IGlobalCases } from '../models/shared.model';
import { featureStoreName, ISharedStore } from './shared.state';

export interface ICoreAppStore extends IAppStore {
	[featureStoreName]: ISharedStore;
}

export const selectCoreStore = (state: ICoreAppStore) => state[featureStoreName];

export const selectGlobalCases = createSelector(
	selectCoreStore,
	(state: ISharedStore): IGlobalCases => state?.cases?.global
);
