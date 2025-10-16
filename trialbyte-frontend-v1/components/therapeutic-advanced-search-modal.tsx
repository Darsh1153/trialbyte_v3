"use client"

import { formatDateToMMDDYYYY } from "@/lib/date-utils";
import { getUniqueFieldValues, normalizePhaseValue, arePhasesEquivalent } from "@/lib/search-utils";
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { X, Plus, Minus, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import CustomDateInput from "@/components/ui/custom-date-input"
import { MultiTagInput } from "@/components/ui/multi-tag-input"

// Define TherapeuticTrial interface locally
interface TherapeuticTrial {
  trial_id: string;
  overview: {
    id: string;
    therapeutic_area: string;
    trial_identifier: string[];
    trial_phase: string;
    status: string;
    primary_drugs: string;
    other_drugs: string;
    title: string;
    disease_type: string;
    patient_segment: string;
    line_of_therapy: string;
    reference_links: string[];
    trial_tags: string;
    sponsor_collaborators: string;
    sponsor_field_activity: string;
    associated_cro: string;
    countries: string;
    region: string;
    trial_record_status: string;
    created_at: string;
    updated_at: string;
  };
  outcomes: Array<{
    id: string;
    trial_id: string;
    purpose_of_trial: string;
    summary: string;
    primary_outcome_measure: string;
    other_outcome_measure: string;
    study_design_keywords: string;
    study_design: string;
    treatment_regimen: string;
    number_of_arms: number;
  }>;
  criteria: Array<{
    id: string;
    trial_id: string;
    inclusion_criteria: string;
    exclusion_criteria: string;
    age_from: string;
    subject_type: string;
    age_to: string;
    sex: string;
    healthy_volunteers: string;
    target_no_volunteers: number;
    actual_enrolled_volunteers: number | null;
  }>;
  timing: Array<{
    id: string;
    trial_id: string;
    start_date_estimated: string | null;
    trial_end_date_estimated: string | null;
  }>;
  results: Array<{
    id: string;
    trial_id: string;
    trial_outcome: string;
    reference: string;
    trial_results: string[];
    adverse_event_reported: string;
    adverse_event_type: string | null;
    treatment_for_adverse_events: string | null;
  }>;
  sites: Array<{
    id: string;
    trial_id: string;
    total: number;
    notes: string;
  }>;
  other: Array<{
    id: string;
    trial_id: string;
    data: string;
  }>;
  logs: Array<{
    id: string;
    trial_id: string;
    trial_changes_log: string;
  }>;
  notes: Array<{
    id: string;
    trial_id: string;
    notes: string;
  }>;
}

interface TherapeuticAdvancedSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplySearch: (criteria: TherapeuticSearchCriteria[]) => void
  trials?: TherapeuticTrial[] // Add trials data for dynamic dropdowns
}

export interface TherapeuticSearchCriteria {
  id: string
  field: string
  operator: string
  value: string | string[] // Support both single string and array of strings
  logic: "AND" | "OR"
}

