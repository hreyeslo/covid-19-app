import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DetailsComponent } from './component/details.component';

const routes: Routes = [
	{
		path: '',
		component: DetailsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class DetailsRoutingModule {}
