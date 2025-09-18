"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useEditTherapeuticForm } from "../../context/edit-form-context";
import { useDrugNames } from "@/hooks/use-drug-names";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Hierarchical data for dependent dropdowns
const hierarchicalData = {
  "Oncology": {
    diseaseTypes: [
      { value: "Breast Cancer", label: "Breast Cancer" },
      { value: "Lung Cancer", label: "Lung Cancer" },
      { value: "Prostate Cancer", label: "Prostate Cancer" },
      { value: "Colorectal Cancer", label: "Colorectal Cancer" },
      { value: "Leukemia", label: "Leukemia" },
      { value: "Lymphoma", label: "Lymphoma" },
    ]
  },
  "Cardiology": {
    diseaseTypes: [
      { value: "Heart Failure", label: "Heart Failure" },
      { value: "Coronary Artery Disease", label: "Coronary Artery Disease" },
      { value: "Arrhythmia", label: "Arrhythmia" },
      { value: "Hypertension", label: "Hypertension" },
    ]
  },
  "Neurology": {
    diseaseTypes: [
      { value: "Alzheimer's Disease", label: "Alzheimer's Disease" },
      { value: "Parkinson's Disease", label: "Parkinson's Disease" },
      { value: "Multiple Sclerosis", label: "Multiple Sclerosis" },
      { value: "Epilepsy", label: "Epilepsy" },
    ]
  }
};

// Static options
const diseaseTypeOptions: SearchableSelectOption[] = [
  { value: "Cancer", label: "Cancer" },
  { value: "Cardiovascular Disease", label: "Cardiovascular Disease" },
  { value: "Diabetes", label: "Diabetes" },
  { value: "Alzheimer's Disease", label: "Alzheimer's Disease" },
  { value: "Multiple Sclerosis", label: "Multiple Sclerosis" },
];

const therapeuticAreaOptions: SearchableSelectOption[] = [
  { value: "Oncology", label: "Oncology" },
  { value: "Cardiology", label: "Cardiology" },
  { value: "Neurology", label: "Neurology" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Endocrinology", label: "Endocrinology" },
];

const trialPhaseOptions: SearchableSelectOption[] = [
  { value: "Phase I", label: "Phase I" },
  { value: "Phase II", label: "Phase II" },
  { value: "Phase III", label: "Phase III" },
  { value: "Phase IV", label: "Phase IV" },
  { value: "Preclinical", label: "Preclinical" },
];

const statusOptions: SearchableSelectOption[] = [
  { value: "Active", label: "Active" },
  { value: "Recruiting", label: "Recruiting" },
  { value: "Completed", label: "Completed" },
  { value: "Terminated", label: "Terminated" },
  { value: "Suspended", label: "Suspended" },
  { value: "Closed", label: "Closed" },
];

const patientSegmentOptions: SearchableSelectOption[] = [
  { value: "Adults", label: "Adults" },
  { value: "Pediatric", label: "Pediatric" },
  { value: "Elderly", label: "Elderly" },
  { value: "All Ages", label: "All Ages" },
];

const lineOfTherapyOptions: SearchableSelectOption[] = [
  { value: "First-line", label: "First-line" },
  { value: "Second-line", label: "Second-line" },
  { value: "Third-line", label: "Third-line" },
  { value: "Adjuvant", label: "Adjuvant" },
  { value: "Neoadjuvant", label: "Neoadjuvant" },
];

const sponsorFieldActivityOptions: SearchableSelectOption[] = [
  { value: "Pharmaceutical", label: "Pharmaceutical" },
  { value: "Biotechnology", label: "Biotechnology" },
  { value: "Medical Device", label: "Medical Device" },
  { value: "Academic", label: "Academic" },
  { value: "Government", label: "Government" },
];

const associatedCROOptions: SearchableSelectOption[] = [
  { value: "IQVIA", label: "IQVIA" },
  { value: "Parexel", label: "Parexel" },
  { value: "PRA Health Sciences", label: "PRA Health Sciences" },
  { value: "Syneos Health", label: "Syneos Health" },
  { value: "ICON", label: "ICON" },
];

const countriesOptions: SearchableSelectOption[] = [
  { value: "United States", label: "United States" },
  { value: "Canada", label: "Canada" },
  { value: "United Kingdom", label: "United Kingdom" },
  { value: "Germany", label: "Germany" },
  { value: "France", label: "France" },
  { value: "Japan", label: "Japan" },
  { value: "China", label: "China" },
  { value: "India", label: "India" },
];

const regionOptions: SearchableSelectOption[] = [
  { value: "North America", label: "North America" },
  { value: "Europe", label: "Europe" },
  { value: "Asia-Pacific", label: "Asia-Pacific" },
  { value: "Latin America", label: "Latin America" },
  { value: "Middle East & Africa", label: "Middle East & Africa" },
];

const trialRecordStatusOptions: SearchableSelectOption[] = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Archived", label: "Archived" },
  { value: "Draft", label: "Draft" },
];

