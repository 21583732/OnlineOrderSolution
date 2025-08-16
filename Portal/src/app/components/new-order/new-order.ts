import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-new-order',
  standalone: false,
  templateUrl: './new-order.html',
  styleUrl: './new-order.scss'
})
export class NewOrderComponent {
  quantity = 1;
  submitting = false;
  error = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public product: any,
    private dialogRef: MatDialogRef<NewOrderComponent>,
    private api: ApiService,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  placeOrder() {
    const clientId = this.auth.getUserIdFromToken();
    if (!clientId) {
      this.error = 'User not authenticated';

      //update
      this.cdr.detectChanges();
      return;
    }

    if (!this.quantity || this.quantity <= 0) {
      this.error = 'Quantity must be at least 1';
      this.cdr.detectChanges();
      return;
    }

    this.submitting = true;
    this.error = '';
    this.cdr.detectChanges();

    const order = {
      clientId: clientId,
      // orderDate will be set by DB default if not provided
      status: 'New',
      orderItems: [
        {
          productId: this.product.productId,
          quantity: this.quantity,
          unitPrice: this.product.price
        }
      ]
    };

    this.api.createOrder(order).subscribe({
      next: (res) => {
        this.submitting = false;
        //update
        this.cdr.detectChanges();
        this.dialogRef.close(res); // optional: return created order
      },
      error: (err) => {
        console.error('Order creation failed', err);
        this.error = err.error?.message || 'Failed to create order';
        this.submitting = false;

        //update
        this.cdr.detectChanges();
      }
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
