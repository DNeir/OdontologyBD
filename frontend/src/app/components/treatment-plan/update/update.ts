import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TreatmentPlanService } from '../../../services/clinic/treatment-plan.service';
import { PatientService } from '../../../services/patient/patient.service';
import { DentistService } from '../../../services/clinic/dentist.service';
import { TreatmentPlan } from '../../../models/clinic';
import { Patient } from '../../../models/patient';
import { Dentist } from '../../../models/clinic';

@Component({
  selector: 'app-treatment-plan-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SelectModule, InputTextModule, ButtonModule, CardModule, ToastModule, DatePickerModule],
  providers: [MessageService],
  templateUrl: './update.html',
  styleUrls: ['./update.css'],
})
export class Update implements OnInit {
  form: FormGroup;
  saving = false;
  loading = false;
  id: number | null = null;
  patients: Patient[] = [];
  dentists: Dentist[] = [];
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private planService: TreatmentPlanService, private patientService: PatientService, private dentistService: DentistService, private messageService: MessageService) {
    this.form = this.fb.group({
      planPatient: ['', [Validators.required]],
      planDentist: ['', [Validators.required]],
      planStartDate: ['', [Validators.required]],
      planEndDate: [''],
      planStatus: ['ACTIVE', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const parsed = Number(idParam);
      if (!Number.isNaN(parsed)) {
        this.id = parsed;
        this.loadData(parsed);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID inválido' });
        this.router.navigate(['/treatment-plans']);
      }
    }
  }

  private loadData(id: number): void {
    this.loading = true;
    this.patientService.getAllPatients().subscribe({
      next: (data) => (this.patients = data),
      error: (err) => console.error('load patients', err),
    });

    this.dentistService.getAllDentists().subscribe({
      next: (data) => (this.dentists = data),
      error: (err) => console.error('load dentists', err),
    });

    this.planService.getPlanById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (p: any) => {
        this.form.patchValue({
          planPatient: p.planPatient,
          planDentist: p.planDentist,
          planStartDate: p.planStartDate ? new Date(p.planStartDate) : '',
          planEndDate: p.planEndDate ? new Date(p.planEndDate) : '',
          planStatus: p.planStatus,
        });
        this.loading = false;
      },
      error: (err: any) => {
        console.error('load plan', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar' });
        this.loading = false;
        setTimeout(() => this.router.navigate(['/treatment-plans']), 800);
      },
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const startDate = this.f['planStartDate'].value;
    const endDate = this.f['planEndDate'].value;
    const payload: TreatmentPlan = {
      planPatient: Number(this.f['planPatient'].value),
      planDentist: Number(this.f['planDentist'].value),
      planStartDate: startDate ? (typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0]) : '',
      planEndDate: endDate ? (typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0]) : null,
      planStatus: this.f['planStatus'].value,
    };

    this.saving = true;
    const request$ = this.id ? this.planService.updatePlan(this.id, payload) : this.planService.createPlan(payload);
    request$.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Plan guardado' });
        this.router.navigate(['/treatment-plans']);
      },
      error: (err: any) => {
        console.error('save plan', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/treatment-plans']);
  }
}
