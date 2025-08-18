// src/app/core/order-status.service.ts
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { Subject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderStatusService {
  private hubUrl = environment.hubUrl;
  private connection: HubConnection | null = null;
  private orderUpdatedSubject = new Subject<any>();

  constructor(private auth: AuthService) {}

  start(): Promise<void> {
    if (this.connection && this.connection.state === HubConnectionState.Connected) {
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
    });

    return this.connection.start().catch(err => {
      console.error('SignalR connection error:', err);
      throw err;
    });
  }

  stop(): Promise<void> {
    if (!this.connection) return Promise.resolve();
    return this.connection.stop();
  }

  get orderUpdated$(): Observable<any> {
    return this.orderUpdatedSubject.asObservable();
  }
}
