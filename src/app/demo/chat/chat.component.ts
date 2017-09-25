import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Message } from 'shared.model/message.model';
import { DemoStoreService } from 'src/app/demo/demo-store.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  chatSubscription: Subscription;
  messageList: Array<{text: string, class: string}> = [];
  message = new Message();

  constructor(private demoStoreService: DemoStoreService) { }

  ngOnInit() {
    this.chatSubscription = this.demoStoreService.chatConnect().subscribe(
      text => {
        console.log('component receive:', text);
        this.messageList.push({text: `${text}`, class: 'serverMessage'});
      }
    );
  }

  ngOnDestroy() {
    if ( this.chatSubscription ) {
      this.chatSubscription.unsubscribe();
    }
    this.demoStoreService.chatDisconnect();
  }

  send($event: Event) {
    $event.preventDefault();
    if (!this.message.sender) {
      this.message.sender = 'anon';
    }
    this.demoStoreService.chatSendMessage(`${this.message.sender}: ${this.message.body}`);
    this.messageList.push({text: `${this.message.sender}: ${this.message.body}`, class: 'clientMessage'});
  }
}
