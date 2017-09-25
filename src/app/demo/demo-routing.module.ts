import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { StockSlideComponent } from './stock-slide/stock-slide.component';
import { StockComponent } from './stock/stock.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'stock',
        pathMatch: 'full'
      },
      {
        path: 'chat',
        component: ChatComponent
      },
      {
        path: 'stock',
        component: StockComponent
      },
      {
        path: 'stock-slide',
        component: StockSlideComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRoutingModule { }

export const routeComponents = [
  ChatComponent,
  StockComponent,
  StockSlideComponent,
];
