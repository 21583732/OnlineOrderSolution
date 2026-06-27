import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { OrderStatusService } from './order-status.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  private newOrdersCountSubject = new BehaviorSubject<number>(0);
  newOrdersCount$ = this.newOrdersCountSubject.asObservable();

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private orderStatus: OrderStatusService
  ) {
    this.orderStatus.orderUpdated$.subscribe(order => {
    this.refreshNewOrdersCount();
  });
  }

  refreshCartCount() {
    const clientId = this.auth.getUserIdFromToken();
    if (!clientId) return;

    this.api.getCart(clientId).subscribe((cart: any) => {
      const count = cart?.items?.length ?? 0;
      this.cartCountSubject.next(count);
    });
  }

  refreshNewOrdersCount() {
    const clientId = this.auth.getUserIdFromToken();
    if (!clientId) return;

    this.api.getOrdersForClient(clientId).subscribe((orders: any[]) => {
      const count = orders.filter(o =>
        o.status === 'New' || o.status === 'New-Pending'
      ).length;

      this.newOrdersCountSubject.next(count);
    });
  }

  bumpCart() {
    this.cartCountSubject.next(this.cartCountSubject.value + 1);
  }
}