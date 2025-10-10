"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define the complete form structure
export interface TherapeuticFormData {
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
    study_design_keywords: string;
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
    // Trial Duration Calculator fields
    trialDuration: {
      startDate: string;
      enrollmentCloseDate: string;
      resultPublishDate: string;
      trialEndDate: string;
      inclusionPeriod: number;
      resultDuration: number;
      overallDurationToComplete: number;
      confidenceTypes: {
        startDate: "Estimated" | "Benchmark" | "Actual";
        enrollmentCloseDate: "Estimated" | "Benchmark" | "Actual";
        resultPublishDate: "Estimated" | "Benchmark" | "Actual";
        trialEndDate: "Estimated" | "Benchmark" | "Actual";
      };
    };
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
    trial_results: string[];
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

  // Step 5-8: Notes & Documentation
  step5_8: {
    date_type: string;
    notes: Array<{
      id: string;
      date: string;
      type: string;
      content: string;
      sourceLink?: string;
      attachments?: string[];
      isVisible: boolean;
    }>;
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
      changeType?: 'field_change' | 'content_addition' | 'content_removal' | 'visibility_change' | 'creation';
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

// Initial form state
const initialFormState: TherapeuticFormData = {
  step5_1: {
    therapeutic_area: "",
    trial_identifier: [""],
    trial_phase: "",
    status: "",
    primary_drugs: "",
    other_drugs: "",
    title: "",
    disease_type: "",
    patient_segment: "",
    line_of_therapy: "",
    reference_links: [""],
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
    primaryOutcomeMeasures: [""],
    otherOutcomeMeasures: [""],
    study_design_keywords: "",
    study_design: "",
    treatment_regimen: "",
    number_of_arms: "",
  },
  step5_3: {
    inclusion_criteria: [""],
    exclusion_criteria: [""],
    age_min: "",
    age_max: "",
    gender: "",
    ecog_performance_status: "",
    prior_treatments: [""],
    biomarker_requirements: [""],
  },
  step5_4: {
    estimated_enrollment: "",
    actual_enrollment: "",
    enrollment_status: "",
    recruitment_period: "",
    study_completion_date: "",
    primary_completion_date: "",
    population_description: "",
    trialDuration: {
      startDate: "",
      enrollmentCloseDate: "",
      resultPublishDate: "",
      trialEndDate: "",
      inclusionPeriod: 0,
      resultDuration: 0,
      overallDurationToComplete: 0,
      confidenceTypes: {
        startDate: "Estimated",
        enrollmentCloseDate: "Estimated",
        resultPublishDate: "Estimated",
        trialEndDate: "Estimated",
      },
    },
    references: [{
      id: "1",
      date: "",
      registryType: "",
      content: "",
      viewSource: "",
      attachments: [],
      isVisible: true,
    }],
  },
  step5_5: {
    study_sites: [""],
    principal_investigators: [""],
    site_status: "",
    site_countries: [""],
    site_regions: [""],
    site_contact_info: [""],
    trial_results: [""],
    results_available: false,
    endpoints_met: false,
    adverse_events_reported: false,
  },
  step5_6: {
    study_start_date: "",
    first_patient_in: "",
    last_patient_in: "",
    study_end_date: "",
    interim_analysis_dates: [""],
    final_analysis_date: "",
    regulatory_submission_date: "",
  },
  step5_7: {
    primary_endpoint_results: "",
    secondary_endpoint_results: [""],
    safety_results: "",
    efficacy_results: "",
    statistical_significance: "",
    adverse_events: [""],
    conclusion: "",
    pipeline_data: [{
      id: "1",
      date: "",
      information: "",
      url: "",
      file: "",
      isVisible: true,
    }],
    press_releases: [{
      id: "1",
      date: "",
      title: "",
      url: "",
      file: "",
      isVisible: true,
    }],
    publications: [{
      id: "1",
      type: "",
      title: "",
      url: "",
      file: "",
      isVisible: true,
    }],
    trial_registries: [{
      id: "1",
      registry: "",
      identifier: "",
      url: "",
      file: "",
      isVisible: true,
    }],
    associated_studies: [{
      id: "1",
      type: "",
      title: "",
      url: "",
      file: "",
      isVisible: true,
    }],
  },
  step5_8: {
    date_type: "",
    notes: [],
    link: "",
    changesLog: [{
      id: "1",
      timestamp: new Date().toISOString(),
      user: "admin",
      action: "created",
      details: "Created trial",
      field: "trial",
      oldValue: "",
      newValue: "new",
      step: "step5_1",
      changeType: "creation"
    }],
    creationInfo: {
      createdDate: new Date().toISOString(),
      createdUser: "admin",
    },
    modificationInfo: {
      lastModifiedDate: new Date().toISOString(),
      lastModifiedUser: "admin",
      modificationCount: 0,
    },
  },
};

// Action types for the reducer
type FormAction =
  | {
      type: "UPDATE_STEP";
      step: keyof TherapeuticFormData;
      data: Partial<TherapeuticFormData[keyof TherapeuticFormData]>;
    }
  | {
      type: "UPDATE_FIELD";
      step: keyof TherapeuticFormData;
      field: string;
      value: any;
    }
  | { type: "ADD_ARRAY_ITEM"; step: keyof TherapeuticFormData; field: string }
  | {
      type: "REMOVE_ARRAY_ITEM";
      step: keyof TherapeuticFormData;
      field: string;
      index: number;
    }
  | {
      type: "UPDATE_ARRAY_ITEM";
      step: keyof TherapeuticFormData;
      field: string;
      index: number;
      value: string;
    }
  | { type: "RESET_FORM" }
  | { type: "LOAD_FORM"; data: TherapeuticFormData };

// Reducer function
function formReducer(
  state: TherapeuticFormData,
  action: FormAction
): TherapeuticFormData {
  switch (action.type) {
    case "UPDATE_STEP":
      return {
        ...state,
        [action.step]: {
          ...state[action.step],
          ...action.data,
        },
      };

    case "UPDATE_FIELD":
      return {
        ...state,
        [action.step]: {
          ...state[action.step],
          [action.field]: action.value,
        },
      };

    case "ADD_ARRAY_ITEM":
      const currentArray = state[action.step][
        action.field as keyof (typeof state)[typeof action.step]
      ] as string[];
      return {
        ...state,
        [action.step]: {
          ...state[action.step],
          [action.field]: [...currentArray, ""],
        },
      };

    case "REMOVE_ARRAY_ITEM":
      const arrayToRemove = state[action.step][
        action.field as keyof (typeof state)[typeof action.step]
      ] as string[];
      return {
        ...state,
        [action.step]: {
          ...state[action.step],
          [action.field]: arrayToRemove.filter(
            (_, index) => index !== action.index
          ),
        },
      };

    case "UPDATE_ARRAY_ITEM":
      const arrayToUpdate = state[action.step][
        action.field as keyof (typeof state)[typeof action.step]
      ] as string[];
      return {
        ...state,
        [action.step]: {
          ...state[action.step],
          [action.field]: arrayToUpdate.map((item, index) =>
            index === action.index ? action.value : item
          ),
        },
      };

    case "RESET_FORM":
      return initialFormState;

    case "LOAD_FORM":
      return action.data;

    default:
      return state;
  }
}

// Context interface
interface TherapeuticFormContextType {
  formData: TherapeuticFormData;
  updateStep: (
    step: keyof TherapeuticFormData,
    data: Partial<TherapeuticFormData[keyof TherapeuticFormData]>
  ) => void;
  updateField: (
    step: keyof TherapeuticFormData,
    field: string,
    value: any
  ) => void;
  addArrayItem: (step: keyof TherapeuticFormData, field: string) => void;
  removeArrayItem: (
    step: keyof TherapeuticFormData,
    field: string,
    index: number
  ) => void;
  updateArrayItem: (
    step: keyof TherapeuticFormData,
    field: string,
    index: number,
    value: string
  ) => void;
  addComplexArrayItem: (step: keyof TherapeuticFormData, field: string, template: any) => void;
  updateComplexArrayItem: (
    step: keyof TherapeuticFormData,
    field: string,
    index: number,
    updates: any
  ) => void;
  toggleArrayItemVisibility: (
    step: keyof TherapeuticFormData,
    field: string,
    index: number
  ) => void;
  addNote: (step: keyof TherapeuticFormData, field: string) => void;
  updateNote: (
    step: keyof TherapeuticFormData,
    field: string,
    index: number,
    updates: Partial<any>
  ) => void;
  removeNote: (step: keyof TherapeuticFormData, field: string, index: number) => void;
  toggleNoteVisibility: (
    step: keyof TherapeuticFormData,
    field: string,
    index: number
  ) => void;
  addReference: (step: keyof TherapeuticFormData, field: string) => void;
  updateReference: (
    step: keyof TherapeuticFormData,
    field: string,
    index: number,
    updates: Partial<any>
  ) => void;
  removeReference: (step: keyof TherapeuticFormData, field: string, index: number) => void;
  toggleReferenceVisibility: (
    step: keyof TherapeuticFormData,
    field: string,
    index: number
  ) => void;
  addChangeLog: (
    step: keyof TherapeuticFormData,
    field: string,
    action: string,
    details: string,
    fieldName?: string,
    oldValue?: string,
    newValue?: string
  ) => void;
  resetForm: () => void;
  loadForm: (data: TherapeuticFormData) => void;
  getFormData: () => TherapeuticFormData;
  saveTrial: () => Promise<{ success: boolean; message: string; trialId?: string }>;
}

// Create the context
const TherapeuticFormContext = createContext<
  TherapeuticFormContextType | undefined
>(undefined);

// Provider component
export function TherapeuticFormProvider({ children }: { children: ReactNode }) {
  const [formData, dispatch] = useReducer(formReducer, initialFormState);

  const updateStep = (
    step: keyof TherapeuticFormData,
    data: Partial<TherapeuticFormData[keyof TherapeuticFormData]>
  ) => {
    dispatch({ type: "UPDATE_STEP", step, data });
  };

  const updateField = (
    step: keyof TherapeuticFormData,
    field: string,
    value: any
  ) => {
    // Get the current value for change tracking
    const currentValue = (formData[step] as any)[field];
    
    // Dispatch the update
    dispatch({ type: "UPDATE_FIELD", step, field, value });
    
    // Enhanced audit logging
    if (field !== "changesLog" && field !== "creationInfo" && field !== "modificationInfo" && currentValue !== value) {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Determine change type and action
      let changeType: 'field_change' | 'content_addition' | 'content_removal' | 'visibility_change' | 'creation' = 'field_change';
      let action = "changed";
      let details = "";
      
      if (currentValue === "" || currentValue === undefined || currentValue === null) {
        changeType = 'content_addition';
        action = "added";
        details = `Added "${value}" to ${field}`;
      } else if (value === "" || value === undefined || value === null) {
        changeType = 'content_removal';
        action = "removed";
        details = `Removed "${currentValue}" from ${field}`;
      } else {
        changeType = 'field_change';
        action = "changed";
        details = `"${field}" was changed from "${currentValue}" to "${value}"`;
      }
      
      // Check if we should consolidate with existing changes from today
      const existingChanges = (formData.step5_8 as any).changesLog || [];
      const todayChanges = existingChanges.filter((change: any) => 
        change.timestamp.startsWith(today) && change.user === "admin"
      );
      
      let shouldConsolidate = todayChanges.length > 0 && todayChanges.some((change: any) => 
        change.step === step && change.changeType === changeType
      );
      
      // Add to changes log
      setTimeout(() => {
        const currentArray = (formData.step5_8 as any).changesLog || [];
        
        if (shouldConsolidate) {
          // Find the existing entry to consolidate with
          const existingEntryIndex = currentArray.findIndex((change: any) => 
            change.timestamp.startsWith(today) && 
            change.user === "admin" && 
            change.step === step &&
            change.changeType === changeType
          );
          
          if (existingEntryIndex !== -1) {
            // Update existing entry with additional details
            const updatedArray = [...currentArray];
            updatedArray[existingEntryIndex] = {
              ...updatedArray[existingEntryIndex],
              details: `${updatedArray[existingEntryIndex].details}; ${details}`,
              timestamp: now.toISOString(), // Update to latest time
            };
            
            dispatch({
              type: "UPDATE_FIELD",
              step: "step5_8",
              field: "changesLog",
              value: updatedArray,
            });
          }
        } else {
          // Create new entry
          const newLogEntry = {
            id: Date.now().toString(),
            timestamp: now.toISOString(),
            user: "admin",
            action,
            details,
            field,
            oldValue: currentValue,
            newValue: value,
            step,
            changeType,
          };
          
          dispatch({
            type: "UPDATE_FIELD",
            step: "step5_8",
            field: "changesLog",
            value: [...currentArray, newLogEntry],
          });
        }
        
        // Update modification info
        dispatch({
          type: "UPDATE_FIELD",
          step: "step5_8",
          field: "modificationInfo",
          value: {
            lastModifiedDate: now.toISOString(),
            lastModifiedUser: "admin",
            modificationCount: (formData.step5_8 as any).modificationInfo.modificationCount + 1,
          },
        });
      }, 0);
    }
  };

  const addArrayItem = (step: keyof TherapeuticFormData, field: string) => {
    dispatch({ type: "ADD_ARRAY_ITEM", step, field });
    
    // Log the array addition
    setTimeout(() => {
      const currentArray = (formData[step] as any)[field] as any[];
      const newLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        user: "admin",
        action: "added",
        details: `Added new item to ${field}`,
        field,
        oldValue: "",
        newValue: "new item",
      };
      dispatch({
        type: "UPDATE_FIELD",
        step,
        field: "changesLog",
        value: [...currentArray, newLogEntry],
      });
    }, 0);
  };

  const removeArrayItem = (
    step: keyof TherapeuticFormData,
    field: string,
    index: number
  ) => {
    const currentArray = (formData[step] as any)[field] as any[];
    const removedItem = currentArray[index];
    
    dispatch({ type: "REMOVE_ARRAY_ITEM", step, field, index });
    
    // Log the array removal
    setTimeout(() => {
      const changesArray = (formData[step] as any).changesLog || [];
      const newLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        user: "admin",
        action: "removed",
        details: `Removed item from ${field}`,
        field,
        oldValue: removedItem || "item",
        newValue: "",
      };
      dispatch({
        type: "UPDATE_FIELD",
        step,
        field: "changesLog",
        value: [...changesArray, newLogEntry],
      });
    }, 0);
  };

