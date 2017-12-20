import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

//material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


import { AppComponent } from './app.component';
import { HoldingsListComponent } from './holdings-list/holdings-list.component';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';
import { StockMonService } from './stock-mon.service';
import { TransactionListComponent } from './transaction-list/transaction-list.component';

let appRoutes = [
  { path: 'trades', component: TransactionListComponent },
  { path: 'holdings', component: HoldingsListComponent },
  { path: '', redirectTo: 'trades', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    TransactionListComponent,
    HoldingsListComponent,
    TransactionFormComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    HttpClientModule,
    NoopAnimationsModule,

    MatToolbarModule, MatButtonModule, MatButtonToggleModule,
    MatInputModule, MatFormFieldModule, MatAutocompleteModule, MatRadioModule,
    MatNativeDateModule, MatDatepickerModule, 
    MatCardModule,  MatIconModule,
    MatTableModule,
    MatSnackBarModule, MatProgressSpinnerModule,
  ],
  providers: [StockMonService],
  bootstrap: [AppComponent]
})
export class AppModule { }
