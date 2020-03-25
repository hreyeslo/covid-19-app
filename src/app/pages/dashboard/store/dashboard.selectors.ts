import { createSelector } from '@ngrx/store';
import { IAppStore } from '@shared/models';

import { featureStoreName, IDashboardStore } from './dashboard.state';

export interface IFeatureAppStore extends IAppStore {
	[featureStoreName]: IDashboardStore;
}

export const selectFinderStore = (state: IFeatureAppStore) => state[featureStoreName];

export const selectDashboard = createSelector(selectFinderStore, (state: IDashboardStore): IDashboardStore => state);
