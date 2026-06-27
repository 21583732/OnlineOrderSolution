import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../../core/notification.service';
import { Subscription } from 'rxjs';
import { AppStateService } from '../../core/app-state.service';

@Component({
  selector: 'app-navbar-private',
  standalone: false,
  templateUrl: './navbar-private.html',
  styleUrl: './navbar-private.scss'
})
export class NavbarPrivateComponent implements OnInit {

  cartCount = 0;
  newOrdersCount = 0;

  constructor(private appState: AppStateService) {}

  ngOnInit(): void {

    this.appState.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    this.appState.newOrdersCount$.subscribe(count => {
      this.newOrdersCount = count;
    });

    this.appState.refreshCartCount();
    this.appState.refreshNewOrdersCount();
  }
}
