import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Appointment } from '../../models/patient';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private baseUrl = 'http://127.0.0.1:8000/api/patients/appointments';
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  public appointments$ = this.appointmentsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllAppointments(): Observable<Appointment[]> {
    return this.http.get<PaginatedResponse<Appointment>>(`${this.baseUrl}/`).pipe(
      map((res) => res.results),
      tap((a) => this.appointmentsSubject.next(a)),
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.baseUrl}/${id}/`).pipe(
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  createAppointment(data: Appointment): Observable<Appointment> {
    return this.http
      .post<Appointment>(`${this.baseUrl}/`, data)
      .pipe(tap(() => this.refreshAppointments()));
  }

  updateAppointment(id: number, data: Partial<Appointment>): Observable<Appointment> {
    return this.http
      .put<Appointment>(`${this.baseUrl}/${id}/`, data)
      .pipe(tap(() => this.refreshAppointments()));
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(tap(() => this.refreshAppointments()));
  }

  refreshAppointments(): void {
    this.getAllAppointments().subscribe({
      next: (a) => this.appointmentsSubject.next(a),
      error: (err) => console.error('refreshAppointments', err),
    });
  }
}
