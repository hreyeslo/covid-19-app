import { RequestIdlePreloadAllModules } from 'ngx-request-idle';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'dashboard'
	},
	{
		path: 'dashboard',
		loadChildren: () => import('./pages/dashboard/dashboard.module').then(module => module.DashboardModule),
		data: {animation: 'dashboard'}
	},
	{
		path: 'countries',
		children: [
			{
				path: '',
				loadChildren: () => import('./pages/countries/countries.module').then(module => module.CountriesModule),
				data: {animation: 'countries'}
			},
			{
				path: ':country',
				loadChildren: () => import('./pages/details/details.module').then(module => module.DetailsModule),
				data: {animation: 'details'}
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
