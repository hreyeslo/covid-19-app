export const totalCasesChart = {
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
	colors: ['#1B998B'],
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

export const totalDeathsChart = {
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
	colors: ['#EA3546'],
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
