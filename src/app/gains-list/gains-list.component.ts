import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { StockMonService, Gain } from '../stock-mon.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { asCurrency, asPercent } from '../utilities';

import * as _ from 'lodash';
import * as moment from 'moment';
import { BigNumber } from 'bignumber.js';
import { GridBase } from '../grid-base';

@Component({
  selector: 'st2-gains-list',
  templateUrl: './gains-list.component.html',
  styleUrls: ['./gains-list.component.css']
})
export class GainsListComponent extends GridBase {
  _gains: Gain[];

  summary: any = { total_cost: 1, total_gain: 0 };

  constructor(private _service: StockMonService) {
    super();
  }

  fetch() {
    this._gains = [];
    this._service.getGains(this._accountId, this._currentFinYear)
      .subscribe(response => {
        console.log('got response' + response);
        this._gains = _.map(response.gains, g => {
          return {
            'type': 'S',
            'date': moment(g.date).format('YYYY-MM-DD'),
            'stock': g.stock,
            'qty': g.qty,
            'salePrice': asCurrency(g.SP),
            'costPrice': asCurrency(g.CP),
            'tco': asCurrency(g.CP) * g.qty / 1000,
            'brokerage': asCurrency(g.brokerage),
            'gain': asCurrency(g.gain),
            'period': moment(g.date).diff(moment(g.buyDate), 'years', true).toFixed(1),
            'isShortTerm': g.isShortTerm,
            'roi': asPercent(g.roi)
          };



        });
        this._gains = this._gains.concat(_.map(response.dividends, d => {
          return {
            'type': 'D',
            'date': moment(d.date).format('YYYY-MM-DD'),
            'stock': d.stock,
            'gain': asCurrency(d.amount),
          };
        }));

        this._renderGrid();
      },
      err => console.error('TODO ERROR HANDLE', err));

  }


  _updateSummary() {
    let visibleList = (this._filterString)
      ? _.filter(this.dataSource.data, d => this.dataSource.filterPredicate(d, this._filterString))
      : this._gains;


    this.summary = _.reduce(visibleList, (result, value) => {
      if (value.qty) {
        result.total_cost += (value.costPrice * value.qty) / 1000;
      }
      result.total_gain += parseFloat(value.gain) / 1000;
      return result;
    }, { total_cost: 0, total_gain: 0 })

  }

  groupItems() {
    switch (this._groupBy) {
      case 'Stock':
        let mapStockToGains = _.groupBy(this._gains, g => g.stock);
        let groups = _.values(mapStockToGains);
        this._gridData = _.map(groups, gains => {
          let totals = _.reduce(gains,
            (result, value) => {
              return {
                tco: result.tco + (value.tco || 0),
                gain: result.gain + value.gain
              };
            },
            { tco: 0, gain: 0 });
          return {
            stock: gains[0].stock,
            gain: totals.gain,
            tco: totals.tco
          }
        });
        this.displayedColumns = ['stock', 'tco', 'gain'];
        break;
      default:
        this._gridData = this._gains;
        this.displayedColumns = ['stock',  'date', 'costPrice', 'salePrice', 'qty', 'tco', 'gain', 'period', 'roi', 'taxable']
        break;
    }
  }

  afterGridUpdate() {
    this._updateSummary();
  }
}
