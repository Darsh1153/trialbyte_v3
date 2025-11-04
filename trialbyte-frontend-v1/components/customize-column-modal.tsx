"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { X, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface ColumnSettings {
  // Core fields
  therapeuticArea: boolean;
  diseaseType: boolean;
  primaryDrug: boolean;
  trialPhase: boolean;
  patientSegment: boolean;
  lineOfTherapy: boolean;
  countries: boolean;
  sponsorsCollaborators: boolean;
  sponsor: boolean;
  fieldOfActivity: boolean;
  associatedCro: boolean;
  trialTags: boolean;
  sex: boolean;
  healthyVolunteers: boolean;
  trialRecordStatus: boolean;
  otherDrugs: boolean;
  regions: boolean;
  ageMin: boolean;
  ageMax: boolean;
  subjectType: boolean;
  ecogPerformanceStatus: boolean;
  priorTreatments: boolean;
  biomarkerRequirements: boolean;
  estimatedEnrollment: boolean;
  actualEnrollment: boolean;
  enrollmentStatus: boolean;
  recruitmentPeriod: boolean;
  studyCompletionDate: boolean;
  primaryCompletionDate: boolean;
  populationDescription: boolean;
  studySites: boolean;
  principalInvestigators: boolean;
  siteStatus: boolean;
  siteCountries: boolean;
  siteRegions: boolean;
  siteContactInfo: boolean;
  trialResults: boolean;
  trialOutcomeContent: boolean;
  resultsAvailable: boolean;
  endpointsMet: boolean;
  adverseEventsReported: boolean;
  studyStartDate: boolean;
  firstPatientIn: boolean;
  lastPatientIn: boolean;
  studyEndDate: boolean;
  interimAnalysisDates: boolean;
  finalAnalysisDate: boolean;
  regulatorySubmissionDate: boolean;
  purposeOfTrial: boolean;
  summary: boolean;
  primaryOutcomeMeasures: boolean;
  otherOutcomeMeasures: boolean;
  studyDesignKeywords: boolean;
  studyDesign: boolean;
  treatmentRegimen: boolean;
  numberOfArms: boolean;
  inclusionCriteria: boolean;
  exclusionCriteria: boolean;
  ageFrom: boolean;
  ageTo: boolean;
  gender: boolean;
  targetNoVolunteers: boolean;
  actualEnrolledVolunteers: boolean;
  startDateEstimated: boolean;
  trialEndDateEstimated: boolean;
  trialOutcome: boolean;
  adverseEventReported: boolean;
  adverseEventType: boolean;
  treatmentForAdverseEvents: boolean;
  totalSites: boolean;
  siteNotes: boolean;
  publicationType: boolean;
  registryName: boolean;
  studyType: boolean;
}

interface CustomizeColumnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columnSettings: ColumnSettings;
  onColumnSettingsChange: (settings: ColumnSettings) => void;
}

const DEFAULT_COLUMN_SETTINGS: ColumnSettings = {
  therapeuticArea: true,
  diseaseType: true,
  primaryDrug: true,
  trialPhase: true,
  patientSegment: true,
  lineOfTherapy: true,
  countries: true,
  sponsorsCollaborators: true,
  sponsor: true,
  fieldOfActivity: true,
  associatedCro: true,
  trialTags: false,
  sex: false,
  healthyVolunteers: false,
  trialRecordStatus: false,
  otherDrugs: false,
  regions: false,
  ageMin: false,
  ageMax: false,
  subjectType: false,
  ecogPerformanceStatus: false,
  priorTreatments: false,
  biomarkerRequirements: false,
  estimatedEnrollment: false,
  actualEnrollment: false,
  enrollmentStatus: false,
  recruitmentPeriod: false,
  studyCompletionDate: false,
  primaryCompletionDate: false,
  populationDescription: false,
  studySites: false,
  principalInvestigators: false,
  siteStatus: false,
  siteCountries: false,
  siteRegions: false,
  siteContactInfo: false,
  trialResults: false,
  trialOutcomeContent: false,
  resultsAvailable: false,
  endpointsMet: false,
  adverseEventsReported: false,
  studyStartDate: false,
  firstPatientIn: false,
  lastPatientIn: false,
  studyEndDate: false,
  interimAnalysisDates: false,
  finalAnalysisDate: false,
  regulatorySubmissionDate: false,
  purposeOfTrial: false,
  summary: false,
  primaryOutcomeMeasures: false,
  otherOutcomeMeasures: false,
  studyDesignKeywords: false,
  studyDesign: false,
  treatmentRegimen: false,
  numberOfArms: false,
  inclusionCriteria: false,
  exclusionCriteria: false,
  ageFrom: false,
  ageTo: false,
  gender: false,
  targetNoVolunteers: false,
  actualEnrolledVolunteers: false,
  startDateEstimated: false,
  trialEndDateEstimated: false,
  trialOutcome: false,
  adverseEventReported: false,
  adverseEventType: false,
  treatmentForAdverseEvents: false,
  totalSites: false,
  siteNotes: false,
  publicationType: false,
  registryName: false,
  studyType: false,
};

