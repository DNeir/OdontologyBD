import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Treatment } from '../../models/clinic';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response';

@Injectable({ providedIn: 'root' })
export class TreatmentService {
  private baseUrl = 'http://127.0.0.1:8000/api/clinic/treatments';
  private treatmentsSubject = new BehaviorSubject<Treatment[]>([]);
  public treatments$ = this.treatmentsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllTreatments(): Observable<Treatment[]> {
    return this.http.get<PaginatedResponse<Treatment>>(`${this.baseUrl}/`).pipe(
      map((response) => Array.isArray(response) ? response : response.results),
      tap((t) => this.treatmentsSubject.next(t)),
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  getTreatmentById(id: number): Observable<Treatment> {
    return this.http.get<Treatment>(`${this.baseUrl}/${id}/`).pipe(
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  createTreatment(data: Treatment): Observable<Treatment> {
    return this.http
      .post<Treatment>(`${this.baseUrl}/`, data)
      .pipe(tap(() => this.refreshTreatments()));
  }

  updateTreatment(id: number, data: Partial<Treatment>): Observable<Treatment> {
    return this.http
      .put<Treatment>(`${this.baseUrl}/${id}/`, data)
      .pipe(tap(() => this.refreshTreatments()));
  }

  deleteTreatment(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(tap(() => this.refreshTreatments()));
  }

  refreshTreatments(): void {
    this.getAllTreatments().subscribe({
      next: (t) => this.treatmentsSubject.next(t),
      error: (err) => console.error('refreshTreatments', err),
    });
  }
}
