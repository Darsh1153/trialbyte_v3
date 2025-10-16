"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { X } from "lucide-react"

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
}

// Function to extract unique values from trials data
const getUniqueValues = (trials: any[], fieldPath: string): string[] => {
  const values = new Set<string>()
  
  trials.forEach(trial => {
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
    
    if (value && value.trim()) {
      values.add(value.trim())
    }
  })
  
  return Array.from(values).sort()
}

export function TherapeuticFilterModal({ open, onOpenChange, onApplyFilters, currentFilters, trials = [] }: TherapeuticFilterModalProps) {
  const [filters, setFilters] = useState<TherapeuticFilterState>(currentFilters)
  const [activeCategory, setActiveCategory] = useState<keyof TherapeuticFilterState>("therapeuticAreas")
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
    trialRecordStatus: []
  })

  // Update filter categories when trials data changes
  useEffect(() => {
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
        trialRecordStatus: getUniqueValues(trials, 'trial_record_status')
      }
      setFilterCategories(newFilterCategories)
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
    // Create a readable query name
    const activeFilterCount = Object.values(filters).reduce((count, arr) => count + arr.length, 0);
    const queryName = `Therapeutic Filter Query (${activeFilterCount} filters) - ${new Date().toLocaleDateString()}`;
    
    // Save to localStorage for demo purposes
    const savedQueries = JSON.parse(localStorage.getItem('therapeuticFilterQueries') || '[]');
    const newQuery = {
      id: Date.now().toString(),
      name: queryName,
      filters: filters,
      createdAt: new Date().toISOString()
    };
    
    savedQueries.push(newQuery);
    localStorage.setItem('therapeuticFilterQueries', JSON.stringify(savedQueries));
    
    // Show feedback
    alert(`Query saved as: ${queryName}`);
    console.log("Saving therapeutic filter query:", filters)
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
    trialRecordStatus: "Trial Record Status"
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
            <div className="space-y-2">
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

