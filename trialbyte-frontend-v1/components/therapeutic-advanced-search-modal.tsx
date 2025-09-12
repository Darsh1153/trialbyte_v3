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
  // Overview fields
  { value: "title", label: "Trial Title" },
  { value: "therapeutic_area", label: "Therapeutic Area" },
  { value: "trial_identifier", label: "Trial Identifier" },
  { value: "trial_phase", label: "Trial Phase" },
  { value: "status", label: "Trial Status" },
  { value: "primary_drugs", label: "Primary Drugs" },
  { value: "other_drugs", label: "Other Drugs" },
  { value: "disease_type", label: "Disease Type" },
  { value: "patient_segment", label: "Patient Segment" },
  { value: "line_of_therapy", label: "Line of Therapy" },
  { value: "trial_tags", label: "Trial Tags" },
  { value: "sponsor_collaborators", label: "Sponsor/Collaborators" },
  { value: "sponsor_field_activity", label: "Sponsor Field Activity" },
  { value: "associated_cro", label: "Associated CRO" },
  { value: "countries", label: "Countries" },
  { value: "region", label: "Region" },
  { value: "trial_record_status", label: "Trial Record Status" },
  
  // Outcomes fields
  { value: "purpose_of_trial", label: "Purpose of Trial" },
  { value: "summary", label: "Trial Summary" },
  { value: "primary_outcome_measure", label: "Primary Outcome Measure" },
  { value: "other_outcome_measure", label: "Other Outcome Measure" },
  { value: "study_design_keywords", label: "Study Design Keywords" },
  { value: "study_design", label: "Study Design" },
  { value: "treatment_regimen", label: "Treatment Regimen" },
  { value: "number_of_arms", label: "Number of Arms" },
  
  // Criteria fields
  { value: "inclusion_criteria", label: "Inclusion Criteria" },
  { value: "exclusion_criteria", label: "Exclusion Criteria" },
  { value: "age_from", label: "Age From" },
  { value: "age_to", label: "Age To" },
  { value: "subject_type", label: "Subject Type" },
  { value: "sex", label: "Sex" },
  { value: "healthy_volunteers", label: "Healthy Volunteers" },
  { value: "target_no_volunteers", label: "Target Number of Volunteers" },
  { value: "actual_enrolled_volunteers", label: "Actual Enrolled Volunteers" },
  
  // Timing fields
  { value: "start_date_estimated", label: "Start Date (Estimated)" },
  { value: "trial_end_date_estimated", label: "End Date (Estimated)" },
  
  // Results fields
  { value: "trial_outcome", label: "Trial Outcome" },
  { value: "trial_results", label: "Trial Results" },
  { value: "adverse_event_reported", label: "Adverse Event Reported" },
  { value: "adverse_event_type", label: "Adverse Event Type" },
  { value: "treatment_for_adverse_events", label: "Treatment for Adverse Events" },
  
  // Sites fields
  { value: "total_sites", label: "Total Sites" },
  { value: "site_notes", label: "Site Notes" },
  
  // Dates
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
  { value: "less_than", label: "<" },
  { value: "equals", label: "=" },
  { value: "not_equals", label: "!=" }
]

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

  const handleOpenSavedQueries = () => {
    // Implement open saved queries functionality
    console.log("Opening saved therapeutic queries")
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
                  <Input
                    placeholder="Enter the search term"
                    value={criterion.value}
                    onChange={(e) => updateCriteria(criterion.id, "value", e.target.value)}
                  />
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
  )
}
