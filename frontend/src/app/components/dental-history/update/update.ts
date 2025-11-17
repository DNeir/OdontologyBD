import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DentalHistoryService } from '../../../services/patient/dental-history.service';
import { PatientService } from '../../../services/patient/patient.service';
import { DentalHistory, Patient } from '../../../models/patient';

@Component({
  selector: 'app-dental-history-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, CardModule, ToastModule, SelectModule],
  providers: [MessageService],
  templateUrl: './update.html',
  styleUrls: ['./update.css'],
})
export class Update implements OnInit, OnDestroy {
  form: FormGroup;
  saving = false;
  loading = false;
  id: number | null = null;
  patients: Patient[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private dhService: DentalHistoryService,
    private patientService: PatientService,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({ historyPatient: [null, [Validators.required]], historyAnamnesis: [''] });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const parsed = Number(idParam);
      if (!Number.isNaN(parsed)) {
        this.id = parsed;
        this.patientService.getAllPatients().pipe(takeUntil(this.destroy$)).subscribe({ next: (p) => (this.patients = p) });
        this.load(parsed);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID inválido' });
        this.router.navigate(['/dental-histories']);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private load(id: number): void {
    this.loading = true;
    this.dhService.getHistoryById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (h: DentalHistory) => {
        this.form.patchValue({ historyPatient: h.historyPatient, historyAnamnesis: h.historyAnamnesis ?? '' });
        this.loading = false;
      },
      error: (err: any) => {
        console.error('load dental history', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar' });
        this.loading = false;
        setTimeout(() => this.router.navigate(['/dental-histories']), 800);
      },
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Formulario inválido', detail: 'Revisa los campos requeridos' });
      return;
    }

    const payload: DentalHistory = { historyPatient: this.f['historyPatient'].value, historyAnamnesis: this.f['historyAnamnesis'].value || null };

    this.saving = true;
    const request$ = this.id ? this.dhService.updateHistory(this.id, payload) : this.dhService.createHistory(payload);
    request$.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Historial guardado' });
        this.router.navigate(['/dental-histories']);
      },
      error: (err: any) => {
        console.error('save dental history', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/dental-histories']);
  }
}
