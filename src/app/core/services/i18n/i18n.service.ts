import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Service parts
import { EI18nScope, I18N_SCOPE, I18N_FILE, APP_CONFIG } from '../../models/core.model';
import { ConfigManager } from '../../config/config';

@Injectable()
export class I18nService implements TranslateLoader {

	private readonly _configManager: ConfigManager;
	private readonly _httpClient: HttpClient;
	private readonly _i18nScope: EI18nScope;
	private readonly _fileName: string;

	constructor(_injector: Injector) {
		this._configManager = _injector.get<ConfigManager>(APP_CONFIG);
		this._i18nScope = _injector.get<EI18nScope>(I18N_SCOPE);
		this._fileName = _injector.get<string>(I18N_FILE);
		this._httpClient = _injector.get(HttpClient);
	}

	getTranslation(lang: string): Observable<object> {
		const url = this._getScope(lang) + this._getFileName();
		return this._httpClient.get(url);
	}

	// Private
	_getScope(lang: string): string {
		let scope = (this._configManager.config?.i18n?.scope[this._i18nScope] || '');
		scope = scope.replace(/(^\/)|(\/$)/g, '');
		scope = scope.replace(/(\${lang})/g, lang);
		return `${scope}/`;
	}

	_getFileName(): string {
		let name = this._fileName.replace(/^\//, '');
		name = name.replace(/.json$/, '');
		return `${name}.json`;
	}
}
