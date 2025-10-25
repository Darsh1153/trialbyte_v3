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
('trial_record_status', 'Trial record status options'),
('study_design_keywords', 'Study design keywords for outcome measured tab'),
('registry_type', 'Registry types for timing tab'),
('trial_outcome', 'Trial outcome options for results tab'),
('result_type', 'Result type options for results tab'),
('adverse_event_reported', 'Adverse event reported options for results tab'),
('adverse_event_type', 'Adverse event type options for results tab'),
('log_type', 'Log type options for logs tab'),
('sponsor_collaborators', 'Sponsor and collaborators options'),
('associated_cro', 'Associated CRO options'),
('region', 'Region options for trials')
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

-- Study Design Keywords
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'placebo_control', 'Placebo-control', 1 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'active_control', 'Active control', 2 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'randomized', 'Randomized', 3 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'non_randomized', 'Non-Randomized', 4 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'multiple_blinded', 'Multiple-Blinded', 5 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'single_blinded', 'Single-Blinded', 6 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'open', 'Open', 7 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'multi_centre', 'Multi-centre', 8 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'safety', 'Safety', 9 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'efficacy', 'Efficacy', 10 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'tolerability', 'Tolerability', 11 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'pharmacokinetics', 'Pharmacokinetics', 12 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'pharmacodynamics', 'Pharmacodynamics', 13 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'interventional', 'Interventional', 14 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'treatment', 'Treatment', 15 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'parallel_assignment', 'Parallel Assignment', 16 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'single_group_assignment', 'Single group assignment', 17 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'prospective', 'Prospective', 18 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'cohort', 'Cohort', 19 FROM dropdown_categories WHERE name = 'study_design_keywords'
ON CONFLICT (category_id, value) DO NOTHING;

-- Registry Type
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'clinicaltrials_gov', 'ClinicalTrials.gov', 1 FROM dropdown_categories WHERE name = 'registry_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'euctr', 'EUCTR', 2 FROM dropdown_categories WHERE name = 'registry_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'ctri', 'CTRI', 3 FROM dropdown_categories WHERE name = 'registry_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'anzctr', 'ANZCTR', 4 FROM dropdown_categories WHERE name = 'registry_type'
ON CONFLICT (category_id, value) DO NOTHING;

-- Trial Outcome
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'completed_primary_endpoints_met', 'Completed – Primary endpoints met.', 1 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'completed_primary_endpoints_not_met', 'Completed – Primary endpoints not met.', 2 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'completed_outcome_unknown', 'Completed – Outcome unknown', 3 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'completed_outcome_indeterminate', 'Completed – Outcome indeterminate', 4 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'terminated_safety_adverse_effects', 'Terminated – Safety/adverse effects', 5 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'terminated_lack_of_efficacy', 'Terminated – Lack of efficacy', 6 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'terminated_insufficient_enrolment', 'Terminated – Insufficient enrolment', 7 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'terminated_business_drug_strategy_shift', 'Terminated – Business Decision, Drug strategy shift', 8 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'terminated_business_pipeline_reprioritization', 'Terminated - Business Decision, Pipeline Reprioritization', 9 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'terminated_business_other', 'Terminated - Business Decision, Other', 10 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'terminated_lack_of_funding', 'Terminated – Lack of funding', 11 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'terminated_planned_but_never_initiated', 'Terminated – Planned but never initiated', 12 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'terminated_other', 'Terminated – Other', 13 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'terminated_unknown', 'Terminated – Unknown', 14 FROM dropdown_categories WHERE name = 'trial_outcome'
ON CONFLICT (category_id, value) DO NOTHING;

-- Result Type
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'interim', 'Interim', 1 FROM dropdown_categories WHERE name = 'result_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'full_results', 'Full Results', 2 FROM dropdown_categories WHERE name = 'result_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'primary_endpoint_results', 'Primary Endpoint Results', 3 FROM dropdown_categories WHERE name = 'result_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'analysis', 'Analysis', 4 FROM dropdown_categories WHERE name = 'result_type'
ON CONFLICT (category_id, value) DO NOTHING;

-- Adverse Event Reported
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'yes', 'Yes', 1 FROM dropdown_categories WHERE name = 'adverse_event_reported'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'no', 'No', 2 FROM dropdown_categories WHERE name = 'adverse_event_reported'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'not_reported', 'Not Reported', 3 FROM dropdown_categories WHERE name = 'adverse_event_reported'
ON CONFLICT (category_id, value) DO NOTHING;

-- Adverse Event Type
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'serious', 'Serious', 1 FROM dropdown_categories WHERE name = 'adverse_event_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'non_serious', 'Non-Serious', 2 FROM dropdown_categories WHERE name = 'adverse_event_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'severe', 'Severe', 3 FROM dropdown_categories WHERE name = 'adverse_event_type'
ON CONFLICT (category_id, value) DO NOTHING;

-- Log Type
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'creation', 'Creation', 1 FROM dropdown_categories WHERE name = 'log_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'update', 'Update', 2 FROM dropdown_categories WHERE name = 'log_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'deletion', 'Deletion', 3 FROM dropdown_categories WHERE name = 'log_type'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'approval', 'Approval', 4 FROM dropdown_categories WHERE name = 'log_type'
ON CONFLICT (category_id, value) DO NOTHING;