const therapeuticSearchFields = [
  // Core dropdown fields from trial creation (Step 5-1)
  { value: "therapeutic_area", label: "Therapeutic Area" },
  { value: "trial_phase", label: "Trial Phase" },
  { value: "status", label: "Status" },
  { value: "primary_drugs", label: "Primary Drugs" },
  { value: "other_drugs", label: "Other Drugs" },
  { value: "disease_type", label: "Disease Type" },
  { value: "patient_segment", label: "Patient Segment" },
  { value: "line_of_therapy", label: "Line of Therapy" },
  { value: "sponsor_collaborators", label: "Sponsor Collaborators" },
  { value: "sponsor_field_activity", label: "Sponsor Field Activity" },
  { value: "associated_cro", label: "Associated CRO" },
  { value: "countries", label: "Countries" },
  { value: "region", label: "Region" },
  { value: "trial_record_status", label: "Trial Record Status" },
  
  // Eligibility criteria dropdown fields (Step 5-3)
  { value: "gender", label: "Gender" },
  { value: "healthy_volunteers", label: "Healthy Volunteers" },
  
  // Results dropdown fields (Step 5-5)
  { value: "trial_outcome", label: "Trial Outcome" },
  { value: "adverse_event_reported", label: "Adverse Event Reported" },
  { value: "adverse_event_type", label: "Adverse Event Type" },
  
  // Additional data dropdown fields (Step 5-7)
  { value: "publication_type", label: "Publication Type" },
  { value: "registry_name", label: "Registry Name" },
  { value: "study_type", label: "Study Type" },
  
  // Study design keywords (Step 5-2)
  { value: "study_design_keywords", label: "Study Design Keywords" },
  
  // Text fields that are searchable
  { value: "title", label: "Title" },
  { value: "trial_identifier", label: "Trial Identifier" },
  { value: "reference_links", label: "Reference Links" },
  { value: "trial_tags", label: "Trial Tags" },
  { value: "study_design", label: "Study Design" },
  
  // Numeric fields
  { value: "number_of_arms", label: "Number of Arms" },
  { value: "age_min", label: "Age Minimum" },
  { value: "age_max", label: "Age Maximum" },
  
  // Date fields
  { value: "created_at", label: "Created Date" },
  { value: "updated_at", label: "Updated Date" }
]

const operators = [
  { value: "contains", label: "Contains" },
  { value: "is", label: "is" },
  { value: "is_not", label: "is not" },
  { value: "starts_with", label: "Starts with" },
  { value: "ends_with", label: "Ends with" },
  { value: "greater_than", label: ">" },
  { value: "greater_than_equal", label: ">=" },
  { value: "less_than", label: "<" },
  { value: "less_than_equal", label: "<=" },
  { value: "equals", label: "=" },
  { value: "not_equals", label: "!=" }
]

