import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NewOrderComponent } from '../new-order/new-order';
import { Router } from '@angular/router';

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
    private router: Router
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
  const ref = this.dialog.open(NewOrderComponent, {
    width: '420px',
    data: product
  });

  ref.afterClosed().subscribe(result => {
    if (result) {
      // created — optionally navigate to orders or refresh
      console.log('Order created:', result);
      this.router.navigate(['/orders']).then(() => {
        this.cdr.detectChanges();
      })
      // navigate to orders page or show snackbar — keep simple:
      // this.router.navigate(['/orders']);
      // OR refresh orders/products if you want
    }
  });
}
}
