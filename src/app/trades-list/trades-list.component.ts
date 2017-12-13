import { Component, OnInit } from '@angular/core';
import { Trade } from '../trade';
import { MatTableDataSource } from '@angular/material/table';
import { DataSource } from '@angular/cdk/collections';
import { StockMonService } from '../stock-mon.service';

import * as _ from 'lodash';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-trades-list',
  templateUrl: './trades-list.component.html',
  styleUrls: ['./trades-list.component.css'],
  providers: [StockMonService]
})
export class TradesListComponent implements OnInit {
  knownStocks: string[];
  tradeTypes: { label: string; value: boolean; }[];
  filteredStocks: string[];
  trade: Trade;
  trades: Trade[];

  //grid config
  displayedColumns: string[];
  dataSource: MatTableDataSource<any>;


  constructor(private service: StockMonService, private toastService: MatSnackBar) { }

  ngOnInit() {
    this.trade = this.getBlankTrade();

    this.knownStocks = [];
    this.service.getStockNames().subscribe(
      stocks => this.knownStocks = stocks,
      err => console.error('Stocks dropdown ' + err)
    );

    this.filteredStocks = this.knownStocks.slice();
    this.tradeTypes = [{ label: 'Buy', value: true }, { label: 'Sale', value: false },]

    this.trades = [];

    this.displayedColumns = ['type', 'date', 'stock', 'qty', 'price', 'brokerage', 'amount'];
    this.dataSource = new MatTableDataSource<Trade>(this.trades);

  }

  onStockChange(searchTerm: string) {
    searchTerm = searchTerm.toLowerCase();
    if (searchTerm.length == 0) {
      this.filteredStocks = this.knownStocks.slice();
    } else {
      this.filteredStocks = this.knownStocks.filter(name => name.toLowerCase().includes(searchTerm));
    }
  }

  addTrade() {
    console.log('Added trade')

    this.trades.push(this.trade);
    this.trade = this.getBlankTrade(this.trade.date);
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

  getBlankTrade(date?: Date) {
    return new Trade('', date || new Date(Date.now()), 0, 0, 0, '', true);
  }
}
