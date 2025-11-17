import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { TreatmentMaterialService } from '../../../services/clinic/treatment-material.service';
import { TreatmentService } from '../../../services/clinic/treatment.service';
import { MaterialService } from '../../../services/inventory/material.service';
import { TreatmentMaterial } from '../../../models/clinic';
import { Treatment } from '../../../models/clinic';
import { Material } from '../../../models/inventory';

@Component({
  selector: 'app-material-treatment-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, SelectModule, InputTextModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
})
export class Create implements OnInit {
  form: FormGroup;
  saving = false;
  treatments: Treatment[] = [];
  materials: Material[] = [];

  constructor(private fb: FormBuilder, private tmService: TreatmentMaterialService, private treatmentService: TreatmentService, private materialService: MaterialService, private router: Router, private messageService: MessageService) {
    this.form = this.fb.group({
      tmTreatment: ['', [Validators.required]],
      tmMaterial: ['', [Validators.required]],
      tmQuantity: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.treatmentService.getAllTreatments().subscribe({
      next: (data) => (this.treatments = data),
      error: (err) => console.error('load treatments', err),
    });

    this.materialService.getAllMaterials().subscribe({
      next: (data) => (this.materials = data),
      error: (err) => console.error('load materials', err),
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
    this.tmService.createTreatmentMaterial(payload).pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Material de tratamiento creado' });
        this.router.navigate(['/material-treatments']);
      },
      error: (err: any) => {
        console.error('create material treatment', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/material-treatments']);
  }
}
