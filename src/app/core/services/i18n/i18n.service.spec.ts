import { TestBed } from '@angular/core/testing';

import { I18nService } from './i18n.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injector } from '@angular/core';
import { APP_CONFIG, ConfigManager } from '@app/core';
import { I18N_SCOPE, EI18nScope, I18N_FILE } from '../../models/core.model';

describe('I18nService', () => {
	let service: I18nService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				{
					provide: APP_CONFIG,
					useClass: ConfigManager
				},
				{
					provide: I18N_SCOPE,
					useValue: EI18nScope.FOR_ROOT
				},
				{
					provide: I18N_FILE,
					useValue: 'app'
				},
				{
					provide: I18nService,
					useClass: I18nService,
					deps: [Injector]
				}
			]
		});
		const configManager = TestBed.inject<ConfigManager>(APP_CONFIG);
		configManager.config = {
			host: 'https://dog.ceo/api',
			randomImages: 3,
			i18n: {
				scope: {
					forRoot: '/i18n/${lang}/',
					forChild: '/i18n/${lang}/pages/'
				},
				default: 'en',
				langs: ['en', 'es']
			}
		};
		service = TestBed.inject(I18nService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
