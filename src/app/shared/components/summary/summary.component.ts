import { Component, Input, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { ISharedTodayData, ISharedTomorrowData } from '@shared/models';

import { ISummaryViewData } from './summary.model';

@Component({
	selector: 'covid-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent implements OnChanges {

	@Input() viewData: ISummaryViewData;
	@Input() todayData$: Observable<Partial<ISharedTodayData>>;
	@Input() tomorrowData$: Observable<ISharedTomorrowData>;
	@Input() countUpOptions;

	countUpOptionsPercents = {
		suffix: '%'
	};

	countUpOptionsDecimals = {
		decimalPlaces: 3
	};

	constructor() { }

	trackByIndex(index: number): number {
		return index;
	}

	ngOnChanges(changes: SimpleChanges) {
		this.countUpOptionsPercents = {
			...this.countUpOptions,
			...this.countUpOptionsPercents
		};
		this.countUpOptionsDecimals = {
			...this.countUpOptions,
			...this.countUpOptionsDecimals
		};
	}

}
