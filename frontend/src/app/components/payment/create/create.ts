import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PaymentService } from '../../../services/inventory/payment.service';
import { TreatmentPlanService } from '../../../services/clinic/treatment-plan.service';
import { Payment } from '../../../models/inventory';
import { TreatmentPlan } from '../../../models/clinic';

@Component({
  selector: 'app-payment-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, CardModule, ToastModule, SelectModule],
  providers: [MessageService],
  templateUrl: './create.html',
  styleUrls: ['./create.css'],
})
export class Create implements OnInit, OnDestroy {
  form: FormGroup;
  saving = false;
  plans: TreatmentPlan[] = [];
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private paymentService: PaymentService, private planService: TreatmentPlanService, private router: Router, private messageService: MessageService) {
    this.form = this.fb.group({ paymentPlan: [null, [Validators.required]], paymentDateTime: ['', [Validators.required]], paymentAmount: [0, [Validators.required, Validators.min(0)]], paymentMethod: [''] });
  }

  ngOnInit(): void {
    this.planService.getAllPlans().pipe(takeUntil(this.destroy$)).subscribe({ next: (p) => (this.plans = p) });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: Payment = { paymentPlan: this.f['paymentPlan'].value, paymentDateTime: this.f['paymentDateTime'].value, paymentAmount: Number(this.f['paymentAmount'].value), paymentMethod: this.f['paymentMethod'].value || null };

    this.saving = true;
    this.paymentService.createPayment(payload).pipe(finalize(() => (this.saving = false))).subscribe({ next: () => { this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pago creado' }); this.router.navigate(['/payments']); }, error: (err) => { console.error('create payment', err); this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo crear' }); } });
  }

  cancel(): void {
    this.router.navigate(['/payments']);
  }
}
