import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MainStoreService } from 'src/app/main/main-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  isLoggedIn: BehaviorSubject<boolean>;

  constructor(
    private router: Router,
    private mainStoreService: MainStoreService
  ) {
    this.isLoggedIn = mainStoreService.isLoggedIn;
  }

  title = 'WebSocket App';

  toggleLogin($event: Event) {
    $event.preventDefault();
    this.mainStoreService.toggleLogin();
  }

  goToStock($event: Event) {
    $event.preventDefault();
    this.router.navigateByUrl('/demo/stock');
  }

  goToChat($event: Event) {
    $event.preventDefault();
    this.router.navigateByUrl('/demo/chat');
  }
}
