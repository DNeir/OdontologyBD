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
import { TreatmentPlanService } from '../../../services/clinic/treatment-plan.service';
import { TreatmentPlan } from '../../../models/clinic';

@Component({
  selector: 'app-treatment-plan-getall',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './getall.html',
})
export class Getall implements OnInit, OnDestroy {
  plans: TreatmentPlan[] = [];
  loading = false;
  private sub = new Subscription();

  constructor(
    private planService: TreatmentPlanService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadPlans();
    this.sub.add(this.planService.plans$.subscribe((p) => (this.plans = p)));
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadPlans(): void {
    this.loading = true;
    this.sub.add(
      this.planService.getAllPlans().subscribe({
        next: (p) => {
          this.plans = p;
          this.loading = false;
        },
        error: (e) => {
          console.error(e);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los planes',
          });
          this.loading = false;
        },
      }),
    );
  }

  confirmDelete(plan: TreatmentPlan): void {
    this.confirmationService.confirm({
      message: `¿Eliminar plan #${plan.id}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deletePlan(plan.id!),
    });
  }
  deletePlan(id: number): void {
    this.sub.add(
      this.planService.deletePlan(id).subscribe({
        next: () =>
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Plan eliminado',
          }),
        error: (e) =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar',
          }),
      }),
    );
  }
}
