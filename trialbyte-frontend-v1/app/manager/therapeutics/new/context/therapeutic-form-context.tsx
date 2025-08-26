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
  };

  // Step 5-5: Study Sites
  step5_5: {
    study_sites: string[];
    principal_investigators: string[];
    site_status: string;
    site_countries: string[];
    site_regions: string[];
    site_contact_info: string[];
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
  };

  // Step 5-8: Notes & Documentation
  step5_8: {
    date_type: string;
    notes: string;
    link: string;
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
  },
  step5_5: {
    study_sites: [""],
    principal_investigators: [""],
    site_status: "",
    site_countries: [""],
    site_regions: [""],
    site_contact_info: [""],
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
  },
  step5_8: {
    date_type: "",
    notes: "",
    link: "",
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
  resetForm: () => void;
  loadForm: (data: TherapeuticFormData) => void;
  getFormData: () => TherapeuticFormData;
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
    dispatch({ type: "UPDATE_FIELD", step, field, value });
  };

  const addArrayItem = (step: keyof TherapeuticFormData, field: string) => {
    dispatch({ type: "ADD_ARRAY_ITEM", step, field });
  };

  const removeArrayItem = (
    step: keyof TherapeuticFormData,
    field: string,
    index: number
  ) => {
    dispatch({ type: "REMOVE_ARRAY_ITEM", step, field, index });
  };

  const updateArrayItem = (
    step: keyof TherapeuticFormData,
    field: string,
    index: number,
    value: string
  ) => {
    dispatch({ type: "UPDATE_ARRAY_ITEM", step, field, index, value });
  };

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  const loadForm = (data: TherapeuticFormData) => {
    dispatch({ type: "LOAD_FORM", data });
  };

  const getFormData = () => formData;

  const value: TherapeuticFormContextType = {
    formData,
    updateStep,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    resetForm,
    loadForm,
    getFormData,
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
