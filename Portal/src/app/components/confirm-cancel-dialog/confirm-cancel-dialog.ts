// confirm-cancel-dialog.ts
import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../core/api.service';

@Component({
  selector: 'app-confirm-cancel-dialog',
  standalone: false,
  templateUrl: './confirm-cancel-dialog.html',
  styleUrl: './confirm-cancel-dialog.scss'
})
export class ConfirmCancelDialogComponent {
  loading = false;
  message = ''; // used to display "Order cancelled" or errors

  // data: expected to contain { orderId: number }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { orderId: number },
    private dialogRef: MatDialogRef<ConfirmCancelDialogComponent>,
    private api: ApiService,
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
    this.cdr.detectChanges();

    this.api.deleteOrder(this.data.orderId).subscribe({
      next: () => {
        // show cancelled message in dialog
        this.loading = false;
        this.message = 'Order cancelled';
        this.cdr.detectChanges();

        // keep message for 3 seconds then close with true
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 3000);
      },
      error: (err) => {
        console.error('Failed to cancel order', err);
        this.loading = false;
        this.message = err?.error?.message || 'Failed to cancel order';
        this.cdr.detectChanges();
      }
    });
  }
}
