"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select"
import { X } from "lucide-react"
import { SaveQueryModal } from "@/components/save-query-modal"

interface TherapeuticFilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: TherapeuticFilterState) => void
  currentFilters: TherapeuticFilterState
  trials?: any[] // Add trials data for dynamic filtering
}

export interface TherapeuticFilterState {
  therapeuticAreas: string[]
  statuses: string[]
  diseaseTypes: string[]
  primaryDrugs: string[]
  trialPhases: string[]
  patientSegments: string[]
  lineOfTherapy: string[]
  countries: string[]
  sponsorsCollaborators: string[]
  sponsorFieldActivity: string[]
  associatedCro: string[]
  trialTags: string[]
  sex: string[]
  healthyVolunteers: string[]
  trialRecordStatus: string[]
  // Additional fields from trial creation form
  otherDrugs: string[]
  regions: string[]
  ageMin: string[]
  ageMax: string[]
  subjectType: string[]
  ecogPerformanceStatus: string[]
  priorTreatments: string[]
  biomarkerRequirements: string[]
  estimatedEnrollment: string[]
  actualEnrollment: string[]
  enrollmentStatus: string[]
  recruitmentPeriod: string[]
  studyCompletionDate: string[]
  primaryCompletionDate: string[]
  populationDescription: string[]
  studySites: string[]
  principalInvestigators: string[]
  siteStatus: string[]
  siteCountries: string[]
  siteRegions: string[]
  siteContactInfo: string[]
  trialResults: string[]
  trialOutcomeContent: string[]
  resultsAvailable: string[]
  endpointsMet: string[]
  adverseEventsReported: string[]
  studyStartDate: string[]
  firstPatientIn: string[]
  lastPatientIn: string[]
  studyEndDate: string[]
  interimAnalysisDates: string[]
  finalAnalysisDate: string[]
  regulatorySubmissionDate: string[]
  purposeOfTrial: string[]
  summary: string[]
  primaryOutcomeMeasures: string[]
  otherOutcomeMeasures: string[]
  studyDesignKeywords: string[]
  studyDesign: string[]
  treatmentRegimen: string[]
  numberOfArms: string[]
  inclusionCriteria: string[]
  exclusionCriteria: string[]
  ageFrom: string[]
  ageTo: string[]
  gender: string[]
  targetNoVolunteers: string[]
  actualEnrolledVolunteers: string[]
  startDateEstimated: string[]
  trialEndDateEstimated: string[]
  trialOutcome: string[]
  adverseEventReported: string[]
  adverseEventType: string[]
  treatmentForAdverseEvents: string[]
  totalSites: string[]
  siteNotes: string[]
  publicationType: string[]
  registryName: string[]
  studyType: string[]
}

