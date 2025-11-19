import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Patient } from '../../models/patient';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private baseUrl = 'http://127.0.0.1:8000/api/patients/patients';
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  public patients$ = this.patientsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllPatients(): Observable<Patient[]> {
    return this.http.get<PaginatedResponse<Patient>>(`${this.baseUrl}/`).pipe(
      map((response) => Array.isArray(response) ? response : response.results),
      tap((p) => this.patientsSubject.next(p)),
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/${id}/`).pipe(
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  createPatient(data: Patient): Observable<Patient> {
    return this.http
      .post<Patient>(`${this.baseUrl}/`, data)
      .pipe(tap(() => this.refreshPatients()));
  }

  updatePatient(id: number, data: Partial<Patient>): Observable<Patient> {
    return this.http
      .put<Patient>(`${this.baseUrl}/${id}/`, data)
      .pipe(tap(() => this.refreshPatients()));
  }

  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`).pipe(tap(() => this.refreshPatients()));
  }

  refreshPatients(): void {
    this.getAllPatients().subscribe({
      next: (p) => this.patientsSubject.next(p),
      error: (err) => console.error('refreshPatients', err),
    });
  }
}
