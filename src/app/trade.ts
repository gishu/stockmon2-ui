import * as _ from 'lodash';
export class Buy {
    constructor(public stock: string, public date: Date,
        public qty: number, public price: number, public brokerage: number,
        public notes: string) {

    }
    amount() {
        return _.round(this.qty * this.price + this.brokerage, 2);
    }
    static instance() {
        return new Buy('', new Date(Date.now()), 1, 1, 0, '');
    }
}

export class Sale {
    constructor(public stock: string, public date: Date,
        public qty: number, public price: number, public brokerage: number,
        public notes: string) {

    }
    amount() {
        return _.round(this.qty * this.price - this.brokerage, 2);
    }
    static instance() {
        return new Sale('', new Date(Date.now()), 1, 1, 0, '');
    }
}

export class Dividend {
    constructor(public stock: string, public date: Date,
        public amount: number,
        public notes: string) {

    }
    static instance() {
        return new Dividend('', new Date(Date.now()), 1, '');
    }
}