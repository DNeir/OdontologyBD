import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [PanelMenu],
  templateUrl: './aside.html',
  styleUrl: './aside.css',
})
export class Aside {
  items: MenuItem[] | undefined;
  ngOnInit() {
    this.items = [
      {
        label: 'Clínica',
        icon: 'pi pi-fw pi-plus',
        items: [
          {
            label: 'Dentistas',
            icon: 'pi pi-fw pi-users-plus',
          },
          {
            label: 'Procedimientos',
            icon: 'pi pi-fw pi-address-book',
          },
          {
            label: 'Piezas Dentales',
            icon: 'pi pi-fw pi-box',
          },
          {
            label: 'Tratamiento de Materiales',
            icon: 'pi pi-fw pi-hammer',
          },
          {
            label: 'Plan de Tratamientos',
            icon: 'pi pi-fw pi-calendar-clock',
          },
          {
            label: 'Tratamientos',
            icon: 'pi pi-fw pi-clipboard',
          },
        ],
      },
      {
        label: 'Inventario',
        icon: 'pi pi-fw pi-shopping-bag',
        items: [
          {
            label: 'Materiales',
            icon: 'pi pi-fw pi-briefcase',
          },
          {
            label: 'Laboratorio Dental',
            icon: 'pi pi-fw pi-home',
          },
          {
            label: 'Método de Pago',
            icon: 'pi pi-fw pi-wallet',
          },
        ],
      },
      {
        label: 'Pacientes',
        icon: 'pi pi-fw pi-users-plus',
        items: [
          {
            label: 'Citas',
            icon: 'pi pi-fw pi-calendar',
          },
          {
            label: 'Historia Odontológica',
            icon: 'pi pi-fw pi-file',
          },
          {
            label: 'Pacientes',
            icon: 'pi pi-fw pi-user',
          },
        ],
      },
    ];
  }
}
