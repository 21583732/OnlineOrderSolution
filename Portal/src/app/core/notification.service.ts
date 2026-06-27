import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private cartAddedSubject = new Subject<string>();
  cartAdded$ = this.cartAddedSubject.asObservable();

  notifyCartAdded(message: string) {
    this.cartAddedSubject.next(message);
  }
}