import { TestBed } from '@angular/core/testing';

import { MonopaymentService } from './monopayment.service';

describe('MonopaymentService', () => {
  let service: MonopaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonopaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
