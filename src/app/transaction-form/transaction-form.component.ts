import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Dividend, Sale, Buy } from '../trade';
import { StockMonService } from '../stock-mon.service';
import * as _ from 'lodash';
@Component({
  selector: 'st2-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {

  knownStocks: string[];
  filteredStocks: string[];

  type: string;
  model: Buy | Sale | Dividend;


  @Output()
  tradeAdded: EventEmitter<any> = new EventEmitter();

  constructor(private service: StockMonService) { }

  ngOnInit() {
    this.type = "B";
    this._resetModel();

    this.knownStocks = this.filteredStocks = [];
    this.service.getStockNames().subscribe(
      stocks => {
        this.knownStocks = stocks;
        this.filteredStocks = this.knownStocks.slice();
      },
      err => console.error('Stocks dropdown ' + err)
    );



  }

  public addTrade() {
    this.tradeAdded.emit(this.model);
  }

  public reset() {
    this._resetModel({ date: this.model.date })
  }

  private _resetModel(propsToCarryOver?: object) {
    let blankModel;
    switch (this.type) {
      case "B":
        blankModel = Buy.instance();
        break;
      case "S":
        blankModel = Sale.instance();
        break;
      case "D":
        blankModel = Dividend.instance();
        break;
    }
    if (propsToCarryOver){
      blankModel=_.assign(blankModel, propsToCarryOver);
    }
    this.model = blankModel;
  }

  onTypeChanged(newType) {
    console.log(newType, '-', this.type);
    this._resetModel();
  }

  // add visual feedback based on trade type
  highlightBasedOnType() {
    return { "in": !(this.model instanceof Buy), "out": (this.model instanceof Buy) };
  }

  private updateStocksDropdown(searchTerm: string) {
    searchTerm = searchTerm.toLowerCase();
    if (searchTerm.length == 0) {
      this.filteredStocks = this.knownStocks.slice();
    } else {
      this.filteredStocks = this.knownStocks.filter(name => name.toLowerCase().includes(searchTerm));
    }
  }
}
