# NIRA EMR — Universal Data → FHIR EMR Converter

## Architecture

```
Patient Portal (React :3002) ──┐
                                ├──→ Converter Agent (Node.js :3001)
Doctor Portal (React :3003) ───┘         │
                                         ├── NLP Entity Extractor
                                         ├── FHIR R4 Mapper
                                         ├── HAPI FHIR Server (:8080)
                                         ├── PostgreSQL (:5432)
                                         ├── Redis (:6379) → Socket.IO
                                         └── Bahmni/OpenMRS (:8081)
```

## Quick Start

```bash
# 1. Copy env file
cp .env.example .env

# 2. Start all services
docker-compose up -d

# 3. Access
# Patient Portal: http://localhost:3002
# Doctor Portal:  http://localhost:3003
# HAPI FHIR:     http://localhost:8080
# Converter API:  http://localhost:3001
```

## Dev Mode (without Docker)

```bash
# Terminal 1 — Converter Agent
cd converter-agent && npm install && npm run dev

# Terminal 2 — Patient Portal
cd patient-portal && npm install && npm run dev

# Terminal 3 — Doctor Portal
cd doctor-portal && npm install && npm run dev
```

Requires PostgreSQL, Redis, and HAPI FHIR running locally.

## API Endpoints

### Universal Converter
- `POST /api/convert` — Auto-detect input type, convert to FHIR
- `POST /api/convert/booking` — Booking → Patient + Encounter(planned)
- `POST /api/convert/symptoms` — Symptom text → Composition + Observations
- `POST /api/convert/doctor-notes` — Doctor notes → Condition + MedicationRequest
- `POST /api/convert/vitals` — Vitals → Observations

### Queue
- `GET /api/queue` — Full OPD queue
- `GET /api/queue/doctor/:name` — Queue for specific doctor
- `PATCH /api/queue/:id/status` — Update queue status

### FHIR Proxy
- `GET /api/fhir/patient/:id` — Get patient
- `GET /api/fhir/patient/:id/everything` — Get all patient resources
- `GET /api/fhir/search/:resourceType?params` — Search FHIR resources

## Input Examples

**Booking:**
```json
{ "phone": "9876543210", "time": "10AM", "doctor": "Dr Rao" }
```

**Symptom Interview:**
```json
{ "text": "I have fever, cough for 3 days, BP 140/90" }
```

**Doctor Notes:**
```json
{ "text": "Exam normal, Dx viral URTI, Rx paracetamol", "patientId": "123", "doctorName": "Dr Rao" }
```

**Vitals:**
```json
{ "patientId": "123", "systolic": 140, "diastolic": 90, "heartRate": 88, "temperature": 101 }
```
