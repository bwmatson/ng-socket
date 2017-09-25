import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AuthenticationGuard } from 'shared.guard/authentication.guard';
import { MainStoreService } from 'src/app/main/main-store.service';
import { routeComponents, MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main/main.component';

@NgModule({
  declarations: [
    MainComponent,
    routeComponents,
  ],
  imports: [
    BrowserModule,
    MainRoutingModule // needs to be last import to ensure routes are correct
  ],
  providers: [
    MainStoreService,
    {
      provide: AuthenticationGuard,
      useClass: AuthenticationGuard
    }
  ],
  bootstrap: [MainComponent]
})
export class MainModule { }
