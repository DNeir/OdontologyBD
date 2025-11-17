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
import { TreatmentMaterialService } from '../../../services/clinic/treatment-material.service';
import { TreatmentMaterial } from '../../../models/clinic';

@Component({
  selector: 'app-treatment-material-getall',
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
  tms: TreatmentMaterial[] = [];
  loading = false;
  private sub = new Subscription();

  constructor(
    private tmService: TreatmentMaterialService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadTMs();
    this.sub.add(this.tmService.treatmentMaterials$.subscribe((tms) => (this.tms = tms)));
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadTMs(): void {
    this.loading = true;
    this.sub.add(
      this.tmService.getAllTreatmentMaterials().subscribe({
        next: (tms) => {
          this.tms = tms;
          this.loading = false;
        },
        error: (e) => {
          console.error(e);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los materiales',
          });
          this.loading = false;
        },
      }),
    );
  }

  confirmDelete(tm: TreatmentMaterial): void {
    this.confirmationService.confirm({
      message: `¿Eliminar registro #${tm.id}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteTM(tm.id!),
    });
  }
  deleteTM(id: number): void {
    this.sub.add(
      this.tmService.deleteTreatmentMaterial(id).subscribe({
        next: () =>
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Material eliminado',
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
