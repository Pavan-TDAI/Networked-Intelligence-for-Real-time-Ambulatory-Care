/** FHIR R4 Resource type definitions for NIRA EMR */

export interface FhirResource {
  resourceType: string;
  id?: string;
  meta?: { lastUpdated?: string; profile?: string[] };
}

export interface FhirPatient extends FhirResource {
  resourceType: "Patient";
  name: Array<{ use: string; family: string; given: string[] }>;
  telecom?: Array<{ system: string; value: string; use?: string }>;
  gender?: "male" | "female" | "other" | "unknown";
  birthDate?: string;
  address?: Array<{ line?: string[]; city?: string; state?: string; postalCode?: string }>;
}

export interface FhirEncounter extends FhirResource {
  resourceType: "Encounter";
  status: "planned" | "arrived" | "triaged" | "in-progress" | "finished" | "cancelled";
  class: { system: string; code: string; display: string };
  subject: { reference: string };
  participant?: Array<{ individual: { reference: string; display: string } }>;
  period?: { start: string; end?: string };
  reasonCode?: Array<{ text: string }>;
}

export interface FhirObservation extends FhirResource {
  resourceType: "Observation";
  status: "final" | "preliminary" | "registered";
  category: Array<{ coding: Array<{ system: string; code: string; display: string }> }>;
  code: { coding: Array<{ system: string; code: string; display: string }>; text: string };
  subject: { reference: string };
  encounter?: { reference: string };
  effectiveDateTime?: string;
  valueQuantity?: { value: number; unit: string; system?: string; code?: string };
  valueString?: string;
  component?: Array<{
    code: { coding: Array<{ system: string; code: string; display: string }> };
    valueQuantity?: { value: number; unit: string };
  }>;
}

export interface FhirCondition extends FhirResource {
  resourceType: "Condition";
  clinicalStatus: { coding: Array<{ system: string; code: string }> };
  verificationStatus?: { coding: Array<{ system: string; code: string }> };
  category?: Array<{ coding: Array<{ system: string; code: string; display: string }> }>;
  code: { coding?: Array<{ system: string; code: string; display: string }>; text: string };
  subject: { reference: string };
  encounter?: { reference: string };
  recordedDate?: string;
}

export interface FhirComposition extends FhirResource {
  resourceType: "Composition";
  status: "preliminary" | "final" | "amended";
  type: { coding: Array<{ system: string; code: string; display: string }> };
  subject: { reference: string };
  encounter?: { reference: string };
  date: string;
  title: string;
  author: Array<{ display: string }>;
  section: Array<{
    title: string;
    code?: { coding: Array<{ system: string; code: string; display: string }> };
    text: { status: string; div: string };
  }>;
}

export interface FhirMedicationRequest extends FhirResource {
  resourceType: "MedicationRequest";
  status: "active" | "completed" | "cancelled" | "draft";
  intent: "order" | "plan" | "proposal";
  medicationCodeableConcept: { text: string; coding?: Array<{ system: string; code: string; display: string }> };
  subject: { reference: string };
  encounter?: { reference: string };
  authoredOn?: string;
  requester?: { display: string };
  dosageInstruction?: Array<{ text: string }>;
}

export interface FhirBundle extends FhirResource {
  resourceType: "Bundle";
  type: "transaction" | "collection" | "searchset";
  entry: Array<{
    resource: FhirResource;
    request?: { method: string; url: string };
  }>;
}

// Input types
export interface BookingInput {
  phone: string;
  time: string;
  doctor: string;
  patientName?: string;
  date?: string;
}

export interface SymptomInput {
  text: string;
  patientId?: string;
  patientPhone?: string;
}

export interface DoctorNotesInput {
  text: string;
  patientId: string;
  encounterId?: string;
  doctorName: string;
}

export interface VitalsInput {
  patientId: string;
  encounterId?: string;
  systolic?: number;
  diastolic?: number;
  heartRate?: number;
  temperature?: number;
  spo2?: number;
  weight?: number;
  height?: number;
  respiratoryRate?: number;
  rawText?: string;
}

export type ConvertInput =
  | { type: "booking"; data: BookingInput }
  | { type: "symptom"; data: SymptomInput }
  | { type: "doctor_notes"; data: DoctorNotesInput }
  | { type: "vitals"; data: VitalsInput }
  | { type: "raw"; data: { text: string; patientId?: string } };

export interface ConvertResult {
  success: boolean;
  inputType: string;
  resourcesCreated: string[];
  patientId?: string;
  encounterId?: string;
  queueToken?: number;
  errors?: string[];
}

export interface QueueEntry {
  id: number;
  patient_fhir_id: string;
  encounter_fhir_id: string | null;
  doctor_name: string | null;
  status: string;
  priority: number;
  token_number: number | null;
  check_in_time: string;
  called_time: string | null;
  completed_time: string | null;
  notes: string | null;
}
