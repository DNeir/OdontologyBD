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
import { PatientService } from '../../../services/patient/patient.service';
import { Patient } from '../../../models/patient';

@Component({
  selector: 'app-patient-getall',
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
  patients: Patient[] = [];
  loading = false;
  private sub = new Subscription();

  constructor(
    private patientService: PatientService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadPatients();

    // mantengo sincronización con el servicio (BehaviorSubject)
    this.sub.add(this.patientService.patients$.subscribe((p) => (this.patients = p)));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadPatients(): void {
    this.loading = true;
    this.sub.add(
      this.patientService.getAllPatients().subscribe({
        next: (patients) => {
          this.patients = patients;
          this.loading = false;
        },
        error: (err) => {
          console.error('loadPatients', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los pacientes',
          });
          this.loading = false;
        },
      }),
    );
  }

  confirmDelete(patient: Patient): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea eliminar a ${patient.patientName} ${patient.patientLastName}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (patient.id != null) {
          this.deletePatient(patient.id);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'ID de paciente inválido',
          });
        }
      },
    });
  }

  deletePatient(id: number): void {
    this.sub.add(
      this.patientService.deletePatient(id).subscribe({
        next: () =>
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Paciente eliminado correctamente',
          }),
        error: (err) => {
          console.error('deletePatient', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar el paciente',
          });
        },
      }),
    );
  }
}
