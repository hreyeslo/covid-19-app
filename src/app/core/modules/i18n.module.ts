import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { NgModule, Injector, ModuleWithProviders } from '@angular/core';
import { Store } from '@ngrx/store';
// Module parts
import { I18N_FILE, I18N_SCOPE, EI18nScope } from '../models/core.model';
import { I18nService } from '../services/i18n/i18n.service';
import { selectLang } from '../store/core.selectors';

export const TranslateLoaderProvider = {
	provide: TranslateLoader,
	useClass: I18nService,
	deps: [Injector]
};

export function loadLangFiles(_injector: Injector): void {
	_injector.get(Store)
		.select(selectLang)
		.subscribe((lang: string) => _injector.get(TranslateService).use(lang));
}

@NgModule({
	imports: [TranslateModule.forRoot({isolate: true})],
	providers: [TranslateLoaderProvider],
	exports: [TranslateModule]
})
export class I18nModuleForRoot {
	constructor(private _injector: Injector) {
		loadLangFiles(_injector);
	}
}

@NgModule({
	imports: [TranslateModule.forChild({isolate: true})],
	providers: [TranslateLoaderProvider],
	exports: [TranslateModule]
})
export class I18nModuleForChild {
	constructor(private _injector: Injector) {
		loadLangFiles(_injector);
	}
}

// Main module
@NgModule()
export class I18nModule {
	static forRoot(fileName: string): ModuleWithProviders {
		return {
			ngModule: I18nModuleForRoot,
			providers: [
				{
					provide: I18N_SCOPE,
					useValue: EI18nScope.FOR_ROOT
				},
				{
					provide: I18N_FILE,
					useValue: fileName
				}
			]
		};
	}

	static forChild(fileName: string): ModuleWithProviders {
		return {
			ngModule: I18nModuleForChild,
			providers: [
				{
					provide: I18N_SCOPE,
					useValue: EI18nScope.FOR_CHILD
				},
				{
					provide: I18N_FILE,
					useValue: fileName
				}
			]
		};
	}
}
