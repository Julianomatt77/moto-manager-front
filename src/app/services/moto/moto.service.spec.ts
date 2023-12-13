import { TestBed } from '@angular/core/testing';

import { MotoService } from './moto.service';

describe('MotoService', () => {
  let service: MotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
