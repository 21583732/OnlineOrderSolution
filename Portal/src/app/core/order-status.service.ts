import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Subject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class OrderStatusService {
  private hubUrl = 'http://localhost:5240/orderHub';
  private connection: HubConnection | null = null;

  private orderUpdatedSubject = new Subject<any>();
  orderUpdated$ = this.orderUpdatedSubject.asObservable();

  constructor(private auth: AuthService) {}

  start(): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      return Promise.resolve();
    }

    this.connection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => this.auth.getToken() || ''
      })
      .withAutomaticReconnect()
      .build();

    this.connection.on('OrderUpdated', (order: any) => {
      this.orderUpdatedSubject.next(order);
      // NO SIDE EFFECTS HERE
    });

    return this.connection.start().catch(err => {
      console.error('SignalR connection error:', err);
      throw err;
    });
  }

  stop(): Promise<void> {
    return this.connection?.stop() ?? Promise.resolve();
  }
}