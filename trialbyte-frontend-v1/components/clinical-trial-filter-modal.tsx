"use client"

import { formatDateToMMDDYYYY } from "@/lib/date-utils";
import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"
import { useDrugNames } from "@/hooks/use-drug-names"

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
  otherDrugs: string[]
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

// Static filter options that match the add trial form
const staticFilterCategories = {
  therapeuticAreas: [
    "Autoimmune", "Cardiovascular", "Endocrinology", "Gastrointestinal", "Infectious",
    "Oncology", "Gastroenterology", "Dermatology", "Vaccines", "CNS/Neurology",
    "Ophthalmology", "Immunology", "Rheumatology", "Haematology", "Nephrology", "Urology"
  ],
  statuses: ["Planned", "Open", "Closed", "Completed", "Terminated"],
  diseaseTypes: [
    "Acute Lymphocytic Leukemia", "Acute Myelogenous Leukemia", "Anal", "Appendiceal",
    "Basal Skin Cell Carcinoma", "Bladder", "Breast", "Cervical", "Cholangiocarcinoma (Bile duct)",
    "Chronic Lymphocytic Leukemia", "Chronic Myelomonositic Leukemia", "Astrocytoma",
    "Brain Stem Glioma", "Carniopharyngioma", "Choroid Plexus Tumors", "Embryonal Tumors",
    "Epedymoma", "Germ Cell Tumors", "Glioblastoma", "Hemangioblastoma", "Medulloblastoma",
    "Meningioma", "Oligodendroglioma", "Pineal Tumor", "Pituitary Tumor", "Colorectal",
    "Endometrial", "Esophageal", "Fallopian Tube", "Gall Bladder", "Gastric", "GIST",
    "Head/Neck", "Hodgkin's Lymphoma", "Leukemia, Chronic Myelogenous", "Liver",
    "Lung Non-small cell", "Lung Small Cell", "Melanoma", "Mesothelioma", "Metastatic Cancer",
    "Multiple Myeloma", "Myelodysplastic Syndrome", "Myeloproliferative Neoplasms",
    "Neuroblastoma", "Neuroendocrine", "Non-Hodgkin's Lymphoma", "Osteosarcoma", "Ovarian",
    "Pancreas", "Penile", "Primary Peritoneal", "Prostate", "Renal", "Small Intestine",
    "Soft Tissue Carcinoma", "Solid Tumor, Unspecified", "Squamous Skin Cell Carcinoma",
    "Supportive care", "Tenosynovial Giant Cell Tumor", "Testicular", "Thymus", "Thyroid",
    "Unspecified Cancer", "Unspecified Haematological Cancer", "Vaginal", "Vulvar"
  ],
  trialPhases: ["Phase I", "Phase I/II", "Phase II", "Phase II/III", "Phase III", "Phase III/IV", "Phase IV"],
  patientSegments: ["Children", "Adults", "Healthy Volunteers", "Unknown", "First Line", "Second Line", "Adjuvant"],
  lineOfTherapy: [
    "1 – First Line", "2 – Second Line", "Unknown", "2+ - At least second line",
    "3+ - At least third line", "Neo-Adjuvant", "Adjuvant", "Maintenance/Consolidation",
    "1+ - At least first line"
  ],
  countries: [
    "United States", "Canada", "United Kingdom", "Germany", "France", "Italy", "Spain",
    "Japan", "China", "India", "Australia", "Brazil", "Mexico", "South Korea",
    "Switzerland", "Netherlands", "Belgium", "Sweden", "Norway", "Denmark"
  ],
  sponsorsCollaborators: ["Pfizer", "Novartis", "AstraZeneca"],
  sponsorFieldActivity: ["Pharmaceutical Company", "University/Academy", "Investigator", "CRO", "Hospital"],
  associatedCro: ["IQVIA", "Syneos", "PPD"],
  trialTags: [
    "Biomarker-Efficacy", "Biomarker-Toxicity", "Expanded Access", "Expanded Indication",
    "First in Human", "Investigator-Initiated", "IO/Cytotoxic Combination", "IO/Hormonal Combination",
    "IO/IO Combination", "IO/Other Combination", "IO/Radiotherapy Combination", "IO/Targeted Combination",
    "Microdosing", "PGX-Biomarker Identification/Evaluation", "PGX-Pathogen",
    "PGX-Patient Preselection/Stratification", "Post-Marketing Commitment", "Registration"
  ],
  sex: ["Male", "Female", "Both"],
  healthyVolunteers: ["Yes", "No"]
}

export function ClinicalTrialFilterModal({ open, onOpenChange, onApplyFilters, currentFilters }: ClinicalTrialFilterModalProps) {
  const [filters, setFilters] = useState<ClinicalTrialFilterState>(currentFilters)
  const [activeCategory, setActiveCategory] = useState<keyof ClinicalTrialFilterState>("therapeuticAreas")
  const { getPrimaryDrugsOptions, isLoading: isDrugsLoading } = useDrugNames()

  // Build filter categories with dynamic drug data from API
  const filterCategories = useMemo(() => {
    const drugOptions = getPrimaryDrugsOptions()
    const drugLabels = drugOptions.map(drug => drug.label)
    
    return {
      ...staticFilterCategories,
      primaryDrugs: drugLabels.length > 0 ? drugLabels : ["No drugs available - add drugs in the drug module"],
      otherDrugs: drugLabels.length > 0 ? drugLabels : ["No drugs available - add drugs in the drug module"],
    }
  }, [getPrimaryDrugsOptions])

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
    const queryName = `Filter Query (${activeFilterCount} filters) - ${formatDateToMMDDYYYY(new Date().toISOString())}`;
    
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
    primaryDrugs: "Primary Drugs",
    otherDrugs: "Other Drugs",
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
                const selectedCount = filters[category]?.length || 0
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between ${
                      activeCategory === category ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                    }`}
                  >
                    <span>{categoryLabels[category]}</span>
                    {selectedCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-full">
                        {selectedCount}
                      </span>
                    )}
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