// Field-specific options for dropdowns - matching exactly what's available in trial creation
const fieldOptions: Record<string, { value: string; label: string }[]> = {
  // Step 5-1: Trial Overview dropdowns
  therapeutic_area: [
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
    { value: "urology", label: "Urology" }
  ],
  trial_phase: [
    { value: "phase_i", label: "Phase I" },
    { value: "phase_i_ii", label: "Phase I/II" },
    { value: "phase_ii", label: "Phase II" },
    { value: "phase_ii_iii", label: "Phase II/III" },
    { value: "phase_iii", label: "Phase III" },
    { value: "phase_iii_iv", label: "Phase III/IV" },
    { value: "phase_iv", label: "Phase IV" }
  ],
  status: [
    { value: "planned", label: "Planned" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "completed", label: "Completed" },
    { value: "terminated", label: "Terminated" }
  ],
  // Disease Type - Exact options from creation phase
  disease_type: [
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
    { value: "chronic_myelomonositic_leukemia", label: "Chronic Myelomonositic Leukemia" },
    { value: "astrocytoma", label: "Astrocytoma" },
    { value: "brain_stem_glioma", label: "Brain Stem Giloma" },
    { value: "craniopharyngioma", label: "Carniopharyngioma" },
    { value: "choroid_plexus_tumors", label: "Choroid Plexus Tumors" },
    { value: "embryonal_tumors", label: "Embryonal Tumors" },
    { value: "epedymoma", label: "Epedymoma" },
    { value: "germ_cell_tumors", label: "Germ Cell Tumors" },
    { value: "glioblastoma", label: "Giloblastoma" },
    { value: "hemangioblastoma", label: "Hemangioblastoma" },
    { value: "medulloblastoma", label: "Medulloblastoma" },
    { value: "meningioma", label: "Meningioma" },
    { value: "oligodendroglioma", label: "Oligodendrogiloma" },
    { value: "pineal_tumor", label: "Pineal Tumor" },
    { value: "pituitary_tumor", label: "Pituatory Tumor" },
    { value: "colorectal", label: "Colorectal" },
    { value: "endometrial", label: "Endometrial" },
    { value: "esophageal", label: "Esophageal" },
    { value: "fallopian_tube", label: "Fallopian Tube" },
    { value: "gall_bladder", label: "Gall Bladder" },
    { value: "gastric", label: "Gastirc" },
    { value: "gist", label: "GIST" },
    { value: "head_neck", label: "Head/Neck" },
    { value: "hodgkins_lymphoma", label: "Hodgkin's Lymphoma" },
    { value: "leukemia_chronic_myelogenous", label: "Leukemia, Chronic Myelogenous" },
    { value: "liver", label: "Liver" },
    { value: "lung_non_small_cell", label: "Lung Non-small cell" },
    { value: "lung_small_cell", label: "Lung Small Cell" },
    { value: "melanoma", label: "Melanoma" },
    { value: "mesothelioma", label: "Mesothelioma" },
    { value: "metastatic_cancer", label: "Metastatic Cancer" },
    { value: "multiple_myeloma", label: "Multiple Myeloma" },
    { value: "myelodysplastic_syndrome", label: "Myelodysplastic Syndrome" },
    { value: "myeloproliferative_neoplasms", label: "Myeloproliferative Neoplasms" },
    { value: "neuroblastoma", label: "Neuroblastoma" },
    { value: "neuroendocrine", label: "Neuroendocrine" },
    { value: "non_hodgkins_lymphoma", label: "Non-Hodgkin's Lymphoma" },
    { value: "osteosarcoma", label: "Osteosarcoma" },
    { value: "ovarian", label: "Ovarian" },
    { value: "pancreas", label: "Pancreas" },
    { value: "penile", label: "Penile" },
    { value: "primary_peritoneal", label: "Primary Peritoneal" },
    { value: "prostate", label: "Prostate" },
    { value: "renal", label: "Renal" },
    { value: "small_intestine", label: "Small Intestine" },
    { value: "soft_tissue_carcinoma", label: "Soft Tissue Carcinoma" },
    { value: "solid_tumor_unspecified", label: "Solid Tumor, Unspecified" },
    { value: "squamous_skin_cell_carcinoma", label: "Squamous Skin Cell Carcinoma" },
    { value: "supportive_care", label: "Supportive care" },
    { value: "tenosynovial_giant_cell_tumor", label: "Tenosynovial Giant Cell Tumor" },
    { value: "testicular", label: "Testicular" },
    { value: "thymus", label: "Thymus" },
    { value: "thyroid", label: "Thyroid" },
    { value: "unspecified_cancer", label: "Unspecified Cancer" },
    { value: "unspecified_haematological_cancer", label: "Unspecified Haematological Cancer" },
    { value: "vaginal", label: "Vaginal" },
    { value: "vulvar", label: "Vulvar" }
  ],
  // Patient Segment - Exact options from creation phase
  patient_segment: [
    { value: "children", label: "Children" },
    { value: "adults", label: "Adults" },
    { value: "healthy_volunteers", label: "Healthy Volunteers" },
    { value: "unknown", label: "Unknown" },
    { value: "first_line", label: "First Line" },
    { value: "second_line", label: "Second Line" },
    { value: "adjuvant", label: "Adjuvant" }
  ],
  // Line of Therapy - Exact options from creation phase
  line_of_therapy: [
    { value: "second_line", label: "2 – Second Line" },
    { value: "unknown", label: "Unknown" },
    { value: "first_line", label: "1 – First Line" },
    { value: "at_least_second_line", label: "2+ - At least second line" },
    { value: "at_least_third_line", label: "3+ - At least third line" },
    { value: "neo_adjuvant", label: "Neo-Adjuvant" },
    { value: "adjuvant", label: "Adjuvant" },
    { value: "maintenance_consolidation", label: "Maintenance/Consolidation" },
    { value: "at_least_first_line", label: "1+ - At least first line" }
  ],
  // Sponsor Collaborators - Exact options from creation phase
  sponsor_collaborators: [
    { value: "Pfizer", label: "Pfizer" },
    { value: "Novartis", label: "Novartis" },
    { value: "AstraZeneca", label: "AstraZeneca" }
  ],
  // Sponsor Field Activity - Exact options from creation phase
  sponsor_field_activity: [
    { value: "pharmaceutical_company", label: "Pharmaceutical Company" },
    { value: "university_academy", label: "University/Academy" },
    { value: "investigator", label: "Investigator" },
    { value: "cro", label: "CRO" },
    { value: "hospital", label: "Hospital" }
  ],
  // Associated CRO - Exact options from creation phase
  associated_cro: [
    { value: "IQVIA", label: "IQVIA" },
    { value: "Syneos", label: "Syneos" },
    { value: "PPD", label: "PPD" }
  ],
  // Countries - Exact options from creation phase
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
    { value: "denmark", label: "Denmark" }
  ],
  // Region - Exact options from creation phase
  region: [
    { value: "north_america", label: "North America" },
    { value: "europe", label: "Europe" },
    { value: "asia_pacific", label: "Asia Pacific" },
    { value: "latin_america", label: "Latin America" },
    { value: "africa", label: "Africa" },
    { value: "middle_east", label: "Middle East" }
  ],
  // Trial Record Status - Exact options from creation phase
  trial_record_status: [
    { value: "development_in_progress", label: "Development In Progress (DIP)" },
    { value: "in_production", label: "In Production (IP)" },
    { value: "update_in_progress", label: "Update In Progress (UIP)" }
  ],
  // Step 5-3: Eligibility Criteria dropdowns
  gender: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "both", label: "Both" }
  ],
  healthy_volunteers: [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "no_information", label: "No Information" }
  ],
  // Step 5-5: Results dropdowns
  trial_outcome: [
    { value: "Completed – Primary endpoints met.", label: "Completed – Primary endpoints met." },
    { value: "Completed – Primary endpoints not met.", label: "Completed – Primary endpoints not met." },
    { value: "Completed – Outcome unknown", label: "Completed – Outcome unknown" },
    { value: "Completed – Outcome indeterminate", label: "Completed – Outcome indeterminate" },
    { value: "Terminated – Safety/adverse effects", label: "Terminated – Safety/adverse effects" },
    { value: "Terminated – Lack of efficacy", label: "Terminated – Lack of efficacy" },
    { value: "Terminated – Insufficient enrolment", label: "Terminated – Insufficient enrolment" },
    { value: "Terminated – Business Decision, Drug strategy shift", label: "Terminated – Business Decision, Drug strategy shift" },
    { value: "Terminated - Business Decision, Pipeline Reprioritization", label: "Terminated - Business Decision, Pipeline Reprioritization" },
    { value: "Terminated - Business Decision, Other", label: "Terminated - Business Decision, Other" },
    { value: "Terminated – Lack of funding", label: "Terminated – Lack of funding" },
    { value: "Terminated – Planned but never initiated", label: "Terminated – Planned but never initiated" },
    { value: "Terminated – Other", label: "Terminated – Other" },
    { value: "Terminated – Unknown", label: "Terminated – Unknown" }
  ],
  adverse_event_reported: [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" }
  ],
  adverse_event_type: [
    { value: "Mild", label: "Mild" },
    { value: "Moderate", label: "Moderate" },
    { value: "Severe", label: "Severe" }
  ],
  // Step 5-7: Additional Data dropdowns
  publication_type: [
    { value: "company_presentation", label: "Company Presentation" },
    { value: "sec_filing", label: "SEC Filing" },
    { value: "company_conference_report", label: "Company Conference Report" },
    { value: "revenue_reports", label: "Revenue Reports" },
    { value: "others", label: "Others" }
  ],
  registry_name: [
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
    { value: "umin", label: "UMIN" }
  ],
  study_type: [
    { value: "follow_up_study", label: "Follow up Study" },
    { value: "observational_study", label: "Observational study" },
    { value: "other_study", label: "Other Study" }
  ],
  // Step 5-2: Study Design Keywords
  study_design_keywords: [
    { value: "Placebo-control", label: "Placebo-control" },
    { value: "Active control", label: "Active control" },
    { value: "Randomized", label: "Randomized" },
    { value: "Non-Randomized", label: "Non-Randomized" },
    { value: "Multiple-Blinded", label: "Multiple-Blinded" },
    { value: "Single-Blinded", label: "Single-Blinded" },
    { value: "Open", label: "Open" },
    { value: "Multi-centre", label: "Multi-centre" },
    { value: "Safety", label: "Safety" },
    { value: "Efficacy", label: "Efficacy" },
    { value: "Tolerability", label: "Tolerability" },
    { value: "Pharmacokinetics", label: "Pharmacokinetics" },
    { value: "Pharmacodynamics", label: "Pharmacodynamics" },
    { value: "Interventional", label: "Interventional" },
    { value: "Treatment", label: "Treatment" },
    { value: "Parallel Assignment", label: "Parallel Assignment" },
    { value: "Single group assignment", label: "Single group assignment" },
    { value: "Prospective", label: "Prospective" },
    { value: "Cohort", label: "Cohort" }
  ]
}

