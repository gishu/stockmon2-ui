import { BigNumber } from 'bignumber.js';

export function asPercent(number) {
    if (!(number instanceof BigNumber)) {
        number = new BigNumber(number)
    }
    return number.round(4).toNumber();
}

export function asCurrency(number) {
    if (!(number instanceof BigNumber)) {
      number = new BigNumber(number)
    }
    return number.round(2).toNumber();
  }
  