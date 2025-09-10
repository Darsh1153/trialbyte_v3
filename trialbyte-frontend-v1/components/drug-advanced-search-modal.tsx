"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Plus, Minus } from "lucide-react"

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
  { value: "drug_name", label: "Drug Name" },
  { value: "generic_name", label: "Generic Name" },
  { value: "other_name", label: "Other Name" },
  { value: "primary_name", label: "Primary Name" },
  { value: "global_status", label: "Global Status" },
  { value: "development_status", label: "Development Status" },
  { value: "originator", label: "Originator" },
  { value: "other_active_companies", label: "Other Active Companies" },
  { value: "therapeutic_area", label: "Therapeutic Area" },
  { value: "disease_type", label: "Disease Type" },
  { value: "regulator_designations", label: "Regulator Designations" },
  { value: "drug_record_status", label: "Drug Record Status" },
  { value: "is_approved", label: "Approval Status" },
  { value: "mechanism_of_action", label: "Mechanism of Action" },
  { value: "biological_target", label: "Biological Target" },
  { value: "drug_technology", label: "Drug Technology" },
  { value: "delivery_route", label: "Delivery Route" },
  { value: "delivery_medium", label: "Delivery Medium" },
  { value: "company", label: "Company" },
  { value: "company_type", label: "Company Type" },
  { value: "status", label: "Status" },
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
    // Implement open saved queries functionality
    console.log("Opening saved drug queries")
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
