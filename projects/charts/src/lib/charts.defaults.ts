import { defaultChart } from './charts.constants';

export const defaultChartLinear = {
	series: [],
	chart: {
		...defaultChart.chart,
		height: 350,
		type: 'bar'
	},
	title: {
		text: 'My First Angular Chart'
	},
	xaxis: {
		categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
	}
};
