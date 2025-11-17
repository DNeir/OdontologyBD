import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { MaterialService } from '../../../services/inventory/material.service';
import { Material } from '../../../models/inventory';

@Component({
  selector: 'app-material-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
})
export class Create {
  form: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private materialService: MaterialService,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      materialName: ['', [Validators.required, Validators.maxLength(150)]],
      materialDescription: ['', [Validators.maxLength(500)]],
      materialStock: [0, [Validators.required, Validators.min(0)]],
    });
  }

  get controls() {
    return this.form.controls as { [key: string]: any };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor complete los campos requeridos',
      });
      return;
    }

    const payload: Material = {
      materialName: this.controls['materialName'].value,
      materialDescription: this.controls['materialDescription'].value || null,
      materialStock: Number(this.controls['materialStock'].value) ?? 0,
    };

    this.saving = true;
    this.materialService
      .createMaterial(payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Material creado correctamente',
          });
          this.router.navigate(['/materials']);
        },
        error: (err) => {
          console.error('createMaterial', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el material',
          });
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/materials']);
  }
}
