import { InjectionToken } from '@angular/core';

import { ConfigManager } from '../config/config';

export interface IAppConfig {
	api: {
		host: string;
	};
	i18n: {
		scope: II18nScope;
		default: string;
		langs: IAppLangTypes[];
	};
}

export interface IAppLangTypes {
	name: string;
	flag: string;
}

export interface IAppEnv {
	production: boolean;
	configFile: string;
}

export interface II18nScope {
	forRoot: string;
	forChild: string;
}

export enum EI18nScope {
	FOR_ROOT = 'forRoot',
	FOR_CHILD = 'forChild'
}

// Tokens
export const APP_CONFIG = new InjectionToken<ConfigManager>('APP_CONFIG');
export const APP_ENVIRONMENT = new InjectionToken<IAppEnv>('APP_ENVIRONMENT');
// I18n
export const I18N_SCOPE = new InjectionToken<EI18nScope>('I18N_SCOPE');
export const I18N_FILE = new InjectionToken<string>('I18N_FILE');
