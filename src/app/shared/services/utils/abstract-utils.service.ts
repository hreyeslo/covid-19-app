import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';

import { IGlobalCases } from '../../models/shared.model';
import { UtilsApiModule } from './utils-api.module';
import { UtilsService } from './utils.service';

@Injectable({
	providedIn: UtilsApiModule,
	useClass: UtilsService,
	deps: [Injector]
})
export abstract class AbstractUtilsService {
	abstract getGlobalCases(): Observable<IGlobalCases>;
}
