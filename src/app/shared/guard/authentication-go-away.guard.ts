import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Route, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationGuard } from 'shared.guard/authentication.guard';

@Injectable()
export class AuthenticationGoAwayGuard extends AuthenticationGuard {
  loginRedirectUrl = '/go-away';

  constructor(injector: Injector) {
    super(injector.get('Router'));
  }

  public canLoad(route: Route): Observable<boolean> {
    if (!route.data) {
      return Observable.of(true);
    }
    return this.checkAuthentication();
  }

  public canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuthentication();
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }

}
