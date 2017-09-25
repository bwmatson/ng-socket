import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthenticationGuard } from 'shared.guard/authentication.guard';

@Injectable()
export class MainStoreService {
  isLoggedIn: BehaviorSubject<boolean>;

  constructor(
    private isAuthenticated: AuthenticationGuard,
  ) {
    this.isLoggedIn = this.isAuthenticated.isLoggedIn;
   }

  toggleLogin() {
    this.isLoggedIn.next(!this.isLoggedIn.getValue());
  }

}
