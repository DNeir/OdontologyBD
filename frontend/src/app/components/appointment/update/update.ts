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
import { AppointmentService } from '../../../services/patient/appointment.service';
import { PatientService } from '../../../services/patient/patient.service';
import { DentistService } from '../../../services/clinic/dentist.service';
import { Appointment, Patient } from '../../../models/patient';
import { Dentist } from '../../../models/clinic';

@Component({
  selector: 'app-appointment-update',
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
  dentists: Dentist[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private dentistService: DentistService,
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
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const parsed = Number(idParam);
      if (!Number.isNaN(parsed)) {
        this.id = parsed;
        this.loadLookups();
        this.loadAppointment(parsed);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID inválido' });
        this.router.navigate(['/appointments']);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadLookups(): void {
    this.patientService.getAllPatients().pipe(takeUntil(this.destroy$)).subscribe({ next: (p) => (this.patients = p) });
    this.dentistService.getAllDentists().pipe(takeUntil(this.destroy$)).subscribe({ next: (d) => (this.dentists = d) });
  }

  private loadAppointment(id: number): void {
    this.loading = true;
    this.appointmentService.getAppointmentById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (a: Appointment) => {
        this.form.patchValue({
          appointmentPatient: a.appointmentPatient,
          appointmentDentist: a.appointmentDentist,
          appointmentDateTime: a.appointmentDateTime,
          appointmentReason: a.appointmentReason ?? '',
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('loadAppointment', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la cita' });
        this.loading = false;
        setTimeout(() => this.router.navigate(['/appointments']), 800);
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

    const payload: Appointment = {
      appointmentPatient: this.f['appointmentPatient'].value,
      appointmentDentist: this.f['appointmentDentist'].value,
      appointmentDateTime: this.f['appointmentDateTime'].value,
      appointmentReason: this.f['appointmentReason'].value || null,
    };

    this.saving = true;
    const request$ = this.id ? this.appointmentService.updateAppointment(this.id, payload) : this.appointmentService.createAppointment(payload);

    request$.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        const action = this.id ? 'actualizada' : 'creada';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Cita ${action} correctamente` });
        this.router.navigate(['/appointments']);
      },
      error: (err) => {
        console.error('saveAppointment', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/appointments']);
  }
}
