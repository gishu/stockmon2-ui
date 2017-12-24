import { Component, OnInit, ViewChild } from '@angular/core';
import { StockMonService, Holding } from '../stock-mon.service';
import { MatTableDataSource, MatSort, MatTable } from '@angular/material';
import * as _ from 'lodash';
import { BigNumber } from 'bignumber.js'
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-holdings-list',
  templateUrl: './holdings-list.component.html',
  styleUrls: ['./holdings-list.component.css']
})
export class HoldingsListComponent implements OnInit {
  summary: any = { total_cost: 0, total_gain: 0 };
  _hasViewLoaded: boolean = false;

  _holdings: Holding[] = [];
  _holdingsForDisplay: any = [];

  dataSource: MatTableDataSource<Holding>;
  displayedColumns = ['stock', 'date', 'qty', 'price', 'age', 'cost', 'marketPrice', 'gain', 'gain%', 'roi', 'notes']

  @ViewChild(MatSort) sort: MatSort;

  _isLoading = false;

  _accounts = [
    { id: 1, name: 'Gishu Hdfc' },
    { id: 2, name: 'Mushu Hdfc' },
    { id: 3, name: 'Gishu Zerodha' }];

  constructor(private _service: StockMonService) {

  }

  onAccountChanged(accountId) {
    this._isLoading = true;
    this._clearGrid();
    this._service.getHoldings(accountId, new Date(Date.now()).getFullYear())
      .subscribe(
      result => this._updateHoldings(result),
      error => console.error('Unable to fetch holdings ', error)
      );
  }

  ngOnInit() {
    BigNumber.config({ DECIMAL_PLACES: 2 });

    this._clearGrid();

  }

  private _clearGrid() {
    this._holdings = this._holdingsForDisplay = [];
    this.dataSource = new MatTableDataSource(this._holdingsForDisplay);
  }

  ngAfterViewInit() {
    this._hasViewLoaded = true;
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

          this.summary = _.reduce(this._holdingsForDisplay, (result, value) => {
            if (value.cost) {
              result.total_cost += parseFloat(value.cost);
              result.total_gain += parseFloat(value.gain);
            }
            return result;
          }, { total_cost: 0, total_gain: 0 })

          //TODO: show error indicators on network call failures & turn off load indicators
          this.dataSource = new MatTableDataSource<Holding>(this._holdingsForDisplay)
          if (this._hasViewLoaded) {
            this.dataSource.sort = this.sort;
          }
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

  getRowClasses(row) {
    let roi = parseFloat(row.roi);

    return {
      'nafaa': roi > 0.25,
      'nuksaan': roi < -0.08
    };
  }

}
export function getAgeBin(age_months) {
  if (age_months < 12) {
    return (age_months < 9 ? "SHORT" : "ALMOST");
  } else {
    return "";
  }

}
