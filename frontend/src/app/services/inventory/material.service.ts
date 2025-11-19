import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { Material } from '../../models/inventory';
import { PaginatedResponse } from '../../shared/interfaces/paginated-response';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  private baseUrl = 'http://127.0.0.1:8000/api/inventory/materials';
  private materialsSubject = new BehaviorSubject<Material[]>([]);
  public materials$ = this.materialsSubject.asObservable();

  constructor(private http: HttpClient) {}

  /* ---------- CRUD ---------- */
  getAllMaterials(): Observable<Material[]> {
    return this.http.get<PaginatedResponse<Material>>(`${this.baseUrl}/`).pipe(
      map((response) => Array.isArray(response) ? response : response.results),
      tap((materials) => {
        this.materialsSubject.next(materials);
      }),
      catchError((error) => {
        console.error('Error fetching materials:', error);
        return throwError(() => error);
      }),
    );
  }

  getMaterialById(id: number): Observable<Material> {
    return this.http.get<Material>(`${this.baseUrl}/${id}/`).pipe(
      catchError((e) => {
        console.error(e);
        return throwError(() => e);
      }),
    );
  }

  createMaterial(data: Material): Observable<Material> {
    return this.http
      .post<Material>(`${this.baseUrl}/`, data)
      .pipe(tap(() => this.refreshMaterials()));
  }

  updateMaterial(id: number, data: Partial<Material>): Observable<Material> {
    return this.http
      .put<Material>(`${this.baseUrl}/${id}/`, data)
      .pipe(tap(() => this.refreshMaterials()));
  }

  deleteMaterial(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}/${id}/`)
      .pipe(tap(() => this.refreshMaterials()));
  }

  /* ---------- UTILS ---------- */
  refreshMaterials(): void {
    this.getAllMaterials().subscribe({
      next: (m) => this.materialsSubject.next(m),
      error: (err) => console.error('refreshMaterials', err),
    });
  }
}
