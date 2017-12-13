import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class StockMonService {

  constructor(private http: HttpClient) { }

  getStockNames(): Observable<any> {
    return this.http.get<JsonData>('http://localhost:3123/stocks')
      .map(results => results.data)
      .catch(this.throwError);
  }

  postTrades(accountId: number, csvPayload: string): Observable<any> {
    return this.http.put('http://localhost:3123/accounts/' + accountId + '/trades', csvPayload,
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