// Comprehensive dropdown options for all filter fields
const DROPDOWN_OPTIONS: Record<keyof TherapeuticFilterState, SearchableSelectOption[]> = {
  // Trial Phase Options
  trialPhases: [
    { value: "phase_i", label: "Phase I" },
    { value: "phase_i_ii", label: "Phase I/II" },
    { value: "phase_ii", label: "Phase II" },
    { value: "phase_ii_iii", label: "Phase II/III" },
    { value: "phase_iii", label: "Phase III" },
    { value: "phase_iii_iv", label: "Phase III/IV" },
    { value: "phase_iv", label: "Phase IV" },
  ],

  // Status Options
  statuses: [
    { value: "planned", label: "Planned" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "completed", label: "Completed" },
    { value: "terminated", label: "Terminated" },
    { value: "suspended", label: "Suspended" },
    { value: "not_yet_recruiting", label: "Not yet recruiting" },
    { value: "recruiting", label: "Recruiting" },
    { value: "active", label: "Active" },
  ],

  // Therapeutic Area Options
  therapeuticAreas: [
    { value: "autoimmune", label: "Autoimmune" },
    { value: "cardiovascular", label: "Cardiovascular" },
    { value: "endocrinology", label: "Endocrinology" },
    { value: "gastrointestinal", label: "Gastrointestinal" },
    { value: "infectious", label: "Infectious" },
    { value: "oncology", label: "Oncology" },
    { value: "gastroenterology", label: "Gastroenterology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "vaccines", label: "Vaccines" },
    { value: "cns_neurology", label: "CNS/Neurology" },
    { value: "ophthalmology", label: "Ophthalmology" },
    { value: "immunology", label: "Immunology" },
    { value: "rheumatology", label: "Rheumatology" },
    { value: "haematology", label: "Haematology" },
    { value: "nephrology", label: "Nephrology" },
    { value: "urology", label: "Urology" },
  ],

  // Disease Type Options
  diseaseTypes: [
    { value: "acute_lymphocytic_leukemia", label: "Acute Lymphocytic Leukemia" },
    { value: "acute_myelogenous_leukemia", label: "Acute Myelogenous Leukemia" },
    { value: "anal", label: "Anal" },
    { value: "appendiceal", label: "Appendiceal" },
    { value: "basal_skin_cell_carcinoma", label: "Basal Skin Cell Carcinoma" },
    { value: "bladder", label: "Bladder" },
    { value: "breast", label: "Breast" },
    { value: "cervical", label: "Cervical" },
    { value: "cholangiocarcinoma", label: "Cholangiocarcinoma (Bile duct)" },
    { value: "chronic_lymphocytic_leukemia", label: "Chronic Lymphocytic Leukemia" },
    { value: "colorectal", label: "Colorectal" },
    { value: "endometrial", label: "Endometrial" },
    { value: "esophageal", label: "Esophageal" },
    { value: "gastric", label: "Gastric" },
    { value: "head_neck", label: "Head/Neck" },
    { value: "hodgkins_lymphoma", label: "Hodgkin's Lymphoma" },
    { value: "liver", label: "Liver" },
    { value: "lung_non_small_cell", label: "Lung Non-small cell" },
    { value: "lung_small_cell", label: "Lung Small Cell" },
    { value: "melanoma", label: "Melanoma" },
    { value: "multiple_myeloma", label: "Multiple Myeloma" },
    { value: "non_hodgkins_lymphoma", label: "Non-Hodgkin's Lymphoma" },
    { value: "ovarian", label: "Ovarian" },
    { value: "pancreas", label: "Pancreas" },
    { value: "prostate", label: "Prostate" },
    { value: "renal", label: "Renal" },
    { value: "thyroid", label: "Thyroid" },
    { value: "unspecified_cancer", label: "Unspecified Cancer" },
  ],

  // Patient Segment Options
  patientSegments: [
    { value: "children", label: "Children" },
    { value: "adults", label: "Adults" },
    { value: "healthy_volunteers", label: "Healthy Volunteers" },
    { value: "unknown", label: "Unknown" },
    { value: "first_line", label: "First Line" },
    { value: "second_line", label: "Second Line" },
    { value: "adjuvant", label: "Adjuvant" },
    { value: "early_stage", label: "Early Stage" },
    { value: "locally_advanced", label: "Locally Advanced" },
    { value: "metastatic", label: "Metastatic" },
    { value: "geriatric", label: "Geriatric" },
    { value: "pediatric", label: "Pediatric" },
  ],

  // Line of Therapy Options
  lineOfTherapy: [
    { value: "first_line", label: "1 – First Line" },
    { value: "second_line", label: "2 – Second Line" },
    { value: "at_least_second_line", label: "2+ - At least second line" },
    { value: "at_least_third_line", label: "3+ - At least third line" },
    { value: "neo_adjuvant", label: "Neo-Adjuvant" },
    { value: "adjuvant", label: "Adjuvant" },
    { value: "maintenance_consolidation", label: "Maintenance/Consolidation" },
    { value: "at_least_first_line", label: "1+ - At least first line" },
    { value: "unknown", label: "Unknown" },
  ],

  // Countries Options
  countries: [
    { value: "united_states", label: "United States" },
    { value: "canada", label: "Canada" },
    { value: "united_kingdom", label: "United Kingdom" },
    { value: "germany", label: "Germany" },
    { value: "france", label: "France" },
    { value: "italy", label: "Italy" },
    { value: "spain", label: "Spain" },
    { value: "japan", label: "Japan" },
    { value: "china", label: "China" },
    { value: "india", label: "India" },
    { value: "australia", label: "Australia" },
    { value: "brazil", label: "Brazil" },
    { value: "mexico", label: "Mexico" },
    { value: "south_korea", label: "South Korea" },
    { value: "switzerland", label: "Switzerland" },
    { value: "netherlands", label: "Netherlands" },
    { value: "belgium", label: "Belgium" },
    { value: "sweden", label: "Sweden" },
    { value: "norway", label: "Norway" },
    { value: "denmark", label: "Denmark" },
  ],

  // Sponsors & Collaborators Options
  sponsorsCollaborators: [
    { value: "pfizer", label: "Pfizer" },
    { value: "novartis", label: "Novartis" },
    { value: "astrazeneca", label: "AstraZeneca" },
    { value: "merck", label: "Merck" },
    { value: "roche", label: "Roche" },
    { value: "johnson_johnson", label: "Johnson & Johnson" },
    { value: "bristol_myers_squibb", label: "Bristol Myers Squibb" },
    { value: "gilead", label: "Gilead" },
    { value: "abbvie", label: "AbbVie" },
    { value: "amgen", label: "Amgen" },
    { value: "biogen", label: "Biogen" },
    { value: "celgene", label: "Celgene" },
    { value: "regeneron", label: "Regeneron" },
    { value: "moderna", label: "Moderna" },
    { value: "gsk", label: "GSK" },
  ],

  // Sponsor Field of Activity Options
  sponsorFieldActivity: [
    { value: "pharmaceutical_company", label: "Pharmaceutical Company" },
    { value: "university_academy", label: "University/Academy" },
    { value: "investigator", label: "Investigator" },
    { value: "cro", label: "CRO" },
    { value: "hospital", label: "Hospital" },
    { value: "biotechnology", label: "Biotechnology" },
    { value: "academic", label: "Academic" },
    { value: "government", label: "Government" },
    { value: "non_profit", label: "Non-profit" },
  ],

  // Associated CRO Options
  associatedCro: [
    { value: "iqvia", label: "IQVIA" },
    { value: "syneos", label: "Syneos" },
    { value: "ppd", label: "PPD" },
    { value: "parexel", label: "Parexel" },
    { value: "icon", label: "ICON" },
    { value: "pra_health_sciences", label: "PRA Health Sciences" },
    { value: "covance", label: "Covance" },
    { value: "medpace", label: "Medpace" },
    { value: "pharm_olam", label: "Pharm-Olam" },
    { value: "worldwide_clinical_trials", label: "Worldwide Clinical Trials" },
  ],

  // Trial Tags Options
  trialTags: [
    { value: "biomarker_efficacy", label: "Biomarker-Efficacy" },
    { value: "biomarker_toxicity", label: "Biomarker-Toxicity" },
    { value: "expanded_access", label: "Expanded Access" },
    { value: "expanded_indication", label: "Expanded Indication" },
    { value: "first_in_human", label: "First in Human" },
    { value: "investigator_initiated", label: "Investigator-Initiated" },
    { value: "io_cytotoxic_combination", label: "IO/Cytotoxic Combination" },
    { value: "io_hormonal_combination", label: "IO/Hormonal Combination" },
    { value: "io_io_combination", label: "IO/IO Combination" },
    { value: "io_other_combination", label: "IO/Other Combination" },
    { value: "io_radiotherapy_combination", label: "IO/Radiotherapy Combination" },
    { value: "io_targeted_combination", label: "IO/Targeted Combination" },
    { value: "microdosing", label: "Microdosing" },
    { value: "pgx_biomarker_identification", label: "PGX-Biomarker Identification/Evaluation" },
    { value: "pgx_pathogen", label: "PGX-Pathogen" },
    { value: "pgx_patient_preselection", label: "PGX-Patient Preselection/Stratification" },
    { value: "post_marketing_commitment", label: "Post-Marketing Commitment" },
    { value: "registration", label: "Registration" },
    { value: "randomized", label: "Randomized" },
    { value: "double_blind", label: "Double-blind" },
    { value: "placebo_controlled", label: "Placebo-controlled" },
    { value: "open_label", label: "Open-label" },
    { value: "multicenter", label: "Multicenter" },
  ],

  // Sex Options
  sex: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "both", label: "Both" },
    { value: "all", label: "All" },
  ],

  // Healthy Volunteers Options
  healthyVolunteers: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "no_information", label: "No Information" },
  ],

  // Trial Record Status Options
  trialRecordStatus: [
    { value: "development_in_progress", label: "Development In Progress (DIP)" },
    { value: "in_production", label: "In Production (IP)" },
    { value: "update_in_progress", label: "Update In Progress (UIP)" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "terminated", label: "Terminated" },
    { value: "suspended", label: "Suspended" },
  ],

  // Other Drugs Options (same as primary drugs)
  otherDrugs: [
    { value: "placebo", label: "Placebo" },
    { value: "standard_care", label: "Standard Care" },
    { value: "comparator_drug", label: "Comparator Drug" },
    { value: "pembrolizumab", label: "Pembrolizumab" },
    { value: "nivolumab", label: "Nivolumab" },
    { value: "atezolizumab", label: "Atezolizumab" },
    { value: "trastuzumab", label: "Trastuzumab" },
    { value: "bevacizumab", label: "Bevacizumab" },
    { value: "rituximab", label: "Rituximab" },
  ],

  // Regions Options
  regions: [
    { value: "north_america", label: "North America" },
    { value: "europe", label: "Europe" },
    { value: "asia_pacific", label: "Asia Pacific" },
    { value: "latin_america", label: "Latin America" },
    { value: "africa", label: "Africa" },
    { value: "middle_east", label: "Middle East" },
  ],

  // Age Options (0-150)
  ageMin: Array.from({ length: 151 }, (_, i) => ({
    value: i.toString(),
    label: i.toString()
  })),
  ageMax: Array.from({ length: 151 }, (_, i) => ({
    value: i.toString(),
    label: i.toString()
  })),
  ageFrom: Array.from({ length: 151 }, (_, i) => ({
    value: i.toString(),
    label: i.toString()
  })),
  ageTo: Array.from({ length: 151 }, (_, i) => ({
    value: i.toString(),
    label: i.toString()
  })),

  // Subject Type Options
  subjectType: [
    { value: "patient", label: "Patient" },
    { value: "healthy_volunteer", label: "Healthy Volunteer" },
    { value: "both", label: "Both" },
  ],

  // ECOG Performance Status Options
  ecogPerformanceStatus: [
    { value: "0", label: "0 - Fully active" },
    { value: "1", label: "1 - Restricted in physically strenuous activity" },
    { value: "2", label: "2 - Ambulatory and capable of all self-care" },
    { value: "3", label: "3 - Capable of only limited self-care" },
    { value: "4", label: "4 - Completely disabled" },
  ],

  // Prior Treatments Options
  priorTreatments: [
    { value: "chemotherapy", label: "Chemotherapy" },
    { value: "radiotherapy", label: "Radiotherapy" },
    { value: "surgery", label: "Surgery" },
    { value: "immunotherapy", label: "Immunotherapy" },
    { value: "targeted_therapy", label: "Targeted Therapy" },
    { value: "hormonal_therapy", label: "Hormonal Therapy" },
    { value: "none", label: "None" },
  ],

  // Biomarker Requirements Options
  biomarkerRequirements: [
    { value: "pd_l1", label: "PD-L1" },
    { value: "egfr", label: "EGFR" },
    { value: "kras", label: "KRAS" },
    { value: "braf", label: "BRAF" },
    { value: "alk", label: "ALK" },
    { value: "ros1", label: "ROS1" },
    { value: "her2", label: "HER2" },
    { value: "none", label: "None" },
  ],

  // Enrollment Options
  estimatedEnrollment: [
    { value: "10-50", label: "10-50" },
    { value: "51-100", label: "51-100" },
    { value: "101-500", label: "101-500" },
    { value: "501-1000", label: "501-1000" },
    { value: "1000+", label: "1000+" },
  ],
  actualEnrollment: [
    { value: "10-50", label: "10-50" },
    { value: "51-100", label: "51-100" },
    { value: "101-500", label: "101-500" },
    { value: "501-1000", label: "501-1000" },
    { value: "1000+", label: "1000+" },
  ],
  targetNoVolunteers: [
    { value: "10-50", label: "10-50" },
    { value: "51-100", label: "51-100" },
    { value: "101-500", label: "101-500" },
    { value: "501-1000", label: "501-1000" },
    { value: "1000+", label: "1000+" },
  ],
  actualEnrolledVolunteers: [
    { value: "10-50", label: "10-50" },
    { value: "51-100", label: "51-100" },
    { value: "101-500", label: "101-500" },
    { value: "501-1000", label: "501-1000" },
    { value: "1000+", label: "1000+" },
  ],

  // Enrollment Status Options
  enrollmentStatus: [
    { value: "recruiting", label: "Recruiting" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "suspended", label: "Suspended" },
    { value: "terminated", label: "Terminated" },
  ],

  // Recruitment Period Options
  recruitmentPeriod: [
    { value: "6_months", label: "6 months" },
    { value: "12_months", label: "12 months" },
    { value: "18_months", label: "18 months" },
    { value: "24_months", label: "24 months" },
    { value: "36_months", label: "36 months" },
    { value: "48_months", label: "48 months" },
  ],

  // Date Options (Years)
  studyCompletionDate: Array.from({ length: 10 }, (_, i) => ({
    value: (2024 + i).toString(),
    label: (2024 + i).toString()
  })),
  primaryCompletionDate: Array.from({ length: 10 }, (_, i) => ({
    value: (2024 + i).toString(),
    label: (2024 + i).toString()
  })),
  studyStartDate: Array.from({ length: 10 }, (_, i) => ({
    value: (2024 + i).toString(),
    label: (2024 + i).toString()
  })),
  studyEndDate: Array.from({ length: 10 }, (_, i) => ({
    value: (2024 + i).toString(),
    label: (2024 + i).toString()
  })),
  firstPatientIn: Array.from({ length: 10 }, (_, i) => ({
    value: (2024 + i).toString(),
    label: (2024 + i).toString()
  })),
  lastPatientIn: Array.from({ length: 10 }, (_, i) => ({
    value: (2024 + i).toString(),
    label: (2024 + i).toString()
  })),
  interimAnalysisDates: Array.from({ length: 10 }, (_, i) => ({
    value: (2024 + i).toString(),
    label: (2024 + i).toString()
  })),
  finalAnalysisDate: Array.from({ length: 10 }, (_, i) => ({
    value: (2024 + i).toString(),
    label: (2024 + i).toString()
  })),
  regulatorySubmissionDate: Array.from({ length: 10 }, (_, i) => ({
    value: (2024 + i).toString(),
    label: (2024 + i).toString()
  })),
  startDateEstimated: Array.from({ length: 10 }, (_, i) => ({
    value: (2024 + i).toString(),
    label: (2024 + i).toString()
  })),
  trialEndDateEstimated: Array.from({ length: 10 }, (_, i) => ({
    value: (2024 + i).toString(),
    label: (2024 + i).toString()
  })),

  // Population Description Options
  populationDescription: [
    { value: "adult_patients", label: "Adult patients" },
    { value: "pediatric_patients", label: "Pediatric patients" },
    { value: "healthy_volunteers", label: "Healthy volunteers" },
    { value: "elderly_patients", label: "Elderly patients" },
  ],

  // Study Sites Options
  studySites: [
    { value: "single_site", label: "Single site" },
    { value: "multi_site", label: "Multi-site" },
    { value: "international", label: "International" },
  ],

  // Principal Investigators Options
  principalInvestigators: [
    { value: "dr_smith", label: "Dr. Smith" },
    { value: "dr_johnson", label: "Dr. Johnson" },
    { value: "dr_williams", label: "Dr. Williams" },
    { value: "dr_brown", label: "Dr. Brown" },
    { value: "dr_davis", label: "Dr. Davis" },
  ],

  // Site Status Options
  siteStatus: [
    { value: "active", label: "Active" },
    { value: "recruiting", label: "Recruiting" },
    { value: "completed", label: "Completed" },
    { value: "suspended", label: "Suspended" },
    { value: "terminated", label: "Terminated" },
  ],

  // Site Countries Options (same as countries)
  siteCountries: [
    { value: "united_states", label: "United States" },
    { value: "canada", label: "Canada" },
    { value: "united_kingdom", label: "United Kingdom" },
    { value: "germany", label: "Germany" },
    { value: "france", label: "France" },
    { value: "japan", label: "Japan" },
    { value: "australia", label: "Australia" },
  ],

  // Site Regions Options (same as regions)
  siteRegions: [
    { value: "north_america", label: "North America" },
    { value: "europe", label: "Europe" },
    { value: "asia_pacific", label: "Asia Pacific" },
    { value: "latin_america", label: "Latin America" },
  ],

  // Site Contact Info Options
  siteContactInfo: [
    { value: "contact_available", label: "Contact available" },
    { value: "contact_not_available", label: "Contact not available" },
  ],

  // Trial Results Options
  trialResults: [
    { value: "positive", label: "Positive" },
    { value: "negative", label: "Negative" },
    { value: "inconclusive", label: "Inconclusive" },
    { value: "pending", label: "Pending" },
  ],

  // Trial Outcome Content Options
  trialOutcomeContent: [
    { value: "primary_endpoint_met", label: "Primary endpoint met" },
    { value: "secondary_endpoint_met", label: "Secondary endpoint met" },
    { value: "safety_endpoint_met", label: "Safety endpoint met" },
  ],

  // Results Available Options
  resultsAvailable: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "partial", label: "Partial" },
  ],

  // Endpoints Met Options
  endpointsMet: [
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
    { value: "safety", label: "Safety" },
    { value: "none", label: "None" },
  ],

  // Adverse Events Reported Options
  adverseEventsReported: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "unknown", label: "Unknown" },
  ],

  // Trial Outcome Options
  trialOutcome: [
    { value: "positive", label: "Positive" },
    { value: "negative", label: "Negative" },
    { value: "inconclusive", label: "Inconclusive" },
  ],

  // Adverse Event Reported Options
  adverseEventReported: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ],

  // Adverse Event Type Options
  adverseEventType: [
    { value: "grade_1", label: "Grade 1" },
    { value: "grade_2", label: "Grade 2" },
    { value: "grade_3", label: "Grade 3" },
    { value: "grade_4", label: "Grade 4" },
    { value: "grade_5", label: "Grade 5" },
  ],

  // Treatment for Adverse Events Options
  treatmentForAdverseEvents: [
    { value: "supportive_care", label: "Supportive care" },
    { value: "dose_reduction", label: "Dose reduction" },
    { value: "treatment_discontinuation", label: "Treatment discontinuation" },
  ],

  // Total Sites Options
  totalSites: [
    { value: "1", label: "1" },
    { value: "2-5", label: "2-5" },
    { value: "6-10", label: "6-10" },
    { value: "11-20", label: "11-20" },
    { value: "20+", label: "20+" },
  ],

  // Site Notes Options
  siteNotes: [
    { value: "notes_available", label: "Notes available" },
    { value: "no_notes", label: "No notes" },
  ],

  // Purpose of Trial Options
  purposeOfTrial: [
    { value: "efficacy", label: "Efficacy" },
    { value: "safety", label: "Safety" },
    { value: "dose_finding", label: "Dose finding" },
    { value: "bioequivalence", label: "Bioequivalence" },
    { value: "pharmacokinetics", label: "Pharmacokinetics" },
    { value: "pharmacodynamics", label: "Pharmacodynamics" },
  ],

  // Summary Options
  summary: [
    { value: "phase_i_study", label: "Phase I study" },
    { value: "phase_ii_study", label: "Phase II study" },
    { value: "phase_iii_study", label: "Phase III study" },
    { value: "phase_iv_study", label: "Phase IV study" },
  ],

  // Primary Outcome Measures Options
  primaryOutcomeMeasures: [
    { value: "overall_response_rate", label: "Overall Response Rate" },
    { value: "progression_free_survival", label: "Progression Free Survival" },
    { value: "overall_survival", label: "Overall Survival" },
    { value: "disease_free_survival", label: "Disease Free Survival" },
    { value: "time_to_progression", label: "Time to Progression" },
  ],

  // Other Outcome Measures Options
  otherOutcomeMeasures: [
    { value: "safety", label: "Safety" },
    { value: "quality_of_life", label: "Quality of Life" },
    { value: "biomarker_analysis", label: "Biomarker Analysis" },
    { value: "pharmacokinetics", label: "Pharmacokinetics" },
  ],

  // Study Design Keywords Options
  studyDesignKeywords: [
    { value: "randomized", label: "Randomized" },
    { value: "double_blind", label: "Double-blind" },
    { value: "placebo_controlled", label: "Placebo-controlled" },
    { value: "open_label", label: "Open-label" },
    { value: "crossover", label: "Crossover" },
  ],

  // Study Design Options
  studyDesign: [
    { value: "parallel", label: "Parallel" },
    { value: "crossover", label: "Crossover" },
    { value: "factorial", label: "Factorial" },
    { value: "sequential", label: "Sequential" },
    { value: "single_group", label: "Single Group" },
  ],

  // Treatment Regimen Options
  treatmentRegimen: [
    { value: "monotherapy", label: "Monotherapy" },
    { value: "combination_therapy", label: "Combination therapy" },
    { value: "adjuvant", label: "Adjuvant" },
    { value: "neoadjuvant", label: "Neoadjuvant" },
  ],

  // Number of Arms Options
  numberOfArms: [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5+", label: "5+" },
  ],

  // Inclusion Criteria Options
  inclusionCriteria: [
    { value: "age_18_plus", label: "Age 18+" },
    { value: "ecog_0_1", label: "ECOG 0-1" },
    { value: "adequate_organ_function", label: "Adequate organ function" },
    { value: "life_expectancy_3_months", label: "Life expectancy ≥3 months" },
  ],

  // Exclusion Criteria Options
  exclusionCriteria: [
    { value: "pregnant_women", label: "Pregnant women" },
    { value: "active_infection", label: "Active infection" },
    { value: "prior_malignancy", label: "Prior malignancy" },
    { value: "severe_comorbidities", label: "Severe comorbidities" },
  ],

  // Gender Options (same as sex)
  gender: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "both", label: "Both" },
  ],

  // Primary Drugs Options
  primaryDrugs: [
    { value: "pembrolizumab", label: "Pembrolizumab" },
    { value: "nivolumab", label: "Nivolumab" },
    { value: "atezolizumab", label: "Atezolizumab" },
    { value: "trastuzumab", label: "Trastuzumab" },
    { value: "bevacizumab", label: "Bevacizumab" },
    { value: "rituximab", label: "Rituximab" },
    { value: "pembrolizumab_keytruda", label: "Pembrolizumab (Keytruda)" },
    { value: "nivolumab_opdivo", label: "Nivolumab (Opdivo)" },
    { value: "atezolizumab_tecentriq", label: "Atezolizumab (Tecentriq)" },
  ],

  // Publication Type Options
  publicationType: [
    { value: "company_presentation", label: "Company Presentation" },
    { value: "sec_filing", label: "SEC Filing" },
    { value: "company_conference_report", label: "Company Conference Report" },
    { value: "revenue_reports", label: "Revenue Reports" },
    { value: "others", label: "Others" },
  ],

  // Registry Name Options
  registryName: [
    { value: "euctr", label: "EUCTR" },
    { value: "ctri", label: "CTRI" },
    { value: "anzctr", label: "ANZCTR" },
    { value: "slctr", label: "SLCTR" },
    { value: "chictr", label: "ChiCTR" },
    { value: "chinese_fda", label: "Chinese FDA" },
    { value: "canadian_cancer_trials", label: "Canadian Cancer Trials" },
    { value: "health_canada", label: "Health Canada" },
    { value: "brazil_ctr", label: "Brazil CTR" },
    { value: "german_ctr", label: "German CTR" },
    { value: "cuban_ctr", label: "Cuban CTR" },
    { value: "iran_ctr", label: "Iran CTR" },
    { value: "lebanon_ctr", label: "Lebanon CTR" },
    { value: "pactr", label: "PACTR" },
    { value: "umin", label: "UMIN" },
  ],

  // Study Type Options
  studyType: [
    { value: "follow_up_study", label: "Follow up Study" },
    { value: "observational_study", label: "Observational study" },
    { value: "other_study", label: "Other Study" },
    { value: "interventional", label: "Interventional" },
    { value: "expanded_access", label: "Expanded Access" },
  ],
};

