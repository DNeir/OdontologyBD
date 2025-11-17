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
import { ToothService } from '../../../services/clinic/tooth.service';
import { Tooth } from '../../../models/clinic';

@Component({
  selector: 'app-tooth-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
})
export class Create {
  form: FormGroup;
  saving = false;

  constructor(private fb: FormBuilder, private toothService: ToothService, private router: Router, private messageService: MessageService) {
    this.form = this.fb.group({ toothNumber: ['', [Validators.required, Validators.maxLength(10)]], toothDescription: [''] });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Tooth = { toothNumber: this.f['toothNumber'].value, toothDescription: this.f['toothDescription'].value || null };
    this.saving = true;
    this.toothService.createTooth(payload).pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Diente creado' });
        this.router.navigate(['/teeth']);
      },
      error: (err) => {
        console.error('create tooth', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/teeth']);
  }
}
