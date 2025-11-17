import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { TreatmentService } from '../../../services/clinic/treatment.service';
import { Treatment } from '../../../models/clinic';

@Component({
  selector: 'app-treatment-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
})
export class Create {
  form: FormGroup;
  saving = false;

  constructor(private fb: FormBuilder, private treatmentService: TreatmentService, private router: Router, private messageService: MessageService) {
    this.form = this.fb.group({ treatmentName: ['', [Validators.required, Validators.maxLength(150)]], treatmentDescription: [''], treatmentCost: [0] });
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
    this.treatmentService.createTreatment(payload).pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tratamiento creado' });
        this.router.navigate(['/treatments']);
      },
      error: (err) => {
        console.error('create treatment', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/treatments']);
  }
}
