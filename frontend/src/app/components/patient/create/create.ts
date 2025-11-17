import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PatientService } from '../../../services/patient/patient.service';
import { Patient } from '../../../models/patient';

@Component({
  selector: 'app-patient-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
})
export class Create implements OnInit, OnDestroy {
  form: FormGroup;
  saving = false;
  public loading = false;
  public id: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      patientName: ['', [Validators.required, Validators.maxLength(120)]],
      patientLastName: ['', [Validators.required, Validators.maxLength(120)]],
      patientBirthDate: [''],
      patientPhone: [''],
      patientAddress: [''],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const parsed = Number(idParam);
      if (!Number.isNaN(parsed)) {
        this.id = parsed;
        this.loadPatient(parsed);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'ID de paciente inválido',
        });
        // navigate back to list
        this.router.navigate(['/patients']);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPatient(id: number): void {
    this.loading = true;
    this.patientService
      .getPatientById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (p: Patient) => {
          // patch form with values
          this.form.patchValue({
            patientName: p.patientName,
            patientLastName: p.patientLastName,
            patientBirthDate: p.patientBirthDate ?? '',
            patientPhone: p.patientPhone ?? '',
            patientAddress: p.patientAddress ?? '',
          });
          this.loading = false;
        },
        error: (err) => {
          console.error('loadPatient', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar el paciente',
          });
          this.loading = false;
          // fallback to list
          setTimeout(() => this.router.navigate(['/patients']), 800);
        },
      });
  }

  get controls() {
    return this.form.controls as { [key: string]: any };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Revisa los campos requeridos',
      });
      return;
    }

    const payload: Patient = {
      patientName: this.controls['patientName'].value,
      patientLastName: this.controls['patientLastName'].value,
      patientBirthDate: this.controls['patientBirthDate'].value || null,
      patientPhone: this.controls['patientPhone'].value || null,
      patientAddress: this.controls['patientAddress'].value || null,
    };

    this.saving = true;
    const request$ = this.id
      ? this.patientService.updatePatient(this.id, payload)
      : this.patientService.createPatient(payload);

    request$.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        const action = this.id ? 'actualizado' : 'creado';
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: `Paciente ${action} correctamente`,
        });
        this.router.navigate(['/patients']);
      },
      error: (err) => {
        console.error('savePatient', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ocurrió un error al guardar',
        });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/patients']);
  }
}
