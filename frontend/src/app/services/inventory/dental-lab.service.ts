import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { DentalLab } from '../../models/inventory';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response';

@Injectable({ providedIn: 'root' })
export class DentalLabService {
  private baseUrl = 'http://127.0.0.1:8000/api/inventory/dental-labs';
  private labsSubject = new BehaviorSubject<DentalLab[]>([]);
  public labs$ = this.labsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllLabs(): Observable<DentalLab[]> {
    return this.http.get<PaginatedResponse<DentalLab>>(`${this.baseUrl}/`).pipe(
      map((res) => res.results),
      tap((l) => this.labsSubject.next(l)),
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
      return this.http.get<any>(`${this.baseUrl}/`).pipe(
        map((response) => Array.isArray(response) ? response : response.results),
        tap((labs) => {
          this.labsSubject.next(labs);
        }),
        catchError((error) => {
          console.error('Error fetching dental labs:', error);
          return throwError(() => error);
        }),
      );
  }

  getLabById(id: number): Observable<DentalLab> {
    return this.http.get<DentalLab>(`${this.baseUrl}/${id}/`).pipe(
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  createLab(data: DentalLab): Observable<DentalLab> {
    return this.http.post<DentalLab>(`${this.baseUrl}/`, data).pipe(tap(() => this.refreshLabs()));
  }

  updateLab(id: number, data: Partial<DentalLab>): Observable<DentalLab> {
    return this.http
      .put<DentalLab>(`${this.baseUrl}/${id}/`, data)
      .pipe(tap(() => this.refreshLabs()));
  }

  deleteLab(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`).pipe(tap(() => this.refreshLabs()));
  }

  refreshLabs(): void {
    this.getAllLabs().subscribe({
      next: (l) => this.labsSubject.next(l),
      error: (err) => console.error('refreshLabs', err),
    });
  }
}
