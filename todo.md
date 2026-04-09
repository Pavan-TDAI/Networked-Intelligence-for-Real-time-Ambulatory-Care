# NIRA MVP - Project TODO

## Database & Schema
- [x] Create patients table (demographics, ABHA, contact info)
- [x] Create appointments table (booking, status, queue position)
- [x] Create consultations table (encounter data, timestamps)
- [x] Create symptom_interviews table (interview transcript, responses, language)
- [x] Create pre_charts table (AI-generated SOAP notes, confidence scores)
- [x] Create prescriptions table (medications, dosage, status)
- [x] Create prescription_items table (individual drugs in prescription)
- [x] Create drug_interactions table (DDI rules, severity levels)
- [x] Create edit_logs table (doctor edits to AI suggestions, feedback)
- [x] Create vitals table (BP, HR, temp, RR, SpO2, etc.)
- [x] Create examination_notes table (doctor findings)
- [x] Create abha_consent table (ABHA linkage, consent status)
- [x] Create diagnoses table (ICD-10 codes, AI-suggested vs approved)

## Authentication & Authorization
- [x] Extend user table with role (patient, doctor, nurse, admin)
- [x] Implement role-based access control (RBAC) middleware
- [x] Create protected procedures for doctor-only operations
- [x] Create protected procedures for patient-only operations
- [x] Implement session management and logout
- [x] Add user profile endpoints

## Patient Portal - Core Pages
- [x] Create Home page with navigation
- [x] Create Patient Portal page (appointments, prescriptions, health records)
- [x] Create Symptom Interview page (conversational chat interface)
- [x] Implement language switcher (Hindi/English)
- [x] Add responsive mobile-first design

## Doctor Portal - Core Pages
- [x] Create Doctor Dashboard page (queue overview, stats)
- [x] Create Patient Queue page (real-time queue with AI pre-chart status)
- [x] Create Unified EMR page (scrollable view with all sections)
- [x] Create Prescription Management page (drug selection, DDI alerts)
- [x] Create Approval Workflow page (review and approve consultation)
- [ ] Create Edit History page (view doctor edits and feedback)
- [ ] Add doctor profile and settings

## Patient Portal - Components
- [x] Build Appointment Booking component (date/time picker, slot display)
- [x] Build Symptom Interview Chat component (message display, input, language toggle)
- [x] Build Prescription Card component (medication details, download)
- [x] Build Health Summary component (basic vitals, recent visits)

## Doctor Portal - Components
- [x] Build Patient Queue Card component (patient info, pre-chart status)
- [x] Build EMR Header component (patient demographics, ABHA)
- [x] Build Chief Complaint Section (AI-generated, editable)
- [x] Build History Section (AI-generated, editable)
- [x] Build Vitals Entry component (manual input for BP, HR, temp, etc.)
- [x] Build Examination Notes component (free text, editable)
- [x] Build Diagnosis Section (AI-suggested ICD-10, editable)
- [x] Build Prescription Builder component (drug search, dosage, frequency)
- [x] Build DDI Alert component (severity levels, warnings)
- [x] Build Approve Button component (confirmation dialog)
- [x] Build Edit Diff Logger component (track changes)

## AI & NLP Features
- [ ] Create Symptom Interview Agent (conversational flow, adaptive questions)
- [ ] Implement interview transcript processing
- [ ] Create Clinical NLP Extraction service (extract symptoms, findings)
- [ ] Create SOAP Note Generation service (generate pre-chart from interview)
- [ ] Add confidence score calculation for AI suggestions
- [ ] Implement Hindi language support via IndicTrans2 (or API)
- [ ] Create ICD-10 coding service (map diagnoses to codes)

## Prescription & Drug Safety
- [ ] Create Drug Database service (RxNorm mapping, Indian generics)
- [x] Implement DDI Check Engine (rule-based checks, severity levels)
- [ ] Create Prescription PDF Generation (e-Rx format)
- [x] Implement Prescription Approval workflow
- [x] Create Prescription Display in Patient Portal
- [ ] Add prescription history tracking

## Workflow & Integration
- [x] Implement One-Click Approve workflow
- [x] Create Edit Logging system (capture all doctor edits)
- [ ] Implement ABHA Sandbox integration (HIP registration simulation)
- [ ] Create FHIR bundle generation for approved consultations
- [x] Implement real-time queue updates
- [x] Create pre-chart status indicators (pending, approved, rejected)

## API Endpoints (tRPC Procedures)
- [x] patients.register (create new patient)
- [x] patients.getProfile (fetch patient details)
- [x] appointments.book (create appointment)
- [x] appointments.getQueue (fetch doctor's queue)
- [x] appointments.getMyAppointments (fetch patient's appointments)
- [x] interviews.start (initiate symptom interview)
- [x] interviews.submitResponse (save interview response)
- [x] preCharts.generate (AI generates SOAP note)
- [x] preCharts.getByAppointment (fetch pre-chart)
- [x] preCharts.update (doctor edits pre-chart)
- [x] vitals.record (nurse/doctor enters vitals)
- [x] vitals.getByAppointment (fetch vitals)
- [x] diagnoses.suggest (AI suggests diagnoses)
- [x] diagnoses.approve (doctor approves diagnosis)
- [x] prescriptions.create (create prescription)
- [x] prescriptions.checkDDI (check drug interactions)
- [x] prescriptions.approve (approve and generate e-Rx)
- [x] prescriptions.getByPatient (fetch patient's prescriptions)
- [x] editLogs.record (log doctor edits)
- [x] editLogs.getByAppointment (fetch edit history)
- [x] abha.linkConsent (simulate ABHA consent)
- [x] abha.getStatus (check ABHA linkage status)

## UI/UX & Design
- [x] Define color palette (professional healthcare theme)
- [x] Define typography (readable, accessible)
- [x] Create responsive layout components
- [x] Implement loading states and skeletons
- [x] Add error handling and user feedback (toasts, alerts)
- [x] Create empty states for lists
- [x] Add confirmation dialogs for critical actions
- [x] Implement breadcrumb navigation
- [ ] Add accessibility features (ARIA labels, keyboard navigation)

## Testing & Quality
- [ ] Write vitest tests for authentication
- [ ] Write vitest tests for appointment booking flow
- [ ] Write vitest tests for prescription approval workflow
- [ ] Write vitest tests for DDI check engine
- [ ] Write vitest tests for edit logging
- [ ] Test patient portal on mobile devices
- [ ] Test doctor portal on desktop and tablet
- [ ] Test bilingual support (Hindi/English)
- [ ] Test interview timeout (5-8 min limit)

## Documentation & Deployment
- [ ] Create deployment guide for clinic servers
- [ ] Document API endpoints and usage
- [ ] Create user guides (patient, doctor, nurse)
- [ ] Add inline code comments for complex logic
- [ ] Create README with setup instructions
- [ ] Document environment variables and secrets
- [ ] Create database schema documentation

## Post-MVP Considerations (Deferred)
- [ ] Full 8-language support
- [ ] WhatsApp integration
- [ ] Ambient room listener
- [ ] Full lab path (OpenELIS integration)
- [ ] Advanced CDSS rules
- [ ] Follow-up scheduling and adherence reminders
- [ ] Model retraining pipeline
- [ ] Analytics dashboard (Metabase)
- [ ] Pharmacy routing
- [ ] Full NDHM profiles
