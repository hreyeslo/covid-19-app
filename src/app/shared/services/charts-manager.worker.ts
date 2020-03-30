/// <reference lib="webworker" />

import { get, each } from 'lodash';

addEventListener('message', ({data}) => {
	switch (data?.type) {
		case 'TOTAL_CASES':
			return postMessage({
				...data,
				charts: calcTotalCounts(data?.charts, 'cases')
			});
		case 'TOTAL_DEATHS':
			return postMessage({
				...data,
				charts: calcTotalCounts(data?.charts, 'deaths')
			});
		default:
			return;
	}
});

// Methods

function calcTotalCounts(chartData: any, key: any) {
	const countries: any[] = get(chartData, 'historical', []);
	return countries.reduce((acc: any, country: any) => {
		const data = country?.timeline[key] || {};
		each(data, (value, date) => {
			if (countries.length && value > 0) {
				acc[date] = acc[date] ? acc[date] + value : value;
			} else if (countries.length > 1) {
				acc[date] = acc[date] ? acc[date] + value : value;
			}
		});
		return acc;
	}, {});
}
