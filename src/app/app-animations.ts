import { transition, trigger, useAnimation } from '@angular/animations';
import {
	moveFromRight,
	moveFromLeft,
	scaleDownFromRight,
	scaleDownFromLeft
} from 'ngx-router-animations';

export const AppRoutingAnimations =
	trigger('routeAnimations', [
		transition('dashboard => countries', useAnimation(moveFromRight)),
		transition('dashboard => details', useAnimation(moveFromRight)),
		transition('countries => details', useAnimation(moveFromRight)),
		transition('countries => dashboard', useAnimation(moveFromLeft)),
		transition('details => countries', useAnimation(moveFromLeft)),
		transition('details => dashboard', useAnimation(moveFromLeft))
	]);

export const AppTabsAnimations =
	trigger('tabsAnimations', [
		transition(':enter', useAnimation(scaleDownFromRight)),
		transition(':leave', useAnimation(scaleDownFromLeft))
	]);
