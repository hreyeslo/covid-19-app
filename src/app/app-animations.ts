import { transition, trigger, useAnimation } from '@angular/animations';
import { fromRightEasing, fromLeftEasing } from 'ngx-router-animations';

export const AppRoutingAnimations =
	trigger('routeAnimations', [
		transition('dashboard => countries', useAnimation(fromRightEasing)),
		transition('dashboard => details', useAnimation(fromRightEasing)),
		transition('countries => details', useAnimation(fromRightEasing)),
		transition('countries => dashboard', useAnimation(fromLeftEasing)),
		transition('details => countries', useAnimation(fromLeftEasing)),
		transition('details => dashboard', useAnimation(fromLeftEasing))
	]);
