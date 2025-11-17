import { Component, OnInit } from '@angular/core';
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
import { TreatmentMaterialService } from '../../../services/clinic/treatment-material.service';
import { TreatmentService } from '../../../services/clinic/treatment.service';
import { MaterialService } from '../../../services/inventory/material.service';
import { TreatmentMaterial } from '../../../models/clinic';
import { Treatment } from '../../../models/clinic';
import { Material } from '../../../models/inventory';

@Component({
  selector: 'app-material-treatment-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SelectModule, InputTextModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './update.html',
  styleUrls: ['./update.css'],
})
export class Update implements OnInit {
  form: FormGroup;
  saving = false;
  loading = false;
  id: number | null = null;
  treatments: Treatment[] = [];
  materials: Material[] = [];
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private tmService: TreatmentMaterialService, private treatmentService: TreatmentService, private materialService: MaterialService, private messageService: MessageService) {
    this.form = this.fb.group({
      tmTreatment: ['', [Validators.required]],
      tmMaterial: ['', [Validators.required]],
      tmQuantity: ['', [Validators.required, Validators.min(0)]],
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
        this.router.navigate(['/material-treatments']);
      }
    }
  }

  private loadData(id: number): void {
    this.loading = true;
    this.treatmentService.getAllTreatments().subscribe({
      next: (data) => (this.treatments = data),
      error: (err) => console.error('load treatments', err),
    });

    this.materialService.getAllMaterials().subscribe({
      next: (data) => (this.materials = data),
      error: (err) => console.error('load materials', err),
    });

    this.tmService.getTreatmentMaterialById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (tm: TreatmentMaterial) => {
        this.form.patchValue({
          tmTreatment: tm.tmTreatment,
          tmMaterial: tm.tmMaterial,
          tmQuantity: tm.tmQuantity,
        });
        this.loading = false;
      },
      error: (err: any) => {
        console.error('load material treatment', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar' });
        this.loading = false;
        setTimeout(() => this.router.navigate(['/material-treatments']), 800);
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

    const payload: TreatmentMaterial = {
      tmTreatment: Number(this.f['tmTreatment'].value),
      tmMaterial: Number(this.f['tmMaterial'].value),
      tmQuantity: Number(this.f['tmQuantity'].value),
    };

    this.saving = true;
    const request$ = this.id ? this.tmService.updateTreatmentMaterial(this.id, payload) : this.tmService.createTreatmentMaterial(payload);
    request$.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Material de tratamiento guardado' });
        this.router.navigate(['/material-treatments']);
      },
      error: (err: any) => {
        console.error('save material treatment', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/material-treatments']);
  }
}
