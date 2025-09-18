"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Minus } from "lucide-react"
import { QueryHistoryModal } from "@/components/query-history-modal"

interface DrugAdvancedSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplySearch: (criteria: DrugSearchCriteria[]) => void
}

export interface DrugSearchCriteria {
  id: string
  field: string
  operator: string
  value: string
  logic: "AND" | "OR"
}

const drugSearchFields = [
  { value: "agreement", label: "Agreement" },
  { value: "biological_target", label: "Biological Target" },
  { value: "company", label: "Company" },
  { value: "company_type", label: "Company Type" },
  { value: "created_at", label: "Created Date" },
  { value: "created_date", label: "Log Created Date" },
  { value: "data", label: "Other Sources Data" },
  { value: "delivery_medium", label: "Delivery Medium" },
  { value: "delivery_route", label: "Delivery Route" },
  { value: "development_status", label: "Development Status" },
  { value: "disease_type", label: "Disease Type" },
  { value: "drug_changes_log", label: "Drug Changes Log" },
  { value: "drug_name", label: "Drug Name" },
  { value: "drug_record_status", label: "Drug Record Status" },
  { value: "drug_summary", label: "Drug Summary" },
  { value: "drug_technology", label: "Drug Technology" },
  { value: "full_review_user", label: "Full Review User" },
  { value: "generic_name", label: "Generic Name" },
  { value: "global_status", label: "Global Status" },
  { value: "is_approved", label: "Approval Status" },
  { value: "last_modified_user", label: "Last Modified User" },
  { value: "licensing_availability", label: "Licensing Availability" },
  { value: "marketing_approvals", label: "Marketing Approvals" },
  { value: "mechanism_of_action", label: "Mechanism of Action" },
  { value: "next_review_date", label: "Next Review Date" },
  { value: "notes", label: "Notes" },
  { value: "originator", label: "Originator" },
  { value: "other_active_companies", label: "Other Active Companies" },
  { value: "other_name", label: "Other Name" },
  { value: "preclinical", label: "Preclinical" },
  { value: "primary_drugs", label: "Primary Drugs" },
  { value: "primary_name", label: "Primary Name" },
  { value: "reference", label: "Reference" },
  { value: "regulator_designations", label: "Regulator Designations" },
  { value: "source_link", label: "Source Link" },
  { value: "sponsor", label: "Sponsor" },
  { value: "status", label: "Status" },
  { value: "therapeutic_area", label: "Therapeutic Area" },
  { value: "therapeutic_class", label: "Therapeutic Class" },
  { value: "title", label: "Development Title" },
  { value: "trial_id", label: "Trial ID" },
  { value: "updated_at", label: "Updated Date" }
]

const operators = [
  { value: "contains", label: "Contains" },
  { value: "is", label: "is" },
  { value: "is_not", label: "is not" },
  { value: "starts_with", label: "Starts with" },
  { value: "ends_with", label: "Ends with" },
  { value: "equals", label: "=" },
  { value: "not_equals", label: "!=" },
  { value: "greater_than", label: ">" },
  { value: "greater_than_or_equal", label: ">=" },
  { value: "less_than", label: "<" },
  { value: "less_than_or_equal", label: "<=" }
]

// Sample drug names for dropdown - in real app, this would come from API
const drugNames = [
  "Aspirin", "Ibuprofen", "Acetaminophen", "Morphine", "Codeine", "Penicillin", "Amoxicillin", "Ciprofloxacin",
  "Metformin", "Insulin", "Warfarin", "Digoxin", "Furosemide", "Lisinopril", "Amlodipine", "Atorvastatin",
  "Omeprazole", "Prednisone", "Hydrocortisone", "Diazepam", "Lorazepam", "Alprazolam", "Sertraline", "Fluoxetine"
]

// Fields that should show dropdowns instead of text input
const dropdownFields = [
  "drug_name", "generic_name", "primary_name", "global_status", "development_status", 
  "originator", "therapeutic_area", "disease_type", "regulator_designations", 
  "drug_record_status", "mechanism_of_action", "biological_target", "drug_technology",
  "delivery_route", "delivery_medium", "company", "company_type", "status", "is_approved",
  "therapeutic_class", "sponsor", "last_modified_user", "full_review_user"
]

