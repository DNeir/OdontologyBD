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
import { ToothService } from '../../../services/clinic/tooth.service';
import { Tooth } from '../../../models/clinic';

@Component({
  selector: 'app-tooth-getall',
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
  teeth: Tooth[] = [];
  loading = false;
  private sub = new Subscription();

  constructor(
    private toothService: ToothService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadTeeth();
    this.sub.add(this.toothService.teeth$.subscribe((t) => (this.teeth = t)));
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadTeeth(): void {
    this.loading = true;
    this.sub.add(
      this.toothService.getAllTeeth().subscribe({
        next: (t) => {
          this.teeth = t;
          this.loading = false;
        },
        error: (e) => {
          console.error(e);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los dientes',
          });
          this.loading = false;
        },
      }),
    );
  }

  confirmDelete(tooth: Tooth): void {
    this.confirmationService.confirm({
      message: `¿Eliminar el diente ${tooth.toothNumber}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteTooth(tooth.id!),
    });
  }
  deleteTooth(id: number): void {
    this.sub.add(
      this.toothService.deleteTooth(id).subscribe({
        next: () =>
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Diente eliminado',
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
