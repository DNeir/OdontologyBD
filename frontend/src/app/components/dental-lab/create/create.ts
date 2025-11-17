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
import { DentalLabService } from '../../../services/inventory/dental-lab.service';
import { DentalLab } from '../../../models/inventory';

@Component({
  selector: 'app-dental-lab-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
})
export class Create {
  form: FormGroup;
  saving = false;

  constructor(private fb: FormBuilder, private labService: DentalLabService, private router: Router, private messageService: MessageService) {
    this.form = this.fb.group({ labName: ['', [Validators.required, Validators.maxLength(200)]], labPhone: [''], labAddress: [''] });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: DentalLab = { labName: this.f['labName'].value, labPhone: this.f['labPhone'].value || null, labAddress: this.f['labAddress'].value || null };

    this.saving = true;
    this.labService
      .createLab(payload)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Laboratorio creado' });
          this.router.navigate(['/dental-labs']);
        },
        error: (err) => {
          console.error('create lab', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' });
        },
      });
  }

  cancel(): void {
    this.router.navigate(['/dental-labs']);
  }
}
