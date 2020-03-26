import { IAppConfig } from '../models/core.model';

export class ConfigManager {
	private _config: IAppConfig;

	get config(): IAppConfig {
		return this._config;
	}

	set config(value: IAppConfig) {
		this._config = value;
	}

}
