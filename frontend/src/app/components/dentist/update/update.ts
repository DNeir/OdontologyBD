import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { DentistService } from '../../../services/clinic/dentist.service';
import { Dentist } from '../../../models/clinic';

@Component({
  selector: 'app-update',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './update.html',
  styleUrl: './update.css',
})
export class Update implements OnInit, OnDestroy {
  form: FormGroup;
  loading = false;
  private id!: number;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private dentistService: DentistService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.form = this.fb.group({
      dentistName: ['', [Validators.required, Validators.maxLength(100)]],
      dentistLastName: ['', [Validators.required, Validators.maxLength(100)]],
      dentistSpecialty: ['', [Validators.maxLength(150)]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const idParam = params.get('id');
      if (!idParam) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'ID de dentista inválido',
        });
        this.router.navigate(['/dentists']);
        return;
      }

      this.id = Number(idParam);
      if (Number.isNaN(this.id)) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'ID de dentista inválido',
        });
        this.router.navigate(['/dentists']);
        return;
      }

      this.loadDentist();
    });
  }

  private loadDentist(): void {
    this.loading = true;
    this.dentistService
      .getDentistById(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (d: Dentist) => {
          this.form.patchValue({
            dentistName: d.dentistName,
            dentistLastName: d.dentistLastName,
            dentistSpecialty: d.dentistSpecialty ?? '',
          });
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading dentist', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar el dentista',
          });
          this.loading = false;
          // Navigate back to list after a short delay to let user see the toast
          setTimeout(() => this.router.navigate(['/dentists']), 1000);
        },
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor verifica los campos requeridos',
      });
      return;
    }

    const payload: Partial<Dentist> = {
      dentistName: this.form.value.dentistName,
      dentistLastName: this.form.value.dentistLastName,
      dentistSpecialty: this.form.value.dentistSpecialty || null,
    };

    this.loading = true;
    this.dentistService
      .updateDentist(this.id, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Dentista actualizado correctamente',
          });
          this.loading = false;
          this.router.navigate(['/dentists']);
        },
        error: (err) => {
          console.error('Error updating dentist', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo actualizar el dentista',
          });
          this.loading = false;
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/dentists']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Helpers for template validation states
  get dentistName() {
    return this.form.get('dentistName');
  }
  get dentistLastName() {
    return this.form.get('dentistLastName');
  }
  get dentistSpecialty() {
    return this.form.get('dentistSpecialty');
  }
}
