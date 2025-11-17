export interface Dentist {
  id?: number;
  dentistName: string;
  dentistLastName: string;
  dentistSpecialty?: string | null;
}

export interface Tooth {
  id?: number;
  toothNumber: string;
  toothDescription?: string | null;
}

export interface Treatment {
  id?: number;
  treatmentName: string;
  treatmentDescription?: string | null;
  treatmentCost?: number | null;
}

export type PlanStatus = 'ACTIVE' | 'INACTIVE';

export interface TreatmentPlan {
  id?: number;
  planPatient: number; // ID del paciente
  planDentist: number; // ID del dentista
  planStartDate: string; // ISO date string
  planEndDate?: string | null;
  planStatus: PlanStatus;
}

export interface Procedure {
  id?: number;
  procedurePlan: number; // ID del TreatmentPlan
  procedureTreatment: number; // ID del Treatment
  procedureTooth?: number | null;
  procedureDate: string; // ISO date string
  procedureNotes?: string | null;
}

export interface TreatmentMaterial {
  id?: number;
  tmTreatment: number; // ID del Treatment
  tmMaterial: number; // ID del Material
  tmQuantity: number;
}
