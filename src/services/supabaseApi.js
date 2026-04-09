import { supabase } from "../lib/supabase";

// ── Encounters ──────────────────────────────────────────────

export async function createEncounter({ patientId, doctorId, clinicId, scheduledTime, type, chiefComplaint }) {
  // Use Edge Function for full EMR integration
  const { data, error } = await supabase.functions.invoke("booking-to-emr", {
    body: { patientId, doctorId, clinicId, scheduledTime, type, chiefComplaint },
  });
  if (error) throw error;
  return data;
}

export async function updateEncounterStatus(encounterId, status) {
  const { data, error } = await supabase
    .from("encounters")
    .update({ status })
    .eq("id", encounterId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getEncounterWithDetails(encounterId) {
  const { data, error } = await supabase
    .from("encounters")
    .select("*, patients(*), user_profiles!encounters_doctor_id_fkey(full_name, specialty)")
    .eq("id", encounterId)
    .single();
  if (error) throw error;
  return data;
}

// ── Prescriptions ───────────────────────────────────────────

export async function createPrescription({ encounterId, patientId, doctorId, clinicId, medications, diagnosis, notes }) {
  const { data, error } = await supabase
    .from("medication_requests")
    .insert({ encounter_id: encounterId, patient_id: patientId, doctor_id: doctorId, clinic_id: clinicId, medications, diagnosis, notes })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function approvePrescription(prescriptionId, doctorId) {
  const { data, error } = await supabase.functions.invoke("rx-approval", {
    body: { prescriptionId, action: "approve", doctorId },
  });
  if (error) throw error;
  return data;
}

// ── Patients ────────────────────────────────────────────────

export async function getPatientByUserId(userId) {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function upsertPatient(patient) {
  const { data, error } = await supabase
    .from("patients")
    .upsert(patient, { onConflict: "user_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Interview Sessions ──────────────────────────────────────

export async function createInterview({ encounterId, patientId, language }) {
  const { data, error } = await supabase
    .from("interview_sessions")
    .insert({ encounter_id: encounterId, patient_id: patientId, language })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateInterview(interviewId, updates) {
  const { data, error } = await supabase
    .from("interview_sessions")
    .update(updates)
    .eq("id", interviewId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── User Profiles ───────────────────────────────────────────

export async function getDoctorsByClinic(clinicId) {
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("clinic_id", clinicId)
    .eq("role", "doctor")
    .eq("status", "active");
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId, updates) {
  const { data, error } = await supabase
    .from("user_profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
