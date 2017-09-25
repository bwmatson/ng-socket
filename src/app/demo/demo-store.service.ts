import { Injectable } from '@angular/core';
import { ChatService } from 'shared.service/chat.service';
import { ReadFileService } from 'shared.service/read-file.service';
import { StockService } from 'shared.service/stock.service';

@Injectable()
export class DemoStoreService {

  constructor(
    private chatService: ChatService,
    private stockService: StockService
  ) { }

  chatConnect() {
    return this.chatService.connect();
  }

  chatDisconnect() {
    return this.chatService.disconnect();
  }

  chatSendMessage(message: string) {
    return this.chatService.sendMessage(message);
  }

  stockConnect() {
    return this.stockService.connect();
  }

  stockDisconnect() {
    return this.stockService.disconnect();
  }

  loadJSON(file: string) {
    return ReadFileService.loadJSON(file);
  }
}
