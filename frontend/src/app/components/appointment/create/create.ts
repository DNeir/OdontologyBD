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
import { AppointmentService } from '../../../services/patient/appointment.service';
import { PatientService } from '../../../services/patient/patient.service';
import { DentistService } from '../../../services/clinic/dentist.service';
import { Appointment, Patient } from '../../../models/patient';
import { Dentist } from '../../../models/clinic';

@Component({
  selector: 'app-appointment-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, CardModule, ToastModule, SelectModule],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
})
export class Create implements OnInit, OnDestroy {
  form: FormGroup;
  saving = false;
  loading = false;
  patients: Patient[] = [];
  dentists: Dentist[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private dentistService: DentistService,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      appointmentPatient: [null, [Validators.required]],
      appointmentDentist: [null, [Validators.required]],
      appointmentDateTime: ['', [Validators.required]],
      appointmentReason: [''],
    });
  }

  ngOnInit(): void {
    this.loadLookups();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadLookups(): void {
    this.loading = true;
    this.patientService.getAllPatients().pipe(takeUntil(this.destroy$)).subscribe({
      next: (p) => (this.patients = p),
      error: (err) => console.error('load patients', err),
    });
    this.dentistService.getAllDentists().pipe(takeUntil(this.destroy$)).subscribe({
      next: (d) => (this.dentists = d),
      error: (err) => console.error('load dentists', err),
      complete: () => (this.loading = false),
    });
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

    const payload: Appointment = {
      appointmentPatient: this.f['appointmentPatient'].value,
      appointmentDentist: this.f['appointmentDentist'].value,
      appointmentDateTime: this.f['appointmentDateTime'].value,
      appointmentReason: this.f['appointmentReason'].value || null,
    };

    this.saving = true;
    this.appointmentService
      .createAppointment(payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cita creada correctamente' });
          this.router.navigate(['/appointments']);
        },
        error: (err) => {
          console.error('create appointment', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear la cita' });
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/appointments']);
  }
}
