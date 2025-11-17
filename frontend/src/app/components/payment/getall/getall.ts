import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PaymentService } from '../../../services/inventory/payment.service';
import { Payment } from '../../../models/inventory';

@Component({
  selector: 'app-payment-getall',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule, TooltipModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css'],
})
export class Getall implements OnInit, OnDestroy {
  payments: Payment[] = [];
  loading = false;
  private sub = new Subscription();

  constructor(private paymentService: PaymentService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.load();
    this.sub.add(this.paymentService.payments$.subscribe((p) => (this.payments = p)));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.sub.add(
      this.paymentService.getAllPayments().subscribe({
        next: (res) => {
          this.payments = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('load payments', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los pagos' });
          this.loading = false;
        },
      }),
    );
  }

  confirmDelete(p: Payment): void {
    this.confirmationService.confirm({
      message: `¿Eliminar pago #${p.id}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (p.id != null) {
          this.delete(p.id);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID inválido' });
        }
      },
    });
  }

  delete(id: number): void {
    this.sub.add(
      this.paymentService.deletePayment(id).subscribe({
        next: () => this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Pago eliminado' }),
        error: (err) => {
          console.error('delete payment', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' });
        },
      }),
    );
  }
}
