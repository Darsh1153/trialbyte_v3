-- Dropdown Management Schema
-- This schema allows admins to dynamically manage dropdown options used across the application

-- Dropdown Categories Table
CREATE TABLE IF NOT EXISTS dropdown_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dropdown Options Table
CREATE TABLE IF NOT EXISTS dropdown_options (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES dropdown_categories(id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, value)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dropdown_options_category_id ON dropdown_options(category_id);
CREATE INDEX IF NOT EXISTS idx_dropdown_options_active ON dropdown_options(is_active);
CREATE INDEX IF NOT EXISTS idx_dropdown_categories_active ON dropdown_categories(is_active);

-- Insert default dropdown categories
INSERT INTO dropdown_categories (name, description) VALUES
('therapeutic_area', 'Therapeutic areas for drugs and trials'),
('disease_type', 'Types of diseases and conditions'),
('trial_phase', 'Clinical trial phases'),
('trial_status', 'Trial status options'),
('development_status', 'Drug development status'),
('mechanism_of_action', 'Mechanism of action for drugs'),
('biological_target', 'Biological targets for drugs'),
('delivery_route', 'Drug delivery routes'),
('delivery_medium', 'Drug delivery mediums'),
('company_type', 'Types of pharmaceutical companies'),
('country', 'Countries for trials and companies'),
('sponsor_field_activity', 'Sponsor field activity types'),
('line_of_therapy', 'Lines of therapy for treatments'),
('patient_segment', 'Patient segments for trials'),
('trial_tags', 'Tags for categorizing trials'),
('sex', 'Sex options for trials'),
('healthy_volunteers', 'Healthy volunteer options'),
('trial_record_status', 'Trial record status options')
ON CONFLICT (name) DO NOTHING;

-- Insert default options for each category
-- Therapeutic Area
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'autoimmune', 'Autoimmune', 1 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'cardiovascular', 'Cardiovascular', 2 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'endocrinology', 'Endocrinology', 3 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'gastrointestinal', 'Gastrointestinal', 4 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'infectious', 'Infectious', 5 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'oncology', 'Oncology', 6 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'dermatology', 'Dermatology', 7 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'vaccines', 'Vaccines', 8 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'cns_neurology', 'CNS/Neurology', 9 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'ophthalmology', 'Ophthalmology', 10 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'immunology', 'Immunology', 11 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'rheumatology', 'Rheumatology', 12 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'haematology', 'Haematology', 13 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'nephrology', 'Nephrology', 14 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'urology', 'Urology', 15 FROM dropdown_categories WHERE name = 'therapeutic_area'
ON CONFLICT (category_id, value) DO NOTHING;

-- Trial Phase
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'phase_i', 'Phase I', 1 FROM dropdown_categories WHERE name = 'trial_phase'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'phase_i_ii', 'Phase I/II', 2 FROM dropdown_categories WHERE name = 'trial_phase'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'phase_ii', 'Phase II', 3 FROM dropdown_categories WHERE name = 'trial_phase'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'phase_ii_iii', 'Phase II/III', 4 FROM dropdown_categories WHERE name = 'trial_phase'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'phase_iii', 'Phase III', 5 FROM dropdown_categories WHERE name = 'trial_phase'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'phase_iii_iv', 'Phase III/IV', 6 FROM dropdown_categories WHERE name = 'trial_phase'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'phase_iv', 'Phase IV', 7 FROM dropdown_categories WHERE name = 'trial_phase'
ON CONFLICT (category_id, value) DO NOTHING;

-- Trial Status
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'planned', 'Planned', 1 FROM dropdown_categories WHERE name = 'trial_status'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'open', 'Open', 2 FROM dropdown_categories WHERE name = 'trial_status'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'closed', 'Closed', 3 FROM dropdown_categories WHERE name = 'trial_status'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'completed', 'Completed', 4 FROM dropdown_categories WHERE name = 'trial_status'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'terminated', 'Terminated', 5 FROM dropdown_categories WHERE name = 'trial_status'
ON CONFLICT (category_id, value) DO NOTHING;

-- Development Status
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'launched', 'Launched', 1 FROM dropdown_categories WHERE name = 'development_status'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'no_development_reported', 'No Development Reported', 2 FROM dropdown_categories WHERE name = 'development_status'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'discontinued', 'Discontinued', 3 FROM dropdown_categories WHERE name = 'development_status'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'clinical_phase_1', 'Clinical Phase I', 4 FROM dropdown_categories WHERE name = 'development_status'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'clinical_phase_2', 'Clinical Phase II', 5 FROM dropdown_categories WHERE name = 'development_status'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'clinical_phase_3', 'Clinical Phase III', 6 FROM dropdown_categories WHERE name = 'development_status'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'clinical_phase_4', 'Clinical Phase IV', 7 FROM dropdown_categories WHERE name = 'development_status'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'preclinical', 'Preclinical', 8 FROM dropdown_categories WHERE name = 'development_status'
ON CONFLICT (category_id, value) DO NOTHING;

-- Company Type
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'originator', 'Originator', 1 FROM dropdown_categories WHERE name = 'company_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'generic', 'Generic', 2 FROM dropdown_categories WHERE name = 'company_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'biosimilar', 'Biosimilar', 3 FROM dropdown_categories WHERE name = 'company_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'licensed', 'Licensed', 4 FROM dropdown_categories WHERE name = 'company_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'partnership', 'Partnership', 5 FROM dropdown_categories WHERE name = 'company_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'open_source', 'Open Source', 6 FROM dropdown_categories WHERE name = 'company_type'
ON CONFLICT (category_id, value) DO NOTHING;

-- Sex
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'male', 'Male', 1 FROM dropdown_categories WHERE name = 'sex'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'female', 'Female', 2 FROM dropdown_categories WHERE name = 'sex'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'both', 'Both', 3 FROM dropdown_categories WHERE name = 'sex'
ON CONFLICT (category_id, value) DO NOTHING;

-- Healthy Volunteers
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'yes', 'Yes', 1 FROM dropdown_categories WHERE name = 'healthy_volunteers'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'no', 'No', 2 FROM dropdown_categories WHERE name = 'healthy_volunteers'
ON CONFLICT (category_id, value) DO NOTHING;
