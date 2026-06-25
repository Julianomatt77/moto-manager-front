import { TestBed } from '@angular/core/testing';

import { authGuard } from './auth.guard';

describe('authGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });
});
