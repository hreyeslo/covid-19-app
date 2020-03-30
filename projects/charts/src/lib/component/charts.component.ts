import { Component, Input, OnChanges, SimpleChanges, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, Subscription } from 'rxjs';
import { format } from 'date-fns';
import { isEqual, merge } from 'lodash';

import { HistoricalCases, IGlobalCases, ICountryCases } from '@shared/models';

import { AbstractChartsService } from '../service/abstract-charts.service';
import { totalCasesChart, totalDeathsChart } from '../charts.defaults';
import { IChartsLiterals, IChartsData } from '../charts.model';
import { distinctUntilChanged, first } from 'rxjs/operators';

@Component({
	selector: 'covid-charts',
	templateUrl: './charts.component.html',
	styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnChanges, OnDestroy {

	private readonly _subscriptions: Subscription[] = [];
	private _literals: IChartsLiterals;
	private _chartsData: IChartsData;

	@Input() historical: Observable<HistoricalCases>;
	@Input() global: Observable<IGlobalCases>;
	@Input() country: Observable<ICountryCases>;
	@Input() literals: Observable<IChartsLiterals>;

	totalCasesChart$: BehaviorSubject<Partial<any>> = new BehaviorSubject<Partial<any>>(totalCasesChart);
	totalDeaths$: BehaviorSubject<Partial<any>> = new BehaviorSubject<Partial<any>>(totalDeathsChart);

	constructor(private _chartsService: AbstractChartsService) {}

	ngOnInit() {
		this._updateTotalCasesChart();
		this._updateTotalDeathsChart();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (
			changes?.literals?.currentValue && changes?.literals?.currentValue !== changes?.literals?.previousValue
			&& changes?.historical?.currentValue && changes?.historical?.currentValue !== changes?.historical?.previousValue
			&& (
				changes?.global?.currentValue && changes?.global?.currentValue !== changes?.global?.previousValue
				|| changes?.country?.currentValue && changes?.country?.currentValue !== changes?.country?.previousValue
			)
		) {
			this._initCharts();
		}
	}

	ngOnDestroy() {
		this._subscriptions.forEach(subscription => {
			if (subscription.unsubscribe) {
				subscription.unsubscribe();
			}
		});
	}

	// Private

	_initCharts() {
		this._subscriptions.push(
			combineLatest([
				this.literals.pipe(distinctUntilChanged((prev, curr) => {
					if (!isEqual(prev, curr)) {
						this._updateLiterals(curr);
					}
					return false;
				})),
				this.historical,
				this.global || this.country
			]).subscribe(chartData => {
				this._literals = chartData[0];
				this._chartsData = {
					historical: chartData[1],
					...this.global ? {
						global: chartData[2] as any
					} : {
						country: chartData[2] as any
					}
				};
				this._dispatchTriggers();
			})
		);
	}

	_dispatchTriggers() {
		this._chartsService.calcTotalCases(this._chartsData);
		this._chartsService.calcTotalDeaths(this._chartsData);
	}

	_updateTotalCasesChart() {
		this._subscriptions.push(
			this._chartsService.getTotalCases().subscribe(data => {
				this.totalCasesChart$.next({
					...totalCasesChart,
					series: [
						{
							name: this._literals?.totalCases,
							data: Object.values(data)
						}
					],
					title: {
						text: this._literals?.totalCases,
						align: 'left'
					},
					xaxis: {
						categories: Object.keys(data).map(date => format(new Date(date), 'dd-MM-yyyy'))
					}
				});
			})
		);
	}

	_updateTotalDeathsChart() {
		this._subscriptions.push(
			this._chartsService.getTotalDeaths().subscribe(data => {
				this.totalDeaths$.next({
					...totalDeathsChart,
					series: [
						{
							name: this._literals?.totalDeath,
							data: Object.values(data)
						}
					],
					title: {
						text: this._literals?.totalDeath,
						align: 'left'
					},
					xaxis: {
						categories: Object.keys(data).map(date => format(new Date(date), 'dd-MM-yyyy'))
					}
				});
			})
		);
	}

	_updateLiterals(literals: IChartsLiterals): void {
		combineLatest([
			this.totalCasesChart$,
			this.totalDeaths$
		]).pipe(first()).subscribe(results => {
			this.totalCasesChart$.next(merge({}, results[0], {
				series: (results[0]?.series || []).map((serie: any) => {
					serie.name = literals?.totalCases;
					return serie;
				}),
				title: {
					text: literals?.totalCases
				}
			}));
			this.totalDeaths$.next(merge({}, results[1], {
				series: (results[0]?.series || []).map((serie: any) => {
					serie.name = literals?.totalCases;
					return serie;
				}),
				title: {
					text: literals?.totalDeath
				}
			}));
		});
	}

}
