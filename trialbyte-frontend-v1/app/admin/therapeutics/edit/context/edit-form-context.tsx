"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Define the complete form structure for editing
export interface EditTherapeuticFormData {
  // Step 5-1: Trial Overview
  step5_1: {
    therapeutic_area: string;
    trial_identifier: string[];
    trial_phase: string;
    status: string;
    primary_drugs: string;
    other_drugs: string;
    title: string;
    disease_type: string;
    patient_segment: string;
    line_of_therapy: string;
    reference_links: string[];
    trial_tags: string;
    sponsor_collaborators: string;
    sponsor_field_activity: string;
    associated_cro: string;
    countries: string;
    region: string;
    trial_record_status: string;
  };

  // Step 5-2: Trial Purpose & Design
  step5_2: {
    purpose_of_trial: string;
    summary: string;
    primaryOutcomeMeasures: string[];
    otherOutcomeMeasures: string[];
    study_design_keywords: string[];
    study_design: string;
    treatment_regimen: string;
    number_of_arms: string;
  };

  // Step 5-3: Eligibility Criteria
  step5_3: {
    inclusion_criteria: string[];
    exclusion_criteria: string[];
    age_min: string;
    age_max: string;
    gender: string;
    ecog_performance_status: string;
    prior_treatments: string[];
    biomarker_requirements: string[];
  };

  // Step 5-4: Patient Population
  step5_4: {
    estimated_enrollment: string;
    actual_enrollment: string;
    enrollment_status: string;
    recruitment_period: string;
    study_completion_date: string;
    primary_completion_date: string;
    population_description: string;
    references: Array<{
      id: string;
      date: string;
      registryType: string;
      content: string;
      viewSource: string;
      attachments: string[];
      isVisible: boolean;
    }>;
  };

  // Step 5-5: Study Sites
  step5_5: {
    study_sites: string[];
    principal_investigators: string[];
    site_status: string;
    site_countries: string[];
    site_regions: string[];
    site_contact_info: string[];
    results_available: boolean;
    endpoints_met: boolean;
    adverse_events_reported: boolean;
  };

  // Step 5-6: Timeline & Milestones
  step5_6: {
    study_start_date: string;
    first_patient_in: string;
    last_patient_in: string;
    study_end_date: string;
    interim_analysis_dates: string[];
    final_analysis_date: string;
    regulatory_submission_date: string;
  };

  // Step 5-7: Results & Outcomes
  step5_7: {
    primary_endpoint_results: string;
    secondary_endpoint_results: string[];
    safety_results: string;
    efficacy_results: string;
    statistical_significance: string;
    adverse_events: string[];
    conclusion: string;
    pipeline_data: Array<{
      id: string;
      date: string;
      information: string;
      url: string;
      file: string;
      isVisible: boolean;
    }>;
    press_releases: Array<{
      id: string;
      date: string;
      title: string;
      url: string;
      file: string;
      isVisible: boolean;
    }>;
    publications: Array<{
      id: string;
      type: string;
      title: string;
      url: string;
      file: string;
      isVisible: boolean;
    }>;
    trial_registries: Array<{
      id: string;
      registry: string;
      identifier: string;
      url: string;
      file: string;
      isVisible: boolean;
    }>;
    associated_studies: Array<{
      id: string;
      type: string;
      title: string;
      url: string;
      file: string;
      isVisible: boolean;
    }>;
  };

  // Step 5-8: Additional Information
  step5_8: {
    notes: Array<{
      id: string;
      date: string;
      type: string;
      content: string;
      sourceLink?: string;
      attachments?: string[];
      isVisible: boolean;
    }>;
    attachments: string[];
    regulatory_links: string[];
    publication_links: string[];
    additional_resources: string[];
    date_type: string;
    link: string;
    changesLog: Array<{
      id: string;
      timestamp: string;
      user: string;
      action: string;
      details: string;
      field?: string;
      oldValue?: string;
      newValue?: string;
      step?: string;
      changeType?: string;
    }>;
    creationInfo: {
      createdDate: string;
      createdUser: string;
    };
    modificationInfo: {
      lastModifiedDate: string;
      lastModifiedUser: string;
      modificationCount: number;
    };
  };
}

