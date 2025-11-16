import { Routes } from '@angular/router';

// Dentist
import { Getall as DentistGetall } from './components/dentist/getall/getall';
import { Create as DentistCreate } from './components/dentist/create/create';
import { Update as DentistUpdate } from './components/dentist/update/update';
import { Delete as DentistDelete } from './components/dentist/delete/delete';

// Procedure
import { Getall as ProcedureGetall } from './components/procedure/getall/getall';
import { Create as ProcedureCreate } from './components/procedure/create/create';
import { Update as ProcedureUpdate } from './components/procedure/update/update';
import { Delete as ProcedureDelete } from './components/procedure/delete/delete';

// Teeth
import { Getall as TeethGetall } from './components/teeth/getall/getall';
import { Create as TeethCreate } from './components/teeth/create/create';
import { Update as TeethUpdate } from './components/teeth/update/update';
import { Delete as TeethDelete } from './components/teeth/delete/delete';

// MaterialTreatment
import { Getall as MaterialTreatmentGetall } from './components/material-treatment/getall/getall';
import { Create as MaterialTreatmentCreate } from './components/material-treatment/create/create';
import { Update as MaterialTreatmentUpdate } from './components/material-treatment/update/update';
import { Delete as MaterialTreatmentDelete } from './components/material-treatment/delete/delete';

// TreatmentPlan
import { Getall as TreatmentPlanGetall } from './components/treatment-plan/getall/getall';
import { Create as TreatmentPlanCreate } from './components/treatment-plan/create/create';
import { Update as TreatmentPlanUpdate } from './components/treatment-plan/update/update';
import { Delete as TreatmentPlanDelete } from './components/treatment-plan/delete/delete';

// Treatment
import { Getall as TreatmentGetall } from './components/treatment/getall/getall';
import { Create as TreatmentCreate } from './components/treatment/create/create';
import { Update as TreatmentUpdate } from './components/treatment/update/update';
import { Delete as TreatmentDelete } from './components/treatment/delete/delete';

// Material
import { Getall as MaterialGetall } from './components/material/getall/getall';
import { Create as MaterialCreate } from './components/material/create/create';
import { Update as MaterialUpdate } from './components/material/update/update';
import { Delete as MaterialDelete } from './components/material/delete/delete';

// DentalLab
import { Getall as DentalLabGetall } from './components/dental-lab/getall/getall';
import { Create as DentalLabCreate } from './components/dental-lab/create/create';
import { Update as DentalLabUpdate } from './components/dental-lab/update/update';
import { Delete as DentalLabDelete } from './components/dental-lab/delete/delete';

// Payment
import { Getall as PaymentGetall } from './components/payment/getall/getall';
import { Create as PaymentCreate } from './components/payment/create/create';
import { Update as PaymentUpdate } from './components/payment/update/update';
import { Delete as PaymentDelete } from './components/payment/delete/delete';

// Appointment
import { Getall as AppointmentGetall } from './components/appointment/getall/getall';
import { Create as AppointmentCreate } from './components/appointment/create/create';
import { Update as AppointmentUpdate } from './components/appointment/update/update';
import { Delete as AppointmentDelete } from './components/appointment/delete/delete';

// DentalHistory
import { Getall as DentalHistoryGetall } from './components/dental-history/getall/getall';
import { Create as DentalHistoryCreate } from './components/dental-history/create/create';
import { Update as DentalHistoryUpdate } from './components/dental-history/update/update';
import { Delete as DentalHistoryDelete } from './components/dental-history/delete/delete';

// Patient
import { Getall as PatientGetall } from './components/patient/getall/getall';
import { Create as PatientCreate } from './components/patient/create/create';
import { Update as PatientUpdate } from './components/patient/update/update';
import { Delete as PatientDelete } from './components/patient/delete/delete';

export const routes: Routes = [
  { path: '', redirectTo: '/dentists', pathMatch: 'full' },

  // Dentist
  { path: 'dentists', component: DentistGetall },
  { path: 'dentists/new', component: DentistCreate },
  { path: 'dentists/edit/:id', component: DentistUpdate },
  { path: 'dentists/delete/:id', component: DentistDelete },

  // Procedure
  { path: 'procedures', component: ProcedureGetall },
  { path: 'procedures/new', component: ProcedureCreate },
  { path: 'procedures/edit/:id', component: ProcedureUpdate },
  { path: 'procedures/delete/:id', component: ProcedureDelete },

  // Teeth
  { path: 'dental-pieces', component: TeethGetall },
  { path: 'dental-pieces/new', component: TeethCreate },
  { path: 'dental-pieces/edit/:id', component: TeethUpdate },
  { path: 'dental-pieces/delete/:id', component: TeethDelete },

  // MaterialTreatment
  { path: 'material-treatments', component: MaterialTreatmentGetall },
  { path: 'material-treatments/new', component: MaterialTreatmentCreate },
  { path: 'material-treatments/edit/:id', component: MaterialTreatmentUpdate },
  { path: 'material-treatments/delete/:id', component: MaterialTreatmentDelete },

  // TreatmentPlan
  { path: 'treatment-plans', component: TreatmentPlanGetall },
  { path: 'treatment-plans/new', component: TreatmentPlanCreate },
  { path: 'treatment-plans/edit/:id', component: TreatmentPlanUpdate },
  { path: 'treatment-plans/delete/:id', component: TreatmentPlanDelete },

  // Treatment
  { path: 'treatments', component: TreatmentGetall },
  { path: 'treatments/new', component: TreatmentCreate },
  { path: 'treatments/edit/:id', component: TreatmentUpdate },
  { path: 'treatments/delete/:id', component: TreatmentDelete },

  // Material
  { path: 'materials', component: MaterialGetall },
  { path: 'materials/new', component: MaterialCreate },
  { path: 'materials/edit/:id', component: MaterialUpdate },
  { path: 'materials/delete/:id', component: MaterialDelete },

  // DentalLab
  { path: 'dental-labs', component: DentalLabGetall },
  { path: 'dental-labs/new', component: DentalLabCreate },
  { path: 'dental-labs/edit/:id', component: DentalLabUpdate },
  { path: 'dental-labs/delete/:id', component: DentalLabDelete },

  // Payment
  { path: 'payments', component: PaymentGetall },
  { path: 'payments/new', component: PaymentCreate },
  { path: 'payments/edit/:id', component: PaymentUpdate },
  { path: 'payments/delete/:id', component: PaymentDelete },

  // Appointment
  { path: 'appointments', component: AppointmentGetall },
  { path: 'appointments/new', component: AppointmentCreate },
  { path: 'appointments/edit/:id', component: AppointmentUpdate },
  { path: 'appointments/delete/:id', component: AppointmentDelete },

  // DentalHistory
  { path: 'dental-histories', component: DentalHistoryGetall },
  { path: 'dental-histories/new', component: DentalHistoryCreate },
  { path: 'dental-histories/edit/:id', component: DentalHistoryUpdate },
  { path: 'dental-histories/delete/:id', component: DentalHistoryDelete },

  // Patient
  { path: 'patients', component: PatientGetall },
  { path: 'patients/new', component: PatientCreate },
  { path: 'patients/edit/:id', component: PatientUpdate },
  { path: 'patients/delete/:id', component: PatientDelete },
];
