import { APP_CONFIG, ConfigManager, setLang } from '@app/core';
import { Component, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import { getGlobalCases, getHistoricalCases, getCountryCases } from '@shared/store';

import { environment } from '../environments/environment';

@Component({
	selector: 'covid-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	languages: string[] = [];
	currentLanguage: string;

	constructor(
		@Inject(APP_CONFIG) private _configManager: ConfigManager,
		private _translateService: TranslateService,
		private _store: Store
	) {}

	ngOnInit() {
		this._setInitialLanguage();
		this._initGlobalPooling();
	}

	changeLang(lang: string): void {
		this._store.dispatch(setLang({lang}));
	}

	_setInitialLanguage(): void {
		this._translateService.addLangs(this._configManager.config?.i18n?.langs || [environment.defaultLang]);
		this.languages = this._translateService.getLangs();
		const defaultLang = this._configManager.config?.i18n?.default || environment.defaultLang;
		const browserLang = this._translateService.getBrowserLang();
		this.currentLanguage = this.languages.indexOf(browserLang) > -1 ? browserLang : defaultLang;
		this._translateService.setDefaultLang(this.currentLanguage);
		this.changeLang(this.currentLanguage);
	}

	_initGlobalPooling(): void {
		this._store.dispatch(getGlobalCases());
		this._store.dispatch(getHistoricalCases());
		this._store.dispatch(getCountryCases());
	}
}
