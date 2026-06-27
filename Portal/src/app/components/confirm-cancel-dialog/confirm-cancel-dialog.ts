import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../core/api.service';
import { AppStateService } from '../../core/app-state.service';

@Component({
  selector: 'app-confirm-cancel-dialog',
  standalone: false,
  templateUrl: './confirm-cancel-dialog.html',
  styleUrl: './confirm-cancel-dialog.scss'
})
export class ConfirmCancelDialogComponent {
  loading = false;
  message = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { orderId: number },
    private dialogRef: MatDialogRef<ConfirmCancelDialogComponent>,
    private api: ApiService,
    private appState: AppStateService,
    private cdr: ChangeDetectorRef
  ) {}

  onNo() {
    this.dialogRef.close(false);
  }

  onYes() {
    if (!this.data?.orderId) {
      this.message = 'Invalid order id';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.message = '';

    this.api.deleteOrder(this.data.orderId).subscribe({
      next: () => {
        this.loading = false;
        this.message = 'Order cancelled';

        this.appState.refreshNewOrdersCount();

        this.cdr.detectChanges();

        setTimeout(() => this.dialogRef.close(true), 1200);
      },
      error: (err) => {
        this.loading = false;
        this.message = err?.error?.message || 'Failed to cancel order';
        this.cdr.detectChanges();
      }
    });
  }
}