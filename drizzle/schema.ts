import { 
  int, 
  mysqlEnum, 
  mysqlTable, 
  text, 
  timestamp, 
  varchar,
  decimal,
  boolean,
  json,
  datetime,
  tinyint
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with role field for patient/doctor/nurse/admin distinction.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["patient", "doctor", "nurse", "admin"]).default("patient").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Patient profiles - extended patient information
 */
export const patients = mysqlTable("patients", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  dateOfBirth: datetime("dateOfBirth"),
  gender: mysqlEnum("gender", ["M", "F", "O"]),
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  pincode: varchar("pincode", { length: 10 }),
  abhaId: varchar("abhaId", { length: 100 }).unique(), // Ayushman Bharat Health Account ID
  abhaStatus: mysqlEnum("abhaStatus", ["not_linked", "linking", "linked", "consent_pending"]).default("not_linked"),
  preferredLanguage: mysqlEnum("preferredLanguage", ["en", "hi"]).default("en"),
  emergencyContact: varchar("emergencyContact", { length: 20 }),
  emergencyContactName: varchar("emergencyContactName", { length: 100 }),
  allergies: text("allergies"), // JSON or text list
  chronicConditions: text("chronicConditions"), // JSON or text list
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;

/**
 * Doctor profiles - extended doctor information
 */
export const doctors = mysqlTable("doctors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  licenseNumber: varchar("licenseNumber", { length: 100 }).unique(),
  specialization: varchar("specialization", { length: 100 }),
  qualifications: text("qualifications"), // JSON array
  registrationNumber: varchar("registrationNumber", { length: 100 }),
  clinicName: varchar("clinicName", { length: 200 }),
  clinicAddress: text("clinicAddress"),
  consultationFee: decimal("consultationFee", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = typeof doctors.$inferInsert;

/**
 * Appointments - booking and queue management
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  doctorId: int("doctorId").notNull(),
  appointmentDateTime: datetime("appointmentDateTime").notNull(),
  status: mysqlEnum("status", ["scheduled", "checked_in", "in_progress", "completed", "cancelled", "no_show"]).default("scheduled"),
  appointmentType: mysqlEnum("appointmentType", ["booked", "walk_in"]).default("booked"),
  queuePosition: int("queuePosition"),
  chiefComplaint: text("chiefComplaint"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Symptom interviews - AI-driven patient interviews
 */
export const symptomInterviews = mysqlTable("symptomInterviews", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull(),
  patientId: int("patientId").notNull(),
  language: mysqlEnum("language", ["en", "hi"]).default("en"),
  status: mysqlEnum("status", ["started", "in_progress", "completed", "abandoned"]).default("started"),
  transcript: text("transcript"), // JSON array of Q&A
  duration: int("duration"), // seconds
  completedAt: datetime("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SymptomInterview = typeof symptomInterviews.$inferSelect;
export type InsertSymptomInterview = typeof symptomInterviews.$inferInsert;

/**
 * Pre-charts - AI-generated SOAP notes
 */
export const preCharts = mysqlTable("preCharts", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull(),
  interviewId: int("interviewId").notNull(),
  subjective: text("subjective"), // Chief complaint + HPI
  subjectiveConfidence: decimal("subjectiveConfidence", { precision: 3, scale: 2 }), // 0.00 - 1.00
  objective: text("objective"), // Will be filled by vitals + exam
  objectiveConfidence: decimal("objectiveConfidence", { precision: 3, scale: 2 }),
  assessment: text("assessment"), // AI-suggested diagnoses
  assessmentConfidence: decimal("assessmentConfidence", { precision: 3, scale: 2 }),
  plan: text("plan"), // Treatment plan
  planConfidence: decimal("planConfidence", { precision: 3, scale: 2 }),
  status: mysqlEnum("status", ["draft", "reviewed", "approved", "rejected"]).default("draft"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PreChart = typeof preCharts.$inferSelect;
export type InsertPreChart = typeof preCharts.$inferInsert;

/**
 * Vitals - patient vital signs
 */
export const vitals = mysqlTable("vitals", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull(),
  patientId: int("patientId").notNull(),
  systolicBP: int("systolicBP"), // mmHg
  diastolicBP: int("diastolicBP"), // mmHg
  heartRate: int("heartRate"), // bpm
  temperature: decimal("temperature", { precision: 4, scale: 2 }), // Celsius
  respiratoryRate: int("respiratoryRate"), // breaths/min
  spO2: int("spO2"), // %
  weight: decimal("weight", { precision: 6, scale: 2 }), // kg
  height: decimal("height", { precision: 5, scale: 2 }), // cm
  bmi: decimal("bmi", { precision: 5, scale: 2 }), // calculated
  recordedBy: int("recordedBy"), // userId of nurse/doctor
  recordedAt: datetime("recordedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Vital = typeof vitals.$inferSelect;
export type InsertVital = typeof vitals.$inferInsert;

/**
 * Examination notes - doctor's physical examination findings
 */
export const examinationNotes = mysqlTable("examinationNotes", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull(),
  patientId: int("patientId").notNull(),
  generalExamination: text("generalExamination"),
  systemicExamination: text("systemicExamination"),
  localExamination: text("localExamination"),
  findings: text("findings"), // JSON or structured format
  recordedBy: int("recordedBy"), // doctorId
  recordedAt: datetime("recordedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ExaminationNote = typeof examinationNotes.$inferSelect;
export type InsertExaminationNote = typeof examinationNotes.$inferInsert;

/**
 * Diagnoses - ICD-10 coded diagnoses
 */
export const diagnoses = mysqlTable("diagnoses", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull(),
  patientId: int("patientId").notNull(),
  icd10Code: varchar("icd10Code", { length: 10 }).notNull(),
  diagnosisName: varchar("diagnosisName", { length: 255 }).notNull(),
  aiSuggested: boolean("aiSuggested").default(false),
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // 0.00 - 1.00
  status: mysqlEnum("status", ["suggested", "approved", "rejected"]).default("suggested"),
  isPrimary: boolean("isPrimary").default(false),
  approvedBy: int("approvedBy"), // doctorId
  approvedAt: datetime("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Diagnosis = typeof diagnoses.$inferSelect;
export type InsertDiagnosis = typeof diagnoses.$inferInsert;

/**
 * Prescriptions - medication prescriptions
 */
export const prescriptions = mysqlTable("prescriptions", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull(),
  patientId: int("patientId").notNull(),
  doctorId: int("doctorId").notNull(),
  status: mysqlEnum("status", ["draft", "reviewed", "approved", "rejected", "dispensed"]).default("draft"),
  ddiCheckPassed: boolean("ddiCheckPassed").default(true),
  ddiWarnings: text("ddiWarnings"), // JSON array of warnings
  approvedAt: datetime("approvedAt"),
  approvedBy: int("approvedBy"), // doctorId
  expiresAt: datetime("expiresAt"),
  pdfUrl: varchar("pdfUrl", { length: 500 }), // URL to generated PDF
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Prescription = typeof prescriptions.$inferSelect;
export type InsertPrescription = typeof prescriptions.$inferInsert;

/**
 * Prescription items - individual medications in a prescription
 */
export const prescriptionItems = mysqlTable("prescriptionItems", {
  id: int("id").autoincrement().primaryKey(),
  prescriptionId: int("prescriptionId").notNull(),
  drugName: varchar("drugName", { length: 255 }).notNull(),
  genericName: varchar("genericName", { length: 255 }),
  strength: varchar("strength", { length: 50 }), // e.g., "500mg"
  form: varchar("form", { length: 50 }), // tablet, capsule, syrup, etc.
  frequency: varchar("frequency", { length: 100 }), // e.g., "1-1-1"
  duration: varchar("duration", { length: 100 }), // e.g., "7 days"
  instructions: text("instructions"), // special instructions
  quantity: int("quantity"), // number of units
  ddiRisk: mysqlEnum("ddiRisk", ["none", "low", "moderate", "high", "critical"]).default("none"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PrescriptionItem = typeof prescriptionItems.$inferSelect;
export type InsertPrescriptionItem = typeof prescriptionItems.$inferInsert;

/**
 * Drug interactions - DDI reference database
 */
export const drugInteractions = mysqlTable("drugInteractions", {
  id: int("id").autoincrement().primaryKey(),
  drug1: varchar("drug1", { length: 255 }).notNull(),
  drug2: varchar("drug2", { length: 255 }).notNull(),
  severity: mysqlEnum("severity", ["none", "low", "moderate", "high", "critical"]).default("moderate"),
  description: text("description"),
  recommendation: text("recommendation"),
  source: varchar("source", { length: 100 }), // RxNorm, OpenFDA, etc.
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DrugInteraction = typeof drugInteractions.$inferSelect;
export type InsertDrugInteraction = typeof drugInteractions.$inferInsert;

/**
 * Edit logs - track doctor edits to AI-generated content
 */
export const editLogs = mysqlTable("editLogs", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull(),
  doctorId: int("doctorId").notNull(),
  fieldName: varchar("fieldName", { length: 100 }).notNull(), // e.g., "subjective", "diagnosis", "prescription"
  originalValue: text("originalValue"),
  editedValue: text("editedValue"),
  reason: text("reason"), // why doctor edited
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // original AI confidence
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EditLog = typeof editLogs.$inferSelect;
export type InsertEditLog = typeof editLogs.$inferInsert;

/**
 * ABHA consent - ABHA linkage and consent tracking
 */
export const abhaConsent = mysqlTable("abhaConsent", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  abhaId: varchar("abhaId", { length: 100 }).notNull(),
  consentStatus: mysqlEnum("consentStatus", ["pending", "granted", "revoked"]).default("pending"),
  consentToken: varchar("consentToken", { length: 500 }),
  consentExpiresAt: datetime("consentExpiresAt"),
  linkedAt: datetime("linkedAt"),
  revokedAt: datetime("revokedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ABHAConsent = typeof abhaConsent.$inferSelect;
export type InsertABHAConsent = typeof abhaConsent.$inferInsert;

/**
 * Consultations - main encounter record
 */
export const consultations = mysqlTable("consultations", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull(),
  patientId: int("patientId").notNull(),
  doctorId: int("doctorId").notNull(),
  status: mysqlEnum("status", ["started", "in_progress", "completed", "cancelled"]).default("started"),
  startedAt: datetime("startedAt").notNull(),
  completedAt: datetime("completedAt"),
  duration: int("duration"), // seconds
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Consultation = typeof consultations.$inferSelect;
export type InsertConsultation = typeof consultations.$inferInsert;
