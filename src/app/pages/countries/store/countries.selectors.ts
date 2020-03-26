import { createSelector } from '@ngrx/store';
import { IAppStore } from '@shared/models';

import { featureStoreName, ICountriesStore } from './countries.state';

export interface IFeatureAppStore extends IAppStore {
	[featureStoreName]: ICountriesStore;
}

export const selectDetailsStore = (state: IFeatureAppStore) => state[featureStoreName];

export const selectCountries = createSelector(selectDetailsStore, (state: ICountriesStore): ICountriesStore => state);
