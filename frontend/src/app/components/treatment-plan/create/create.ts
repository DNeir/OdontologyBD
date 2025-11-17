import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { TreatmentPlanService } from '../../../services/clinic/treatment-plan.service';
import { PatientService } from '../../../services/patient/patient.service';
import { DentistService } from '../../../services/clinic/dentist.service';
import { TreatmentPlan } from '../../../models/clinic';
import { Patient } from '../../../models/patient';
import { Dentist } from '../../../models/clinic';

@Component({
  selector: 'app-treatment-plan-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SelectModule, InputTextModule, ButtonModule, CardModule, ToastModule, DatePickerModule],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
})
export class Create implements OnInit {
  form: FormGroup;
  saving = false;
  patients: Patient[] = [];
  dentists: Dentist[] = [];

  constructor(private fb: FormBuilder, private planService: TreatmentPlanService, private patientService: PatientService, private dentistService: DentistService, private router: Router, private messageService: MessageService) {
    this.form = this.fb.group({
      planPatient: ['', [Validators.required]],
      planDentist: ['', [Validators.required]],
      planStartDate: ['', [Validators.required]],
      planEndDate: [''],
      planStatus: ['ACTIVE', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data) => (this.patients = data),
      error: (err) => console.error('load patients', err),
    });

    this.dentistService.getAllDentists().subscribe({
      next: (data) => (this.dentists = data),
      error: (err) => console.error('load dentists', err),
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
    this.planService.createPlan(payload).pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Plan creado' });
        this.router.navigate(['/treatment-plans']);
      },
      error: (err: any) => {
        console.error('create plan', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/treatment-plans']);
  }
}
