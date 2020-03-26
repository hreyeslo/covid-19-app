import { createSelector } from '@ngrx/store';
import { IAppStore } from '@shared/models';

import { featureStoreName, IDetailsStore } from './details.state';

export interface IFeatureAppStore extends IAppStore {
	[featureStoreName]: IDetailsStore;
}

export const selectDetailsStore = (state: IFeatureAppStore) => state[featureStoreName];

export const selectDetails = createSelector(selectDetailsStore, (state: IDetailsStore): IDetailsStore => state);
