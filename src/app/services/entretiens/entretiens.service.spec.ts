import { TestBed } from '@angular/core/testing';

import { EntretiensService } from './entretiens.service';

describe('EntretiensService', () => {
  let service: EntretiensService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntretiensService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
