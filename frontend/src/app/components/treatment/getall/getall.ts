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
import { TreatmentService } from '../../../services/clinic/treatment.service';
import { Treatment } from '../../../models/clinic';

@Component({
  selector: 'app-treatment-getall',
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
  treatments: Treatment[] = [];
  loading = false;
  private sub = new Subscription();

  constructor(
    private treatmentService: TreatmentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadTreatments();
    this.sub.add(this.treatmentService.treatments$.subscribe((t) => (this.treatments = t)));
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadTreatments(): void {
    this.loading = true;
    this.sub.add(
      this.treatmentService.getAllTreatments().subscribe({
        next: (t) => {
          this.treatments = t;
          this.loading = false;
        },
        error: (e) => {
          console.error(e);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los tratamientos',
          });
          this.loading = false;
        },
      }),
    );
  }

  confirmDelete(treatment: Treatment): void {
    this.confirmationService.confirm({
      message: `¿Eliminar ${treatment.treatmentName}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteTreatment(treatment.id!),
    });
  }
  deleteTreatment(id: number): void {
    this.sub.add(
      this.treatmentService.deleteTreatment(id).subscribe({
        next: () =>
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Tratamiento eliminado',
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
