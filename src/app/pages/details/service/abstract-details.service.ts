import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UtilsService } from '@shared/services';
import { IGlobalCases } from '@shared/models';

import { DetailsServiceApiModule } from './details-service-api.module';
import { DetailsService } from './details.service';

@Injectable({
	providedIn: DetailsServiceApiModule,
	useClass: DetailsService,
	deps: [UtilsService]
})
export abstract class AbstractDetailsService {
	abstract getGlobalCases(): Observable<IGlobalCases>;
}
