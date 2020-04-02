export const chartConfig = {
	series: [
		{
			name: 'Nuevos casos',
			type: 'area',
			data: []
		},
		{
			name: 'Nuevas recuperaciones',
			type: 'area',
			data: []
		},
		{
			name: 'Nuevas Muertes',
			type: 'area',
			data: []
		}
	],
	chart: {
		height: '450px',
		type: 'line',
		stacked: false,
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
		enabled: true,
		formatter: (value) => `${value}%`
	},
	stroke: {
		width: [2, 4, 4],
		curve: 'smooth'
	},
	colors: ['#008FFB', '#1B998B', '#EA3546'],
	fill: {
		opacity: [0.25, 0.25, 0.25],
		gradient: {
			inverseColors: false,
			shade: 'light',
			type: 'vertical',
			opacityFrom: 0.85,
			opacityTo: 0.55,
			stops: [0, 100, 100, 100]
		}
	},
	xaxis: {
		categories: [],
		labels: {
			show: true,
			rotate: -65,
			rotateAlways: false,
			hideOverlappingLabels: true,
			showDuplicates: false,
			trim: true
		},
		crosshairs: {
			show: true
		},
		axisTicks: {
			show: true
		},
		tooltip: {
			enabled: true
		}
	},
	yaxis: {
		axisBorder: {
			show: true,
			offsetX: -5,
			offsetY: 0
		},
		tooltip: {
			enabled: false
		},
		labels: {
			show: true,
			align: 'right',
			offsetX: -15,
			offsetY: 0,
			formatter: (label) => `${label}%`
		},
		crosshairs: {
			show: true
		},
		axisTicks: {
			show: true
		}
	},
	tooltip: {
		fixed: {
			enabled: true,
			position: 'topRight',
			offsetY: 10,
			offsetX: 0
		},
		y: {
			formatter: (value) => value === 0 ? `${value}%` : `+${value}%`
		}
	},
	legend: {
		position: 'top',
		horizontalAlign: 'center',
		offsetX: 0,
		offsetY: 0
	}
};
