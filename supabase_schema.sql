-- Aura Med Database Schema

-- 1. Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mrn TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    date_of_birth DATE NOT NULL,
    gender TEXT,
    ward TEXT,
    bed_no TEXT,
    status TEXT DEFAULT 'STABLE', -- STABLE, WATCH, CRITICAL
    severity_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Vitals Table (Historical and Live)
CREATE TABLE IF NOT EXISTS vitals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    heart_rate INTEGER,
    blood_pressure_sys INTEGER,
    blood_pressure_dia INTEGER,
    sp_o2 INTEGER,
    temperature DECIMAL(4,1),
    respiration_rate INTEGER,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Medications Table
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    drug_name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'ACTIVE'
);

-- 4. Lab Results Table
CREATE TABLE IF NOT EXISTS lab_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    test_name TEXT NOT NULL,
    value DECIMAL,
    unit TEXT,
    reference_range TEXT,
    category TEXT, -- CHEMISTRY, HEMATOLOGY, etc.
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
