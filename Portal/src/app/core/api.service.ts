import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiService {
  private baseUrl = 'http://localhost:5240/api';
  //readonly
  constructor(private http: HttpClient) {}

  // Products
  getProducts(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Products`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Products/${id}`);
  }


  // Register client
  registerClient(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Clients/register`, data);
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/Clients/login`, { username, password });
  }

  getClients(): Observable<any> {
    return this.http.get(`${this.baseUrl}/clients`);
  }


  // Orders
  
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders`);
  }
  
  // Orders
  createOrder(order: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, order);
  }

  getOrdersForClient(clientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/orders/client/${clientId}`);
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/orders/${id}`);
  }

  deleteOrder (id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/orders/${id}`);
  }

  //Profile
  getClientById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/Clients/${id}`);
  }
}
