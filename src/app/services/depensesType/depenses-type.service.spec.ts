import { TestBed } from '@angular/core/testing';

import { DepensesTypeService } from './depenses-type.service';

describe('DepensesTypeService', () => {
  let service: DepensesTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepensesTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