  const updateArrayItem = (
    step: keyof TherapeuticFormData,
    field: string,
    index: number,
    value: string
  ) => {
    const currentArray = (formData[step] as any)[field] as any[];
    const oldValue = currentArray[index];
    
    dispatch({ type: "UPDATE_ARRAY_ITEM", step, field, index, value });
    
    // Log the array item update
    setTimeout(() => {
      const changesArray = (formData[step] as any).changesLog || [];
      const newLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        user: "admin",
        action: "updated",
        details: `Updated item in ${field}`,
        field,
        oldValue: oldValue || "",
        newValue: value,
      };
      dispatch({
        type: "UPDATE_FIELD",
        step,
        field: "changesLog",
        value: [...changesArray, newLogEntry],
      });
    }, 0);
  };

  const addComplexArrayItem = (
    step: keyof TherapeuticFormData,
    field: string,
    template: any
  ) => {
    const currentArray = (formData[step] as any)[field] as any[];
    const newItem = {
      ...template,
      id: Date.now().toString(),
    };
    dispatch({
      type: "UPDATE_FIELD",
      step,
      field,
      value: [...currentArray, newItem],
    });
  };

  const updateComplexArrayItem = (
    step: keyof TherapeuticFormData,
    field: string,
    index: number,
    updates: any
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

  const toggleArrayItemVisibility = (
    step: keyof TherapeuticFormData,
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

  // Note management functions
  const addNote = (step: keyof TherapeuticFormData, field: string) => {
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
    step: keyof TherapeuticFormData,
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
    step: keyof TherapeuticFormData,
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
    step: keyof TherapeuticFormData,
    field: string,
    index: number
  ) => {
    const currentArray = (formData[step] as any)[field] as any[];
    const item = currentArray[index];
    const updatedArray = currentArray.map((item, idx) =>
      idx === index ? { ...item, isVisible: !item.isVisible } : item
    );
    dispatch({
      type: "UPDATE_FIELD",
      step,
      field,
      value: updatedArray,
    });
    
    // Log the visibility change with enhanced details
    const action = item.isVisible ? "hidden" : "shown";
    const noteContent = item.content ? item.content.substring(0, 50) + "..." : "Note";
    const noteDate = item.date || "Unknown date";
    const details = `Date note dated ${noteDate} from ${item.type || "General"} was changed from ${item.isVisible ? "show" : "hide"} to ${item.isVisible ? "hide" : "show"}`;
    
    setTimeout(() => {
      const currentLogArray = (formData.step5_8 as any).changesLog || [];
      const newLogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        user: "admin",
        action,
        details,
        field: `${field}[${index}]`,
        oldValue: item.isVisible ? "show" : "hide",
        newValue: item.isVisible ? "hide" : "show",
        step,
        changeType: "visibility_change" as const,
      };
      dispatch({
        type: "UPDATE_FIELD",
        step: "step5_8",
        field: "changesLog",
        value: [...currentLogArray, newLogEntry],
      });
      
      // Update modification info
      dispatch({
        type: "UPDATE_FIELD",
        step: "step5_8",
        field: "modificationInfo",
        value: {
          lastModifiedDate: new Date().toISOString(),
          lastModifiedUser: "admin",
          modificationCount: (formData.step5_8 as any).modificationInfo.modificationCount + 1,
        },
      });
    }, 0);
  };

  // Reference management functions
  const addReference = (step: keyof TherapeuticFormData, field: string) => {
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
    dispatch({
      type: "UPDATE_FIELD",
      step,
      field,
      value: [...currentArray, newReference],
    });
  };

  const updateReference = (
    step: keyof TherapeuticFormData,
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

  const removeReference = (
    step: keyof TherapeuticFormData,
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

  const toggleReferenceVisibility = (
    step: keyof TherapeuticFormData,
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

  // Change log management function
  const addChangeLog = (
    step: keyof TherapeuticFormData,
    field: string,
    action: string,
    details: string,
    fieldName?: string,
    oldValue?: string,
    newValue?: string
  ) => {
    const currentArray = (formData[step] as any)[field] as any[];
    const newLogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      user: "admin", // This could be dynamic based on current user
      action,
      details,
      field: fieldName,
      oldValue,
      newValue,
    };
    dispatch({
      type: "UPDATE_FIELD",
      step,
      field,
      value: [...currentArray, newLogEntry],
    });
  };

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  const loadForm = (data: TherapeuticFormData) => {
    dispatch({ type: "LOAD_FORM", data });
  };

  const getFormData = () => formData;

  // Helper functions for data transformation
  const ensureString = (value: any): string => {
    if (value === null || value === undefined || value === "") {
      return "";
    }
    const stringValue = String(value).trim();
    return stringValue === "" ? "" : stringValue;
  };

  const ensureNumber = (value: any, defaultValue: number = 0): number => {
    if (value === null || value === undefined || value === "") {
      return defaultValue;
    }
    const num = parseInt(String(value));
    return isNaN(num) ? defaultValue : num;
  };

  const saveTrial = async (): Promise<{ success: boolean; message: string; trialId?: string }> => {
    try {
      const allFormData = getFormData();
      
      // Check if API base URL is configured
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiBaseUrl) {
        throw new Error("API base URL is not configured. Please check your environment variables.");
      }
      
      console.log("API Base URL:", apiBaseUrl);
      
      // Transform the form data to match the API structure
      const therapeuticPayload = {
        user_id: "admin", // Admin user ID
        overview: {
          therapeutic_area: ensureString(allFormData.step5_1.therapeutic_area),
          trial_identifier: allFormData.step5_1.trial_identifier.filter(Boolean).length > 0 ? allFormData.step5_1.trial_identifier.filter(Boolean) : [],
          trial_phase: ensureString(allFormData.step5_1.trial_phase),
          status: ensureString(allFormData.step5_1.status),
          primary_drugs: ensureString(allFormData.step5_1.primary_drugs),
          other_drugs: ensureString(allFormData.step5_1.other_drugs),
          title: ensureString(allFormData.step5_1.title),
          disease_type: ensureString(allFormData.step5_1.disease_type),
          patient_segment: ensureString(allFormData.step5_1.patient_segment),
          line_of_therapy: ensureString(allFormData.step5_1.line_of_therapy),
          reference_links: allFormData.step5_1.reference_links.filter(Boolean).length > 0 ? allFormData.step5_1.reference_links.filter(Boolean) : [],
          trial_tags: ensureString(allFormData.step5_1.trial_tags),
          sponsor_collaborators: ensureString(allFormData.step5_1.sponsor_collaborators),
          sponsor_field_activity: ensureString(allFormData.step5_1.sponsor_field_activity),
          associated_cro: ensureString(allFormData.step5_1.associated_cro),
          countries: ensureString(allFormData.step5_1.countries),
          region: ensureString(allFormData.step5_1.region),
          trial_record_status: ensureString(allFormData.step5_1.trial_record_status),
        },
        outcome: {
          purpose_of_trial: ensureString(allFormData.step5_2.purpose_of_trial),
          summary: ensureString(allFormData.step5_2.summary),
          primary_outcome_measure: allFormData.step5_2.primaryOutcomeMeasures.filter(Boolean).join(", ") || "",
          other_outcome_measure: allFormData.step5_2.otherOutcomeMeasures.filter(Boolean).join(", ") || "",
          study_design_keywords: ensureString(allFormData.step5_2.study_design_keywords),
          study_design: ensureString(allFormData.step5_2.study_design),
          treatment_regimen: ensureString(allFormData.step5_2.treatment_regimen),
          number_of_arms: ensureNumber(allFormData.step5_2.number_of_arms, 1),
        },
        criteria: {
          inclusion_criteria: allFormData.step5_3.inclusion_criteria.filter(Boolean).join("; ") || "",
          exclusion_criteria: allFormData.step5_3.exclusion_criteria.filter(Boolean).join("; ") || "",
          age_from: ensureString(allFormData.step5_3.age_min),
          age_to: ensureString(allFormData.step5_3.age_max),
          sex: ensureString(allFormData.step5_3.gender),
          healthy_volunteers: allFormData.step5_3.biomarker_requirements[0] || "",
          subject_type: allFormData.step5_3.prior_treatments[0] || "",
          target_no_volunteers: ensureNumber(allFormData.step5_4.estimated_enrollment, 0),
          actual_enrolled_volunteers: ensureNumber(allFormData.step5_4.actual_enrollment, 0),
        },
        timing: {
          start_date_estimated: ensureString(allFormData.step5_6.study_start_date),
          trial_end_date_estimated: ensureString(allFormData.step5_6.study_end_date),
        },
        results: {
          trial_outcome: ensureString(allFormData.step5_7.primary_endpoint_results),
          reference: ensureString(allFormData.step5_7.conclusion),
          trial_results: allFormData.step5_7.secondary_endpoint_results.filter(Boolean).length > 0 
            ? allFormData.step5_7.secondary_endpoint_results.filter(Boolean) 
            : [],
          adverse_event_reported: allFormData.step5_7.adverse_events.length > 0 ? "Yes" : "No",
          adverse_event_type: allFormData.step5_7.adverse_events.filter(Boolean).join(", ") || "",
          treatment_for_adverse_events: ensureString(allFormData.step5_7.safety_results),
        },
        sites: {
          total: allFormData.step5_5.study_sites.filter(Boolean).length || 0,
          notes: allFormData.step5_5.study_sites.filter(Boolean).join(", ") || "",
        },
        other_sources: {
          pipeline_data: allFormData.step5_7.pipeline_data.filter(item => item.isVisible && (item.date || item.information || item.url || item.file)),
          press_releases: allFormData.step5_7.press_releases.filter(item => item.isVisible && (item.date || item.title || item.url || item.file)),
          publications: allFormData.step5_7.publications.filter(item => item.isVisible && (item.type || item.title || item.url || item.file)),
          trial_registries: allFormData.step5_7.trial_registries.filter(item => item.isVisible && (item.registry || item.identifier || item.url || item.file)),
          associated_studies: allFormData.step5_7.associated_studies.filter(item => item.isVisible && (item.type || item.title || item.url || item.file)),
        },
        logs: {
          trial_changes_log: allFormData.step5_8.changesLog.length > 0 
            ? allFormData.step5_8.changesLog.map(change => 
                `${change.timestamp}: ${change.user} ${change.action} - ${change.details}`
              ).join("; ") 
            : "Trial created",
          trial_added_date: new Date().toISOString(),
          last_modified_date: new Date().toISOString(),
          last_modified_user: "admin",
          full_review_user: "admin",
          next_review_date: null,
        },
        notes: {
          date_type: ensureString(allFormData.step5_8.date_type),
          notes: allFormData.step5_8.notes.filter(note => note.isVisible && note.content).length > 0 
            ? allFormData.step5_8.notes.filter(note => note.isVisible && note.content).map(note => 
                `${note.date} (${note.type}): ${note.content}${note.sourceLink ? ` - Source: ${note.sourceLink}` : ""}`
              ).join("; ") 
            : "No notes available",
          link: ensureString(allFormData.step5_8.link),
          attachments: allFormData.step5_8.notes.filter(note => note.isVisible && note.attachments && note.attachments.length > 0)
            .flatMap(note => note.attachments) || [],
        },
      };

      const fullUrl = `${apiBaseUrl}/api/v1/therapeutic/create-therapeutic`;
      console.log("Making request to:", fullUrl);
      console.log("Payload:", therapeuticPayload);
      console.log("Payload size:", JSON.stringify(therapeuticPayload).length, "characters");
      
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(therapeuticPayload),
        credentials: 'include',
      });

      if (!response.ok) {
        let errorMessage = "Failed to create therapeutic trial";
        try {
          const errorData = await response.json();
          console.error("API Error Response:", errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
          if (errorData.details) {
            errorMessage += ` - Details: ${errorData.details}`;
          }
        } catch (jsonError) {
          // If response is not JSON (e.g., HTML error page), get text
          const errorText = await response.text();
          console.error("Non-JSON error response:", errorText);
          errorMessage = `Server error (${response.status}): ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        throw new Error("Invalid response format from server");
      }

      return {
        success: true,
        message: "Therapeutic trial created successfully!",
        trialId: result.trial_id,
      };
    } catch (error) {
      console.error("Error creating trial:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create therapeutic trial",
      };
    }
  };

  const value: TherapeuticFormContextType = {
    formData,
    updateStep,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    addComplexArrayItem,
    updateComplexArrayItem,
    toggleArrayItemVisibility,
    addNote,
    updateNote,
    removeNote,
    toggleNoteVisibility,
    addReference,
    updateReference,
    removeReference,
    toggleReferenceVisibility,
    addChangeLog,
    resetForm,
    loadForm,
    getFormData,
    saveTrial,
  };

  return (
    <TherapeuticFormContext.Provider value={value}>
      {children}
    </TherapeuticFormContext.Provider>
  );
}

// Custom hook to use the context
export function useTherapeuticForm() {
  const context = useContext(TherapeuticFormContext);
  if (context === undefined) {
    throw new Error(
      "useTherapeuticForm must be used within a TherapeuticFormProvider"
    );
  }
  return context;
}