const MAX_COLUMNS = 15;

export const COLUMN_OPTIONS = [
  { key: 'therapeuticArea' as keyof ColumnSettings, label: 'Therapeutic Area' },
  { key: 'diseaseType' as keyof ColumnSettings, label: 'Disease Type' },
  { key: 'primaryDrug' as keyof ColumnSettings, label: 'Primary Drugs' },
  { key: 'trialPhase' as keyof ColumnSettings, label: 'Phases' },
  { key: 'patientSegment' as keyof ColumnSettings, label: 'Patient Segment' },
  { key: 'lineOfTherapy' as keyof ColumnSettings, label: 'Line of Therapy' },
  { key: 'countries' as keyof ColumnSettings, label: 'Countries' },
  { key: 'sponsorsCollaborators' as keyof ColumnSettings, label: 'Sponsors & Collaborators' },
  { key: 'sponsor' as keyof ColumnSettings, label: 'Sponsor' },
  { key: 'fieldOfActivity' as keyof ColumnSettings, label: 'Field of Activity' },
  { key: 'associatedCro' as keyof ColumnSettings, label: 'Associated CRO' },
  { key: 'trialTags' as keyof ColumnSettings, label: 'Trial Tags' },
  { key: 'sex' as keyof ColumnSettings, label: 'Sex' },
  { key: 'healthyVolunteers' as keyof ColumnSettings, label: 'Healthy Volunteers' },
  { key: 'trialRecordStatus' as keyof ColumnSettings, label: 'Trial Record Status' },
  { key: 'otherDrugs' as keyof ColumnSettings, label: 'Other Drugs' },
  { key: 'regions' as keyof ColumnSettings, label: 'Regions' },
  { key: 'ageMin' as keyof ColumnSettings, label: 'Age Min' },
  { key: 'ageMax' as keyof ColumnSettings, label: 'Age Max' },
  { key: 'subjectType' as keyof ColumnSettings, label: 'Subject Type' },
  { key: 'ecogPerformanceStatus' as keyof ColumnSettings, label: 'ECOG Performance Status' },
  { key: 'priorTreatments' as keyof ColumnSettings, label: 'Prior Treatments' },
  { key: 'biomarkerRequirements' as keyof ColumnSettings, label: 'Biomarker Requirements' },
  { key: 'estimatedEnrollment' as keyof ColumnSettings, label: 'Estimated Enrollment' },
  { key: 'actualEnrollment' as keyof ColumnSettings, label: 'Actual Enrollment' },
  { key: 'enrollmentStatus' as keyof ColumnSettings, label: 'Enrollment Status' },
  { key: 'recruitmentPeriod' as keyof ColumnSettings, label: 'Recruitment Period' },
  { key: 'studyCompletionDate' as keyof ColumnSettings, label: 'Study Completion Date' },
  { key: 'primaryCompletionDate' as keyof ColumnSettings, label: 'Primary Completion Date' },
  { key: 'populationDescription' as keyof ColumnSettings, label: 'Population Description' },
  { key: 'studySites' as keyof ColumnSettings, label: 'Study Sites' },
  { key: 'principalInvestigators' as keyof ColumnSettings, label: 'Principal Investigators' },
  { key: 'siteStatus' as keyof ColumnSettings, label: 'Site Status' },
  { key: 'siteCountries' as keyof ColumnSettings, label: 'Site Countries' },
  { key: 'siteRegions' as keyof ColumnSettings, label: 'Site Regions' },
  { key: 'siteContactInfo' as keyof ColumnSettings, label: 'Site Contact Info' },
  { key: 'trialResults' as keyof ColumnSettings, label: 'Trial Results' },
  { key: 'trialOutcomeContent' as keyof ColumnSettings, label: 'Trial Outcome Content' },
  { key: 'resultsAvailable' as keyof ColumnSettings, label: 'Results Available' },
  { key: 'endpointsMet' as keyof ColumnSettings, label: 'Endpoints Met' },
  { key: 'adverseEventsReported' as keyof ColumnSettings, label: 'Adverse Events Reported' },
  { key: 'studyStartDate' as keyof ColumnSettings, label: 'Study Start Date' },
  { key: 'firstPatientIn' as keyof ColumnSettings, label: 'First Patient In' },
  { key: 'lastPatientIn' as keyof ColumnSettings, label: 'Last Patient In' },
  { key: 'studyEndDate' as keyof ColumnSettings, label: 'Study End Date' },
  { key: 'interimAnalysisDates' as keyof ColumnSettings, label: 'Interim Analysis Dates' },
  { key: 'finalAnalysisDate' as keyof ColumnSettings, label: 'Final Analysis Date' },
  { key: 'regulatorySubmissionDate' as keyof ColumnSettings, label: 'Regulatory Submission Date' },
  { key: 'purposeOfTrial' as keyof ColumnSettings, label: 'Purpose of Trial' },
  { key: 'summary' as keyof ColumnSettings, label: 'Summary' },
  { key: 'primaryOutcomeMeasures' as keyof ColumnSettings, label: 'Primary Outcome Measures' },
  { key: 'otherOutcomeMeasures' as keyof ColumnSettings, label: 'Other Outcome Measures' },
  { key: 'studyDesignKeywords' as keyof ColumnSettings, label: 'Study Design Keywords' },
  { key: 'studyDesign' as keyof ColumnSettings, label: 'Study Design' },
  { key: 'treatmentRegimen' as keyof ColumnSettings, label: 'Treatment Regimen' },
  { key: 'numberOfArms' as keyof ColumnSettings, label: 'Number of Arms' },
  { key: 'inclusionCriteria' as keyof ColumnSettings, label: 'Inclusion Criteria' },
  { key: 'exclusionCriteria' as keyof ColumnSettings, label: 'Exclusion Criteria' },
  { key: 'ageFrom' as keyof ColumnSettings, label: 'Age From' },
  { key: 'ageTo' as keyof ColumnSettings, label: 'Age To' },
  { key: 'gender' as keyof ColumnSettings, label: 'Gender' },
  { key: 'targetNoVolunteers' as keyof ColumnSettings, label: 'Target No Volunteers' },
  { key: 'actualEnrolledVolunteers' as keyof ColumnSettings, label: 'Actual Enrolled Volunteers' },
  { key: 'startDateEstimated' as keyof ColumnSettings, label: 'Start Date Estimated' },
  { key: 'trialEndDateEstimated' as keyof ColumnSettings, label: 'Trial End Date Estimated' },
  { key: 'trialOutcome' as keyof ColumnSettings, label: 'Trial Outcome' },
  { key: 'adverseEventReported' as keyof ColumnSettings, label: 'Adverse Event Reported' },
  { key: 'adverseEventType' as keyof ColumnSettings, label: 'Adverse Event Type' },
  { key: 'treatmentForAdverseEvents' as keyof ColumnSettings, label: 'Treatment for Adverse Events' },
  { key: 'totalSites' as keyof ColumnSettings, label: 'Total Sites' },
  { key: 'siteNotes' as keyof ColumnSettings, label: 'Site Notes' },
  { key: 'publicationType' as keyof ColumnSettings, label: 'Publication Type' },
  { key: 'registryName' as keyof ColumnSettings, label: 'Registry Name' },
  { key: 'studyType' as keyof ColumnSettings, label: 'Study Type' },
];

