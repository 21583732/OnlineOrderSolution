import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CartService } from '../../core/cart.service';

@Component({
    selector: 'app-add-to-cart',
    standalone: false,
    templateUrl: './add-to-cart.html',
    styleUrl: './add-to-cart.scss'
})
export class AddToCartComponent {

  quantity = 1;
  submitting = false;
  successMessage = '';
  error = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public product: any,
    private dialogRef: MatDialogRef<AddToCartComponent>,
      private cart: CartService,
      private cdr: ChangeDetectorRef
    ) {}

    addToCart() {
      if (!this.quantity || this.quantity <= 0) {
          this.error = 'Quantity must be at least 1';
          return;
        }

        this.submitting = true;
        this.error = '';
        this.successMessage = '';
        this.cdr.detectChanges();

        this.cart.addToCart(this.product.productId, this.quantity).subscribe({
            next: () => {
              this.submitting = false;
              this.successMessage = 'Added to cart';
              this.cdr.detectChanges();

              setTimeout(() => {
                this.dialogRef.close(true);
              }, 700);
            },
            error: (err) => {
              this.submitting = false;
              this.error = err?.error?.message || 'Failed to add to cart';
              this.cdr.detectChanges();
            }
        });
      }

      cancel() {
        this.dialogRef.close(false);
      }
    }