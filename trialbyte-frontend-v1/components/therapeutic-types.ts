export interface SearchableSelectOption {
    value: string
    label: string
}

export interface TherapeuticFilterState {
    // Basic Info Section
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
    otherDrugs: string[]
    regions: string[]
    trialRecordStatus: string[]
    // Eligibility Section
    inclusionCriteria: string[]
    exclusionCriteria: string[]
    ageFrom: string[]
    ageTo: string[]
    subjectType: string[]
    sex: string[]
    healthyVolunteers: string[]
    targetNoVolunteers: string[]
    actualEnrolledVolunteers: string[]
    // Study Design Section
    purposeOfTrial: string[]
    summary: string[]
    primaryOutcomeMeasures: string[]
    otherOutcomeMeasures: string[]
    studyDesignKeywords: string[]
    studyDesign: string[]
    treatmentRegimen: string[]
    numberOfArms: string[]
    // Timing Section
    startDateEstimated: string[]
    trialEndDateEstimated: string[]
    // Results Section
    resultsAvailable: string[]
    endpointsMet: string[]
    adverseEventsReported: string[]
    trialOutcome: string[]
    trialOutcomeContent: string[]
    adverseEventReported: string[]
    adverseEventType: string[]
    treatmentForAdverseEvents: string[]
    // Sites Section
    totalSites: string[]
    siteNotes: string[]
}

// Default empty filter state
export const DEFAULT_THERAPEUTIC_FILTERS: TherapeuticFilterState = {
    // Basic Info Section
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
    otherDrugs: [],
    regions: [],
    trialRecordStatus: [],
    // Eligibility Section
    inclusionCriteria: [],
    exclusionCriteria: [],
    ageFrom: [],
    ageTo: [],
    subjectType: [],
    sex: [],
    healthyVolunteers: [],
    targetNoVolunteers: [],
    actualEnrolledVolunteers: [],
    // Study Design Section
    purposeOfTrial: [],
    summary: [],
    primaryOutcomeMeasures: [],
    otherOutcomeMeasures: [],
    studyDesignKeywords: [],
    studyDesign: [],
    treatmentRegimen: [],
    numberOfArms: [],
    // Timing Section
    startDateEstimated: [],
    trialEndDateEstimated: [],
    // Results Section
    resultsAvailable: [],
    endpointsMet: [],
    adverseEventsReported: [],
    trialOutcome: [],
    trialOutcomeContent: [],
    adverseEventReported: [],
    adverseEventType: [],
    treatmentForAdverseEvents: [],
    // Sites Section
    totalSites: [],
    siteNotes: [],
}

export interface TherapeuticSearchCriteria {
    id: string
    field: string
    operator: string
    value: string | string[] // Support both single string and array of strings
    logic: "AND" | "OR"
}
