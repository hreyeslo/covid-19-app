import { AngularFireAnalyticsModule, ScreenTrackingService } from '@angular/fire/analytics';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { AngularFireModule } from '@angular/fire';
import { FormsModule } from '@angular/forms';
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
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production,
			registrationStrategy: 'registerImmediately'
		}),
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireAnalyticsModule,
		SharedModule,
		MatSidenavModule,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		MatSelectModule,
		FormsModule
	],
	providers: [
		ScreenTrackingService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
