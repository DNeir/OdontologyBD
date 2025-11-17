import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DentalHistory } from '../../models/patient';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response';

@Injectable({ providedIn: 'root' })
export class DentalHistoryService {
  private baseUrl = 'http://127.0.0.1:8000/api/patients/histories';
  private historiesSubject = new BehaviorSubject<DentalHistory[]>([]);
  public histories$ = this.historiesSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllHistories(): Observable<DentalHistory[]> {
    return this.http.get<PaginatedResponse<DentalHistory>>(`${this.baseUrl}/`).pipe(
      map((res) => res.results),
      tap((h) => this.historiesSubject.next(h)),
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  getHistoryById(id: number): Observable<DentalHistory> {
    return this.http.get<DentalHistory>(`${this.baseUrl}/${id}/`).pipe(
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  createHistory(data: DentalHistory): Observable<DentalHistory> {
    return this.http
      .post<DentalHistory>(`${this.baseUrl}/`, data)
      .pipe(tap(() => this.refreshHistories()));
  }

  updateHistory(id: number, data: Partial<DentalHistory>): Observable<DentalHistory> {
    return this.http
      .put<DentalHistory>(`${this.baseUrl}/${id}/`, data)
      .pipe(tap(() => this.refreshHistories()));
  }

  deleteHistory(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(tap(() => this.refreshHistories()));
  }

  refreshHistories(): void {
    this.getAllHistories().subscribe({
      next: (h) => this.historiesSubject.next(h),
      error: (err) => console.error('refreshHistories', err),
    });
  }
}
