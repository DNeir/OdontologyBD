import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Payment } from '../../models/inventory';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private baseUrl = 'http://127.0.0.1:8000/api/inventory/payments';
  private paymentsSubject = new BehaviorSubject<Payment[]>([]);
  public payments$ = this.paymentsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<PaginatedResponse<Payment>>(`${this.baseUrl}/`).pipe(
      map((res) => res.results),
      tap((p) => this.paymentsSubject.next(p)),
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.baseUrl}/${id}/`).pipe(
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  createPayment(data: Payment): Observable<Payment> {
    return this.http
      .post<Payment>(`${this.baseUrl}/`, data)
      .pipe(tap(() => this.refreshPayments()));
  }

  updatePayment(id: number, data: Partial<Payment>): Observable<Payment> {
    return this.http
      .put<Payment>(`${this.baseUrl}/${id}/`, data)
      .pipe(tap(() => this.refreshPayments()));
  }

  deletePayment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`).pipe(tap(() => this.refreshPayments()));
  }

  refreshPayments(): void {
    this.getAllPayments().subscribe({
      next: (p) => this.paymentsSubject.next(p),
      error: (err) => console.error('refreshPayments', err),
    });
  }
}
