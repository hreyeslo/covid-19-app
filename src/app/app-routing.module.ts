import { RequestIdlePreloadAllModules } from 'ngx-request-idle';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
	{
		path: '',
		loadChildren: () => import('./pages/dashboard/dashboard.module').then(module => module.DashboardModule)
	},
	{
		path: '**',
		redirectTo: '/',
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
