import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';
import { RegisterModalModule } from './register-modal/register-modal.module';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from './store/reducers';
import { effects } from './store/effects';

@NgModule({
	declarations: [AppComponent, NavComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		PagesModule,
		SharedModule,
		RegisterModalModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireAuthModule,
		AngularFirestoreModule,
		StoreModule.forRoot(reducers),
		EffectsModule.forRoot(effects),
		// !environment.production ? StoreDevtoolsModule.instrument() : [], // devtools
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
