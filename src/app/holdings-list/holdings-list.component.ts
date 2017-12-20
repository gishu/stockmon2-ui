import { Component, OnInit, ViewChild } from '@angular/core';
import { StockMonService, Holding } from '../stock-mon.service';
import { MatTableDataSource, MatSort, MatTable } from '@angular/material';
import * as _ from 'lodash';
import { BigNumber } from 'bignumber.js'
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-holdings-list',
  templateUrl: './holdings-list.component.html',
  styleUrls: ['./holdings-list.component.css']
})
export class HoldingsListComponent implements OnInit {

  _holdingsForDisplay: any;
  dataSource: MatTableDataSource<Holding>;
  displayedColumns = ['stock', 'date', 'qty', 'price', 'age', 'cost', 'marketPrice', 'gain', 'gain%', 'roi', 'notes']

  _holdings: Holding[] = [];

  _isLoading = false;

  constructor(private _service: StockMonService) { }

  ngOnInit() {
    BigNumber.config({ DECIMAL_PLACES: 2 });

    this._isLoading = true;
    this._service.getHoldings(3, 2017)
      .subscribe(
      result => this._updateHoldings(result),
      error => console.error('Unable to fetch holdings ', error)
      );
  }

  ngAfterViewInit() {
    console.log('view init');
   }

  private _updateHoldings(holdings: Holding[]): any {
    try {

      this._holdings = _.concat(this._holdings, holdings);
      this._holdingsForDisplay = _.map(this._holdings, function (h) {
        return {
          stock: h.stock,
          date: h.date,
          qty: h.qty,
          price: h.price,
          price_f: h.price.toString(),
          age: getAgeBin(h.age_months),
          ageInYears: (h.age_months / 12).toFixed(2),
          notes: h.notes
        };
      });

      this.dataSource = new MatTableDataSource<Holding>(this._holdingsForDisplay)

      let symbols = _(this._holdings).map(h => h.stock).uniq().value();
      this._service.getQuotesFor(symbols).subscribe(
        response => {
          let quotes = response.data;
          _.each(this._holdingsForDisplay, h => {
            let quote = quotes[h.stock];
            if (!quote) {
              console.error('Cannot retrieve quote for ' + h.stock);
              return;
            }

            h.cost = new BigNumber(h.price).times(h.qty).div(1000).toFixed(2);
            h.gain = new BigNumber(quote.p).minus(h.price).times(h.qty).div(1000).toFixed(2);
            h.market_price = quote.p.toFixed(2);
            h.change = quote.c.toFixed(2);

            if ((h.price > 0) && (h.ageInYears > 0)) {
              h.gain_percent = new BigNumber(quote.p).minus(h.price).div(h.price).toFixed(2);

              let cagr = Math.pow(new BigNumber(quote.p).div(h.price).toNumber(), (1 / h.ageInYears)) - 1;
              let simpleRate = new BigNumber(quote.p).minus(h.price).div(h.price).div(h.ageInYears).toFixed(2)
              h.roi = (h.age_months < 12) ? simpleRate : cagr;
            }
            else {
              h.roi = 0;
              h.gain_percent = 0;
            }
          })
          //TODO: show error indicators on network call failures & turn off load indicators
          this.dataSource = new MatTableDataSource<Holding>(this._holdingsForDisplay)
          this._isLoading = false;
        },
        err => console.error(err)
      )

    } catch (error) {
      console.log(error);
    }

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

}
export function getAgeBin(age_months) {
  if (age_months < 12) {
    return (age_months < 9 ? "SHORT" : "ALMOST");
  } else {
    return "";
  }

}
