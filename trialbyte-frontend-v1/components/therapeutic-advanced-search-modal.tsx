"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Minus } from "lucide-react"

interface TherapeuticAdvancedSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplySearch: (criteria: TherapeuticSearchCriteria[]) => void
}

export interface TherapeuticSearchCriteria {
  id: string
  field: string
  operator: string
  value: string
  logic: "AND" | "OR"
}

const therapeuticSearchFields = [
  // All fields sorted alphabetically
  { value: "actual_enrollment", label: "Actual Enrollment" },
  { value: "adverse_events", label: "Adverse Events" },
  { value: "adverse_events_reported", label: "Adverse Events Reported" },
  { value: "age_max", label: "Age Maximum" },
  { value: "age_min", label: "Age Minimum" },
  { value: "associated_cro", label: "Associated CRO" },
  { value: "biomarker_requirements", label: "Biomarker Requirements" },
  { value: "conclusion", label: "Conclusion" },
  { value: "countries", label: "Countries" },
  { value: "created_at", label: "Created Date" },
  { value: "disease_type", label: "Disease Type" },
  { value: "ecog_performance_status", label: "ECOG Performance Status" },
  { value: "efficacy_results", label: "Efficacy Results" },
  { value: "enrollment_status", label: "Enrollment Status" },
  { value: "estimated_enrollment", label: "Estimated Enrollment" },
  { value: "exclusion_criteria", label: "Exclusion Criteria" },
  { value: "final_analysis_date", label: "Final Analysis Date" },
  { value: "first_patient_in", label: "First Patient In" },
  { value: "gender", label: "Gender" },
  { value: "inclusion_criteria", label: "Inclusion Criteria" },
  { value: "interim_analysis_dates", label: "Interim Analysis Dates" },
  { value: "last_patient_in", label: "Last Patient In" },
  { value: "line_of_therapy", label: "Line of Therapy" },
  { value: "number_of_arms", label: "Number of Arms" },
  { value: "other_drugs", label: "Other Drugs" },
  { value: "otherOutcomeMeasures", label: "Other Outcome Measures" },
  { value: "patient_segment", label: "Patient Segment" },
  { value: "pipeline_data", label: "Pipeline Data" },
  { value: "population_description", label: "Population Description" },
  { value: "post_publications", label: "Post Publications" },
  { value: "press_releases", label: "Press Releases" },
  { value: "primary_drugs", label: "Primary Drugs" },
  { value: "primary_completion_date", label: "Primary Completion Date" },
  { value: "primary_endpoint_results", label: "Primary Endpoint Results" },
  { value: "primaryOutcomeMeasures", label: "Primary Outcome Measures" },
  { value: "prior_treatments", label: "Prior Treatments" },
  { value: "publications", label: "Publications" },
  { value: "purpose_of_trial", label: "Purpose of Trial" },
  { value: "recruitment_period", label: "Recruitment Period" },
  { value: "reference_links", label: "Reference Links" },
  { value: "region", label: "Region" },
  { value: "regulatory_submission_date", label: "Regulatory Submission Date" },
  { value: "results_available", label: "Results Available" },
  { value: "safety_results", label: "Safety Results" },
  { value: "secondary_endpoint_results", label: "Secondary Endpoint Results" },
  { value: "site_contact_info", label: "Site Contact Info" },
  { value: "site_countries", label: "Site Countries" },
  { value: "site_regions", label: "Site Regions" },
  { value: "site_status", label: "Site Status" },
  { value: "sponsor_collaborators", label: "Sponsor/Collaborators" },
  { value: "sponsor_field_activity", label: "Sponsor Field Activity" },
  { value: "statistical_significance", label: "Statistical Significance" },
  { value: "status", label: "Trial Status" },
  { value: "study_completion_date", label: "Study Completion Date" },
  { value: "study_design", label: "Study Design" },
  { value: "study_design_keywords", label: "Study Design Keywords" },
  { value: "study_end_date", label: "Study End Date" },
  { value: "study_sites", label: "Study Sites" },
  { value: "study_start_date", label: "Study Start Date" },
  { value: "summary", label: "Trial Summary" },
  { value: "therapeutic_area", label: "Therapeutic Area" },
  { value: "trial_identifier", label: "Trial Identifier" },
  { value: "trial_outcome", label: "Trial Outcome" },
  { value: "trial_phase", label: "Trial Phase" },
  { value: "trial_record_status", label: "Trial Record Status" },
  { value: "trial_registries", label: "Trial Registries" },
  { value: "trial_tags", label: "Trial Tags" },
  { value: "trial_results", label: "Trial Results" },
  { value: "treatment_regimen", label: "Treatment Regimen" },
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

// Field-specific options for dropdowns
const fieldOptions: Record<string, { value: string; label: string }[]> = {
  trial_phase: [
    { value: "Phase I", label: "Phase I" },
    { value: "Phase II", label: "Phase II" },
    { value: "Phase III", label: "Phase III" },
    { value: "Phase IV", label: "Phase IV" },
    { value: "Phase I/II", label: "Phase I/II" },
    { value: "Phase II/III", label: "Phase II/III" },
    { value: "Pre-clinical", label: "Pre-clinical" },
    { value: "Not Applicable", label: "Not Applicable" }
  ],
  status: [
    { value: "Recruiting", label: "Recruiting" },
    { value: "Active, not recruiting", label: "Active, not recruiting" },
    { value: "Completed", label: "Completed" },
    { value: "Suspended", label: "Suspended" },
    { value: "Terminated", label: "Terminated" },
    { value: "Withdrawn", label: "Withdrawn" },
    { value: "Not yet recruiting", label: "Not yet recruiting" },
    { value: "Enrolling by invitation", label: "Enrolling by invitation" }
  ],
  trial_outcome: [
    { value: "Completed – Primary endpoints met", label: "Completed – Primary endpoints met" },
    { value: "Completed – Primary endpoints not met", label: "Completed – Primary endpoints not met" },
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
  therapeutic_area: [
    { value: "oncology", label: "Oncology" },
    { value: "cardiovascular", label: "Cardiovascular" },
    { value: "autoimmune", label: "Autoimmune" },
    { value: "neurology", label: "Neurology" },
    { value: "infectious_diseases", label: "Infectious Diseases" },
    { value: "metabolic", label: "Metabolic" },
    { value: "respiratory", label: "Respiratory" },
    { value: "gastroenterology", label: "Gastroenterology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "ophthalmology", label: "Ophthalmology" },
    { value: "urology", label: "Urology" },
    { value: "gynecology", label: "Gynecology" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "geriatrics", label: "Geriatrics" },
    { value: "other", label: "Other" }
  ],
  disease_type: [
    { value: "breast", label: "Breast" },
    { value: "lung_non_small_cell", label: "Lung Non-small cell" },
    { value: "lung_small_cell", label: "Lung Small cell" },
    { value: "colorectal", label: "Colorectal" },
    { value: "prostate", label: "Prostate" },
    { value: "ovarian", label: "Ovarian" },
    { value: "pancreatic", label: "Pancreatic" },
    { value: "gastric", label: "Gastric" },
    { value: "liver", label: "Liver" },
    { value: "kidney", label: "Kidney" },
    { value: "bladder", label: "Bladder" },
    { value: "cervical", label: "Cervical" },
    { value: "endometrial", label: "Endometrial" },
    { value: "thyroid", label: "Thyroid" },
    { value: "brain", label: "Brain" },
    { value: "bone", label: "Bone" },
    { value: "skin", label: "Skin" },
    { value: "blood", label: "Blood" },
    { value: "lymphoma", label: "Lymphoma" },
    { value: "leukemia", label: "Leukemia" },
    { value: "myeloma", label: "Myeloma" },
    { value: "sarcoma", label: "Sarcoma" },
    { value: "other", label: "Other" }
  ],
  patient_segment: [
    { value: "early_stage", label: "Early Stage" },
    { value: "advanced_stage", label: "Advanced Stage" },
    { value: "metastatic", label: "Metastatic" },
    { value: "recurrent", label: "Recurrent" },
    { value: "refractory", label: "Refractory" },
    { value: "treatment_naive", label: "Treatment Naive" },
    { value: "previously_treated", label: "Previously Treated" },
    { value: "biomarker_positive", label: "Biomarker Positive" },
    { value: "biomarker_negative", label: "Biomarker Negative" },
    { value: "high_risk", label: "High Risk" },
    { value: "standard_risk", label: "Standard Risk" },
    { value: "other", label: "Other" }
  ],
  line_of_therapy: [
    { value: "first_line", label: "First Line" },
    { value: "second_line", label: "Second Line" },
    { value: "third_line", label: "Third Line" },
    { value: "fourth_line", label: "Fourth Line" },
    { value: "fifth_line", label: "Fifth Line" },
    { value: "maintenance", label: "Maintenance" },
    { value: "adjuvant", label: "Adjuvant" },
    { value: "neoadjuvant", label: "Neoadjuvant" },
    { value: "consolidation", label: "Consolidation" },
    { value: "salvage", label: "Salvage" },
    { value: "palliative", label: "Palliative" },
    { value: "other", label: "Other" }
  ],
  gender: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "both", label: "Both" },
    { value: "not_specified", label: "Not Specified" }
  ],
  enrollment_status: [
    { value: "recruiting", label: "Recruiting" },
    { value: "active_not_recruiting", label: "Active, not recruiting" },
    { value: "completed", label: "Completed" },
    { value: "suspended", label: "Suspended" },
    { value: "terminated", label: "Terminated" },
    { value: "withdrawn", label: "Withdrawn" },
    { value: "not_yet_recruiting", label: "Not yet recruiting" },
    { value: "enrolling_by_invitation", label: "Enrolling by invitation" }
  ],
  results_available: [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" }
  ],
  endpoints_met: [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" }
  ],
  adverse_events_reported: [
    { value: "true", label: "Yes" },
    { value: "false", label: "No" }
  ]
}

export function TherapeuticAdvancedSearchModal({ open, onOpenChange, onApplySearch }: TherapeuticAdvancedSearchModalProps) {
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

  // Function to render the appropriate input type based on field
  const renderValueInput = (criterion: TherapeuticSearchCriteria) => {
    const fieldOptionsForField = fieldOptions[criterion.field]
    
    if (fieldOptionsForField) {
      return (
        <Select
          value={criterion.value}
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
    
    // Default to text input for fields without specific options
    return (
      <Input
        placeholder="Enter the search term"
        value={criterion.value}
        onChange={(e) => updateCriteria(criterion.id, "value", e.target.value)}
      />
    )
  }

  const addCriteria = () => {
    const newCriteria: TherapeuticSearchCriteria = {
      
      id: Date.now().toString(),
      field: "title",
      operator: "contains",
      value: "",
      logic: "AND",
    }
    setCriteria((prev) => [...prev, newCriteria])
  }

  const removeCriteria = (id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id))
  }

  const updateCriteria = (id: string, field: keyof TherapeuticSearchCriteria, value: string) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const handleApply = () => {
    onApplySearch(criteria.filter((c) => c.value.trim() !== ""))
    onOpenChange(false)
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
    const queryName = `Therapeutic Advanced Search (${criteria.length} criteria) - ${new Date().toLocaleDateString()}`;
    
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
                        {operators.map((op) => (
                          <SelectItem key={op.value} value={op.value}>
                            {op.label}
                          </SelectItem>
                        ))}
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
                          Created: {new Date(query.createdAt).toLocaleDateString()} at {new Date(query.createdAt).toLocaleTimeString()}
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
