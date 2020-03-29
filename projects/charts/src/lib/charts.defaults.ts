export const defaultChartLinear = {
	series: [],
	chart: {
		height: 350,
		type: 'line',
		zoom: {
			enabled: false
		},
		animations: {
			enabled: true,
			easing: 'easeinout',
			speed: 1000,
			animateGradually: {
				enabled: true,
				delay: 150
			},
			dynamicAnimation: {
				enabled: true,
				speed: 350
			}
		},
		toolbar: {
			show: false
		}
	},
	dataLabels: {
		enabled: false
	},
	stroke: {
		curve: 'straight'
	},
	title: {
		text: '',
		align: 'left'
	},
	grid: {
		row: {
			colors: ['#f3f3f3', 'transparent'],
			opacity: 0.5
		}
	},
	xaxis: {
		categories: []
	}
};
