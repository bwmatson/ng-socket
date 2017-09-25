import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class AuthenticationGuard implements CanActivate, CanActivateChild, CanLoad {
  isLoggedIn = new BehaviorSubject(false);
  loginRedirectUrl = '';

  constructor(
    private router: Router,
  ) {
    this.isLoggedIn.subscribe(isLoggedIn => isLoggedIn ? router.navigateByUrl('') : router.navigateByUrl(this.loginRedirectUrl));
  }

  public canLoad(route: Route): Observable<boolean> {
    if (!route.data) {
      return Observable.of(true);
    }
    this.loginRedirectUrl = route.data['loginRedirectUrl'];
    return this.checkAuthentication();
  }

  public canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean> {
    this.loginRedirectUrl = route.data['loginRedirectUrl'];
    return this.checkAuthentication();
  }

  public canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    while ((!route.data || !route.data['loginRedirectUrl']) && route.parent) {
      route = route.parent;
    }
    return this.canActivate(route, state);
  }

  protected checkAuthentication(): Observable<boolean> {
    if (this.isLoggedIn.getValue()) {
      return Observable.of(true);
    } else {
      this.router.navigate([this.loginRedirectUrl]);
      return Observable.of(false);
    }
  }

}
