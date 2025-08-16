import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmCancelDialogComponent } from '../confirm-cancel-dialog/confirm-cancel-dialog';
import { OrderStatusService } from '../../core/order-status.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-details',
  standalone: false,
  templateUrl: './order-details.html',
  styleUrl: './order-details.scss'
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  order: any = null;
  loading = true;
  error = '';

  private orderId: number | null = null;
  private subs: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private dialog: MatDialog,
    private orderStatus: OrderStatusService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Invalid order id';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.orderId = id;

    // start SignalR if not already
    this.orderStatus.start().catch(err => console.warn('SignalR start failed', err));

    // subscribe updates
    this.subs.push(
      this.orderStatus.orderUpdated$.subscribe((order: any) => {
        if (order && this.orderId && order.orderId === this.orderId) {
          // update displayed order
          this.order = order;
          this.cdr.detectChanges();
        }
      })
    );
    this.loadOrder(id);
    this.cdr.detectChanges();
  }

  loadOrder(id: number) {
    this.loading = true;
    this.error = '';
    this.api.getOrderById(id).subscribe({
      next: (data) => {
        this.order = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load order', err);
        this.error = 'Failed to load order';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onBack() {
    this.router.navigate(['/orders']).then(() => {
      this.cdr.detectChanges();
    });
  }

  onCancelOrder() {
    if (!this.order || !this.order.orderId) return;

    const ref = this.dialog.open(ConfirmCancelDialogComponent, {
      width: '420px',
      data: { orderId: this.order.orderId }
    });

    ref.afterClosed().subscribe((result) => {
      // result === true means cancellation succeeded (dialog closed after showing "Order cancelled")
      if (result === true) {
        // navigate back to orders list
        this.router.navigate(['/orders']).then(() => {
          this.cdr.detectChanges();
        });
      } else {
        // do nothing; user cancelled or deletion failed
        // optionally refresh order (in case status changed)
        const id = this.order?.orderId;
        if (id) {
          this.loadOrder(id);
          this.cdr.detectChanges();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.cdr.detectChanges();
  }
}