export function CustomizeColumnModal({
  open,
  onOpenChange,
  columnSettings,
  onColumnSettingsChange,
}: CustomizeColumnModalProps) {
  const [localSettings, setLocalSettings] = useState<ColumnSettings>(columnSettings);

  useEffect(() => {
    setLocalSettings(columnSettings);
  }, [columnSettings]);

  const selectedCount = Object.values(localSettings).filter(Boolean).length;

  const handleColumnToggle = (column: keyof ColumnSettings) => {
    const isCurrentlySelected = localSettings[column];
    
    // If trying to select and already at max, don't allow
    if (!isCurrentlySelected && selectedCount >= MAX_COLUMNS) {
      return;
    }

    setLocalSettings(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleModifyColumns = () => {
    if (selectedCount === 0) {
      alert("Please select at least one column");
      return;
    }
    onColumnSettingsChange(localSettings);
    onOpenChange(false);
  };

  const handleClose = () => {
    setLocalSettings(columnSettings); // Reset to original settings
    onOpenChange(false);
  };

  const columnOptions = COLUMN_OPTIONS;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Customize column view
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 flex-1 overflow-hidden flex flex-col">
          <div className="mb-4">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-700 text-white rounded">
              <h3 className="text-sm font-medium">
                Select columns (Maximum: {MAX_COLUMNS})
              </h3>
              <span className={`text-sm font-bold ${selectedCount > MAX_COLUMNS ? 'text-red-300' : 'text-green-300'}`}>
                {selectedCount} / {MAX_COLUMNS} selected
              </span>
            </div>
          </div>

          {selectedCount >= MAX_COLUMNS && (
            <Alert className="mb-4 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Maximum of {MAX_COLUMNS} columns reached. Deselect a column to select another.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2 overflow-y-auto flex-1 pr-2">
            {columnOptions.map((option) => {
              const isSelected = localSettings[option.key];
              const isDisabled = !isSelected && selectedCount >= MAX_COLUMNS;
              
              return (
                <div 
                  key={option.key} 
                  className={`flex items-center space-x-3 px-1 py-1 rounded ${
                    isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Checkbox
                    id={option.key}
                    checked={isSelected}
                    onCheckedChange={() => handleColumnToggle(option.key)}
                    disabled={isDisabled}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label
                    htmlFor={option.key}
                    className={`text-sm text-gray-700 flex-1 ${
                      isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    {option.label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t pt-4">
          <Button
            onClick={handleModifyColumns}
            disabled={selectedCount === 0 || selectedCount > MAX_COLUMNS}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Modify columns
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { DEFAULT_COLUMN_SETTINGS };
