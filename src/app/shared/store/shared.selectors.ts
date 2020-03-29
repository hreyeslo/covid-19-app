import { createSelector } from '@ngrx/store';

import {
	IAppStore,
	IGlobalCases,
	ILayout,
	ELayoutName,
	CountryCases, HistoricalCases
} from '../models/shared.model';
import { featureStoreName, ISharedStore } from './shared.state';

export interface ICoreAppStore extends IAppStore {
	[featureStoreName]: ISharedStore;
}

export const selectCoreStore = (state: ICoreAppStore) => state[featureStoreName];

export const selectLayout = createSelector(
	selectCoreStore,
	(state: ISharedStore): ILayout => state?.layout
);

export const selectIsMobileLayout = createSelector(
	selectCoreStore,
	(state: ISharedStore): boolean => {
		const layout = state?.layout;
		return (layout.type === ELayoutName.mobile);
	}
);

export const selectIsTabletLayout = createSelector(
	selectCoreStore,
	(state: ISharedStore): boolean => {
		const layout = state?.layout;
		return (layout.type === ELayoutName.tablet);
	}
);

export const selectIsMobileTabletLayout = createSelector(
	selectCoreStore,
	(state: ISharedStore): boolean => {
		const layout = state?.layout;
		return (layout.type === ELayoutName.mobile || layout.type === ELayoutName.tablet);
	}
);

export const selectIsDesktopLayout = createSelector(
	selectCoreStore,
	(state: ISharedStore): boolean => {
		const layout = state?.layout;
		return (layout.type === ELayoutName.laptop || layout.type === ELayoutName.desktop);
	}
);

export const selectLastUpdate = createSelector(
	selectCoreStore,
	(state: ISharedStore): number => state?.cases?.global?.updated
);

export const selectGlobalCases = createSelector(
	selectCoreStore,
	(state: ISharedStore): IGlobalCases => state?.cases?.global
);

export const selectHistoricalCases = createSelector(
	selectCoreStore,
	(state: ISharedStore): HistoricalCases => state?.cases?.historical
);

export const selectGlobalCountries = createSelector(
	selectCoreStore,
	(state: ISharedStore): CountryCases => state?.cases?.countries
);
