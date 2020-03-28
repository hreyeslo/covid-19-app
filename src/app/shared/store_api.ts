export { getGlobalCases, getHistoricalCases, getCountryCases } from './store/shared.actions';
export { ISharedStore, ESharedActions } from './store/shared.state';
export {
	selectLayout,
	selectIsMobileLayout,
	selectIsTabletLayout,
	selectIsMobileTabletLayout,
	selectIsDesktopLayout,
	selectGlobalCases,
	selectGlobalCountries
} from './store/shared.selectors';
