import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';

import { CoreModule, I18nModule } from '@app/core';
import { SharedModule } from '@shared/module';

import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		FlexLayoutModule,
		CoreModule,
		I18nModule.forRoot('app'),
		ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
		SharedModule
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
