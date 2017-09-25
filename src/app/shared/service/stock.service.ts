import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { environment } from 'root.environments/environment';
import { Stock, StockContract } from 'shared.model/stock.model';

@Injectable()
export class StockService {
  endpoint: string;
  socket: WebSocket;
  connectTimeout: number;
  tryReconnect: boolean;
  private data = new Subject<Stock>();

  constructor() {
    const protocal = location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.endpoint = `${protocal}//${environment.stock.endpoint}`;
  }

  connect() {
    console.log('connect', this.endpoint);
    this.tryReconnect = true;
    this.socket = new WebSocket(this.endpoint);

    this.socket.onopen = e => {
        console.log('socket opened', e);
    };

    this.socket.onclose = e => {
        console.log('socket closed', e);
        if (this.tryReconnect) {
          this.connectTimeout = setTimeout(this.connect(), 5000);
        }
    };

    this.socket.onmessage = e => {
        console.log('service recieve', e.data);
        const stock = this.formatData(e.data);
        this.data.next(stock);
    };

    this.socket.onerror = e => {
        console.error(e);
    };

    return this.data;
  }

  disconnect() {
    console.log('disconnect');
    this.tryReconnect = false;
    if ( this.connectTimeout ) {
      clearTimeout(this.connectTimeout);
    }
    this.socket.close();
  }

  sendMessage(message: string) {
    console.log('service send', message);
    this.socket.send(message);
  }

  formatData(response: string): Stock {
    const stock = new Stock();
    const stockResponse: StockContract = JSON.parse(response);
    stock.dateTime = stockResponse.DateTime;
    stock.open = stockResponse.Open;
    stock.close = stockResponse.Close;
    return stock;
  }
}
