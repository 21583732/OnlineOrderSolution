import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../core/cart.service';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { AppStateService } from '../../core/app-state.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent implements OnInit {
  cart: any = null;
  loading = true;
  error = '';
  checkingOut = false;

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private appState: AppStateService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    const clientId = this.auth.getUserIdFromToken();

    if (!clientId) {
      this.error = 'Not authenticated';
      this.loading = false;
      return;
    }

    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'Failed to load cart';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onQuantityChange(item: any, event: Event) {
    const qty = Number((event.target as HTMLInputElement).value);
    if (!qty || qty <= 0) return;

    this.cartService.updateQuantity(item.cartItemId, qty).subscribe({
      next: () => {
        item.quantity = qty;
        this.recalculateTotal();
        this.appState.refreshCartCount();
        this.cdr.detectChanges();
      }
    });
  }

  removeItem(item: any) {
    this.cartService.removeItem(item.cartItemId).subscribe({
      next: () => {
        this.cart.items = this.cart.items.filter(
          (i: any) => i.cartItemId !== item.cartItemId
        );

        this.recalculateTotal();
        this.appState.refreshCartCount();
        this.cdr.detectChanges();
      }
    });
  }

  checkout() {
    this.checkingOut = true;

    this.cartService.checkout().subscribe({
      next: () => {
        this.checkingOut = false;

        this.appState.refreshCartCount();
        this.appState.refreshNewOrdersCount();

        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.checkingOut = false;
        this.error = 
            err.error?.message || 'Checkout failed';

        if (err.error?.message?.includes('complete your profile')) {
          this.router.navigate(['/profile']);
        }
      }
    });
  }

  recalculateTotal() {
    if (!this.cart?.items) return;

    this.cart.total = this.cart.items.reduce(
      (sum: number, i: any) => sum + i.unitPrice * i.quantity,
      0
    );
  }
}