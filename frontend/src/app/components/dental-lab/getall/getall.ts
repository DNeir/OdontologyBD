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
import { DentalLabService } from '../../../services/inventory/dental-lab.service';
import { DentalLab } from '../../../models/inventory';

@Component({
  selector: 'app-dental-lab-getall',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule, TooltipModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css'],
})
export class Getall implements OnInit, OnDestroy {
  labs: DentalLab[] = [];
  loading = false;
  private sub = new Subscription();

  constructor(private labService: DentalLabService, private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.load();
    this.sub.add(this.labService.labs$.subscribe((l) => (this.labs = l)));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  load(): void {
    this.loading = true;
    this.sub.add(
      this.labService.getAllLabs().subscribe({
        next: (res) => {
          this.labs = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('load labs', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los laboratorios' });
          this.loading = false;
        },
      }),
    );
  }

  confirmDelete(l: DentalLab): void {
    this.confirmationService.confirm({
      message: `¿Eliminar laboratorio #${l.id}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (l.id != null) {
          this.delete(l.id);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID inválido' });
        }
      },
    });
  }

  delete(id: number): void {
    this.sub.add(
      this.labService.deleteLab(id).subscribe({
        next: () => this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Laboratorio eliminado' }),
        error: (err) => {
          console.error('delete lab', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar' });
        },
      }),
    );
  }
}
