import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

//material
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';

import { AppComponent } from './app.component';
import { TradesListComponent } from './trades-list/trades-list.component';
import { HoldingsListComponent } from './holdings-list/holdings-list.component';

let appRoutes = [
  { path: 'trades', component: TradesListComponent },
  { path: 'holdings', component: HoldingsListComponent },
  { path: '', redirectTo: 'trades', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    TradesListComponent,
    HoldingsListComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    NoopAnimationsModule,
    MatToolbarModule, MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
