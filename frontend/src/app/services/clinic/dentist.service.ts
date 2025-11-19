import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dentist } from '../../models/clinic';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response';

@Injectable({
  providedIn: 'root',
})
export class DentistService {
  private baseUrl = 'http://127.0.0.1:8000/api/clinic/dentists';
  private dentistsSubject = new BehaviorSubject<Dentist[]>([]);
  public dentists$ = this.dentistsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllDentists(): Observable<Dentist[]> {
    return this.http.get<any>(`${this.baseUrl}/`).pipe(
      map((response) => Array.isArray(response) ? response : response.results),
      tap((dentists) => {
        console.log('Fetched dentists:', dentists);
        this.dentistsSubject.next(dentists);
      }),
      catchError((error) => {
        console.error('Error fetching dentists:', error);
        return throwError(() => error);
      }),
    );
  }

  getDentistById(id: number): Observable<Dentist> {
    return this.http.get<Dentist>(`${this.baseUrl}/${id}/`).pipe(
      catchError((error) => {
        console.error('Error fetching dentist:', error);
        return throwError(() => error);
      }),
    );
  }

  createDentist(dentist: Dentist): Observable<Dentist> {
    return this.http.post<Dentist>(`${this.baseUrl}/`, dentist).pipe(
      tap((response) => {
        console.log('Dentist created:', response);
        this.refreshDentists();
      }),
      catchError((error) => {
        console.error('Error creating dentist:', error);
        return throwError(() => error);
      }),
    );
  }

  updateDentist(id: number, dentist: Partial<Dentist>): Observable<Dentist> {
    return this.http.put<Dentist>(`${this.baseUrl}/${id}/`, dentist).pipe(
      tap((response) => {
        console.log('Dentist updated:', response);
        this.refreshDentists();
      }),
      catchError((error) => {
        console.error('Error updating dentist:', error);
        return throwError(() => error);
      }),
    );
  }

  deleteDentist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`).pipe(
      tap(() => {
        console.log('Dentist deleted:', id);
        this.refreshDentists();
      }),
      catchError((error) => {
        console.error('Error deleting dentist:', error);
        return throwError(() => error);
      }),
    );
  }

  refreshDentists(): void {
    this.getAllDentists().subscribe({
      next: (dentists) => {
        this.dentistsSubject.next(dentists);
      },
      error: (error) => {
        console.error('Error refreshing dentists:', error);
      },
    });
  }
}
