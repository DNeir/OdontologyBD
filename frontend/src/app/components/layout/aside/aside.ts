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
            icon: 'pi pi-fw pi-user-plus',
            routerLink: '/dentists',
          },
          {
            label: 'Procedimientos',
            icon: 'pi pi-fw pi-address-book',
            routerLink: '/procedures',
          },
          {
            label: 'Piezas Dentales',
            icon: 'pi pi-fw pi-box',
            routerLink: '/teeth',
          },
          {
            label: 'Tratamiento de Materiales',
            icon: 'pi pi-fw pi-hammer',
            routerLink: '/material-treatments',
          },
          {
            label: 'Plan de Tratamientos',
            icon: 'pi pi-fw pi-calendar-clock',
            routerLink: '/treatment-plans',
          },
          {
            label: 'Tratamientos',
            icon: 'pi pi-fw pi-clipboard',
            routerLink: '/treatments',
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
            routerLink: '/materials',
          },
          {
            label: 'Laboratorio Dental',
            icon: 'pi pi-fw pi-home',
            routerLink: '/dental-labs',
          },
          {
            label: 'Método de Pago',
            icon: 'pi pi-fw pi-wallet',
            routerLink: '/payments',
          },
        ],
      },
      {
        label: 'Pacientes',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Citas',
            icon: 'pi pi-fw pi-calendar',
            routerLink: '/appointments',
          },
          {
            label: 'Historia Odontológica',
            icon: 'pi pi-fw pi-file',
            routerLink: '/dental-histories',
          },
          {
            label: 'Pacientes',
            icon: 'pi pi-fw pi-user',
            routerLink: '/patients',
          },
        ],
      },
    ];
  }
}
