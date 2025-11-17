import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  selector: 'app-procedure-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SelectModule, InputTextModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './update.html',
  styleUrls: ['./update.css'],
})
export class Update implements OnInit, OnDestroy {
  form: FormGroup;
  saving = false;
  loading = false;
  id: number | null = null;
  plans: any[] = [];
  treatments: Treatment[] = [];
  teeth: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private procedureService: ProcedureService,
    private treatmentService: TreatmentService,
    private planService: TreatmentPlanService,
    private toothService: ToothService,
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
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const parsed = Number(idParam);
      if (!Number.isNaN(parsed)) {
        this.id = parsed;
        this.loadLookups();
        this.loadProcedure(parsed);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID inválido' });
        this.router.navigate(['/procedures']);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadLookups(): void {
    this.planService.getAllPlans().pipe(takeUntil(this.destroy$)).subscribe({ next: (p) => (this.plans = p) });
    this.treatmentService.getAllTreatments().pipe(takeUntil(this.destroy$)).subscribe({ next: (t) => (this.treatments = t) });
    this.toothService.getAllTeeth().pipe(takeUntil(this.destroy$)).subscribe({ next: (t) => (this.teeth = t) });
  }

  private loadProcedure(id: number): void {
    this.loading = true;
    this.procedureService.getProcedureById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (pr: Procedure) => {
        this.form.patchValue({
          procedurePlan: pr.procedurePlan,
          procedureTreatment: pr.procedureTreatment,
          procedureTooth: pr.procedureTooth ?? '',
          procedureDate: pr.procedureDate,
          procedureNotes: pr.procedureNotes ?? '',
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('load procedure', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar' });
        this.loading = false;
        setTimeout(() => this.router.navigate(['/procedures']), 800);
      },
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({ severity: 'warn', summary: 'Formulario inválido', detail: 'Revise los campos' });
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
    const request$ = this.id ? this.procedureService.updateProcedure(this.id, payload) : this.procedureService.createProcedure(payload);
    request$.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Procedimiento guardado' });
        this.router.navigate(['/procedures']);
      },
      error: (err) => {
        console.error('save procedure', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/procedures']);
  }
}