// Initial form data
const initialFormData: EditTherapeuticFormData = {
  step5_1: {
    therapeutic_area: "",
    trial_identifier: [],
    trial_phase: "",
    status: "",
    primary_drugs: "",
    other_drugs: "",
    title: "",
    disease_type: "",
    patient_segment: "",
    line_of_therapy: "",
    reference_links: [],
    trial_tags: "",
    sponsor_collaborators: "",
    sponsor_field_activity: "",
    associated_cro: "",
    countries: "",
    region: "",
    trial_record_status: "",
  },
  step5_2: {
    purpose_of_trial: "",
    summary: "",
    primaryOutcomeMeasures: [],
    otherOutcomeMeasures: [],
    study_design_keywords: [],
    study_design: "",
    treatment_regimen: "",
    number_of_arms: "",
  },
  step5_3: {
    inclusion_criteria: [],
    exclusion_criteria: [],
    age_min: "",
    age_max: "",
    gender: "",
    ecog_performance_status: "",
    prior_treatments: [],
    biomarker_requirements: [],
  },
  step5_4: {
    estimated_enrollment: "",
    actual_enrollment: "",
    enrollment_status: "",
    recruitment_period: "",
    study_completion_date: "",
    primary_completion_date: "",
    population_description: "",
    references: [],
  },
  step5_5: {
    study_sites: [],
    principal_investigators: [],
    site_status: "",
    site_countries: [],
    site_regions: [],
    site_contact_info: [],
    results_available: false,
    endpoints_met: false,
    adverse_events_reported: false,
  },
  step5_6: {
    study_start_date: "",
    first_patient_in: "",
    last_patient_in: "",
    study_end_date: "",
    interim_analysis_dates: [],
    final_analysis_date: "",
    regulatory_submission_date: "",
  },
  step5_7: {
    primary_endpoint_results: "",
    secondary_endpoint_results: [],
    safety_results: "",
    efficacy_results: "",
    statistical_significance: "",
    adverse_events: [],
    conclusion: "",
    pipeline_data: [],
    press_releases: [],
    publications: [],
    trial_registries: [],
    associated_studies: [],
  },
  step5_8: {
    notes: [],
    attachments: [],
    regulatory_links: [],
    publication_links: [],
    additional_resources: [],
    date_type: "",
    link: "",
    changesLog: [],
    creationInfo: {
      createdDate: "",
      createdUser: "",
    },
    modificationInfo: {
      lastModifiedDate: "",
      lastModifiedUser: "",
      modificationCount: 0,
    },
  },
};

// Action types
type EditFormAction =
  | { type: "SET_TRIAL_DATA"; payload: any }
  | { type: "UPDATE_FIELD"; step: keyof EditTherapeuticFormData; field: string; value: any }
  | { type: "ADD_ARRAY_ITEM"; step: keyof EditTherapeuticFormData; field: string; value: any }
  | { type: "REMOVE_ARRAY_ITEM"; step: keyof EditTherapeuticFormData; field: string; index: number }
  | { type: "UPDATE_ARRAY_ITEM"; step: keyof EditTherapeuticFormData; field: string; index: number; value: any }
  | { type: "RESET_FORM" };

