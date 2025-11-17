export interface Patient {
  id?: number;
  patientName: string;
  patientLastName: string;
  patientBirthDate?: string | null; // ISO date string
  patientPhone?: string | null;
  patientAddress?: string | null;
}

export interface DentalHistory {
  id?: number;
  historyPatient: number; // Patient ID
  historyAnamnesis?: string | null;
}

export interface Appointment {
  id?: number;
  appointmentPatient: number; // Patient ID
  appointmentDentist: number; // Dentist ID
  appointmentDateTime: string; // ISO datetime string
  appointmentReason?: string | null;
}
