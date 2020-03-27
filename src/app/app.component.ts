import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { APP_CONFIG, ConfigManager, setLang } from '@app/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { getGlobalCases, getHistoricalCases, getCountryCases } from '@shared/store';
import { ILayout, ELayoutName } from '@shared/models';
import { UtilsService } from '@shared/services';

import { environment } from '../environments/environment';

@Component({
	selector: 'covid-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

	private readonly _subscriptions: Subscription[] = [];

	languages: string[] = [];
	currentLanguage: string;
	currentLayout: ILayout;

	sidenavMode: MatDrawerMode = 'over';
	sidenavHasBackdrop = true;

	constructor(
		@Inject(APP_CONFIG) private _configManager: ConfigManager,
		private _translateService: TranslateService,
		private _store: Store,
		private _utilsService: UtilsService
	) {}

	ngOnInit() {
		this._setInitialLanguage();
		this._initLayoutObserver();
		this._initGlobalPooling();
	}

	ngOnDestroy() {
		this._subscriptions.forEach(subscription => {
			if (subscription.unsubscribe) {
				subscription.unsubscribe();
			}
		});
	}

	changeLang(lang: string): void {
		this._store.dispatch(setLang({lang}));
	}

	_initLayoutObserver(): void {
		this._subscriptions.push(
			this._utilsService.getLayoutObserver().subscribe((layout: ILayout) => {
				const isMobile = layout.type === ELayoutName.mobile || layout.type === ELayoutName.tablet;
				this.currentLayout = layout;
				this.sidenavMode = isMobile ? 'over' : 'side';
				this.sidenavHasBackdrop = isMobile;
			})
		);
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
