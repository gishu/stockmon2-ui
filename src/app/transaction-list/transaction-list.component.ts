import { Component, OnInit, ViewChild } from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { StockMonService } from '../stock-mon.service';

import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { Dividend, Sale, Buy } from '../trade';

@Component({
  selector: 'st2-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css'],
  entryComponents: [TransactionFormComponent]
})
export class TransactionListComponent implements OnInit {
  trades: any[];

  //grid config
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;

  @ViewChild(TransactionFormComponent)
  form: TransactionFormComponent;

  constructor(private service: StockMonService, private toastService: MatSnackBar) { }

  ngOnInit() {

    this.trades = [];

    this.displayedColumns = ['type', 'date', 'stock', 'qty', 'price', 'brokerage', 'amount'];
    this.dataSource = new MatTableDataSource<any>(this.trades);

  }

  private onTradeAdded(trade) {

    let entry = _.assign({}, trade, {
      type: this.getMnemonicFor(trade),
      amount: (trade instanceof Dividend ? trade.amount : trade.amount())
    });
    this.trades.push(entry);
    this.form.reset();
    this.dataSource = new MatTableDataSource<any>(this.trades);
  }

  saveTrades() {
    let csvForPost = 'Date,Stock,Qty,UnitPrice,Amt,Brokerage,Type,Notes\n';
    csvForPost = csvForPost.concat(
      _.map(this.trades, t => {
        if (t.type === "D") {
          return [t.date.toISOString(), t.stock, '', '', t.amount, '', 'DIV', t.notes].join(',');
        } else {
          return [t.date.toISOString(), t.stock, t.qty, t.price, '', t.brokerage, (t.type === "B" ? '' : 'SOLD'), t.notes].join(',');
        }
      }

      ).join('\n')
    );
    
    this.service.postTrades(3, csvForPost)
      .subscribe(succeeded => this.toastService.open('Trades saved!', 'OK', { duration: 2000 }),
      err => {
        console.error(err);
        this.toastService.open('Unable to save the trades', 'OK', { duration: 2000 })
      })
  }

  // map type of entry to buy/sale/div
  getMnemonicFor(trade) {
    if (trade instanceof Dividend) {
      return 'D';
    }
    return (trade instanceof Sale ? 'S' : 'B');
  }


}