// Function to extract unique values from trials data
const getUniqueValues = (trials: any[], fieldPath: string): string[] => {
  const values = new Set<string>()
  
  console.log(`Extracting values for ${fieldPath} from ${trials.length} trials`)
  
  trials.forEach((trial, index) => {
    let value = ''
    
    // Handle nested field paths
    if (fieldPath.includes('.')) {
      const [parent, child] = fieldPath.split('.')
      if (parent === 'overview' && trial.overview) {
        value = trial.overview[child] || ''
      } else if (parent === 'criteria' && trial.criteria && trial.criteria.length > 0) {
        value = trial.criteria[0][child] || ''
      }
    } else {
      // Handle direct fields
      switch (fieldPath) {
        case 'therapeutic_area':
          value = trial.overview?.therapeutic_area || ''
          break
        case 'status':
          value = trial.overview?.status || ''
          break
        case 'disease_type':
          value = trial.overview?.disease_type || ''
          break
        case 'primary_drugs':
          value = trial.overview?.primary_drugs || ''
          break
        case 'trial_phase':
          value = trial.overview?.trial_phase || ''
          break
        case 'patient_segment':
          value = trial.overview?.patient_segment || ''
          break
        case 'line_of_therapy':
          value = trial.overview?.line_of_therapy || ''
          break
        case 'countries':
          value = trial.overview?.countries || ''
          break
        case 'sponsor_collaborators':
          value = trial.overview?.sponsor_collaborators || ''
          break
        case 'sponsor_field_activity':
          value = trial.overview?.sponsor_field_activity || ''
          break
        case 'associated_cro':
          value = trial.overview?.associated_cro || ''
          break
        case 'trial_tags':
          value = trial.overview?.trial_tags || ''
          break
        case 'sex':
          value = trial.criteria?.[0]?.sex || ''
          break
        case 'healthy_volunteers':
          value = trial.criteria?.[0]?.healthy_volunteers || ''
          break
        case 'trial_record_status':
          value = trial.overview?.trial_record_status || ''
          break
      }
    }
    
    // Debug: Log the value found for this trial
    if (index < 3) { // Only log first 3 trials to avoid spam
      console.log(`Trial ${index} - ${fieldPath}: "${value}"`)
    }
    
    // Handle comma-separated values (for fields that might contain multiple values)
    if (value && value.trim()) {
      const trimmedValue = value.trim()
      
      // Check if the value contains commas (multiple values)
      if (trimmedValue.includes(',')) {
        const splitValues = trimmedValue.split(',').map(v => v.trim()).filter(Boolean)
        splitValues.forEach(splitValue => {
          if (splitValue) {
            values.add(splitValue)
          }
        })
      } else {
        values.add(trimmedValue)
      }
    }
  })
  
  const result = Array.from(values).sort()
  console.log(`Found ${result.length} unique values for ${fieldPath}:`, result)
  return result
}

