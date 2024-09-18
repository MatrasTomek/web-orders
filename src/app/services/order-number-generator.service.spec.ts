import { TestBed } from '@angular/core/testing';

import { OrderNumberGeneratorService } from './order-number-generator.service';

describe('OrderNumberGeneratorService', () => {
  let service: OrderNumberGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderNumberGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
