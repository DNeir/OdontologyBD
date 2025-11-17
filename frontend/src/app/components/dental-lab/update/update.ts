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
import { DentalLabService } from '../../../services/inventory/dental-lab.service';
import { DentalLab } from '../../../models/inventory';

@Component({
  selector: 'app-dental-lab-update',
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

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private labService: DentalLabService, private messageService: MessageService) {
    this.form = this.fb.group({ labName: ['', [Validators.required]], labPhone: [''], labAddress: [''] });
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
        this.router.navigate(['/dental-labs']);
      }
    }
  }

  private load(id: number): void {
    this.loading = true;
    this.labService.getLabById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (l: DentalLab) => {
        this.form.patchValue({ labName: l.labName, labPhone: l.labPhone ?? '', labAddress: l.labAddress ?? '' });
        this.loading = false;
      },
      error: (err) => {
        console.error('load lab', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar' });
        this.loading = false;
        setTimeout(() => this.router.navigate(['/dental-labs']), 800);
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

    const payload: DentalLab = { labName: this.f['labName'].value, labPhone: this.f['labPhone'].value || null, labAddress: this.f['labAddress'].value || null };

    this.saving = true;
    const request$ = this.id ? this.labService.updateLab(this.id, payload) : this.labService.createLab(payload);
    request$.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Laboratorio guardado' });
        this.router.navigate(['/dental-labs']);
      },
      error: (err) => {
        console.error('save lab', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/dental-labs']);
  }
}
