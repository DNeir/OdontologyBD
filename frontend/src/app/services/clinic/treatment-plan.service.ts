import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { TreatmentPlan } from '../../models/clinic';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response';

@Injectable({ providedIn: 'root' })
export class TreatmentPlanService {
  private baseUrl = 'http://127.0.0.1:8000/api/clinic/treatment_plans';
  private plansSubject = new BehaviorSubject<TreatmentPlan[]>([]);
  public plans$ = this.plansSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllPlans(): Observable<TreatmentPlan[]> {
    return this.http.get<PaginatedResponse<TreatmentPlan>>(`${this.baseUrl}/`).pipe(
      map((res) => res.results),
      tap((p) => this.plansSubject.next(p)),
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  getPlanById(id: number): Observable<TreatmentPlan> {
    return this.http.get<TreatmentPlan>(`${this.baseUrl}/${id}/`).pipe(
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  createPlan(data: TreatmentPlan): Observable<TreatmentPlan> {
    return this.http
      .post<TreatmentPlan>(`${this.baseUrl}/`, data)
      .pipe(tap(() => this.refreshPlans()));
  }

  updatePlan(id: number, data: Partial<TreatmentPlan>): Observable<TreatmentPlan> {
    return this.http
      .put<TreatmentPlan>(`${this.baseUrl}/${id}/`, data)
      .pipe(tap(() => this.refreshPlans()));
  }

  deletePlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`).pipe(tap(() => this.refreshPlans()));
  }

  refreshPlans(): void {
    this.getAllPlans().subscribe({
      next: (p) => this.plansSubject.next(p),
      error: (err) => console.error('refreshPlans', err),
    });
  }
}
