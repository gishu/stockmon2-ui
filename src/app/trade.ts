import * as _ from 'lodash';
export class Trade {
    constructor(public stock: string, public date: Date, public qty: number, public price: number, public brokerage: number, public notes: string, public isBuy : boolean) {

    }
    amount() {
        return _.round(this.qty * this.price - this.brokerage, 2);
    }
}
