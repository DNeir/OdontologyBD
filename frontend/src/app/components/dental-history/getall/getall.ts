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
import { DentalHistoryService } from '../../../services/patient/dental-history.service';
import { DentalHistory } from '../../../models/patient';

@Component({
  selector: 'app-dental-history-getall',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule, TooltipModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css'],
})
export class Getall implements OnInit, OnDestroy {
  histories: DentalHistory[] = [];
  loading = false;
  private sub = new Subscription();

  constructor(private dhService: DentalHistoryService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.load();
    this.sub.add(this.dhService.histories$.subscribe((h) => (this.histories = h)));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.sub.add(
      this.dhService.getAllHistories().subscribe({
        next: (res: any) => {
          this.histories = res;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('load histories', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las historias' });
          this.loading = false;
        },
      }),
    );
  }

  confirmDelete(h: DentalHistory): void {
    this.confirmationService.confirm({
      message: `¿Eliminar historia #${h.id}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (h.id != null) {
          this.delete(h.id);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID inválido' });
        }
      },
    });
  }

  delete(id: number): void {
    this.sub.add(
      this.dhService.deleteHistory(id).subscribe({
        next: () => this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Historia eliminada' }),
        error: (err: any) => {
          console.error('delete history', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' });
        },
      }),
    );
  }
}
