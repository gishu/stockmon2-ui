import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import * as _ from 'lodash';

@Injectable()
export class StockMonService {
  readonly BASE_URL = 'http://localhost:3123/';
  constructor(private http: HttpClient) { }

  getStockNames(): Observable<any> {
    return this.http.get<JsonData>(this.BASE_URL + 'stocks')
      .map(results => results.data)
      .catch(this.throwError);
  }

  getHoldings(accountId, year): Observable<any> {

    return this.http.get<Holding>(`${this.BASE_URL}accounts/${accountId}/snapshots/${year}/holdings`,
      { headers: new HttpHeaders().set('Accept', 'application/json') });
  }

  getQuotesFor(stockSymbols) : Observable<any>{
    let encodedSymbols = _.map(stockSymbols, encodeURIComponent);
    let queryParams = new HttpParams().set('symbol', _.join(encodedSymbols, ','));
    
    return this.http.get<any>(`${this.BASE_URL}nseProxy`, {params: queryParams});
  }

  postTrades(accountId: number, csvPayload: string): Observable<any> {
    return this.http.put(`${this.BASE_URL}accounts/${accountId}/trades`,
      csvPayload,
      {
        headers: new HttpHeaders().set('Content-Type', 'text/csv'),
        observe: 'response',
        responseType: 'text'
      }).map(this.checkSuccess)
      .catch(this.throwError);
  }

  private checkSuccess(res: HttpResponse<any>): any {
    console.log('Status = %s Text = %s Body = %s', res.status, res.statusText, res.body);
    return res.status === 200;
  }
  private throwError(err: any) {
    if (err.error instanceof Error) {
      console.error('Client err:' + err);
    } else {
      console.error('Server error' + err);
      return Observable.throw(err.error);
    }
  }

}

interface JsonData {
  data: any;
}

export interface Holding{
  date : string,
  stock: string,
  qty : number,
  price : number,
  age_months : number,
  notes : string,
}
