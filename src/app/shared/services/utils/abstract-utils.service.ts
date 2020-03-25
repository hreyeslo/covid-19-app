import { Injectable, Injector } from '@angular/core';

import { UtilsApiModule } from './utils-api.module';
import { UtilsService } from './utils.service';

@Injectable({
	providedIn: UtilsApiModule,
	useClass: UtilsService,
	deps: [Injector]
})
export abstract class AbstractUtilsService {

}
