import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tooth } from '../../models/clinic';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response';

@Injectable({ providedIn: 'root' })
export class ToothService {
  private baseUrl = 'http://127.0.0.1:8000/api/clinic/tooths';
  private teethSubject = new BehaviorSubject<Tooth[]>([]);
  public teeth$ = this.teethSubject.asObservable();

  constructor(private http: HttpClient) {}

  /* ---------- CRUD ---------- */
  getAllTeeth(): Observable<Tooth[]> {
    return this.http.get<PaginatedResponse<Tooth>>(`${this.baseUrl}/`).pipe(
      map((res) => res.results),
      tap((t) => this.teethSubject.next(t)),
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  getToothById(id: number): Observable<Tooth> {
    return this.http.get<Tooth>(`${this.baseUrl}/${id}/`).pipe(
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  createTooth(data: Tooth): Observable<Tooth> {
    return this.http.post<Tooth>(`${this.baseUrl}/`, data).pipe(tap(() => this.refreshTeeth()));
  }

  updateTooth(id: number, data: Partial<Tooth>): Observable<Tooth> {
    return this.http
      .put<Tooth>(`${this.baseUrl}/${id}/`, data)
      .pipe(tap(() => this.refreshTeeth()));
  }

  deleteTooth(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`).pipe(tap(() => this.refreshTeeth()));
  }

  /* ---------- UTILS ---------- */
  refreshTeeth(): void {
    this.getAllTeeth().subscribe({
      next: (t) => this.teethSubject.next(t),
      error: (err) => console.error('refreshTeeth', err),
    });
  }
}
