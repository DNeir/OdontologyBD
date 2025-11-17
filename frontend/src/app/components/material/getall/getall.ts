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
import { MaterialService } from '../../../services/inventory/material.service';
import { Material } from '../../../models/inventory';

@Component({
  selector: 'app-material-getall',
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
  materials: Material[] = [];
  loading = false;
  private sub = new Subscription();

  constructor(
    private materialService: MaterialService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
    // Keep in sync with service subject
    this.sub.add(this.materialService.materials$.subscribe((m) => (this.materials = m)));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadMaterials(): void {
    this.loading = true;
    this.sub.add(
      this.materialService.getAllMaterials().subscribe({
        next: (m) => {
          this.materials = m;
          this.loading = false;
        },
        error: (err) => {
          console.error('loadMaterials', err);
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

  confirmDelete(material: Material): void {
    this.confirmationService.confirm({
      message: `¿Eliminar ${material.materialName || 'material'}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (material.id != null) {
          this.deleteMaterial(material.id);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'ID inválido' });
        }
      },
    });
  }

  deleteMaterial(id: number): void {
    this.sub.add(
      this.materialService.deleteMaterial(id).subscribe({
        next: () =>
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Material eliminado',
          }),
        error: (err) => {
          console.error('deleteMaterial', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo eliminar',
          });
        },
      }),
    );
  }
}
