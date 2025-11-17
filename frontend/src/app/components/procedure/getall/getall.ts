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
import { ProcedureService } from '../../../services/clinic/procedure.service';
import { Procedure } from '../../../models/clinic';

@Component({
  selector: 'app-procedure-getall',
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
  procedures: Procedure[] = [];
  loading = false;
  private sub = new Subscription();

  constructor(
    private procedureService: ProcedureService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadProcedures();
    this.sub.add(this.procedureService.procedures$.subscribe((p) => (this.procedures = p)));
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadProcedures(): void {
    this.loading = true;
    this.sub.add(
      this.procedureService.getAllProcedures().subscribe({
        next: (p) => {
          this.procedures = p;
          this.loading = false;
        },
        error: (e) => {
          console.error(e);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los procedimientos',
          });
          this.loading = false;
        },
      }),
    );
  }

  confirmDelete(procedure: Procedure): void {
    this.confirmationService.confirm({
      message: `¿Eliminar procedimiento #${procedure.id}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteProcedure(procedure.id!),
    });
  }
  deleteProcedure(id: number): void {
    this.sub.add(
      this.procedureService.deleteProcedure(id).subscribe({
        next: () =>
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Procedimiento eliminado',
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
