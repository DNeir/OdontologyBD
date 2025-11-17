export interface Material {
  id?: number;
  materialName?: string | null;
  materialDescription?: string | null;
  materialStock: number;
}

export interface DentalLab {
  id?: number;
  labName?: string | null;
  labPhone?: string | null;
  labAddress?: string | null;
}

export interface Payment {
  id?: number;
  paymentPlan: number; // ID del TreatmentPlan
  paymentDateTime?: string; // ISO string desde DateTime
  paymentAmount: number;
  paymentMethod?: string | null;
}
