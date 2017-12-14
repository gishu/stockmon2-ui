import { Component, OnInit, ViewChild } from '@angular/core';
import { Trade } from '../trade';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { StockMonService } from '../stock-mon.service';

import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';

@Component({
  selector: 'st2-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  entryComponents: [TransactionFormComponent]
})
export class TransactionListComponent implements OnInit {
  trades: Trade[];

  //grid config
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  @ViewChild(TransactionFormComponent)
  form: TransactionFormComponent;

  constructor(private service: StockMonService, private toastService: MatSnackBar) { }

  ngOnInit() {

    this.trades = [];

    this.displayedColumns = ['type', 'date', 'stock', 'qty', 'price', 'brokerage', 'amount'];
    this.dataSource = new MatTableDataSource<Trade>(this.trades);

  }

  private onTradeAdded(trade) {
    this.trades.push(trade);
    this.form.reset();
    this.dataSource = new MatTableDataSource<Trade>(this.trades);
  }

  saveTrades() {
    console.log('Saved!');
    let csvForPost = 'Date,Stock,Qty,UnitPrice,Amt,Brokerage,Type,Notes\n';
    csvForPost = csvForPost.concat(
      _.map(this.trades, t =>
        [t.date.toISOString(), t.stock, t.qty, t.price, '', t.brokerage, (t.isBuy ? '' : 'SOLD'), t.notes].join(',')
      ).join('\n')
    );

    this.service.postTrades(3, csvForPost)
      .subscribe(succeeded => this.toastService.open('Trades saved!', 'OK', { duration: 2000 }),
      err => {
        console.error(err);
        this.toastService.open('Unable to save the trades', 'OK', { duration: 2000 })
      })
  }


}
