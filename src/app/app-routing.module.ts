import { RequestIdlePreloadAllModules } from 'ngx-request-idle';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'world'
	},
	{
		path: 'world',
		loadChildren: () => import('./pages/dashboard/dashboard.module').then(module => module.DashboardModule)
	},
	{
		path: 'countries',
		children: [
			{
				path: '',
				loadChildren: () => import('./pages/countries/countries.module').then(module => module.CountriesModule)
			},
			{
				path: ':country',
				loadChildren: () => import('./pages/details/details.module').then(module => module.DetailsModule)
			}
		]
	},
	{
		path: '**',
		redirectTo: 'world',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			preloadingStrategy: RequestIdlePreloadAllModules
		})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {}
