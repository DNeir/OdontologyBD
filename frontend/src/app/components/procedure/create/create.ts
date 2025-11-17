import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ProcedureService } from '../../../services/clinic/procedure.service';
import { TreatmentService } from '../../../services/clinic/treatment.service';
import { TreatmentPlanService } from '../../../services/clinic/treatment-plan.service';
import { ToothService } from '../../../services/clinic/tooth.service';
import { Procedure, Treatment } from '../../../models/clinic';

@Component({
  selector: 'app-procedure-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SelectModule, InputTextModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
})
export class Create implements OnInit, OnDestroy {
  form: FormGroup;
  saving = false;
  loading = false;
  plans: any[] = [];
  treatments: Treatment[] = [];
  teeth: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private procedureService: ProcedureService,
    private treatmentService: TreatmentService,
    private planService: TreatmentPlanService,
    private toothService: ToothService,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      procedurePlan: [null, [Validators.required]],
      procedureTreatment: [null, [Validators.required]],
      procedureTooth: [null],
      procedureDate: ['', [Validators.required]],
      procedureNotes: [''],
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
    this.planService.getAllPlans().pipe(takeUntil(this.destroy$)).subscribe({ next: (p) => (this.plans = p), error: (e) => console.error('plans', e) });
    this.treatmentService.getAllTreatments().pipe(takeUntil(this.destroy$)).subscribe({ next: (t) => (this.treatments = t), error: (e) => console.error('treatments', e) });
    this.toothService.getAllTeeth().pipe(takeUntil(this.destroy$)).subscribe({ next: (t) => (this.teeth = t), error: (e) => console.error('teeth', e), complete: () => (this.loading = false) });
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

    const payload: Procedure = {
      procedurePlan: this.f['procedurePlan'].value,
      procedureTreatment: this.f['procedureTreatment'].value,
      procedureTooth: this.f['procedureTooth'].value || null,
      procedureDate: this.f['procedureDate'].value,
      procedureNotes: this.f['procedureNotes'].value || null,
    };

    this.saving = true;
    this.procedureService.createProcedure(payload).pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Procedimiento creado' });
        this.router.navigate(['/procedures']);
      },
      error: (err) => {
        console.error('create procedure', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/procedures']);
  }
}