export function DrugAdvancedSearchModal({ open, onOpenChange, onApplySearch }: DrugAdvancedSearchModalProps) {
  const [criteria, setCriteria] = useState<DrugSearchCriteria[]>([
    {
      id: "1",
      field: "drug_name",
      operator: "contains",
      value: "",
      logic: "AND",
    }
  ])
  const [savedQueriesOpen, setSavedQueriesOpen] = useState(false)

  // Get dropdown options based on field
  const getDropdownOptions = (field: string) => {
    switch (field) {
      case "drug_name":
      case "generic_name":
      case "primary_name":
        return drugNames.map(name => ({ value: name, label: name }))
      case "global_status":
        return [
          { value: "Approved", label: "Approved" },
          { value: "Pending", label: "Pending" },
          { value: "Rejected", label: "Rejected" },
          { value: "Discontinued", label: "Discontinued" },
          { value: "Under Review", label: "Under Review" },
          { value: "Phase I", label: "Phase I" },
          { value: "Phase II", label: "Phase II" },
          { value: "Phase III", label: "Phase III" },
          { value: "Phase IV", label: "Phase IV" }
        ]
      case "development_status":
        return [
          { value: "Preclinical", label: "Preclinical" },
          { value: "Phase I", label: "Phase I" },
          { value: "Phase II", label: "Phase II" },
          { value: "Phase III", label: "Phase III" },
          { value: "Phase IV", label: "Phase IV" },
          { value: "Approved", label: "Approved" },
          { value: "Discontinued", label: "Discontinued" },
          { value: "Suspended", label: "Suspended" }
        ]
      case "therapeutic_area":
        return [
          { value: "Oncology", label: "Oncology" },
          { value: "Cardiology", label: "Cardiology" },
          { value: "Neurology", label: "Neurology" },
          { value: "Endocrinology", label: "Endocrinology" },
          { value: "Immunology", label: "Immunology" },
          { value: "Dermatology", label: "Dermatology" },
          { value: "Hematology", label: "Hematology" },
          { value: "Pulmonology", label: "Pulmonology" }
        ]
      case "disease_type":
        return [
          { value: "Lung Cancer", label: "Lung Cancer" },
          { value: "Breast Cancer", label: "Breast Cancer" },
          { value: "Colorectal Cancer", label: "Colorectal Cancer" },
          { value: "Melanoma", label: "Melanoma" },
          { value: "Lymphoma", label: "Lymphoma" },
          { value: "Leukemia", label: "Leukemia" },
          { value: "Prostate Cancer", label: "Prostate Cancer" },
          { value: "Ovarian Cancer", label: "Ovarian Cancer" }
        ]
      case "is_approved":
        return [
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" }
        ]
      case "therapeutic_class":
        return [
          { value: "Antibiotic", label: "Antibiotic" },
          { value: "Antiviral", label: "Antiviral" },
          { value: "Antifungal", label: "Antifungal" },
          { value: "Anticancer", label: "Anticancer" },
          { value: "Cardiovascular", label: "Cardiovascular" },
          { value: "Neurological", label: "Neurological" },
          { value: "Endocrine", label: "Endocrine" },
          { value: "Immunosuppressive", label: "Immunosuppressive" }
        ]
      case "sponsor":
        return [
          { value: "Pfizer", label: "Pfizer" },
          { value: "Johnson & Johnson", label: "Johnson & Johnson" },
          { value: "Roche", label: "Roche" },
          { value: "Novartis", label: "Novartis" },
          { value: "Merck", label: "Merck" },
          { value: "GSK", label: "GSK" },
          { value: "Sanofi", label: "Sanofi" },
          { value: "AstraZeneca", label: "AstraZeneca" }
        ]
      case "last_modified_user":
      case "full_review_user":
        return [
          { value: "admin", label: "Admin" },
          { value: "reviewer", label: "Reviewer" },
          { value: "editor", label: "Editor" },
          { value: "analyst", label: "Analyst" }
        ]
      default:
        return []
    }
  }

  const addCriteria = () => {
    const newCriteria: DrugSearchCriteria = {
      id: Date.now().toString(),
      field: "drug_name",
      operator: "contains",
      value: "",
      logic: "AND",
    }
    setCriteria((prev) => [...prev, newCriteria])
  }

  const removeCriteria = (id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id))
  }

  const updateCriteria = (id: string, field: keyof DrugSearchCriteria, value: string) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const handleApply = () => {
    onApplySearch(criteria.filter((c) => c.value.trim() !== ""))
    onOpenChange(false)
  }

  const handleClear = () => {
    setCriteria([{
      id: "1",
      field: "drug_name",
      operator: "contains",
      value: "",
      logic: "AND",
    }])
  }

  const handleOpenSavedQueries = () => {
    setSavedQueriesOpen(true)
  }

  const handleLoadQuery = (queryData: any) => {
    if (queryData.searchCriteria && Array.isArray(queryData.searchCriteria)) {
      setCriteria(queryData.searchCriteria)
    }
    setSavedQueriesOpen(false)
  }

  const handleSaveQuery = () => {
    // Create a readable query name
    const queryName = `Drug Advanced Search (${criteria.length} criteria) - ${new Date().toLocaleDateString()}`;
    
    // Save to localStorage for demo purposes
    const savedQueries = JSON.parse(localStorage.getItem('drugSearchQueries') || '[]');
    const newQuery = {
      id: Date.now().toString(),
      name: queryName,
      criteria: criteria,
      createdAt: new Date().toISOString()
    };
    
    savedQueries.push(newQuery);
    localStorage.setItem('drugSearchQueries', JSON.stringify(savedQueries));
    
    // Show feedback
    alert(`Query saved as: ${queryName}`);
    console.log("Saving drug query:", criteria)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-blue-50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Advanced Drug Search</DialogTitle>
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
                      {drugSearchFields.map((field) => (
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
                  {dropdownFields.includes(criterion.field) ? (
                    <Select
                      value={criterion.value}
                      onValueChange={(value) => updateCriteria(criterion.id, "value", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a value" />
                      </SelectTrigger>
                      <SelectContent>
                        {getDropdownOptions(criterion.field).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      placeholder="Enter the search term"
                      value={criterion.value}
                      onChange={(e) => updateCriteria(criterion.id, "value", e.target.value)}
                    />
                  )}
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
              Save this Querye
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
      
      <QueryHistoryModal
        open={savedQueriesOpen}
        onOpenChange={setSavedQueriesOpen}
        onLoadQuery={handleLoadQuery}
      />
    </Dialog>
  )
}
