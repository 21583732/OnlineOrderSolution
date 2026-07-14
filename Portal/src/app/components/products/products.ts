import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddToCartComponent } from '../add-to-cart/add-to-cart';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/notification.service';
import { AppStateService } from '../../core/app-state.service';

@Component({
    selector: 'app-products',
    standalone: false,
    templateUrl: './products.html',
    styleUrl: './products.scss'
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  loading = true;

  constructor(
    private api: ApiService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private router: Router,
    private notify: NotificationService,
    private appState: AppStateService
  ) {}

  ngOnInit() {
    this.api.getProducts().subscribe({
        next: (data) => {
          console.log('Products from API:', data);
          this.products = data.map((p: any) => ({
              ...p,
              inStock: !!p.inStock
        }));
        this.loading = false; // ✅ Ensure loading is switched off
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false; // ✅ Even on error, turn off loading
        this.cdr.detectChanges();
      }
  });
}

openNewOrder(product: any) {
  const ref = this.dialog.open(AddToCartComponent, {
    width: '420px',
    data: product
  });

  ref.afterClosed().subscribe(result => {
  if (result) {

    //this.notify.notifyCartAdded('Added to cart successfully');

    this.appState.refreshCartCount();

    this.router.navigate(['/products']).then(() => {
      this.cdr.detectChanges();
    });
  }
});
}
}
