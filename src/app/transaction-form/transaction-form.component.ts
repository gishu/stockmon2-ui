import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Trade } from '../trade';
import { StockMonService } from '../stock-mon.service';

@Component({
  selector: 'st2-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.css']
})
export class TransactionFormComponent implements OnInit {

  knownStocks: string[];
  tradeTypes: { label: string; value: boolean; }[];
  filteredStocks: string[];
  trade: Trade;

  @Output()
  tradeAdded: EventEmitter<Trade> = new EventEmitter();

  constructor(private service: StockMonService) { }

  ngOnInit() {

    this.trade = this.getBlankTrade();

    this.knownStocks = this.filteredStocks = [];
    this.service.getStockNames().subscribe(
      stocks => {
        this.knownStocks = stocks;
        this.filteredStocks = this.knownStocks.slice();
      },
      err => console.error('Stocks dropdown ' + err)
    );


    this.tradeTypes = [{ label: 'Buy', value: true }, { label: 'Sale', value: false },]

  }

  public addTrade() {
    this.tradeAdded.emit(this.trade);
  }

  public reset() {
    this.trade = this.getBlankTrade(this.trade.date);
  }

  private getBlankTrade(date?: Date) {
    return new Trade('', date || new Date(Date.now()), 0, 0, 0, '', true);
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
