import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users,
  patients,
  doctors,
  appointments,
  consultations,
  symptomInterviews,
  preCharts,
  vitals,
  examinationNotes,
  diagnoses,
  prescriptions,
  prescriptionItems,
  editLogs,
  abhaConsent,
  drugInteractions
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Patient queries
export async function getPatientByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(patients).where(eq(patients.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPatient(patientData: typeof patients.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(patients).values(patientData);
  return result;
}

// Doctor queries
export async function getDoctorByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(doctors).where(eq(doctors.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDoctor(doctorData: typeof doctors.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(doctors).values(doctorData);
  return result;
}

// Appointment queries
export async function getAppointmentsByDoctorId(doctorId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(appointments)
    .where(eq(appointments.doctorId, doctorId))
    .orderBy(desc(appointments.appointmentDateTime));
}

export async function getAppointmentsByPatientId(patientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(appointments)
    .where(eq(appointments.patientId, patientId))
    .orderBy(desc(appointments.appointmentDateTime));
}

export async function getAppointmentById(appointmentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(appointments)
    .where(eq(appointments.id, appointmentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAppointment(appointmentData: typeof appointments.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(appointments).values(appointmentData);
  return result;
}

export async function updateAppointment(appointmentId: number, updates: Partial<typeof appointments.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(appointments).set(updates).where(eq(appointments.id, appointmentId));
}

// Symptom Interview queries
export async function getSymptomInterviewByAppointmentId(appointmentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(symptomInterviews)
    .where(eq(symptomInterviews.appointmentId, appointmentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createSymptomInterview(interviewData: typeof symptomInterviews.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(symptomInterviews).values(interviewData);
  return result;
}

export async function updateSymptomInterview(interviewId: number, updates: Partial<typeof symptomInterviews.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(symptomInterviews).set(updates).where(eq(symptomInterviews.id, interviewId));
}

// Pre-Chart queries
export async function getPreChartByAppointmentId(appointmentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(preCharts)
    .where(eq(preCharts.appointmentId, appointmentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createPreChart(preChartData: typeof preCharts.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(preCharts).values(preChartData);
  return result;
}

export async function updatePreChart(preChartId: number, updates: Partial<typeof preCharts.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(preCharts).set(updates).where(eq(preCharts.id, preChartId));
}

// Vitals queries
export async function getVitalsByAppointmentId(appointmentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(vitals)
    .where(eq(vitals.appointmentId, appointmentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createVitals(vitalsData: typeof vitals.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(vitals).values(vitalsData);
  return result;
}

// Examination queries
export async function getExaminationByAppointmentId(appointmentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(examinationNotes)
    .where(eq(examinationNotes.appointmentId, appointmentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createExaminationNotes(examData: typeof examinationNotes.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(examinationNotes).values(examData);
  return result;
}

// Diagnosis queries
export async function getDiagnosesByAppointmentId(appointmentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(diagnoses)
    .where(eq(diagnoses.appointmentId, appointmentId));
}

export async function createDiagnosis(diagnosisData: typeof diagnoses.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(diagnoses).values(diagnosisData);
  return result;
}

export async function updateDiagnosis(diagnosisId: number, updates: Partial<typeof diagnoses.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(diagnoses).set(updates).where(eq(diagnoses.id, diagnosisId));
}

// Prescription queries
export async function getPrescriptionByAppointmentId(appointmentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(prescriptions)
    .where(eq(prescriptions.appointmentId, appointmentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPrescriptionsByPatientId(patientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(prescriptions)
    .where(eq(prescriptions.patientId, patientId))
    .orderBy(desc(prescriptions.createdAt));
}

export async function createPrescription(prescriptionData: typeof prescriptions.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(prescriptions).values(prescriptionData);
  return result;
}

export async function updatePrescription(prescriptionId: number, updates: Partial<typeof prescriptions.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(prescriptions).set(updates).where(eq(prescriptions.id, prescriptionId));
}

// Prescription Items queries
export async function getPrescriptionItemsByPrescriptionId(prescriptionId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(prescriptionItems)
    .where(eq(prescriptionItems.prescriptionId, prescriptionId));
}

export async function createPrescriptionItem(itemData: typeof prescriptionItems.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(prescriptionItems).values(itemData);
  return result;
}

// Edit Log queries
export async function getEditLogsByAppointmentId(appointmentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(editLogs)
    .where(eq(editLogs.appointmentId, appointmentId))
    .orderBy(desc(editLogs.createdAt));
}

export async function createEditLog(logData: typeof editLogs.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(editLogs).values(logData);
  return result;
}

// ABHA Consent queries
export async function getABHAConsentByPatientId(patientId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(abhaConsent)
    .where(eq(abhaConsent.patientId, patientId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createABHAConsent(consentData: typeof abhaConsent.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(abhaConsent).values(consentData);
  return result;
}

export async function updateABHAConsent(consentId: number, updates: Partial<typeof abhaConsent.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(abhaConsent).set(updates).where(eq(abhaConsent.id, consentId));
}

// Drug Interaction queries
export async function checkDrugInteraction(drug1: string, drug2: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(drugInteractions)
    .where(
      and(
        eq(drugInteractions.drug1, drug1),
        eq(drugInteractions.drug2, drug2)
      )
    ).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getDrugInteractionsBySeverity(severity: 'none' | 'low' | 'moderate' | 'high' | 'critical') {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(drugInteractions)
    .where(eq(drugInteractions.severity, severity));
}

// Consultation queries
export async function getConsultationByAppointmentId(appointmentId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(consultations)
    .where(eq(consultations.appointmentId, appointmentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createConsultation(consultationData: typeof consultations.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.insert(consultations).values(consultationData);
  return result;
}

export async function updateConsultation(consultationId: number, updates: Partial<typeof consultations.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return await db.update(consultations).set(updates).where(eq(consultations.id, consultationId));
}
