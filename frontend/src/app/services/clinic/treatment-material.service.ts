import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { TreatmentMaterial } from '../../models/clinic';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response';

@Injectable({ providedIn: 'root' })
export class TreatmentMaterialService {
  private baseUrl = 'http://127.0.0.1:8000/api/clinic/treatment_materials';
  private tmsSubject = new BehaviorSubject<TreatmentMaterial[]>([]);
  public treatmentMaterials$ = this.tmsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllTreatmentMaterials(): Observable<TreatmentMaterial[]> {
    return this.http.get<any>(`${this.baseUrl}/`).pipe(
      map((response) => Array.isArray(response) ? response : response.results),
      tap((tms) => this.tmsSubject.next(tms)),
      catchError((e) => {
        console.error('Error fetching treatment materials:', e);
        return throwError(() => e);
      }),
    );
  }

  getTreatmentMaterialById(id: number): Observable<TreatmentMaterial> {
    return this.http.get<TreatmentMaterial>(`${this.baseUrl}/${id}/`).pipe(
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  createTreatmentMaterial(data: TreatmentMaterial): Observable<TreatmentMaterial> {
    return this.http.post<TreatmentMaterial>(`${this.baseUrl}/`, data).pipe(
      tap(() => this.refreshTreatmentMaterials()),
      catchError((e) => {
        console.error('Error creating treatment material:', e);
        return throwError(() => e);
      })
    );
  }

  updateTreatmentMaterial(id: number, data: Partial<TreatmentMaterial>): Observable<TreatmentMaterial> {
    return this.http.put<TreatmentMaterial>(`${this.baseUrl}/${id}/`, data).pipe(
      tap(() => this.refreshTreatmentMaterials()),
      catchError((e) => {
        console.error('Error updating treatment material:', e);
        return throwError(() => e);
      })
    );
  }

  deleteTreatmentMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`).pipe(
      tap(() => this.refreshTreatmentMaterials()),
      catchError((e) => {
        console.error('Error deleting treatment material:', e);
        return throwError(() => e);
      })
    );
  }

  refreshTreatmentMaterials(): void {
    this.getAllTreatmentMaterials().subscribe({
      next: (tms: TreatmentMaterial[]) => this.tmsSubject.next(tms),
      error: (err: any) => console.error('refreshTreatmentMaterials', err),
    });
  }
}
