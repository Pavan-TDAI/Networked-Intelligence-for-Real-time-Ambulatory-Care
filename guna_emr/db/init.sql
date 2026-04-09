-- Initialize databases for NIRA EMR
CREATE DATABASE openmrs;

-- Queue tracking table (supplements FHIR)
CREATE TABLE IF NOT EXISTS opd_queue (
    id SERIAL PRIMARY KEY,
    patient_fhir_id VARCHAR(64) NOT NULL,
    encounter_fhir_id VARCHAR(64),
    doctor_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'waiting',
    priority INTEGER DEFAULT 5,
    token_number INTEGER,
    check_in_time TIMESTAMP DEFAULT NOW(),
    called_time TIMESTAMP,
    completed_time TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_queue_status ON opd_queue(status);
CREATE INDEX idx_queue_doctor ON opd_queue(doctor_name);

-- Sequence for daily token numbers
CREATE SEQUENCE IF NOT EXISTS daily_token_seq START 1;

-- Raw input log for audit
CREATE TABLE IF NOT EXISTS raw_input_log (
    id SERIAL PRIMARY KEY,
    input_type VARCHAR(50) NOT NULL,
    raw_payload JSONB NOT NULL,
    fhir_resources_created JSONB,
    processing_status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
