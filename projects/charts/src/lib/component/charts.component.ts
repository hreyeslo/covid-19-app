import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';

import { HistoricalCases, IGlobalCases, ICountryCases } from '@shared/models';

@Component({
	selector: 'covid-charts',
	templateUrl: './charts.component.html',
	styleUrls: ['./charts.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartsComponent implements OnChanges {

	@Input() historical: HistoricalCases = [];
	@Input() global: IGlobalCases;
	@Input() country: ICountryCases;

	constructor() { }

	ngOnChanges(changes: SimpleChanges) {
		console.log(changes);
	}

}
