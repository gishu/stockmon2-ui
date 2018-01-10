import { Component, OnInit, ViewChild } from '@angular/core';
import { StockMonService, Holding } from '../stock-mon.service';
import { MatTableDataSource, MatSort, MatTable, MatSnackBar } from '@angular/material';
import * as _ from 'lodash';
import { BigNumber } from 'bignumber.js'
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { FormBuilder, FormGroup } from '@angular/forms';
import { asPercent, asCurrency } from '../utilities'
import { GridBase } from '../grid-base';

@Component({
  selector: 'st2-holdings-list',
  templateUrl: './holdings-list.component.html',
  styleUrls: ['./holdings-list.component.css']
})
export class HoldingsListComponent extends GridBase {
  _holdings: Holding[] = [];
  _quotes: any;

  summary: any = { total_cost: 0, total_gain: 0 };

  constructor(private _service: StockMonService) {
    super();
  }

  fetch(): void {
    this._service.getHoldings(this._accountId, this._currentFinYear)
      .subscribe(
      holdings => {
        let symbols = _(holdings).map(h => h.stock).uniq().value();
        this._service.getQuotesFor(symbols).subscribe(
          response => {
            this._holdings = holdings;
            this._quotes = response.data;
            this._renderGrid();
          });
      },
      error => {
        console.error('Unable to fetch holdings ', error);
      });
  }

  groupItems(): void {
    switch (this._groupBy) {

      case 'Stock':
        let groupsObject = _.groupBy(this._holdings, h => h.stock);
        this._gridData = _(_.values(groupsObject))
          .map(entries => {
            let reduction = _.reduce(entries,
              (result, value) => {
                return {
                  qty: result.qty + value.qty,
                  price: new BigNumber(result.price).times(result.qty)
                    .plus(new BigNumber(value.price).times(value.qty))
                    .div(result.qty + value.qty)
                    .toFixed(2),
                };
              },
              { qty: 0, price: '0' })
            return {
              stock: entries[0].stock,
              qty: reduction.qty,
              price: reduction.price,
              ageInYears: 0
            }
          })
          .value();
        this.displayedColumns = ['stock', 'qty', 'price', 'marketPrice', 'cost', 'gain', 'gainPc']
        break;
      default:

        this._gridData = _.map(this._holdings, function (h) {
          return {
            stock: h.stock,
            date: h.date,
            qty: h.qty,
            price: h.price,
            age: getAgeBin(h.age_months),
            ageInYears: (h.age_months / 12).toFixed(2),
            notes: h.notes
          };
        });

        this.displayedColumns = ['stock', 'date', 'qty', 'price', 'age', 'marketPrice', 'cost', 'gain', 'gainPc', 'roi', 'notes']


        break;
    }
    _.each(this._gridData, h => {
      let quote = this._quotes[h.stock];
      if (!quote) {
        console.error('Cannot retrieve quote for ' + h.stock);
        return;
      }

      h.cost = asCurrency(new BigNumber(h.price).times(h.qty).div(1000));
      h.gain = asCurrency(new BigNumber(quote.p).minus(h.price).times(h.qty).div(1000));
      h.market_price = asCurrency(quote.p);
      h.change = asCurrency(quote.c);

      h.roi = 0;
      h.gain_percent = 0;
      if (h.price > 0) {
        h.gain_percent = asPercent(new BigNumber(quote.p).minus(h.price).div(h.price));
      }

      if ((h.price > 0) && (h.ageInYears > 0)) {
        let cagr = this._getCagr(quote.p, h.price, h.ageInYears);
        let simpleRate = new BigNumber(quote.p).minus(h.price).div(h.price).div(h.ageInYears);
        h.roi = asPercent((h.age_months < 12) ? simpleRate : cagr);
      }

    })
  }

  afterGridUpdate() {
    this._updateSummary();
  }
  _updateSummary() {
    this.summary = _.reduce(this._gridData, (result, value) => {
      // exclude things that we do not have a quote for like bonds
      if (value.market_price) {
        result.total_cost += parseFloat(value.cost);
        result.total_gain += parseFloat(value.gain);
      }

      return result;
    }, { total_cost: 0, total_gain: 0 })

  }
  private _getCagr(curPrice, costPrice, ageInYears) {
    let cagr = Math.pow(new BigNumber(curPrice).div(costPrice).toNumber(), (1 / ageInYears)) - 1;
    return new BigNumber(cagr.toPrecision(10));
  }

  getRowClasses(row) {
    return {
      'nafaa': (row.roi > 0.25) && (row.ageInYears > 0),
      'nuksaan': row.gain_percent < -0.08,
      'spec-row': true
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


