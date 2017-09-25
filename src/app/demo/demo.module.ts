import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DemoStoreService } from 'src/app/demo/demo-store.service';
import { SharedModule } from '../shared/shared.module';
import { routeComponents, DemoRoutingModule } from './demo-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    DemoRoutingModule,
  ],
  declarations: [
    routeComponents
  ],
  providers: [
    DemoStoreService
  ]
})
export class DemoModule { }
