import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'covid-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryComponent {

	constructor() { }

}
