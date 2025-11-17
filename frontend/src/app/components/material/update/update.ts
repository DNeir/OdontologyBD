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
import { MaterialService } from '../../../services/inventory/material.service';
import { Material } from '../../../models/inventory';

@Component({
  selector: 'app-material-update',
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

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private materialService: MaterialService, private messageService: MessageService) {
    this.form = this.fb.group({ materialName: ['', [Validators.required]], materialDescription: [''], materialStock: [0, [Validators.required]] });
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
        this.router.navigate(['/materials']);
      }
    }
  }

  private load(id: number): void {
    this.loading = true;
    this.materialService.getMaterialById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (m: Material) => {
        this.form.patchValue({ materialName: m.materialName, materialDescription: m.materialDescription ?? '', materialStock: m.materialStock });
        this.loading = false;
      },
      error: (err) => {
        console.error('load material', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar' });
        this.loading = false;
        setTimeout(() => this.router.navigate(['/materials']), 800);
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

    const payload: Material = { materialName: this.f['materialName'].value, materialDescription: this.f['materialDescription'].value || null, materialStock: Number(this.f['materialStock'].value) };

    this.saving = true;
    const request$ = this.id ? this.materialService.updateMaterial(this.id, payload) : this.materialService.createMaterial(payload);
    request$.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Material guardado' });
        this.router.navigate(['/materials']);
      },
      error: (err) => {
        console.error('save material', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/materials']);
  }
}
