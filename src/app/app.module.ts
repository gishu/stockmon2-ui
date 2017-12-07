import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import { AppComponent } from './app.component';
import { TradesListComponent } from './trades-list/trades-list.component';
import { HoldingsListComponent } from './holdings-list/holdings-list.component';


@NgModule({
  declarations: [
    AppComponent,
    TradesListComponent,
    HoldingsListComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: 'trades', component: TradesListComponent },
      { path: 'holdings', component: HoldingsListComponent },
      { path: '', redirectTo: 'trades', pathMatch: 'full' }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
