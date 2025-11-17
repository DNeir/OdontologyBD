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
import { AppointmentService } from '../../../services/patient/appointment.service';
import { PatientService } from '../../../services/patient/patient.service';
import { DentistService } from '../../../services/clinic/dentist.service';
import { Appointment } from '../../../models/patient';

@Component({
  selector: 'app-appointment-getall',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, ConfirmDialogModule, ToastModule, TooltipModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './getall.html',
  styleUrls: ['./getall.css'],
})
export class Getall implements OnInit, OnDestroy {
  appointments: Appointment[] = [];
  loading = false;
  private sub = new Subscription();

  constructor(
    private appointmentService: AppointmentService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadAppointments();
    this.sub.add(this.appointmentService.appointments$.subscribe((a) => (this.appointments = a)));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadAppointments(): void {
    this.loading = true;
    this.sub.add(
      this.appointmentService.getAllAppointments().subscribe({
        next: (res) => {
          this.appointments = res;
          this.loading = false;
        },
        error: (err) => {
          console.error('loadAppointments', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las citas' });
          this.loading = false;
        },
      }),
    );
  }

  confirmDelete(appointment: Appointment): void {
    this.confirmationService.confirm({
      message: `¿Eliminar cita #${appointment.id}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (appointment.id != null) {
          this.deleteAppointment(appointment.id);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID inválido' });
        }
      },
    });
  }

  deleteAppointment(id: number): void {
    this.sub.add(
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () =>
          this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cita eliminada correctamente' }),
        error: (err) => {
          console.error('deleteAppointment', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la cita' });
        },
      }),
    );
  }
}
