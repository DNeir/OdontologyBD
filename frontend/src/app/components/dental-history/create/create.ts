import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
  selector: 'app-dental-history-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, CardModule, ToastModule, SelectModule],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
})
export class Create implements OnInit, OnDestroy {
  form: FormGroup;
  saving = false;
  patients: Patient[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dhService: DentalHistoryService,
    private patientService: PatientService,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      historyPatient: [null, [Validators.required]],
      historyAnamnesis: [''],
    });
  }

  ngOnInit(): void {
    this.patientService.getAllPatients().pipe(takeUntil(this.destroy$)).subscribe({ next: (p) => (this.patients = p) });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Formulario inválido', detail: 'Revise los campos requeridos' });
      return;
    }

    const payload: DentalHistory = {
      historyPatient: this.f['historyPatient'].value,
      historyAnamnesis: this.f['historyAnamnesis'].value || null,
    };

    this.saving = true;
    this.dhService
      .createHistory(payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Historia creada' });
          this.router.navigate(['/dental-histories']);
        },
        error: (err: any) => {
          console.error('create dental history', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' });
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/dental-histories']);
  }
}
