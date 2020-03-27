import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
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
		SharedModule,
		MatSidenavModule,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
