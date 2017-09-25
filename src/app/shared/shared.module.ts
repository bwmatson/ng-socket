import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ChatService } from 'shared.service/chat.service';
import { StockService } from 'shared.service/stock.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    ChatService,
    StockService
  ]
})
export class SharedModule { }
