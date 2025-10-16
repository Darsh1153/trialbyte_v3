"use client";

import { useState, useEffect } from 'react';
import { SearchableSelectOption } from '@/components/ui/searchable-select';
import { dropdownManagementAPI, convertToSearchableSelectOptions } from '@/lib/dropdown-management-api';

// Hook for using dynamic dropdown options
export const useDynamicDropdownOptions = (categoryName: string) => {
  const [options, setOptions] = useState<SearchableSelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await dropdownManagementAPI.getOptions(categoryName);
        
        if (response.success && response.data) {
          const searchableOptions = convertToSearchableSelectOptions(response.data);
          setOptions(searchableOptions);
        } else {
          // Fallback to hardcoded options if API fails
          setOptions(getFallbackOptions(categoryName));
          setError(response.error || 'Failed to fetch options');
        }
      } catch (err) {
        // Fallback to hardcoded options if API fails
        setOptions(getFallbackOptions(categoryName));
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [categoryName]);

  return { options, loading, error };
};

// Fallback options for when API is not available
const getFallbackOptions = (categoryName: string): SearchableSelectOption[] => {
  const fallbackOptions: Record<string, SearchableSelectOption[]> = {
    disease_type: [
      { value: "cancer", label: "Cancer" },
      { value: "diabetes", label: "Diabetes" },
      { value: "alzheimers", label: "Alzheimer's Disease" },
      { value: "parkinsons", label: "Parkinson's Disease" },
      { value: "multiple_sclerosis", label: "Multiple Sclerosis" },
      { value: "rheumatoid_arthritis", label: "Rheumatoid Arthritis" },
      { value: "lupus", label: "Lupus" },
      { value: "crohns_disease", label: "Crohn's Disease" },
      { value: "ulcerative_colitis", label: "Ulcerative Colitis" },
      { value: "psoriasis", label: "Psoriasis" },
    ],
    therapeutic_area: [
      { value: "autoimmune", label: "Autoimmune" },
      { value: "cardiovascular", label: "Cardiovascular" },
      { value: "endocrinology", label: "Endocrinology" },
      { value: "gastrointestinal", label: "Gastrointestinal" },
      { value: "infectious", label: "Infectious" },
      { value: "oncology", label: "Oncology" },
      { value: "dermatology", label: "Dermatology" },
      { value: "vaccines", label: "Vaccines" },
      { value: "cns_neurology", label: "CNS/Neurology" },
      { value: "ophthalmology", label: "Ophthalmology" },
      { value: "immunology", label: "Immunology" },
      { value: "rheumatology", label: "Rheumatology" },
      { value: "haematology", label: "Haematology" },
      { value: "nephrology", label: "Nephrology" },
      { value: "urology", label: "Urology" },
    ],
    trial_phase: [
      { value: "phase_i", label: "Phase I" },
      { value: "phase_i_ii", label: "Phase I/II" },
      { value: "phase_ii", label: "Phase II" },
      { value: "phase_ii_iii", label: "Phase II/III" },
      { value: "phase_iii", label: "Phase III" },
      { value: "phase_iii_iv", label: "Phase III/IV" },
      { value: "phase_iv", label: "Phase IV" },
    ],
    trial_status: [
      { value: "planned", label: "Planned" },
      { value: "open", label: "Open" },
      { value: "closed", label: "Closed" },
      { value: "completed", label: "Completed" },
      { value: "terminated", label: "Terminated" },
    ],
    development_status: [
      { value: "launched", label: "Launched" },
      { value: "no_development_reported", label: "No Development Reported" },
      { value: "discontinued", label: "Discontinued" },
      { value: "clinical_phase_1", label: "Clinical Phase I" },
      { value: "clinical_phase_2", label: "Clinical Phase II" },
      { value: "clinical_phase_3", label: "Clinical Phase III" },
      { value: "clinical_phase_4", label: "Clinical Phase IV" },
      { value: "preclinical", label: "Preclinical" },
    ],
    company_type: [
      { value: "originator", label: "Originator" },
      { value: "generic", label: "Generic" },
      { value: "biosimilar", label: "Biosimilar" },
      { value: "licensed", label: "Licensed" },
      { value: "partnership", label: "Partnership" },
      { value: "open_source", label: "Open Source" },
    ],
    sex: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "both", label: "Both" },
    ],
    healthy_volunteers: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
    ],
  };

  return fallbackOptions[categoryName] || [];
};




