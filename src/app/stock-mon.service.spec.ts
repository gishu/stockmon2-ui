import { TestBed, inject } from '@angular/core/testing';

import { StockMonService } from './stock-mon.service';

describe('StockMonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StockMonService]
    });
  });

  it('should be created', inject([StockMonService], (service: StockMonService) => {
    expect(service).toBeTruthy();
  }));
});
