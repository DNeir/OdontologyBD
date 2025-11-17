import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TreatmentService } from '../../../services/clinic/treatment.service';
import { Treatment } from '../../../models/clinic';

@Component({
  selector: 'app-treatment-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './update.html',
  styleUrls: ['./update.css'],
})
export class Update implements OnInit {
  form: FormGroup;
  saving = false;
  loading = false;
  id: number | null = null;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private treatmentService: TreatmentService, private messageService: MessageService) {
    this.form = this.fb.group({ treatmentName: ['', [Validators.required]], treatmentDescription: [''], treatmentCost: [0] });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const parsed = Number(idParam);
      if (!Number.isNaN(parsed)) {
        this.id = parsed;
        this.load(parsed);
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID inválido' });
        this.router.navigate(['/treatments']);
      }
    }
  }

  private load(id: number): void {
    this.loading = true;
    this.treatmentService.getTreatmentById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (t: Treatment) => {
        this.form.patchValue({ treatmentName: t.treatmentName, treatmentDescription: t.treatmentDescription ?? '', treatmentCost: t.treatmentCost ?? 0 });
        this.loading = false;
      },
      error: (err) => {
        console.error('load treatment', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar' });
        this.loading = false;
        setTimeout(() => this.router.navigate(['/treatments']), 800);
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

    const payload: Treatment = { treatmentName: this.f['treatmentName'].value, treatmentDescription: this.f['treatmentDescription'].value || null, treatmentCost: Number(this.f['treatmentCost'].value) || null };
    this.saving = true;
    const request$ = this.id ? this.treatmentService.updateTreatment(this.id, payload) : this.treatmentService.createTreatment(payload);
    request$.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tratamiento guardado' });
        this.router.navigate(['/treatments']);
      },
      error: (err) => {
        console.error('save treatment', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/treatments']);
  }
}
