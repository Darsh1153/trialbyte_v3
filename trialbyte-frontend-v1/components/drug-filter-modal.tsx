"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"

interface DrugFilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: DrugFilterState) => void
  currentFilters: DrugFilterState
}

export interface DrugFilterState {
  globalStatuses: string[]
  developmentStatuses: string[]
  therapeuticAreas: string[]
  diseaseTypes: string[]
  originators: string[]
  otherActiveCompanies: string[]
  regulatorDesignations: string[]
  drugRecordStatus: string[]
  isApproved: string[]
  companyTypes: string[]
  mechanismOfAction: string[]
  biologicalTargets: string[]
  drugTechnologies: string[]
  deliveryRoutes: string[]
  deliveryMediums: string[]
}

const filterCategories = {
  globalStatuses: ["Approved", "Pending", "Rejected", "Discontinued", "Under Review", "Phase I", "Phase II", "Phase III", "Phase IV"],
  developmentStatuses: ["Preclinical", "Phase I", "Phase II", "Phase III", "Phase IV", "Approved", "Discontinued", "Suspended"],
  therapeuticAreas: ["Oncology", "Cardiology", "Neurology", "Endocrinology", "Immunology", "Dermatology", "Hematology", "Pulmonology", "Gastroenterology"],
  diseaseTypes: ["Lung Cancer", "Breast Cancer", "Colorectal Cancer", "Melanoma", "Lymphoma", "Leukemia", "Prostate Cancer", "Ovarian Cancer", "Pancreatic Cancer"],
  originators: ["Novartis", "Pfizer", "Roche", "Bristol Myers Squibb", "Merck", "Johnson & Johnson", "AstraZeneca", "Sanofi", "GlaxoSmithKline", "AbbVie"],
  otherActiveCompanies: ["Novartis", "Pfizer", "Roche", "Bristol Myers Squibb", "Merck", "Johnson & Johnson", "AstraZeneca", "Sanofi", "GlaxoSmithKline", "AbbVie"],
  regulatorDesignations: ["Fast Track", "Breakthrough Therapy", "Orphan Drug", "Priority Review", "Accelerated Approval", "Conditional Approval"],
  drugRecordStatus: ["Active", "Inactive", "Draft", "Under Review", "Approved", "Rejected"],
  isApproved: ["Yes", "No"],
  companyTypes: ["Pharmaceutical Company", "Biotechnology Company", "Academic Institution", "Contract Research Organization", "Government Agency"],
  mechanismOfAction: ["Kinase Inhibitor", "Monoclonal Antibody", "Small Molecule", "Gene Therapy", "Cell Therapy", "Antibody-Drug Conjugate", "Immunotherapy"],
  biologicalTargets: ["EGFR", "VEGF", "PD-1", "PD-L1", "HER2", "ALK", "BRAF", "PI3K", "mTOR", "CDK"],
  drugTechnologies: ["Small Molecule", "Biologic", "Gene Therapy", "Cell Therapy", "RNA Therapy", "Protein Therapy", "Vaccine"],
  deliveryRoutes: ["Oral", "Intravenous", "Subcutaneous", "Intramuscular", "Topical", "Inhalation", "Intranasal"],
  deliveryMediums: ["Tablets", "Capsules", "Injection", "Infusion", "Cream", "Ointment", "Inhaler", "Patch"]
}

export function DrugFilterModal({ open, onOpenChange, onApplyFilters, currentFilters }: DrugFilterModalProps) {
  const [filters, setFilters] = useState<DrugFilterState>(currentFilters)
  const [activeCategory, setActiveCategory] = useState<keyof DrugFilterState>("globalStatuses")

  const handleSelectAll = (category: keyof DrugFilterState) => {
    setFilters((prev) => ({
      ...prev,
      [category]: filterCategories[category],
    }))
  }

  const handleDeselectAll = (category: keyof DrugFilterState) => {
    setFilters((prev) => ({
      ...prev,
      [category]: [],
    }))
  }

  const handleItemToggle = (category: keyof DrugFilterState, item: string) => {
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
    // Create a readable query name
    const activeFilterCount = Object.values(filters).reduce((count, arr) => count + arr.length, 0);
    const queryName = `Drug Filter Query (${activeFilterCount} filters) - ${new Date().toLocaleDateString()}`;
    
    // Save to localStorage for demo purposes
    const savedQueries = JSON.parse(localStorage.getItem('drugFilterQueries') || '[]');
    const newQuery = {
      id: Date.now().toString(),
      name: queryName,
      filters: filters,
      createdAt: new Date().toISOString()
    };
    
    savedQueries.push(newQuery);
    localStorage.setItem('drugFilterQueries', JSON.stringify(savedQueries));
    
    // Show feedback
    alert(`Query saved as: ${queryName}`);
    console.log("Saving drug filter query:", filters)
  }

  const categoryLabels: Record<keyof DrugFilterState, string> = {
    globalStatuses: "Global Status",
    developmentStatuses: "Development Status", 
    therapeuticAreas: "Therapeutic Area",
    diseaseTypes: "Disease Type",
    originators: "Originator",
    otherActiveCompanies: "Other Active Companies",
    regulatorDesignations: "Regulator Designations",
    drugRecordStatus: "Drug Record Status",
    isApproved: "Approval Status",
    companyTypes: "Company Type",
    mechanismOfAction: "Mechanism of Action",
    biologicalTargets: "Biological Target",
    drugTechnologies: "Drug Technology",
    deliveryRoutes: "Delivery Route",
    deliveryMediums: "Delivery Medium"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-blue-50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Drug Filters</DialogTitle>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="h-6 w-6 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex h-[500px]">
          {/* Left sidebar with filter categories */}
          <div className="w-64 border-r bg-gray-50 p-4">
            <div className="space-y-2">
              {Object.keys(categoryLabels).map((key) => {
                const category = key as keyof DrugFilterState
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
                {filterCategories[activeCategory].map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${activeCategory}-${item}`}
                      checked={filters[activeCategory].includes(item)}
                      onCheckedChange={() => handleItemToggle(activeCategory, item)}
                    />
                    <label
                      htmlFor={`${activeCategory}-${item}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item}
                    </label>
                  </div>
                ))}
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
    </Dialog>
  )
}

