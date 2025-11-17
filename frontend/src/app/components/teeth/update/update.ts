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
import { ToothService } from '../../../services/clinic/tooth.service';
import { Tooth } from '../../../models/clinic';

@Component({
  selector: 'app-tooth-update',
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

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private toothService: ToothService, private messageService: MessageService) {
    this.form = this.fb.group({ toothNumber: ['', [Validators.required]], toothDescription: [''] });
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
        this.router.navigate(['/teeth']);
      }
    }
  }

  private load(id: number): void {
    this.loading = true;
    this.toothService.getToothById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (t: Tooth) => {
        this.form.patchValue({ toothNumber: t.toothNumber, toothDescription: t.toothDescription ?? '' });
        this.loading = false;
      },
      error: (err) => {
        console.error('load tooth', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar' });
        this.loading = false;
        setTimeout(() => this.router.navigate(['/teeth']), 800);
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

    const payload: Tooth = { toothNumber: this.f['toothNumber'].value, toothDescription: this.f['toothDescription'].value || null };
    this.saving = true;
    const request$ = this.id ? this.toothService.updateTooth(this.id, payload) : this.toothService.createTooth(payload);
    request$.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Diente guardado' });
        this.router.navigate(['/teeth']);
      },
      error: (err) => {
        console.error('save tooth', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar' });
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/teeth']);
  }
}
