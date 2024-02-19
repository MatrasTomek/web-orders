import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { PagesModule } from './pages/pages.module';
import { SharedModule } from './shared/shared.module';
import { RegisterModalModule } from './register-modal/register-modal.module';

@NgModule({
  declarations: [AppComponent, NavComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    SharedModule,
    RegisterModalModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
