import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { environment } from 'root.environments/environment';

@Injectable()
export class ChatService {
  endpoint: string;
  socket: WebSocket;
  connectTimeout: number;
  tryReconnect: boolean;
  private data = new Subject<string>();

  constructor(
  ) {
    const protocal = location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.endpoint = `${protocal}//${environment.chat.endpoint}`;
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
        console.log('service receive', e.data);
        this.data.next(e.data);
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
}
