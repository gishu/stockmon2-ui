import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BigNumber } from 'bignumber.js';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  selectedTabIndex: number = 0;
  model: any = {
    accountId: 3,
    filter: '',
    group: 'None'
  };
  formModel: FormGroup;

  accountOptions = [
    { id: 1, name: 'Gishu Hdfc' },
    { id: 2, name: 'Mushu' },
    { id: 3, name: 'Gishu Zerodha' }];
  groupClauses = ['None', 'Stock', 'Month'];


  constructor(private _builder: FormBuilder) {
    this.formModel = _builder.group({
      accountId: this.model.accountId,
      filter: this.model.filter,
      group: this.model.group
    });
  }

  ngOnInit() {
    BigNumber.config({ DECIMAL_PLACES: 5 });

    this.formModel.get('accountId').valueChanges.subscribe(
      newAccountId => this.onAccountChanged(newAccountId)
    );
    this.formModel.get('filter').valueChanges.subscribe(
      filterString => this.applyFilter(filterString)
    );
    this.formModel.get('group').valueChanges.subscribe(
      grouping => this.onGroupChanged(grouping)
    );

    this.onAccountChanged(this.formModel.value.accountId);
  }
  onAccountChanged(accountId) {
    this.model.accountId = accountId;
  }
  onGroupChanged(grouping) {
    this.model.group = grouping;
  }
  applyFilter(filterString) {
    this.model.filter = filterString;
  }
  switchContent(selectedTabIndex){
    this.selectedTabIndex = selectedTabIndex;  
  }

  currentFinYear(): number {
    let today = new Date(Date.now());
    let firstOfApril = Date.UTC(today.getFullYear(), 3, 1, 0, 0, 0, 0);
    return (firstOfApril.valueOf() < today.valueOf()) ? today.getFullYear() : today.getFullYear() - 1;
  }

}
