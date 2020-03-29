import { createSelector } from '@ngrx/store';
import { IAppStore } from '@shared/models';

import { featureStoreName, IDashboardStore } from './dashboard.state';

export interface IFeatureAppStore extends IAppStore {
	[featureStoreName]: IDashboardStore;
}

export const selectDetailsStore = (state: IFeatureAppStore) => state[featureStoreName];

export const selectDashboard = createSelector(selectDetailsStore, (state: IDashboardStore): IDashboardStore => state);