// Date fields that should show calendar input
const dateFields = [
  "created_at",
  "updated_at"
]

export function TherapeuticAdvancedSearchModal({ open, onOpenChange, onApplySearch, trials = [] }: TherapeuticAdvancedSearchModalProps) {
  const [criteria, setCriteria] = useState<TherapeuticSearchCriteria[]>([
    {
      id: "1",
      field: "title",
      operator: "contains",
      value: "",
      logic: "AND",
    }
  ])
  const [savedQueriesOpen, setSavedQueriesOpen] = useState(false)
  const [savedQueries, setSavedQueries] = useState<any[]>([])
  const [therapeuticData, setTherapeuticData] = useState<TherapeuticTrial[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch therapeutic data when modal opens
  useEffect(() => {
    if (open) {
      fetchTherapeuticData()
    }
  }, [open])

  const fetchTherapeuticData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/therapeutic/all-trials-with-data`)
      if (response.ok) {
        const data = await response.json()
        setTherapeuticData(data.trials || [])
      }
    } catch (error) {
      console.error('Error fetching therapeutic data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique values for a specific field from the therapeutic data
  const getFieldValues = (field: string): string[] => {
    const values = new Set<string>()
    
    // Use passed trials data or fallback to fetched data
    const dataToUse = trials.length > 0 ? trials : therapeuticData;
    
    dataToUse.forEach(trial => {
      // Handle different field paths
      let fieldValue = ''
      
      if (field.includes('.')) {
        // Handle nested fields like 'overview.therapeutic_area'
        const [parent, child] = field.split('.')
        if (parent === 'overview' && trial.overview) {
          fieldValue = trial.overview[child as keyof typeof trial.overview] as string
        }
      } else {
        // Handle direct fields
        switch (field) {
          case 'therapeutic_area':
            fieldValue = trial.overview?.therapeutic_area || ''
            break
          case 'disease_type':
            fieldValue = trial.overview?.disease_type || ''
            break
          case 'trial_phase':
            fieldValue = trial.overview?.trial_phase || ''
            break
          case 'status':
            fieldValue = trial.overview?.status || ''
            break
          case 'primary_drugs':
            fieldValue = trial.overview?.primary_drugs || ''
            break
          case 'other_drugs':
            fieldValue = trial.overview?.other_drugs || ''
            break
          case 'title':
            fieldValue = trial.overview?.title || ''
            break
          case 'patient_segment':
            fieldValue = trial.overview?.patient_segment || ''
            break
          case 'line_of_therapy':
            fieldValue = trial.overview?.line_of_therapy || ''
            break
          case 'sponsor_collaborators':
            fieldValue = trial.overview?.sponsor_collaborators || ''
            break
          case 'associated_cro':
            fieldValue = trial.overview?.associated_cro || ''
            break
          case 'countries':
            fieldValue = trial.overview?.countries || ''
            break
          case 'region':
            fieldValue = trial.overview?.region || ''
            break
          case 'trial_record_status':
            fieldValue = trial.overview?.trial_record_status || ''
            break
          // Handle array fields
          case 'trial_identifier':
            if (trial.overview?.trial_identifier) {
              trial.overview.trial_identifier.forEach(id => values.add(id))
            }
            break
          case 'reference_links':
            if (trial.overview?.reference_links) {
              trial.overview.reference_links.forEach(link => values.add(link))
            }
            break
        }
      }
      
      if (fieldValue && fieldValue.trim()) {
        values.add(fieldValue.trim())
      }
    })
    
    return Array.from(values).sort()
  }

  // Function to render the appropriate input type based on field
  const renderValueInput = (criterion: TherapeuticSearchCriteria) => {
    const fieldOptionsForField = fieldOptions[criterion.field]
    const isDateField = dateFields.includes(criterion.field)
    const dynamicValues = getFieldValues(criterion.field)
    
    // Special handling for trial_tags - use multi-tag input
    if (criterion.field === "trial_tags") {
      const tags = Array.isArray(criterion.value) ? criterion.value : 
                   criterion.value ? [criterion.value] : [];
      return (
        <MultiTagInput
          value={tags}
          onChange={(tags) => updateCriteria(criterion.id, "value", tags)}
          placeholder="Enter tags like 'Cancer', 'Fever' and press Enter"
          className="w-full"
        />
      )
    }
    
    // Date field with custom input
    if (isDateField) {
      return (
        <CustomDateInput
          value={Array.isArray(criterion.value) ? criterion.value[0] || "" : criterion.value}
          onChange={(value) => updateCriteria(criterion.id, "value", value)}
          placeholder="MM-DD-YYYY"
          className="w-full"
        />
      )
    }
    
    // Dropdown for fields with specific options (hardcoded)
    if (fieldOptionsForField) {
      return (
        <Select
          value={Array.isArray(criterion.value) ? criterion.value[0] || "" : criterion.value}
          onValueChange={(value) => updateCriteria(criterion.id, "value", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            {fieldOptionsForField.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }
    
    // Dynamic dropdown for fields with data from database
    if (dynamicValues.length > 0) {
      return (
        <Select
          value={Array.isArray(criterion.value) ? criterion.value[0] || "" : criterion.value}
          onValueChange={(value) => updateCriteria(criterion.id, "value", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            {dynamicValues.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }
    
    // Integer input for number_of_arms field
    if (criterion.field === "number_of_arms") {
      return (
        <Input
          type="number"
          min="1"
          placeholder="Enter number of arms (e.g., 2)"
          value={Array.isArray(criterion.value) ? criterion.value[0] || "" : criterion.value}
          onChange={(e) => {
            const value = e.target.value;
            // Only allow positive integers
            if (value === "" || /^\d+$/.test(value)) {
              updateCriteria(criterion.id, "value", value);
            }
          }}
          onKeyDown={(e) => {
            // Prevent non-numeric characters except backspace, delete, arrow keys
            if (!/[\d\b\ArrowLeft\ArrowRight\ArrowUp\ArrowDown\Delete]/.test(e.key) && !e.ctrlKey && !e.metaKey) {
              e.preventDefault();
            }
          }}
        />
      )
    }
    
    // Default to text input for fields without specific options or dynamic data
    return (
      <Input
        placeholder="Enter the search term"
        value={Array.isArray(criterion.value) ? criterion.value[0] || "" : criterion.value}
        onChange={(e) => updateCriteria(criterion.id, "value", e.target.value)}
      />
    )
  }

  const addCriteria = () => {
    const dropdownFields = [
      'therapeutic_area', 'trial_phase', 'status', 'primary_drugs', 'other_drugs',
      'disease_type', 'patient_segment', 'line_of_therapy', 'sponsor_collaborators',
      'sponsor_field_activity', 'associated_cro', 'countries', 'region', 'trial_record_status',
      'gender', 'healthy_volunteers', 'trial_outcome', 'adverse_event_reported', 'adverse_event_type',
      'publication_type', 'registry_name', 'study_type', 'study_design_keywords'
    ];
    
    // Set default operator based on field type
    let defaultOperator = "contains";
    if (dropdownFields.includes(criteria[criteria.length - 1]?.field)) {
      defaultOperator = "is";
    } else if (criteria[criteria.length - 1]?.field === "number_of_arms") {
      defaultOperator = "equals";
    }
    
    const newCriteria: TherapeuticSearchCriteria = {
      id: Date.now().toString(),
      field: "title",
      operator: defaultOperator,
      value: "",
      logic: "AND",
    }
    setCriteria((prev) => [...prev, newCriteria])
  }

  const removeCriteria = (id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id))
  }

  const updateCriteria = (id: string, field: keyof TherapeuticSearchCriteria, value: string | string[]) => {
    setCriteria((prev) => prev.map((c) => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        
        // Set default operator based on field type
        if (field === "field") {
          const dropdownFields = [
            'therapeutic_area', 'trial_phase', 'status', 'primary_drugs', 'other_drugs',
            'disease_type', 'patient_segment', 'line_of_therapy', 'sponsor_collaborators',
            'sponsor_field_activity', 'associated_cro', 'countries', 'region', 'trial_record_status',
            'gender', 'healthy_volunteers', 'trial_outcome', 'adverse_event_reported', 'adverse_event_type',
            'publication_type', 'registry_name', 'study_type', 'study_design_keywords'
          ];
          
          if (dropdownFields.includes(value as string)) {
            updated.operator = "is";
            updated.value = "";
          } else if (value === "number_of_arms") {
            updated.operator = "equals";
            updated.value = "";
          } else {
            updated.operator = "contains";
            updated.value = "";
          }
        }
        
        return updated;
      }
      return c;
    }))
  }

  const handleApply = () => {
    const filteredCriteria = criteria.filter((c) => {
      if (Array.isArray(c.value)) {
        return c.value.length > 0 && c.value.some(v => v.trim() !== "");
      }
      return c.value.trim() !== "";
    });
    onApplySearch(filteredCriteria);
    onOpenChange(false);
  }

  const handleClear = () => {
    setCriteria([{
      id: "1",
      field: "title",
      operator: "contains",
      value: "",
      logic: "AND",
    }])
  }

  // Load saved queries from localStorage
  const loadSavedQueries = () => {
    const queries = JSON.parse(localStorage.getItem('therapeuticSearchQueries') || '[]')
    setSavedQueries(queries)
  }

  const handleOpenSavedQueries = () => {
    loadSavedQueries()
    setSavedQueriesOpen(true)
  }

  const handleLoadQuery = (query: any) => {
    setCriteria(query.criteria)
    setSavedQueriesOpen(false)
  }

  const handleDeleteQuery = (queryId: string) => {
    const updatedQueries = savedQueries.filter(q => q.id !== queryId)
    setSavedQueries(updatedQueries)
    localStorage.setItem('therapeuticSearchQueries', JSON.stringify(updatedQueries))
  }

  const handleSaveQuery = () => {
    // Create a readable query name
    const queryName = `Therapeutic Advanced Search (${criteria.length} criteria) - ${formatDateToMMDDYYYY(new Date().toISOString())}`;
    
    // Save to localStorage for demo purposes
    const savedQueries = JSON.parse(localStorage.getItem('therapeuticSearchQueries') || '[]');
    const newQuery = {
      id: Date.now().toString(),
      name: queryName,
      criteria: criteria,
      createdAt: new Date().toISOString()
    };
    
    savedQueries.push(newQuery);
    localStorage.setItem('therapeuticSearchQueries', JSON.stringify(savedQueries));
    
    // Show feedback
    alert(`Query saved as: ${queryName}`);
    console.log("Saving therapeutic query:", criteria)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="px-6 py-4 border-b bg-blue-50">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Advanced Therapeutic Search</DialogTitle>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
            {criteria.map((criterion, index) => (
              <div key={criterion.id} className="space-y-3">
                <div className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-2">
                    <Select
                      value={criterion.field}
                      onValueChange={(value) => updateCriteria(criterion.id, "field", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {therapeuticSearchFields.map((field) => (
                          <SelectItem key={field.value} value={field.value}>
                            {field.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <Select
                      value={criterion.operator}
                      onValueChange={(value) => updateCriteria(criterion.id, "operator", value)}
                    >
                      <SelectTrigger className="bg-teal-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(() => {
                          // Define dropdown fields that should use exact matching
                          const dropdownFields = [
                            'therapeutic_area', 'trial_phase', 'status', 'primary_drugs', 'other_drugs',
                            'disease_type', 'patient_segment', 'line_of_therapy', 'sponsor_collaborators',
                            'sponsor_field_activity', 'associated_cro', 'countries', 'region', 'trial_record_status',
                            'gender', 'healthy_volunteers', 'trial_outcome', 'adverse_event_reported', 'adverse_event_type',
                            'publication_type', 'registry_name', 'study_type', 'study_design_keywords'
                          ];
                          
                          // For dropdown fields, suggest exact matching operators
                          if (dropdownFields.includes(criterion.field)) {
                            return [
                              { value: "is", label: "is" },
                              { value: "is_not", label: "is not" },
                              { value: "contains", label: "contains" },
                              { value: "equals", label: "=" },
                              { value: "not_equals", label: "!=" }
                            ].map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ));
                          }
                          
                          // For numeric fields, show numeric operators
                          if (criterion.field === "number_of_arms" || criterion.field === "age_min" || criterion.field === "age_max") {
                            return operators.filter(op => ["equals", "greater_than", "greater_than_equal", "less_than", "less_than_equal", "not_equals"].includes(op.value))
                              .map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ));
                          }
                          
                          // For all other fields, show all operators
                          return operators.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ));
                        })()}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-4">
                    {renderValueInput(criterion)}
                  </div>

                  <div className="col-span-2">
                    <Select
                      value={criterion.logic}
                      onValueChange={(value) => updateCriteria(criterion.id, "logic", value as "AND" | "OR")}
                    >
                      <SelectTrigger className="bg-orange-500 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AND">AND</SelectItem>
                        <SelectItem value="OR">OR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addCriteria}
                      className="bg-green-500 text-white hover:bg-green-600 h-8 w-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    {criteria.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCriteria(criterion.id)}
                        className="bg-red-500 text-white hover:bg-red-600 h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                {/* Remove logic connector line for the last item */}
                {index < criteria.length - 1 && (
                  <div className="flex justify-center">
                    <div className="w-8 h-4 flex items-center justify-center">
                      <div className="w-px h-4 bg-gray-300"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleOpenSavedQueries}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <span className="mr-2">📁</span>
                Open saved queries
              </Button>
              <Button variant="outline" onClick={handleSaveQuery} className="bg-gray-600 text-white hover:bg-gray-700">
                <span className="mr-2">💾</span>
                Save this Query
              </Button>
              <Button variant="outline" onClick={handleClear} className="bg-yellow-600 text-white hover:bg-yellow-700">
                <span className="mr-2">🔄</span>
                Clear All
              </Button>
            </div>
            <Button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700">
              Run Search
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Saved Queries Modal */}
      <Dialog open={savedQueriesOpen} onOpenChange={setSavedQueriesOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] p-0">
          <DialogHeader className="px-6 py-4 border-b bg-blue-50">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Saved Therapeutic Search Queries</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSavedQueriesOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-6">
            {savedQueries.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 text-lg mb-2">No saved queries found</div>
                <div className="text-gray-400 text-sm">Save your first search query to see it here</div>
              </div>
            ) : (
              <div className="space-y-4">
                {savedQueries.map((query) => (
                  <div key={query.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{query.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Created: {formatDateToMMDDYYYY(query.createdAt)} at {new Date(query.createdAt).toLocaleTimeString()}
                        </p>
                        <div className="mt-2">
                          <span className="text-sm text-gray-600">
                            {query.criteria.length} criteria: 
                          </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {query.criteria.slice(0, 3).map((criterion: any, index: number) => {
                              const field = therapeuticSearchFields.find(f => f.value === criterion.field)
                              return (
                                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                  {field?.label}: {criterion.value || 'Any'}
                                </span>
                              )
                            })}
                            {query.criteria.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                                +{query.criteria.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadQuery(query)}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Load Query
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteQuery(query.id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end px-6 py-4 border-t bg-gray-50">
            <Button
              variant="outline"
              onClick={() => setSavedQueriesOpen(false)}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
