import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DentistService } from '../../../services/clinic/dentist.service';
import { Dentist } from '../../../models/clinic';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-dentist-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
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
    private dentistService: DentistService,
    private router: Router,
    private messageService: MessageService,
  ) {
    // Inicializar el formulario reactivo
    this.form = this.fb.group({
      dentistName: ['', [Validators.required, Validators.maxLength(100)]],
      dentistLastName: ['', [Validators.required, Validators.maxLength(100)]],
      dentistSpecialty: ['', [Validators.maxLength(150)]],
    });
  }

  // Getter de conveniencia para controles
  get f() {
    return this.form.controls;
  }

  // Método que se enlaza al submit del formulario
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Dentist = {
      dentistName: this.f['dentistName'].value,
      dentistLastName: this.f['dentistLastName'].value,
      dentistSpecialty: this.f['dentistSpecialty'].value || null,
    };

    this.saving = true;
    this.dentistService
      .createDentist(payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (created) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Dentista creado correctamente',
          });
          // Volver al listado
          this.router.navigate(['/dentists']);
        },
        error: (err) => {
          console.error('Error creando dentista:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo crear el dentista',
          });
        },
      });
  }

  // Cancelar y volver al listado
  cancel(): void {
    this.router.navigate(['/dentists']);
  }
}
