import { async, inject, TestBed } from '@angular/core/testing';

import { AuthenticationGoAwayGuard } from './authentication-go-away.guard';

describe('AuthenticationGoAwayGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationGoAwayGuard]
    });
  });

  it('should ...', inject([AuthenticationGoAwayGuard], (guard: AuthenticationGoAwayGuard) => {
    expect(guard).toBeTruthy();
  }));
});
