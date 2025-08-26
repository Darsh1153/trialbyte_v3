"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Minus } from "lucide-react"

interface ClinicalTrialAdvancedSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplySearch: (criteria: ClinicalTrialSearchCriteria[]) => void
}

export interface ClinicalTrialSearchCriteria {
  id: string
  field: string
  operator: string
  value: string
  logic: "AND" | "OR"
}

const searchFields = [
  { value: "disease_type", label: "Disease Type" },
  { value: "enrollment", label: "Enrollment" },
  { value: "therapeutic_area", label: "Therapeutic Area" },
  { value: "trial_phase", label: "Trial Phase" },
  { value: "primary_drugs", label: "Primary Drug" },
  { value: "secondary_drugs", label: "Secondary Drug" },
  { value: "trial_status", label: "Trial Status" },
  { value: "sponsor_collaborators", label: "Sponsor" },
  { value: "countries", label: "Countries" },
  { value: "patient_segment", label: "Patient Segment" },
  { value: "line_of_therapy", label: "Line of Therapy" },
  { value: "trial_identifier", label: "Trial Identifier" },
  { value: "start_date", label: "Start Date" },
  { value: "end_date", label: "End Date" }
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

export function ClinicalTrialAdvancedSearchModal({ open, onOpenChange, onApplySearch }: ClinicalTrialAdvancedSearchModalProps) {
  const [criteria, setCriteria] = useState<ClinicalTrialSearchCriteria[]>([
    {
      id: "1",
      field: "disease_type",
      operator: "contains",
      value: "User cancer",
      logic: "AND",
    },
    {
      id: "2", 
      field: "enrollment",
      operator: "is",
      value: "100",
      logic: "OR",
    }
  ])

  const addCriteria = () => {
    const newCriteria: ClinicalTrialSearchCriteria = {
      id: Date.now().toString(),
      field: "disease_type",
      operator: "contains",
      value: "",
      logic: "AND",
    }
    setCriteria((prev) => [...prev, newCriteria])
  }

  const removeCriteria = (id: string) => {
    setCriteria((prev) => prev.filter((c) => c.id !== id))
  }

  const updateCriteria = (id: string, field: keyof ClinicalTrialSearchCriteria, value: string) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const handleApply = () => {
    onApplySearch(criteria.filter((c) => c.value.trim() !== ""))
    onOpenChange(false)
  }

  const handleOpenSavedQueries = () => {
    // Implement open saved queries functionality
    console.log("Opening saved queries")
  }

  const handleSaveQuery = () => {
    // Create a readable query name
    const queryName = `Advanced Search (${criteria.length} criteria) - ${new Date().toLocaleDateString()}`;
    
    // Save to localStorage for demo purposes
    const savedQueries = JSON.parse(localStorage.getItem('clinicalTrialSearchQueries') || '[]');
    const newQuery = {
      id: Date.now().toString(),
      name: queryName,
      criteria: criteria,
      createdAt: new Date().toISOString()
    };
    
    savedQueries.push(newQuery);
    localStorage.setItem('clinicalTrialSearchQueries', JSON.stringify(savedQueries));
    
    // Show feedback
    alert(`Query saved as: ${queryName}`);
    console.log("Saving query:", criteria)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-blue-50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Advanced search</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
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
                      {searchFields.map((field) => (
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
          </div>
          <Button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700">
            Run
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
