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
import { DentistService } from '../../../services/clinic/dentist.service';
import { Dentist } from '../../../models/clinic';

@Component({
  selector: 'app-dentist-getall',
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
  styleUrls: ['./getall.css'],
})
export class Getall implements OnInit, OnDestroy {
  dentists: Dentist[] = [];
  loading = false;
  private subscription = new Subscription();

  constructor(
    private dentistService: DentistService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadDentists();

    // Escuchar cambios en el servicio
    this.subscription.add(
      this.dentistService.dentists$.subscribe((dentists) => (this.dentists = dentists)),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  loadDentists(): void {
    this.loading = true;
    this.subscription.add(
      this.dentistService.getAllDentists().subscribe({
        next: (dentists) => {
          this.dentists = dentists;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los dentistas',
          });
          this.loading = false;
        },
      }),
    );
  }

  confirmDelete(dentist: Dentist): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar a ${dentist.dentistName} ${dentist.dentistLastName}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteDentist(dentist.id!),
    });
  }

  deleteDentist(id: number): void {
    this.subscription.add(
      this.dentistService.deleteDentist(id).subscribe({
        next: () =>
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Dentista eliminado correctamente',
          }),
        error: (err) => {
          console.error(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el dentista',
          });
        },
      }),
    );
  }
}