export function TherapeuticFilterModal({ open, onOpenChange, onApplyFilters, currentFilters, trials = [] }: TherapeuticFilterModalProps) {
  const [filters, setFilters] = useState<TherapeuticFilterState>(currentFilters)
  const [activeCategory, setActiveCategory] = useState<keyof TherapeuticFilterState>("therapeuticAreas")
  const [saveQueryModalOpen, setSaveQueryModalOpen] = useState(false)
  const [filterCategories, setFilterCategories] = useState<Record<keyof TherapeuticFilterState, string[]>>({
    therapeuticAreas: [],
    statuses: [],
    diseaseTypes: [],
    primaryDrugs: [],
    trialPhases: [],
    patientSegments: [],
    lineOfTherapy: [],
    countries: [],
    sponsorsCollaborators: [],
    sponsorFieldActivity: [],
    associatedCro: [],
    trialTags: [],
    sex: [],
    healthyVolunteers: [],
    trialRecordStatus: [],
    // Additional fields from trial creation form
    otherDrugs: [],
    regions: [],
    ageMin: [],
    ageMax: [],
    subjectType: [],
    ecogPerformanceStatus: [],
    priorTreatments: [],
    biomarkerRequirements: [],
    estimatedEnrollment: [],
    actualEnrollment: [],
    enrollmentStatus: [],
    recruitmentPeriod: [],
    studyCompletionDate: [],
    primaryCompletionDate: [],
    populationDescription: [],
    studySites: [],
    principalInvestigators: [],
    siteStatus: [],
    siteCountries: [],
    siteRegions: [],
    siteContactInfo: [],
    trialResults: [],
    trialOutcomeContent: [],
    resultsAvailable: [],
    endpointsMet: [],
    adverseEventsReported: [],
    studyStartDate: [],
    firstPatientIn: [],
    lastPatientIn: [],
    studyEndDate: [],
    interimAnalysisDates: [],
    finalAnalysisDate: [],
    regulatorySubmissionDate: [],
    purposeOfTrial: [],
    summary: [],
    primaryOutcomeMeasures: [],
    otherOutcomeMeasures: [],
    studyDesignKeywords: [],
    studyDesign: [],
    treatmentRegimen: [],
    numberOfArms: [],
    inclusionCriteria: [],
    exclusionCriteria: [],
    ageFrom: [],
    ageTo: [],
    gender: [],
    targetNoVolunteers: [],
    actualEnrolledVolunteers: [],
    startDateEstimated: [],
    trialEndDateEstimated: [],
    trialOutcome: [],
    adverseEventReported: [],
    adverseEventType: [],
    treatmentForAdverseEvents: [],
    totalSites: [],
    siteNotes: [],
    publicationType: [],
    registryName: [],
    studyType: []
  })

  // Update filter categories when trials data changes
  useEffect(() => {
    console.log('TherapeuticFilterModal: Trials data changed, updating filter categories', trials.length)
    console.log('TherapeuticFilterModal: Sample trial data:', trials[0])
    
    if (trials.length > 0) {
      const newFilterCategories = {
        therapeuticAreas: getUniqueValues(trials, 'therapeutic_area'),
        statuses: getUniqueValues(trials, 'status'),
        diseaseTypes: getUniqueValues(trials, 'disease_type'),
        primaryDrugs: getUniqueValues(trials, 'primary_drugs'),
        trialPhases: getUniqueValues(trials, 'trial_phase'),
        patientSegments: getUniqueValues(trials, 'patient_segment'),
        lineOfTherapy: getUniqueValues(trials, 'line_of_therapy'),
        countries: getUniqueValues(trials, 'countries'),
        sponsorsCollaborators: getUniqueValues(trials, 'sponsor_collaborators'),
        sponsorFieldActivity: getUniqueValues(trials, 'sponsor_field_activity'),
        associatedCro: getUniqueValues(trials, 'associated_cro'),
        trialTags: getUniqueValues(trials, 'trial_tags'),
        sex: getUniqueValues(trials, 'sex'),
        healthyVolunteers: getUniqueValues(trials, 'healthy_volunteers'),
        trialRecordStatus: getUniqueValues(trials, 'trial_record_status'),
        // Additional fields from trial creation form
        otherDrugs: getUniqueValues(trials, 'other_drugs'),
        regions: getUniqueValues(trials, 'region'),
        ageMin: getUniqueValues(trials, 'age_from'),
        ageMax: getUniqueValues(trials, 'age_to'),
        subjectType: getUniqueValues(trials, 'subject_type'),
        ecogPerformanceStatus: getUniqueValues(trials, 'ecog_performance_status'),
        priorTreatments: getUniqueValues(trials, 'prior_treatments'),
        biomarkerRequirements: getUniqueValues(trials, 'biomarker_requirements'),
        estimatedEnrollment: getUniqueValues(trials, 'estimated_enrollment'),
        actualEnrollment: getUniqueValues(trials, 'actual_enrollment'),
        enrollmentStatus: getUniqueValues(trials, 'enrollment_status'),
        recruitmentPeriod: getUniqueValues(trials, 'recruitment_period'),
        studyCompletionDate: getUniqueValues(trials, 'study_completion_date'),
        primaryCompletionDate: getUniqueValues(trials, 'primary_completion_date'),
        populationDescription: getUniqueValues(trials, 'population_description'),
        studySites: getUniqueValues(trials, 'study_sites'),
        principalInvestigators: getUniqueValues(trials, 'principal_investigators'),
        siteStatus: getUniqueValues(trials, 'site_status'),
        siteCountries: getUniqueValues(trials, 'site_countries'),
        siteRegions: getUniqueValues(trials, 'site_regions'),
        siteContactInfo: getUniqueValues(trials, 'site_contact_info'),
        trialResults: getUniqueValues(trials, 'trial_results'),
        trialOutcomeContent: getUniqueValues(trials, 'trial_outcome_content'),
        resultsAvailable: getUniqueValues(trials, 'results_available'),
        endpointsMet: getUniqueValues(trials, 'endpoints_met'),
        adverseEventsReported: getUniqueValues(trials, 'adverse_events_reported'),
        studyStartDate: getUniqueValues(trials, 'study_start_date'),
        firstPatientIn: getUniqueValues(trials, 'first_patient_in'),
        lastPatientIn: getUniqueValues(trials, 'last_patient_in'),
        studyEndDate: getUniqueValues(trials, 'study_end_date'),
        interimAnalysisDates: getUniqueValues(trials, 'interim_analysis_dates'),
        finalAnalysisDate: getUniqueValues(trials, 'final_analysis_date'),
        regulatorySubmissionDate: getUniqueValues(trials, 'regulatory_submission_date'),
        purposeOfTrial: getUniqueValues(trials, 'purpose_of_trial'),
        summary: getUniqueValues(trials, 'summary'),
        primaryOutcomeMeasures: getUniqueValues(trials, 'primary_outcome_measure'),
        otherOutcomeMeasures: getUniqueValues(trials, 'other_outcome_measure'),
        studyDesignKeywords: getUniqueValues(trials, 'study_design_keywords'),
        studyDesign: getUniqueValues(trials, 'study_design'),
        treatmentRegimen: getUniqueValues(trials, 'treatment_regimen'),
        numberOfArms: getUniqueValues(trials, 'number_of_arms'),
        inclusionCriteria: getUniqueValues(trials, 'inclusion_criteria'),
        exclusionCriteria: getUniqueValues(trials, 'exclusion_criteria'),
        ageFrom: getUniqueValues(trials, 'age_from'),
        ageTo: getUniqueValues(trials, 'age_to'),
        gender: getUniqueValues(trials, 'sex'),
        targetNoVolunteers: getUniqueValues(trials, 'target_no_volunteers'),
        actualEnrolledVolunteers: getUniqueValues(trials, 'actual_enrolled_volunteers'),
        startDateEstimated: getUniqueValues(trials, 'start_date_estimated'),
        trialEndDateEstimated: getUniqueValues(trials, 'trial_end_date_estimated'),
        trialOutcome: getUniqueValues(trials, 'trial_outcome'),
        adverseEventReported: getUniqueValues(trials, 'adverse_event_reported'),
        adverseEventType: getUniqueValues(trials, 'adverse_event_type'),
        treatmentForAdverseEvents: getUniqueValues(trials, 'treatment_for_adverse_events'),
        totalSites: getUniqueValues(trials, 'total'),
        siteNotes: getUniqueValues(trials, 'notes'),
        publicationType: getUniqueValues(trials, 'publication_type'),
        registryName: getUniqueValues(trials, 'registry_name'),
        studyType: getUniqueValues(trials, 'study_type')
      }
      
      console.log('TherapeuticFilterModal: Updated filter categories:', newFilterCategories)
      
      // Check if any categories have values
      const hasValues = Object.values(newFilterCategories).some(category => category.length > 0)
      console.log('TherapeuticFilterModal: Has values from trials data:', hasValues)
      
      if (hasValues) {
        setFilterCategories(newFilterCategories)
      } else {
        console.log('TherapeuticFilterModal: No values found in trials data, using fallback')
        // Use fallback data if no values found
        const fallbackCategories = {
          therapeuticAreas: ['Oncology', 'Cardiology', 'Neurology', 'Endocrinology', 'Immunology', 'Dermatology', 'Hematology', 'Pulmonology'],
          statuses: ['Recruiting', 'Active', 'Completed', 'Terminated', 'Suspended', 'Not yet recruiting'],
          diseaseTypes: ['Cancer', 'Cardiovascular Disease', 'Diabetes', 'Alzheimer\'s Disease', 'Multiple Sclerosis', 'Rheumatoid Arthritis'],
          primaryDrugs: ['Pembrolizumab', 'Nivolumab', 'Atezolizumab', 'Trastuzumab', 'Bevacizumab', 'Rituximab'],
          trialPhases: ['Phase I', 'Phase II', 'Phase III', 'Phase IV'],
          patientSegments: ['Adult', 'Pediatric', 'Geriatric', 'All Ages'],
          lineOfTherapy: ['First Line', 'Second Line', 'Third Line', 'Maintenance'],
          countries: ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia'],
          sponsorsCollaborators: ['Pfizer', 'Merck', 'Roche', 'Novartis', 'Johnson & Johnson', 'Bristol Myers Squibb'],
          sponsorFieldActivity: ['Pharmaceutical', 'Biotechnology', 'Academic', 'Government', 'Non-profit'],
          associatedCro: ['IQVIA', 'Parexel', 'ICON', 'Syneos Health', 'PRA Health Sciences'],
          trialTags: ['Randomized', 'Double-blind', 'Placebo-controlled', 'Open-label', 'Multicenter'],
          sex: ['Male', 'Female', 'All'],
          healthyVolunteers: ['Yes', 'No'],
          trialRecordStatus: ['Active', 'Completed', 'Terminated', 'Suspended'],
          // Additional fields from trial creation form
          otherDrugs: ['Placebo', 'Standard Care', 'Comparator Drug'],
          regions: ['North America', 'Europe', 'Asia-Pacific', 'Latin America'],
          ageMin: ['18', '21', '25', '30', '35', '40', '45', '50'],
          ageMax: ['65', '70', '75', '80', '85', '90', '95', '100'],
          subjectType: ['Patient', 'Healthy Volunteer', 'Both'],
          ecogPerformanceStatus: ['0', '1', '2', '3', '4'],
          priorTreatments: ['Chemotherapy', 'Radiotherapy', 'Surgery', 'Immunotherapy'],
          biomarkerRequirements: ['PD-L1', 'EGFR', 'KRAS', 'BRAF', 'None'],
          estimatedEnrollment: ['10-50', '51-100', '101-500', '501-1000', '1000+'],
          actualEnrollment: ['10-50', '51-100', '101-500', '501-1000', '1000+'],
          enrollmentStatus: ['Recruiting', 'Active', 'Completed', 'Suspended'],
          recruitmentPeriod: ['6 months', '12 months', '18 months', '24 months', '36 months'],
          studyCompletionDate: ['2024', '2025', '2026', '2027', '2028'],
          primaryCompletionDate: ['2024', '2025', '2026', '2027', '2028'],
          populationDescription: ['Adult patients', 'Pediatric patients', 'Healthy volunteers'],
          studySites: ['Single site', 'Multi-site', 'International'],
          principalInvestigators: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams'],
          siteStatus: ['Active', 'Recruiting', 'Completed', 'Suspended'],
          siteCountries: ['United States', 'Canada', 'United Kingdom', 'Germany'],
          siteRegions: ['North America', 'Europe', 'Asia-Pacific'],
          siteContactInfo: ['Contact available', 'Contact not available'],
          trialResults: ['Positive', 'Negative', 'Inconclusive', 'Pending'],
          trialOutcomeContent: ['Primary endpoint met', 'Secondary endpoint met', 'Safety endpoint met'],
          resultsAvailable: ['Yes', 'No', 'Partial'],
          endpointsMet: ['Primary', 'Secondary', 'Safety', 'None'],
          adverseEventsReported: ['Yes', 'No', 'Unknown'],
          studyStartDate: ['2024', '2025', '2026'],
          firstPatientIn: ['2024', '2025', '2026'],
          lastPatientIn: ['2024', '2025', '2026'],
          studyEndDate: ['2024', '2025', '2026'],
          interimAnalysisDates: ['2024', '2025', '2026'],
          finalAnalysisDate: ['2024', '2025', '2026'],
          regulatorySubmissionDate: ['2024', '2025', '2026'],
          purposeOfTrial: ['Efficacy', 'Safety', 'Dose finding', 'Bioequivalence'],
          summary: ['Phase I study', 'Phase II study', 'Phase III study'],
          primaryOutcomeMeasures: ['Overall Response Rate', 'Progression Free Survival', 'Overall Survival'],
          otherOutcomeMeasures: ['Safety', 'Quality of Life', 'Biomarker Analysis'],
          studyDesignKeywords: ['Randomized', 'Double-blind', 'Placebo-controlled'],
          studyDesign: ['Parallel', 'Crossover', 'Factorial', 'Sequential'],
          treatmentRegimen: ['Monotherapy', 'Combination therapy', 'Adjuvant'],
          numberOfArms: ['1', '2', '3', '4', '5+'],
          inclusionCriteria: ['Age 18+', 'ECOG 0-1', 'Adequate organ function'],
          exclusionCriteria: ['Pregnant women', 'Active infection', 'Prior malignancy'],
          ageFrom: ['18', '21', '25', '30'],
          ageTo: ['65', '70', '75', '80'],
          gender: ['Male', 'Female', 'Both'],
          targetNoVolunteers: ['10-50', '51-100', '101-500', '501-1000'],
          actualEnrolledVolunteers: ['10-50', '51-100', '101-500', '501-1000'],
          startDateEstimated: ['2024', '2025', '2026'],
          trialEndDateEstimated: ['2024', '2025', '2026'],
          trialOutcome: ['Positive', 'Negative', 'Inconclusive'],
          adverseEventReported: ['Yes', 'No'],
          adverseEventType: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'],
          treatmentForAdverseEvents: ['Supportive care', 'Dose reduction', 'Treatment discontinuation'],
          totalSites: ['1', '2-5', '6-10', '11-20', '20+'],
          siteNotes: ['Notes available', 'No notes'],
          publicationType: ['Company Presentation', 'SEC Filing', 'Conference Report'],
          registryName: ['ClinicalTrials.gov', 'EUCTR', 'CTRI'],
          studyType: ['Interventional', 'Observational', 'Expanded Access']
        }
        setFilterCategories(fallbackCategories)
      }
    } else {
      console.log('TherapeuticFilterModal: No trials data available, using fallback data')
      // Fallback data to ensure the UI works even without trials data
      const fallbackCategories = {
        therapeuticAreas: ['Oncology', 'Cardiology', 'Neurology', 'Endocrinology', 'Immunology', 'Dermatology', 'Hematology', 'Pulmonology'],
        statuses: ['Recruiting', 'Active', 'Completed', 'Terminated', 'Suspended', 'Not yet recruiting'],
        diseaseTypes: ['Cancer', 'Cardiovascular Disease', 'Diabetes', 'Alzheimer\'s Disease', 'Multiple Sclerosis', 'Rheumatoid Arthritis'],
        primaryDrugs: ['Pembrolizumab', 'Nivolumab', 'Atezolizumab', 'Trastuzumab', 'Bevacizumab', 'Rituximab'],
        trialPhases: ['Phase I', 'Phase II', 'Phase III', 'Phase IV'],
        patientSegments: ['Adult', 'Pediatric', 'Geriatric', 'All Ages'],
        lineOfTherapy: ['First Line', 'Second Line', 'Third Line', 'Maintenance'],
        countries: ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia'],
        sponsorsCollaborators: ['Pfizer', 'Merck', 'Roche', 'Novartis', 'Johnson & Johnson', 'Bristol Myers Squibb'],
        sponsorFieldActivity: ['Pharmaceutical', 'Biotechnology', 'Academic', 'Government', 'Non-profit'],
        associatedCro: ['IQVIA', 'Parexel', 'ICON', 'Syneos Health', 'PRA Health Sciences'],
        trialTags: ['Randomized', 'Double-blind', 'Placebo-controlled', 'Open-label', 'Multicenter'],
        sex: ['Male', 'Female', 'All'],
        healthyVolunteers: ['Yes', 'No'],
        trialRecordStatus: ['Active', 'Completed', 'Terminated', 'Suspended'],
        // Additional fields from trial creation form
        otherDrugs: ['Placebo', 'Standard Care', 'Comparator Drug'],
        regions: ['North America', 'Europe', 'Asia-Pacific', 'Latin America'],
        ageMin: ['18', '21', '25', '30', '35', '40', '45', '50'],
        ageMax: ['65', '70', '75', '80', '85', '90', '95', '100'],
        subjectType: ['Patient', 'Healthy Volunteer', 'Both'],
        ecogPerformanceStatus: ['0', '1', '2', '3', '4'],
        priorTreatments: ['Chemotherapy', 'Radiotherapy', 'Surgery', 'Immunotherapy'],
        biomarkerRequirements: ['PD-L1', 'EGFR', 'KRAS', 'BRAF', 'None'],
        estimatedEnrollment: ['10-50', '51-100', '101-500', '501-1000', '1000+'],
        actualEnrollment: ['10-50', '51-100', '101-500', '501-1000', '1000+'],
        enrollmentStatus: ['Recruiting', 'Active', 'Completed', 'Suspended'],
        recruitmentPeriod: ['6 months', '12 months', '18 months', '24 months', '36 months'],
        studyCompletionDate: ['2024', '2025', '2026', '2027', '2028'],
        primaryCompletionDate: ['2024', '2025', '2026', '2027', '2028'],
        populationDescription: ['Adult patients', 'Pediatric patients', 'Healthy volunteers'],
        studySites: ['Single site', 'Multi-site', 'International'],
        principalInvestigators: ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams'],
        siteStatus: ['Active', 'Recruiting', 'Completed', 'Suspended'],
        siteCountries: ['United States', 'Canada', 'United Kingdom', 'Germany'],
        siteRegions: ['North America', 'Europe', 'Asia-Pacific'],
        siteContactInfo: ['Contact available', 'Contact not available'],
        trialResults: ['Positive', 'Negative', 'Inconclusive', 'Pending'],
        trialOutcomeContent: ['Primary endpoint met', 'Secondary endpoint met', 'Safety endpoint met'],
        resultsAvailable: ['Yes', 'No', 'Partial'],
        endpointsMet: ['Primary', 'Secondary', 'Safety', 'None'],
        adverseEventsReported: ['Yes', 'No', 'Unknown'],
        studyStartDate: ['2024', '2025', '2026'],
        firstPatientIn: ['2024', '2025', '2026'],
        lastPatientIn: ['2024', '2025', '2026'],
        studyEndDate: ['2024', '2025', '2026'],
        interimAnalysisDates: ['2024', '2025', '2026'],
        finalAnalysisDate: ['2024', '2025', '2026'],
        regulatorySubmissionDate: ['2024', '2025', '2026'],
        purposeOfTrial: ['Efficacy', 'Safety', 'Dose finding', 'Bioequivalence'],
        summary: ['Phase I study', 'Phase II study', 'Phase III study'],
        primaryOutcomeMeasures: ['Overall Response Rate', 'Progression Free Survival', 'Overall Survival'],
        otherOutcomeMeasures: ['Safety', 'Quality of Life', 'Biomarker Analysis'],
        studyDesignKeywords: ['Randomized', 'Double-blind', 'Placebo-controlled'],
        studyDesign: ['Parallel', 'Crossover', 'Factorial', 'Sequential'],
        treatmentRegimen: ['Monotherapy', 'Combination therapy', 'Adjuvant'],
        numberOfArms: ['1', '2', '3', '4', '5+'],
        inclusionCriteria: ['Age 18+', 'ECOG 0-1', 'Adequate organ function'],
        exclusionCriteria: ['Pregnant women', 'Active infection', 'Prior malignancy'],
        ageFrom: ['18', '21', '25', '30'],
        ageTo: ['65', '70', '75', '80'],
        gender: ['Male', 'Female', 'Both'],
        targetNoVolunteers: ['10-50', '51-100', '101-500', '501-1000'],
        actualEnrolledVolunteers: ['10-50', '51-100', '101-500', '501-1000'],
        startDateEstimated: ['2024', '2025', '2026'],
        trialEndDateEstimated: ['2024', '2025', '2026'],
        trialOutcome: ['Positive', 'Negative', 'Inconclusive'],
        adverseEventReported: ['Yes', 'No'],
        adverseEventType: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4'],
        treatmentForAdverseEvents: ['Supportive care', 'Dose reduction', 'Treatment discontinuation'],
        totalSites: ['1', '2-5', '6-10', '11-20', '20+'],
        siteNotes: ['Notes available', 'No notes'],
        publicationType: ['Company Presentation', 'SEC Filing', 'Conference Report'],
        registryName: ['ClinicalTrials.gov', 'EUCTR', 'CTRI'],
        studyType: ['Interventional', 'Observational', 'Expanded Access']
      }
      setFilterCategories(fallbackCategories)
    }
  }, [trials])

  const handleSelectAll = (category: keyof TherapeuticFilterState) => {
    setFilters((prev) => ({
      ...prev,
      [category]: filterCategories[category],
    }))
  }

  const handleDeselectAll = (category: keyof TherapeuticFilterState) => {
    setFilters((prev) => ({
      ...prev,
      [category]: [],
    }))
  }

  const handleItemToggle = (category: keyof TherapeuticFilterState, item: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(item) 
        ? prev[category].filter((i) => i !== item) 
        : [...prev[category], item],
    }))
  }

  const handleApply = () => {
    onApplyFilters(filters)
    onOpenChange(false)
  }

  const handleSaveQuery = () => {
    setSaveQueryModalOpen(true)
  }

  const categoryLabels: Record<keyof TherapeuticFilterState, string> = {
    therapeuticAreas: "Therapeutic Area",
    statuses: "Status", 
    diseaseTypes: "Disease Type",
    primaryDrugs: "Primary Drug",
    trialPhases: "Trial Phase",
    patientSegments: "Patient Segment",
    lineOfTherapy: "Line of Therapy",
    countries: "Countries",
    sponsorsCollaborators: "Sponsors & Collaborators",
    sponsorFieldActivity: "Sponsor Field of Activity",
    associatedCro: "Associated CRO",
    trialTags: "Trial Tags",
    sex: "Sex",
    healthyVolunteers: "Healthy Volunteers",
    trialRecordStatus: "Trial Record Status",
    // Additional fields from trial creation form
    otherDrugs: "Other Drugs",
    regions: "Regions",
    ageMin: "Age Min",
    ageMax: "Age Max",
    subjectType: "Subject Type",
    ecogPerformanceStatus: "ECOG Performance Status",
    priorTreatments: "Prior Treatments",
    biomarkerRequirements: "Biomarker Requirements",
    estimatedEnrollment: "Estimated Enrollment",
    actualEnrollment: "Actual Enrollment",
    enrollmentStatus: "Enrollment Status",
    recruitmentPeriod: "Recruitment Period",
    studyCompletionDate: "Study Completion Date",
    primaryCompletionDate: "Primary Completion Date",
    populationDescription: "Population Description",
    studySites: "Study Sites",
    principalInvestigators: "Principal Investigators",
    siteStatus: "Site Status",
    siteCountries: "Site Countries",
    siteRegions: "Site Regions",
    siteContactInfo: "Site Contact Info",
    trialResults: "Trial Results",
    trialOutcomeContent: "Trial Outcome Content",
    resultsAvailable: "Results Available",
    endpointsMet: "Endpoints Met",
    adverseEventsReported: "Adverse Events Reported",
    studyStartDate: "Study Start Date",
    firstPatientIn: "First Patient In",
    lastPatientIn: "Last Patient In",
    studyEndDate: "Study End Date",
    interimAnalysisDates: "Interim Analysis Dates",
    finalAnalysisDate: "Final Analysis Date",
    regulatorySubmissionDate: "Regulatory Submission Date",
    purposeOfTrial: "Purpose of Trial",
    summary: "Summary",
    primaryOutcomeMeasures: "Primary Outcome Measures",
    otherOutcomeMeasures: "Other Outcome Measures",
    studyDesignKeywords: "Study Design Keywords",
    studyDesign: "Study Design",
    treatmentRegimen: "Treatment Regimen",
    numberOfArms: "Number of Arms",
    inclusionCriteria: "Inclusion Criteria",
    exclusionCriteria: "Exclusion Criteria",
    ageFrom: "Age From",
    ageTo: "Age To",
    gender: "Gender",
    targetNoVolunteers: "Target No Volunteers",
    actualEnrolledVolunteers: "Actual Enrolled Volunteers",
    startDateEstimated: "Start Date Estimated",
    trialEndDateEstimated: "Trial End Date Estimated",
    trialOutcome: "Trial Outcome",
    adverseEventReported: "Adverse Event Reported",
    adverseEventType: "Adverse Event Type",
    treatmentForAdverseEvents: "Treatment for Adverse Events",
    totalSites: "Total Sites",
    siteNotes: "Site Notes",
    publicationType: "Publication Type",
    registryName: "Registry Name",
    studyType: "Study Type"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-blue-50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Therapeutic Trial Filters</DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex h-[500px]">
          {/* Left sidebar with filter categories */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <div className="space-y-2 max-h-full overflow-y-auto pr-2">
              {Object.keys(categoryLabels).map((key) => {
                const category = key as keyof TherapeuticFilterState
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded text-sm ${
                      activeCategory === category ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                    }`}
                  >
                    {categoryLabels[category]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right content area */}
          <div className="flex-1 p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{categoryLabels[activeCategory]}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    filters[activeCategory].length === filterCategories[activeCategory].length
                      ? handleDeselectAll(activeCategory)
                      : handleSelectAll(activeCategory)
                  }
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  {filters[activeCategory].length === filterCategories[activeCategory].length
                    ? "Deselect All"
                    : "Select All"}
                </Button>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto">
                {/* Use SearchableSelect for dropdown fields */}
                <SearchableSelect
                  options={DROPDOWN_OPTIONS[activeCategory] || []}
                  value={filters[activeCategory][0] || ""}
                  onValueChange={(value) => {
                    if (value) {
                      setFilters((prev) => ({
                        ...prev,
                        [activeCategory]: [value]
                      }));
                    } else {
                      setFilters((prev) => ({
                        ...prev,
                        [activeCategory]: []
                      }));
                    }
                  }}
                  placeholder={`Select ${categoryLabels[activeCategory]}...`}
                  searchPlaceholder={`Search ${categoryLabels[activeCategory]}...`}
                  emptyMessage={`No ${categoryLabels[activeCategory].toLowerCase()} found.`}
                  className="w-full"
                />
                
                {/* Show selected values as chips */}
                {filters[activeCategory].length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {filters[activeCategory].map((item) => (
                      <div
                        key={item}
                        className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                      >
                        <span>{item}</span>
                        <button
                          onClick={() => handleItemToggle(activeCategory, item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                  </div>
                ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={handleSaveQuery} className="bg-blue-600 text-white hover:bg-blue-700">
            <span className="mr-2">💾</span>
            Save this Query
          </Button>
          <Button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700">
            Apply Filters
          </Button>
        </div>
      </DialogContent>

      {/* Save Query Modal */}
      <SaveQueryModal
        open={saveQueryModalOpen}
        onOpenChange={setSaveQueryModalOpen}
        currentFilters={filters}
        currentSearchCriteria={[]}
        searchTerm=""
      />
    </Dialog>
  )
}

