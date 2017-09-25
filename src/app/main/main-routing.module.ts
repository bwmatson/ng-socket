import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { AuthenticationGuard } from 'shared.guard/authentication.guard';
import { GoAwayComponent } from './go-away/go-away.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'demo',
    pathMatch: 'full',
  },
  {
    path: 'demo',
    loadChildren: 'src/app/demo/demo.module#DemoModule',
    canLoad: [AuthenticationGuard],
    data: { loginRedirectUrl: '/login'},
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'go-away',
    component: GoAwayComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule { }

export const routeComponents = [
  LoginComponent,
  GoAwayComponent,
];