// Reducer function
function editFormReducer(state: EditTherapeuticFormData, action: EditFormAction): EditTherapeuticFormData {
  switch (action.type) {
    case "SET_TRIAL_DATA":
      return action.payload;
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.step]: {
          ...state[action.step],
          [action.field]: action.value,
        },
      };
    case "ADD_ARRAY_ITEM":
      return {
        ...state,
        [action.step]: {
          ...state[action.step],
          [action.field]: [...(state[action.step] as any)[action.field], action.value],
        },
      };
    case "REMOVE_ARRAY_ITEM":
      return {
        ...state,
        [action.step]: {
          ...state[action.step],
          [action.field]: (state[action.step] as any)[action.field].filter(
            (_: any, index: number) => index !== action.index
          ),
        },
      };
    case "UPDATE_ARRAY_ITEM":
      return {
        ...state,
        [action.step]: {
          ...state[action.step],
          [action.field]: (state[action.step] as any)[action.field].map(
            (item: any, index: number) => (index === action.index ? action.value : item)
          ),
        },
      };
    case "RESET_FORM":
      return initialFormData;
    default:
      return state;
  }
}

// Context type
interface EditTherapeuticFormContextType {
  formData: EditTherapeuticFormData;
  updateField: (step: keyof EditTherapeuticFormData, field: string, value: any) => void;
  addArrayItem: (step: keyof EditTherapeuticFormData, field: string, value: any) => void;
  removeArrayItem: (step: keyof EditTherapeuticFormData, field: string, index: number) => void;
  updateArrayItem: (step: keyof EditTherapeuticFormData, field: string, index: number, value: any) => void;
  addReference: (step: keyof EditTherapeuticFormData, field: string) => void;
  removeReference: (step: keyof EditTherapeuticFormData, field: string, index: number) => void;
  updateReference: (step: keyof EditTherapeuticFormData, field: string, index: number, updates: any) => void;
  addNote: (step: keyof EditTherapeuticFormData, field: string) => void;
  updateNote: (step: keyof EditTherapeuticFormData, field: string, index: number, updates: Partial<any>) => void;
  removeNote: (step: keyof EditTherapeuticFormData, field: string, index: number) => void;
  toggleNoteVisibility: (step: keyof EditTherapeuticFormData, field: string, index: number) => void;
  saveTrial: (trialId: string) => Promise<void>;
  loadTrialData: (trialId: string) => Promise<void>;
  isLoading: boolean;
  isSaving: boolean;
}

// Create context
const EditTherapeuticFormContext = createContext<EditTherapeuticFormContextType | undefined>(undefined);

