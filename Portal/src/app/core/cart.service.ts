import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { AppStateService } from './app-state.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:5240/api';

  constructor(
  private http: HttpClient,
  private auth: AuthService,
  private appState: AppStateService
) {}

  private getClientId(): number | null {
    return this.auth.getUserIdFromToken();
  }

  getCart(): Observable<any> {
    const clientId = this.getClientId();
    return this.http.get(`${this.baseUrl}/cart/${clientId}`);
  }

  addToCart(productId: number, quantity: number = 1): Observable<any> {
  const clientId = this.getClientId();

  return this.http.post(`${this.baseUrl}/cart/add`, {
    clientId,
    productId,
    quantity
  }).pipe(
    tap(() => {
      this.appState.bumpCart();
    })
  );
}

  updateQuantity(cartItemId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/cart/update`, {
      cartItemId,
      quantity
    });
  }

  removeItem(cartItemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/cart/remove/${cartItemId}`);
  }

  checkout(): Observable<any> {
    const clientId = this.getClientId();
    return this.http.post(`${this.baseUrl}/cart/checkout/${clientId}`, {});
  }
}