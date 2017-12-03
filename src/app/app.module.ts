import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import { AppComponent } from './app.component';
import { TradesComponent } from './trades/trades.component';


@NgModule({
  declarations: [
    AppComponent,
    TradesComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'trades', component: TradesComponent },
      { path: '', redirectTo: 'trades', pathMatch: 'full' }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
