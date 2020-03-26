import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { CountriesComponent } from './component/countries.component';

const routes: Routes = [
	{
		path: '',
		component: CountriesComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class CountriesRoutingModule {}
