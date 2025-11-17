import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Procedure } from '../../models/clinic';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response';

@Injectable({ providedIn: 'root' })
export class ProcedureService {
  private baseUrl = 'http://127.0.0.1:8000/api/clinic/procedures';
  private proceduresSubject = new BehaviorSubject<Procedure[]>([]);
  public procedures$ = this.proceduresSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllProcedures(): Observable<Procedure[]> {
    return this.http.get<PaginatedResponse<Procedure>>(`${this.baseUrl}/`).pipe(
      map((res) => res.results),
      tap((p) => this.proceduresSubject.next(p)),
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  getProcedureById(id: number): Observable<Procedure> {
    return this.http.get<Procedure>(`${this.baseUrl}/${id}/`).pipe(
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  createProcedure(data: Procedure): Observable<Procedure> {
    return this.http
      .post<Procedure>(`${this.baseUrl}/`, data)
      .pipe(tap(() => this.refreshProcedures()));
  }

  updateProcedure(id: number, data: Partial<Procedure>): Observable<Procedure> {
    return this.http
      .put<Procedure>(`${this.baseUrl}/${id}/`, data)
      .pipe(tap(() => this.refreshProcedures()));
  }

  deleteProcedure(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(tap(() => this.refreshProcedures()));
  }

  refreshProcedures(): void {
    this.getAllProcedures().subscribe({
      next: (p) => this.proceduresSubject.next(p),
      error: (err) => console.error('refreshProcedures', err),
    });
  }
}
