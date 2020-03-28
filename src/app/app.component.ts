import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { APP_CONFIG, ConfigManager, setLang } from '@app/core';
import { MatDrawerMode } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';
import { SwUpdate } from '@angular/service-worker';
import { Subscription, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import {
	getGlobalCases,
	getHistoricalCases,
	getCountryCases,
	selectIsDesktopLayout,
	selectIsMobileTabletLayout
} from '@shared/store';
import { UtilsService } from '@shared/services';

import { environment } from '../environments/environment';
import { AppRoutingAnimations } from './app-animations';

@Component({
	selector: 'covid-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	animations: [AppRoutingAnimations]
})
export class AppComponent implements OnInit, OnDestroy {

	private readonly _subscriptions: Subscription[] = [];

	languages: string[] = [];
	currentLanguage: string;

	isDesktopLayout$: Observable<boolean>;
	isMobileLayout$: Observable<boolean>;
	sidenavMode: MatDrawerMode = 'over';
	sidenavHasBackdrop = true;

	constructor(
		@Inject(APP_CONFIG) private _configManager: ConfigManager,
		private _translateService: TranslateService,
		private _store: Store,
		private _utilsService: UtilsService,
		private _swUpdate: SwUpdate
	) {}

	ngOnInit() {
		this._swUpdateChecker();
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
		this.isMobileLayout$ = this._store.pipe(select(selectIsMobileTabletLayout));
		this.isDesktopLayout$ = this._store.pipe(
			select(selectIsDesktopLayout),
			tap((isDesktopLayout: boolean) => {
				this.sidenavMode = isDesktopLayout ? 'side' : 'over';
				this.sidenavHasBackdrop = !isDesktopLayout;
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

	_swUpdateChecker(): void {
		if (this._swUpdate.isEnabled) {
			this._swUpdate.available.subscribe(event => {
				window.location.reload();
			});
		}
	}
}