-- Trial Record Status
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'development_in_progress', 'Development In Progress (DIP)', 1 FROM dropdown_categories WHERE name = 'trial_record_status'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'in_production', 'In Production (IP)', 2 FROM dropdown_categories WHERE name = 'trial_record_status'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'update_in_progress', 'Update In Progress (UIP)', 3 FROM dropdown_categories WHERE name = 'trial_record_status'
ON CONFLICT (category_id, value) DO NOTHING;

-- Trial Tags
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'biomarker_efficacy', 'Biomarker-Efficacy', 1 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'biomarker_toxicity', 'Biomarker-Toxicity', 2 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'expanded_access', 'Expanded Access', 3 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'expanded_indication', 'Expanded Indication', 4 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'first_in_human', 'First in Human', 5 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'investigator_initiated', 'Investigator-Initiated', 6 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'io_cytotoxic_combination', 'IO/Cytotoxic Combination', 7 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'io_hormonal_combination', 'IO/Hormonal Combination', 8 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'io_io_combination', 'IO/IO Combination', 9 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'io_other_combination', 'IO/Other Combination', 10 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'io_radiotherapy_combination', 'IO/Radiotherapy Combination', 11 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'io_targeted_combination', 'IO/Targeted Combination', 12 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'microdosing', 'Microdosing', 13 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'pgx_biomarker_identification', 'PGX-Biomarker Identification/Evaluation', 14 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'pgx_pathogen', 'PGX-Pathogen', 15 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'pgx_patient_preselection', 'PGX-Patient Preselection/Stratification', 16 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'post_marketing_commitment', 'Post-Marketing Commitment', 17 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'registration', 'Registration', 18 FROM dropdown_categories WHERE name = 'trial_tags'
ON CONFLICT (category_id, value) DO NOTHING;

-- Sponsor and Collaborators
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'Pfizer', 'Pfizer', 1 FROM dropdown_categories WHERE name = 'sponsor_collaborators'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'Novartis', 'Novartis', 2 FROM dropdown_categories WHERE name = 'sponsor_collaborators'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'AstraZeneca', 'AstraZeneca', 3 FROM dropdown_categories WHERE name = 'sponsor_collaborators'
ON CONFLICT (category_id, value) DO NOTHING;

-- Sponsor Field of Activity
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'pharmaceutical_company', 'Pharmaceutical Company', 1 FROM dropdown_categories WHERE name = 'sponsor_field_activity'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'university_academy', 'University/Academy', 2 FROM dropdown_categories WHERE name = 'sponsor_field_activity'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'investigator', 'Investigator', 3 FROM dropdown_categories WHERE name = 'sponsor_field_activity'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'cro', 'CRO', 4 FROM dropdown_categories WHERE name = 'sponsor_field_activity'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'hospital', 'Hospital', 5 FROM dropdown_categories WHERE name = 'sponsor_field_activity'
ON CONFLICT (category_id, value) DO NOTHING;

-- Associated CRO
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'IQVIA', 'IQVIA', 1 FROM dropdown_categories WHERE name = 'associated_cro'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'Syneos', 'Syneos', 2 FROM dropdown_categories WHERE name = 'associated_cro'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'PPD', 'PPD', 3 FROM dropdown_categories WHERE name = 'associated_cro'
ON CONFLICT (category_id, value) DO NOTHING;

-- Countries
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'united_states', 'United States', 1 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'canada', 'Canada', 2 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'united_kingdom', 'United Kingdom', 3 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'germany', 'Germany', 4 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'france', 'France', 5 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'italy', 'Italy', 6 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'spain', 'Spain', 7 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'japan', 'Japan', 8 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'china', 'China', 9 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'india', 'India', 10 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'australia', 'Australia', 11 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'brazil', 'Brazil', 12 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'mexico', 'Mexico', 13 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'south_korea', 'South Korea', 14 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'switzerland', 'Switzerland', 15 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'netherlands', 'Netherlands', 16 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'belgium', 'Belgium', 17 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'sweden', 'Sweden', 18 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'norway', 'Norway', 19 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'denmark', 'Denmark', 20 FROM dropdown_categories WHERE name = 'country'
ON CONFLICT (category_id, value) DO NOTHING;

-- Region
INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'north_america', 'North America', 1 FROM dropdown_categories WHERE name = 'region'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'europe', 'Europe', 2 FROM dropdown_categories WHERE name = 'region'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'asia_pacific', 'Asia Pacific', 3 FROM dropdown_categories WHERE name = 'region'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'latin_america', 'Latin America', 4 FROM dropdown_categories WHERE name = 'region'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'africa', 'Africa', 5 FROM dropdown_categories WHERE name = 'region'
ON CONFLICT (category_id, value) DO NOTHING;

INSERT INTO dropdown_options (category_id, value, label, sort_order) 
SELECT id, 'middle_east', 'Middle East', 6 FROM dropdown_categories WHERE name = 'region'
ON CONFLICT (category_id, value) DO NOTHING;