export default function EditTherapeuticsStep5_1() {
  const {
    formData,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    saveTrial,
    isLoading,
    isSaving,
  } = useEditTherapeuticForm();
  const { getPrimaryDrugsOptions } = useDrugNames();
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const [isSavingStep, setIsSavingStep] = useState(false);
  const form = formData.step5_1;

  // Helper functions for hierarchical dropdowns
  const getDiseaseTypeOptions = (): SearchableSelectOption[] => {
    if (!form.therapeutic_area) {
      return diseaseTypeOptions; // Return all options if no therapeutic area selected
    }
    
    const therapeuticAreaData = hierarchicalData[form.therapeutic_area as keyof typeof hierarchicalData];
    if (therapeuticAreaData?.diseaseTypes) {
      return therapeuticAreaData.diseaseTypes;
    }
    
    return diseaseTypeOptions; // Fallback to all options
  };

  const primaryDrugsOptions: SearchableSelectOption[] = [
    ...getPrimaryDrugsOptions().map(drug => ({
      value: drug.value,
      label: drug.label
    }))
  ];

  const otherDrugsOptions: SearchableSelectOption[] = [
    { value: "Drug X", label: "Drug X" },
    { value: "Drug Y", label: "Drug Y" },
    { value: "Drug Z", label: "Drug Z" },
  ];

  const handleSaveStep = async () => {
    try {
      setIsSavingStep(true);
      await saveTrial(params.id as string);
      toast({
        title: "Success",
        description: "Step 5-1 saved successfully!",
      });
    } catch (error) {
      console.error("Error saving step:", error);
      toast({
        title: "Error",
        description: "Failed to save step. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSavingStep(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EAF8FF] to-white p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading trial data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF8FF] to-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/therapeutics")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clinical Trials
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit Clinical Trial - Step 5-1</h1>
              <p className="text-gray-600">Trial Overview</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleSaveStep}
              disabled={isSavingStep || isSaving}
              className="bg-[#204B73] hover:bg-[#204B73]/90 text-white"
            >
              {isSavingStep || isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <Button asChild>
              <Link href={`/admin/therapeutics/edit/${params.id}/5-2`}>
                Next Step
              </Link>
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 1
                  ? "bg-[#204B73] text-white"
                  : step <= 8
                  ? "bg-gray-200 text-gray-600"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        {/* Edit Form */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Trial Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* First Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Therapeutic Area</Label>
                <SearchableSelect
                  options={therapeuticAreaOptions}
                  value={form.therapeutic_area}
                  onValueChange={(value) => updateField("step5_1", "therapeutic_area", value)}
                  placeholder="Select therapeutic area"
                  searchPlaceholder="Search therapeutic area..."
                  emptyMessage="No therapeutic area found."
                />
              </div>
              <div className="space-y-2">
                <Label>Trial Phase</Label>
                <SearchableSelect
                  options={trialPhaseOptions}
                  value={form.trial_phase}
                  onValueChange={(value) => updateField("step5_1", "trial_phase", value)}
                  placeholder="Select trial phase"
                  searchPlaceholder="Search trial phase..."
                  emptyMessage="No trial phase found."
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <SearchableSelect
                  options={statusOptions}
                  value={form.status}
                  onValueChange={(value) => updateField("step5_1", "status", value)}
                  placeholder="Select status"
                  searchPlaceholder="Search status..."
                  emptyMessage="No status found."
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Drugs</Label>
                <SearchableSelect
                  options={primaryDrugsOptions}
                  value={form.primary_drugs}
                  onValueChange={(value) => updateField("step5_1", "primary_drugs", value)}
                  placeholder="Select primary drug"
                  searchPlaceholder="Search primary drugs..."
                  emptyMessage="No primary drug found."
                />
              </div>
              <div className="space-y-2">
                <Label>Other Drugs</Label>
                <SearchableSelect
                  options={otherDrugsOptions}
                  value={form.other_drugs}
                  onValueChange={(value) => updateField("step5_1", "other_drugs", value)}
                  placeholder="Select other drug"
                  searchPlaceholder="Search other drugs..."
                  emptyMessage="No other drug found."
                />
              </div>
            </div>

            {/* Third Row */}
            <div className="space-y-2">
              <Label>Trial Title</Label>
              <Input
                value={form.title}
                onChange={(e) => updateField("step5_1", "title", e.target.value)}
                placeholder="Enter trial title"
                className="w-full"
              />
            </div>

            {/* Fourth Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Disease Type</Label>
                <SearchableSelect
                  options={getDiseaseTypeOptions()}
                  value={form.disease_type}
                  onValueChange={(value) => updateField("step5_1", "disease_type", value)}
                  placeholder="Select disease type"
                  searchPlaceholder="Search disease type..."
                  emptyMessage="No disease type found."
                />
              </div>
              <div className="space-y-2">
                <Label>Patient Segment</Label>
                <SearchableSelect
                  options={patientSegmentOptions}
                  value={form.patient_segment}
                  onValueChange={(value) => updateField("step5_1", "patient_segment", value)}
                  placeholder="Select patient segment"
                  searchPlaceholder="Search patient segment..."
                  emptyMessage="No patient segment found."
                />
              </div>
              <div className="space-y-2">
                <Label>Line of Therapy</Label>
                <SearchableSelect
                  options={lineOfTherapyOptions}
                  value={form.line_of_therapy}
                  onValueChange={(value) => updateField("step5_1", "line_of_therapy", value)}
                  placeholder="Select line of therapy"
                  searchPlaceholder="Search line of therapy..."
                  emptyMessage="No line of therapy found."
                />
              </div>
            </div>

            {/* Fifth Row */}
            <div className="space-y-2">
              <Label>Trial Tags</Label>
              <Textarea
                value={form.trial_tags}
                onChange={(e) => updateField("step5_1", "trial_tags", e.target.value)}
                placeholder="Enter trial tags (comma-separated)"
                rows={2}
                className="w-full"
              />
            </div>

            {/* Sixth Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sponsor & Collaborators</Label>
                <Input
                  value={form.sponsor_collaborators}
                  onChange={(e) => updateField("step5_1", "sponsor_collaborators", e.target.value)}
                  placeholder="Enter sponsor and collaborators"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Sponsor Field of Activity</Label>
                <SearchableSelect
                  options={sponsorFieldActivityOptions}
                  value={form.sponsor_field_activity}
                  onValueChange={(value) => updateField("step5_1", "sponsor_field_activity", value)}
                  placeholder="Select sponsor field of activity"
                  searchPlaceholder="Search sponsor field..."
                  emptyMessage="No sponsor field found."
                />
              </div>
            </div>

            {/* Seventh Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Associated CRO</Label>
                <SearchableSelect
                  options={associatedCROOptions}
                  value={form.associated_cro}
                  onValueChange={(value) => updateField("step5_1", "associated_cro", value)}
                  placeholder="Select associated CRO"
                  searchPlaceholder="Search CRO..."
                  emptyMessage="No CRO found."
                />
              </div>
              <div className="space-y-2">
                <Label>Trial Record Status</Label>
                <SearchableSelect
                  options={trialRecordStatusOptions}
                  value={form.trial_record_status}
                  onValueChange={(value) => updateField("step5_1", "trial_record_status", value)}
                  placeholder="Select trial record status"
                  searchPlaceholder="Search status..."
                  emptyMessage="No status found."
                />
              </div>
            </div>

            {/* Eighth Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Countries</Label>
                <SearchableSelect
                  options={countriesOptions}
                  value={form.countries}
                  onValueChange={(value) => updateField("step5_1", "countries", value)}
                  placeholder="Select countries"
                  searchPlaceholder="Search countries..."
                  emptyMessage="No countries found."
                />
              </div>
              <div className="space-y-2">
                <Label>Region</Label>
                <SearchableSelect
                  options={regionOptions}
                  value={form.region}
                  onValueChange={(value) => updateField("step5_1", "region", value)}
                  placeholder="Select region"
                  searchPlaceholder="Search region..."
                  emptyMessage="No region found."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
