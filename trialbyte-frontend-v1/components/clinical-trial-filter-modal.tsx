"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"

interface ClinicalTrialFilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplyFilters: (filters: ClinicalTrialFilterState) => void
  currentFilters: ClinicalTrialFilterState
}

export interface ClinicalTrialFilterState {
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
}

const filterCategories = {
  therapeuticAreas: ["Oncology", "Cardiology", "Neurology", "Endocrinology", "Immunology", "Dermatology"],
  statuses: ["Phase I", "Phase I/II", "Phase II", "Phase II/III", "Phase III", "Phase IV"],
  diseaseTypes: ["Lung Cancer", "Breast Cancer", "Colorectal Cancer", "Melanoma", "Lymphoma", "Leukemia"],
  primaryDrugs: ["Paclitaxel", "Carboplatin", "Pembrolizumab", "Nivolumab", "Atezolizumab", "Bevacizumab"],
  trialPhases: ["Phase I", "Phase I/II", "Phase II", "Phase II/III", "Phase III", "Phase IV"],
  patientSegments: ["Adults", "Elderly", "Pediatric", "Treatment Naive", "Treatment Experienced"],
  lineOfTherapy: ["First Line", "Second Line", "Third Line", "At least first line", "At least second line"],
  countries: ["United States", "Germany", "France", "United Kingdom", "Italy", "Spain", "Canada", "Japan"],
  sponsorsCollaborators: ["Novartis", "Pfizer", "Roche", "Bristol Myers Squibb", "Merck", "Johnson & Johnson"],
  sponsorFieldActivity: ["Pharmaceutical Company", "Biotechnology Company", "Academic Institution", "Contract Research Organization"],
  associatedCro: ["IQVIA", "Covance", "PPD", "Icon", "Syneos Health", "Parexel"],
  trialTags: ["Targeted", "Immunotherapy", "Combination", "Biomarker", "Precision Medicine"],
  sex: ["Male", "Female", "Both"],
  healthyVolunteers: ["Yes", "No"]
}

export function ClinicalTrialFilterModal({ open, onOpenChange, onApplyFilters, currentFilters }: ClinicalTrialFilterModalProps) {
  const [filters, setFilters] = useState<ClinicalTrialFilterState>(currentFilters)
  const [activeCategory, setActiveCategory] = useState<keyof ClinicalTrialFilterState>("therapeuticAreas")

  const handleSelectAll = (category: keyof ClinicalTrialFilterState) => {
    setFilters((prev) => ({
      ...prev,
      [category]: filterCategories[category],
    }))
  }

  const handleDeselectAll = (category: keyof ClinicalTrialFilterState) => {
    setFilters((prev) => ({
      ...prev,
      [category]: [],
    }))
  }

  const handleItemToggle = (category: keyof ClinicalTrialFilterState, item: string) => {
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
    const queryName = `Filter Query (${activeFilterCount} filters) - ${new Date().toLocaleDateString()}`;
    
    // Save to localStorage for demo purposes
    const savedQueries = JSON.parse(localStorage.getItem('clinicalTrialFilterQueries') || '[]');
    const newQuery = {
      id: Date.now().toString(),
      name: queryName,
      filters: filters,
      createdAt: new Date().toISOString()
    };
    
    savedQueries.push(newQuery);
    localStorage.setItem('clinicalTrialFilterQueries', JSON.stringify(savedQueries));
    
    // Show feedback
    alert(`Query saved as: ${queryName}`);
    console.log("Saving query:", filters)
  }

  const categoryLabels: Record<keyof ClinicalTrialFilterState, string> = {
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
    healthyVolunteers: "Healthy Volunteers"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-blue-50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Filters</DialogTitle>
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
                const category = key as keyof ClinicalTrialFilterState
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
                    : "Select All/Deselect All"}
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
            Run
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