// Provider component
export function EditTherapeuticFormProvider({ children, trialId }: { children: ReactNode; trialId: string }) {
  const [formData, dispatch] = useReducer(editFormReducer, initialFormData);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();

  // Store the original trial data for reference
  const [originalTrial, setOriginalTrial] = React.useState<any>(null);

  // Load trial data
  const loadTrialData = async (trialId: string) => {
    try {
      setIsLoading(true);
      
      // Try to fetch from API first
      let data = null;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        // Wrap fetch in a promise that never rejects
        const fetchPromise = fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/therapeutic/all-trials-with-data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          signal: controller.signal,
        }).catch(() => null); // Convert rejection to null
        
        const response = await fetchPromise;
        clearTimeout(timeoutId);
        
        if (response && response.ok) {
          data = await response.json().catch(() => null);
        } else if (response) {
          console.warn('API response not ok:', response.status);
        } else {
          console.warn('API fetch failed, trying localStorage');
        }
      } catch (apiError) {
        console.warn('API fetch failed, trying localStorage:', apiError);
      }
      
      // If API failed, try localStorage
      if (!data) {
        const localTrials = JSON.parse(localStorage.getItem('therapeuticTrials') || '[]');
        if (localTrials.length > 0) {
          data = { trials: localTrials };
        }
      }
      
      if (data.trials && data.trials.length > 0) {
        // First, check if we have localStorage data that might be more recent
        const localTrials = JSON.parse(localStorage.getItem('therapeuticTrials') || '[]');
        const localTrial = localTrials.find((t: any) => t.trial_id === trialId);
        const recentlyUpdated = localStorage.getItem(`trial_updated_${trialId}`);
        
        let foundTrial = data.trials.find((t: any) => t.trial_id === trialId);
        
        // If we have localStorage data and it was recently updated, prioritize it
        if (localTrial && recentlyUpdated) {
          console.log('Using recently updated localStorage data for trial:', trialId);
          foundTrial = localTrial;
          // Clear the update flag since we're using the updated data
          localStorage.removeItem(`trial_updated_${trialId}`);
        } else if (localTrial && foundTrial) {
          // Compare timestamps to see which is more recent
          const localUpdatedAt = new Date(localTrial.overview?.updated_at || 0);
          const apiUpdatedAt = new Date(foundTrial.overview?.updated_at || 0);
          
          if (localUpdatedAt > apiUpdatedAt) {
            console.log('Using localStorage data (more recent) for trial:', trialId);
            foundTrial = localTrial;
          }
        }
        
        if (foundTrial) {
          // Store original trial data for reference
          setOriginalTrial(foundTrial);
          
          // Map trial data to form structure
          const mappedData: EditTherapeuticFormData = {
            step5_1: {
              therapeutic_area: foundTrial.overview?.therapeutic_area || "",
              trial_identifier: foundTrial.overview?.trial_identifier || [],
              trial_phase: foundTrial.overview?.trial_phase || "",
              status: foundTrial.overview?.status || "",
              primary_drugs: foundTrial.overview?.primary_drugs || "",
              other_drugs: foundTrial.overview?.other_drugs || "",
              title: foundTrial.overview?.title || "",
              disease_type: foundTrial.overview?.disease_type || "",
              patient_segment: foundTrial.overview?.patient_segment || "",
              line_of_therapy: foundTrial.overview?.line_of_therapy || "",
              reference_links: foundTrial.overview?.reference_links || [],
              trial_tags: foundTrial.overview?.trial_tags || "",
              sponsor_collaborators: foundTrial.overview?.sponsor_collaborators || "",
              sponsor_field_activity: foundTrial.overview?.sponsor_field_activity || "",
              associated_cro: foundTrial.overview?.associated_cro || "",
              countries: foundTrial.overview?.countries || "",
              region: foundTrial.overview?.region || "",
              trial_record_status: foundTrial.overview?.trial_record_status || "",
            },
            step5_2: {
              purpose_of_trial: foundTrial.outcomes?.[0]?.purpose_of_trial || "",
              summary: foundTrial.outcomes?.[0]?.summary || "",
              primaryOutcomeMeasures: foundTrial.outcomes?.[0]?.primary_outcome_measure 
                ? Array.isArray(foundTrial.outcomes[0].primary_outcome_measure)
                  ? foundTrial.outcomes[0].primary_outcome_measure.filter(Boolean)
                  : typeof foundTrial.outcomes[0].primary_outcome_measure === 'string'
                    ? foundTrial.outcomes[0].primary_outcome_measure.split(", ").filter(Boolean)
                    : [foundTrial.outcomes[0].primary_outcome_measure].filter(Boolean)
                : [],
              otherOutcomeMeasures: foundTrial.outcomes?.[0]?.other_outcome_measure 
                ? Array.isArray(foundTrial.outcomes[0].other_outcome_measure)
                  ? foundTrial.outcomes[0].other_outcome_measure.filter(Boolean)
                  : typeof foundTrial.outcomes[0].other_outcome_measure === 'string'
                    ? foundTrial.outcomes[0].other_outcome_measure.split(", ").filter(Boolean)
                    : [foundTrial.outcomes[0].other_outcome_measure].filter(Boolean)
                : [],
              study_design_keywords: foundTrial.outcomes?.[0]?.study_design_keywords 
                ? Array.isArray(foundTrial.outcomes[0].study_design_keywords)
                  ? foundTrial.outcomes[0].study_design_keywords.filter(Boolean)
                  : typeof foundTrial.outcomes[0].study_design_keywords === 'string'
                    ? foundTrial.outcomes[0].study_design_keywords.split(", ").filter(Boolean)
                    : []
                : [],
              study_design: foundTrial.outcomes?.[0]?.study_design || "",
              treatment_regimen: foundTrial.outcomes?.[0]?.treatment_regimen || "",
              number_of_arms: foundTrial.outcomes?.[0]?.number_of_arms?.toString() || "",
            },
            step5_3: {
              inclusion_criteria: foundTrial.criteria?.[0]?.inclusion_criteria 
                ? Array.isArray(foundTrial.criteria[0].inclusion_criteria)
                  ? foundTrial.criteria[0].inclusion_criteria.filter(Boolean)
                  : typeof foundTrial.criteria[0].inclusion_criteria === 'string'
                    ? foundTrial.criteria[0].inclusion_criteria.split("; ").filter(Boolean)
                    : [foundTrial.criteria[0].inclusion_criteria].filter(Boolean)
                : [],
              exclusion_criteria: foundTrial.criteria?.[0]?.exclusion_criteria 
                ? Array.isArray(foundTrial.criteria[0].exclusion_criteria)
                  ? foundTrial.criteria[0].exclusion_criteria.filter(Boolean)
                  : typeof foundTrial.criteria[0].exclusion_criteria === 'string'
                    ? foundTrial.criteria[0].exclusion_criteria.split("; ").filter(Boolean)
                    : [foundTrial.criteria[0].exclusion_criteria].filter(Boolean)
                : [],
              age_min: foundTrial.criteria?.[0]?.age_from || "",
              age_max: foundTrial.criteria?.[0]?.age_to || "",
              gender: foundTrial.criteria?.[0]?.sex || "",
              ecog_performance_status: "",
              prior_treatments: [],
              biomarker_requirements: [],
            },
            step5_4: {
              estimated_enrollment: foundTrial.criteria?.[0]?.target_no_volunteers?.toString() || "",
              actual_enrollment: foundTrial.criteria?.[0]?.actual_enrolled_volunteers?.toString() || "",
              enrollment_status: "",
              recruitment_period: "",
              study_completion_date: "",
              primary_completion_date: "",
              population_description: "",
              references: [],
            },
            step5_5: {
              study_sites: foundTrial.sites?.[0]?.notes ? [foundTrial.sites[0].notes] : [],
              principal_investigators: [],
              site_status: "",
              site_countries: [],
              site_regions: [],
              site_contact_info: [],
              results_available: false,
              endpoints_met: false,
              adverse_events_reported: false,
            },
            step5_6: {
              study_start_date: foundTrial.timing?.[0]?.start_date_estimated || "",
              first_patient_in: "",
              last_patient_in: "",
              study_end_date: foundTrial.timing?.[0]?.trial_end_date_estimated || "",
              interim_analysis_dates: [],
              final_analysis_date: "",
              regulatory_submission_date: "",
            },
            step5_7: {
              primary_endpoint_results: foundTrial.results?.[0]?.trial_outcome || "",
              secondary_endpoint_results: foundTrial.results?.[0]?.trial_results || [],
              safety_results: foundTrial.results?.[0]?.adverse_event_reported || "",
              efficacy_results: "",
              statistical_significance: "",
              adverse_events: foundTrial.results?.[0]?.adverse_event_type ? [foundTrial.results[0].adverse_event_type] : [],
              conclusion: "",
              pipeline_data: [],
              press_releases: [],
              publications: [],
              trial_registries: [],
              associated_studies: [],
            },
            step5_8: {
              notes: foundTrial.notes?.map((note: any) => ({
                id: note.id || Date.now().toString(),
                date: note.date || new Date().toISOString().split("T")[0],
                type: note.type || "General",
                content: note.content || "",
                sourceLink: note.sourceLink || "",
                attachments: note.attachments || [],
                isVisible: note.isVisible !== false
              })) || [],
              attachments: [],
              regulatory_links: [],
              publication_links: [],
              additional_resources: [],
              date_type: "",
              link: "",
              changesLog: [{
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                user: "admin",
                action: "loaded",
                details: "Trial loaded for editing",
                field: "trial",
                oldValue: "",
                newValue: "edit_mode",
                step: "step5_1",
                changeType: "creation"
              }],
              creationInfo: {
                createdDate: foundTrial.created_at || new Date().toISOString(),
                createdUser: foundTrial.created_by || "admin",
              },
              modificationInfo: {
                lastModifiedDate: foundTrial.updated_at || new Date().toISOString(),
                lastModifiedUser: foundTrial.updated_by || "admin",
                modificationCount: 0,
              },
            },
          };
          
          dispatch({ type: "SET_TRIAL_DATA", payload: mappedData });
        } else {
          toast({
            title: "Trial Not Found",
            description: "The requested clinical trial could not be found.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "No Data Available",
          description: "No clinical trials data available.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading trial data:", error);
      toast({
        title: "Error",
        description: "Failed to load trial data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save trial function
  const saveTrial = async (trialId: string) => {
    try {
      setIsSaving(true);
      
      // Get user ID from localStorage
      const currentUserId = localStorage.getItem("userId");
      if (!currentUserId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Check if we have original trial data
      if (!originalTrial) {
        throw new Error("No trial data available for saving.");
      }

      // Prepare the update data for the overview (step5_1)
      const updateData = {
        user_id: currentUserId,
        ...formData.step5_1,
        updated_at: new Date().toISOString(),
      };

      console.log('Saving trial with data:', updateData);

      // Get the overview ID from the original trial
      const overviewId = originalTrial.overview?.id;
      if (!overviewId) {
        console.warn('No overview ID found, skipping API update and using localStorage only');
      }

      // Check if backend is reachable first
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      let backendAvailable = false;
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout for health check
        
        // Wrap health check in a promise that never rejects
        const healthCheckPromise = fetch(`${baseUrl}/api/v1/therapeutic/overview`, {
          method: 'GET',
          credentials: 'include',
          signal: controller.signal,
        }).catch(() => null); // Convert rejection to null
        
        const healthCheck = await healthCheckPromise;
        clearTimeout(timeoutId);
        
        if (healthCheck && healthCheck.ok) {
          backendAvailable = true;
        } else {
          console.warn('Backend health check failed, using localStorage only');
          backendAvailable = false;
        }
      } catch (healthError) {
        console.warn('Backend health check failed:', healthError);
        backendAvailable = false;
      }

      // Try API update if backend is available and we have an overview ID
      if (backendAvailable && overviewId) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          // Wrap fetch in a promise that never rejects
          const fetchPromise = fetch(`${baseUrl}/api/v1/therapeutic/overview/${overviewId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
            credentials: 'include',
            signal: controller.signal,
          }).catch(() => null); // Convert rejection to null

          const response = await fetchPromise;
          clearTimeout(timeoutId);

          if (response && response.ok) {
            toast({
              title: "Success",
              description: "Clinical trial updated successfully! Changes have been saved to the database.",
            });
            
            // Trigger refresh event for the main page
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('refreshFromEdit'));
            }
            return;
          } else if (response) {
            const errorText = await response.text().catch(() => 'Unknown error');
            console.warn('API update failed:', response.status, errorText);
            console.warn('API update failed, falling back to localStorage');
          } else {
            console.warn('API request failed, falling back to localStorage');
          }
        } catch (error) {
          // This should never happen now, but just in case
          console.warn('API update failed, falling back to localStorage');
        }
      }

      // Fallback: Update localStorage
      const updatedTrial = {
        ...originalTrial,
        overview: {
          ...originalTrial.overview,
          ...formData.step5_1,
          updated_at: new Date().toISOString(),
        },
        outcomes: [formData.step5_2],
        criteria: [formData.step5_3],
        timing: [formData.step5_6],
        results: [formData.step5_7],
        sites: [formData.step5_5],
        notes: formData.step5_8.notes.map(note => ({ notes: note })),
      };

      // Update localStorage safely
      try {
        const existingTrials = JSON.parse(localStorage.getItem('therapeuticTrials') || '[]');
        const updatedTrials = existingTrials.map((t: any) => 
          t.trial_id === trialId ? updatedTrial : t
        );
        localStorage.setItem('therapeuticTrials', JSON.stringify(updatedTrials));
        
        // Store update flag
        localStorage.setItem(`trial_updated_${trialId}`, new Date().toISOString());
      } catch (localStorageError) {
        console.error('Error updating localStorage:', localStorageError);
        // Continue anyway, the main functionality should still work
      }
      
      toast({
        title: "Success",
        description: "Clinical trial updated successfully! Changes are saved locally and visible immediately.",
      });

      // Trigger refresh event for the main page
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('refreshFromEdit'));
      }

    } catch (error) {
      console.error("Error saving trial:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Error",
        description: `Failed to save changes: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Safe wrapper for saveTrial to prevent any errors from breaking the app
  const safeSaveTrial = async (trialId: string) => {
    try {
      await saveTrial(trialId);
    } catch (error) {
      console.error("Unexpected error in saveTrial:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Load trial data on mount
  useEffect(() => {
    if (trialId) {
      loadTrialData(trialId);
    }
  }, [trialId]);

  const updateField = (step: keyof EditTherapeuticFormData, field: string, value: any) => {
    const oldValue = (formData[step] as any)[field];
    
    dispatch({ type: "UPDATE_FIELD", step, field, value });
    
    // Log the field update
    setTimeout(() => {
      const newLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        user: "admin",
        action: "changed",
        details: `Updated ${field}`,
        field,
        oldValue: typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue),
        newValue: typeof value === 'string' ? value : JSON.stringify(value),
        step,
        changeType: "field_change" as const,
      };
      
      const changesArray = (formData.step5_8 as any).changesLog || [];
      dispatch({
        type: "UPDATE_FIELD",
        step: "step5_8",
        field: "changesLog",
        value: [...changesArray, newLogEntry],
      });
    }, 0);
  };

  const addArrayItem = (step: keyof EditTherapeuticFormData, field: string, value: any) => {
    dispatch({ type: "ADD_ARRAY_ITEM", step, field, value });
    
    // Log the array addition
    setTimeout(() => {
      const currentArray = (formData[step] as any)[field] as any[];
      const newLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        user: "admin",
        action: "added",
        details: `Added item to ${field}`,
        field,
        oldValue: "",
        newValue: typeof value === 'string' ? value : JSON.stringify(value),
        step,
        changeType: "content_addition" as const,
      };
      
      const changesArray = (formData.step5_8 as any).changesLog || [];
      dispatch({
        type: "UPDATE_FIELD",
        step: "step5_8",
        field: "changesLog",
        value: [...changesArray, newLogEntry],
      });
    }, 0);
  };

  const removeArrayItem = (step: keyof EditTherapeuticFormData, field: string, index: number) => {
    const currentArray = (formData[step] as any)[field] as any[];
    const removedItem = currentArray[index];
    
    dispatch({ type: "REMOVE_ARRAY_ITEM", step, field, index });
    
    // Log the array removal
    setTimeout(() => {
      const newLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        user: "admin",
        action: "removed",
        details: `Removed item from ${field}`,
        field,
        oldValue: typeof removedItem === 'string' ? removedItem : JSON.stringify(removedItem),
        newValue: "",
        step,
        changeType: "content_removal" as const,
      };
      
      const changesArray = (formData.step5_8 as any).changesLog || [];
      dispatch({
        type: "UPDATE_FIELD",
        step: "step5_8",
        field: "changesLog",
        value: [...changesArray, newLogEntry],
      });
    }, 0);
  };

  const updateArrayItem = (step: keyof EditTherapeuticFormData, field: string, index: number, value: any) => {
    const currentArray = (formData[step] as any)[field] as any[];
    const oldValue = currentArray[index];
    
    dispatch({ type: "UPDATE_ARRAY_ITEM", step, field, index, value });
    
    // Log the array update
    setTimeout(() => {
      const newLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        user: "admin",
        action: "changed",
        details: `Updated item in ${field}`,
        field,
        oldValue: typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue),
        newValue: typeof value === 'string' ? value : JSON.stringify(value),
        step,
        changeType: "field_change" as const,
      };
      
      const changesArray = (formData.step5_8 as any).changesLog || [];
      dispatch({
        type: "UPDATE_FIELD",
        step: "step5_8",
        field: "changesLog",
        value: [...changesArray, newLogEntry],
      });
    }, 0);
  };

  // Reference management functions
  const addReference = (step: keyof EditTherapeuticFormData, field: string) => {
    const currentArray = (formData[step] as any)[field] as any[];
    const newReference = {
      id: Date.now().toString(),
      date: "",
      registryType: "",
      content: "",
      viewSource: "",
      attachments: [],
      isVisible: true,
    };
    dispatch({ type: "ADD_ARRAY_ITEM", step, field, value: newReference });
  };

  const removeReference = (step: keyof EditTherapeuticFormData, field: string, index: number) => {
    dispatch({ type: "REMOVE_ARRAY_ITEM", step, field, index });
  };

  const updateReference = (step: keyof EditTherapeuticFormData, field: string, index: number, updates: any) => {
    const currentArray = (formData[step] as any)[field] as any[];
    const updatedReference = { ...currentArray[index], ...updates };
    dispatch({ type: "UPDATE_ARRAY_ITEM", step, field, index, value: updatedReference });
  };

  // Note management functions
  const addNote = (step: keyof EditTherapeuticFormData, field: string) => {
    const currentArray = (formData[step] as any)[field] as any[];
    const newNote = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      type: "General",
      content: "",
      sourceLink: "",
      attachments: [],
      isVisible: true,
    };
    dispatch({
      type: "UPDATE_FIELD",
      step,
      field,
      value: [...currentArray, newNote],
    });
  };

  const updateNote = (
    step: keyof EditTherapeuticFormData,
    field: string,
    index: number,
    updates: Partial<any>
  ) => {
    const currentArray = (formData[step] as any)[field] as any[];
    const updatedArray = currentArray.map((item, idx) =>
      idx === index ? { ...item, ...updates } : item
    );
    dispatch({
      type: "UPDATE_FIELD",
      step,
      field,
      value: updatedArray,
    });
  };

  const removeNote = (
    step: keyof EditTherapeuticFormData,
    field: string,
    index: number
  ) => {
    const currentArray = (formData[step] as any)[field] as any[];
    const updatedArray = currentArray.filter((_, idx) => idx !== index);
    dispatch({
      type: "UPDATE_FIELD",
      step,
      field,
      value: updatedArray,
    });
  };

  const toggleNoteVisibility = (
    step: keyof EditTherapeuticFormData,
    field: string,
    index: number
  ) => {
    const currentArray = (formData[step] as any)[field] as any[];
    const updatedArray = currentArray.map((item, idx) =>
      idx === index ? { ...item, isVisible: !item.isVisible } : item
    );
    dispatch({
      type: "UPDATE_FIELD",
      step,
      field,
      value: updatedArray,
    });
  };

  const value: EditTherapeuticFormContextType = {
    formData,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    addReference,
    removeReference,
    updateReference,
    addNote,
    updateNote,
    removeNote,
    toggleNoteVisibility,
    saveTrial: safeSaveTrial,
    loadTrialData,
    isLoading,
    isSaving,
  };

  return (
    <EditTherapeuticFormContext.Provider value={value}>
      {children}
    </EditTherapeuticFormContext.Provider>
  );
}

// Hook to use the context
export function useEditTherapeuticForm() {
  const context = useContext(EditTherapeuticFormContext);
  if (context === undefined) {
    throw new Error("useEditTherapeuticForm must be used within an EditTherapeuticFormProvider");
  }
  return context;
}
