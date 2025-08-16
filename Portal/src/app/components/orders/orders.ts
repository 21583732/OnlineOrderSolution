import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { OrderStatusService } from '../../core/order-status.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders: any[] = [];
  loading = true;
  error = '';

  private subs: Subscription[] = [];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private orderStatus: OrderStatusService
  ) {}

  ngOnInit(): void {
    const clientId = this.auth.getUserIdFromToken();
    if (!clientId) {
      this.error = 'Not authenticated';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    // start SignalR connection (safe to call multiple times)
    this.orderStatus.start().catch(err => console.warn('SignalR start failed', err));
    this.cdr.detectChanges();

    this.subs.push(
      this.orderStatus.orderUpdated$.subscribe((order: any) => {
        // if the order belongs to this client, update list
        if (order.clientId === clientId) {
          const idx = this.orders.findIndex(o => o.orderId === order.orderId);
          if (idx >= 0) {
            this.orders[idx] = order;
          } else {
            // new order — insert at top
            this.orders.unshift(order);
          }
          this.cdr.detectChanges();
        }
      })
    );

    this.api.getOrdersForClient(clientId).subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.error = 'Failed to load orders';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewOrder(orderId: number) {
    this.router.navigate(['/orders', orderId]);
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.cdr.detectChanges();
    // optionally stop connection
    // this.orderStatus.stop();
  }
}
