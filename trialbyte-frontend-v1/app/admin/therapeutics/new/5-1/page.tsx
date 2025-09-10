"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { Plus, X } from "lucide-react";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";
import { Textarea } from "@/components/ui/textarea";
import { useDrugNames } from "@/hooks/use-drug-names";

export default function TherapeuticsStep5_1() {
  const {
    formData,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
  } = useTherapeuticForm();
  const { getPrimaryDrugsOptions } = useDrugNames();
  const form = formData.step5_1;

  // Options for searchable dropdowns
  const therapeuticAreaOptions: SearchableSelectOption[] = [
    { value: "Oncology", label: "Oncology" },
    { value: "Cardiology", label: "Cardiology" },
    { value: "Neurology", label: "Neurology" },
  ];

  const trialPhaseOptions: SearchableSelectOption[] = [
    { value: "I", label: "Phase I" },
    { value: "II", label: "Phase II" },
    { value: "III", label: "Phase III" },
    { value: "IV", label: "Phase IV" },
  ];

  const statusOptions: SearchableSelectOption[] = [
    { value: "Planned", label: "Planned" },
    { value: "Open", label: "Open" },
    { value: "Closed", label: "Closed" },
    { value: "Completed", label: "Completed" },
    { value: "Terminated", label: "Terminated" },
  ];

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

  const diseaseTypeOptions: SearchableSelectOption[] = [
    { value: "Lung Cancer", label: "Lung Cancer" },
    { value: "Breast Cancer", label: "Breast Cancer" },
  ];

  const patientSegmentOptions: SearchableSelectOption[] = [
    { value: "Adult", label: "Adult" },
    { value: "Pediatric", label: "Pediatric" },
    { value: "Elderly", label: "Elderly" },
  ];

  const lineOfTherapyOptions: SearchableSelectOption[] = [
    { value: "First Line", label: "First Line" },
    { value: "Second Line", label: "Second Line" },
    { value: "Maintenance", label: "Maintenance" },
  ];

  const trialTagsOptions: SearchableSelectOption[] = [
    { value: "Immunotherapy", label: "Immunotherapy" },
    { value: "Targeted", label: "Targeted" },
    { value: "Chemotherapy", label: "Chemotherapy" },
  ];

  const sponsorOptions: SearchableSelectOption[] = [
    { value: "Pfizer", label: "Pfizer" },
    { value: "Novartis", label: "Novartis" },
    { value: "AstraZeneca", label: "AstraZeneca" },
  ];

  const sponsorFieldOptions: SearchableSelectOption[] = [
    { value: "Pharma", label: "Pharma" },
    { value: "Biotech", label: "Biotech" },
    { value: "Academic", label: "Academic" },
  ];

  const croOptions: SearchableSelectOption[] = [
    { value: "IQVIA", label: "IQVIA" },
    { value: "Syneos", label: "Syneos" },
    { value: "PPD", label: "PPD" },
  ];

  const countriesOptions: SearchableSelectOption[] = [
    { value: "United States", label: "United States" },
    { value: "Canada", label: "Canada" },
    { value: "United Kingdom", label: "United Kingdom" },
  ];

  const regionOptions: SearchableSelectOption[] = [
    { value: "West Coast", label: "West Coast" },
    { value: "East Coast", label: "East Coast" },
    { value: "EMEA", label: "EMEA" },
  ];

  const trialRecordStatusOptions: SearchableSelectOption[] = [
    { value: "Draft", label: "Draft" },
    { value: "Active", label: "Active" },
    { value: "Archived", label: "Archived" },
  ];

  // Helpers for multi-input fields
  const addTrialIdentifierField = () =>
    addArrayItem("step5_1", "trial_identifier");
  const removeTrialIdentifier = (index: number) =>
    removeArrayItem("step5_1", "trial_identifier", index);
  const updateTrialIdentifier = (index: number, value: string) =>
    updateArrayItem("step5_1", "trial_identifier", index, value);

  const addReferenceLinkField = () =>
    addArrayItem("step5_1", "reference_links");
  const removeReferenceLink = (index: number) =>
    removeArrayItem("step5_1", "reference_links", index);
  const updateReferenceLink = (index: number, value: string) =>
    updateArrayItem("step5_1", "reference_links", index, value);

  return (
    <div className="space-y-4">
      <FormProgress currentStep={1} />
      
      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline"
          asChild
        >
          <Link href="/admin/therapeutics">Cancel</Link>
        </Button>
        <Button 
          className="text-white font-medium px-6 py-2"
          style={{ backgroundColor: '#204B73' }}
        >
          Save Changes
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-6">
          {/* Row 1: therapeutic area / trial identifier / phase */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Clinical Trials</Label>
              <SearchableSelect
                options={therapeuticAreaOptions}
                value={form.therapeutic_area}
                onValueChange={(v) =>
                  updateField("step5_1", "therapeutic_area", v)
                }
                placeholder="Select Clinical Trials"
                searchPlaceholder="Search therapeutic areas..."
                emptyMessage="No therapeutic area found."
              />
            </div>
            <div className="space-y-2">
              <Label>Trial Identifier</Label>
              <div className="space-y-2">
                {form.trial_identifier.map((val, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Textarea
                      value={val}
                      onChange={(e) =>
                        updateTrialIdentifier(idx, e.target.value)
                      }
                      placeholder="#807996"
                      rows={2}
                    />
                    {idx === 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTrialIdentifierField}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeTrialIdentifier(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Trial Phase</Label>
              <SearchableSelect
                options={trialPhaseOptions}
                value={form.trial_phase}
                onValueChange={(v) => updateField("step5_1", "trial_phase", v)}
                placeholder="Select Phase"
                searchPlaceholder="Search trial phases..."
                emptyMessage="No trial phase found."
              />
            </div>
          </div>

          {/* Row 2: status / primary drugs / other drugs */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <SearchableSelect
                options={statusOptions}
                value={form.status}
                onValueChange={(v) => updateField("step5_1", "status", v)}
                placeholder="Select status"
                searchPlaceholder="Search status..."
                emptyMessage="No status found."
              />
            </div>
            <div className="space-y-2">
              <Label>Primary Drugs</Label>
              <SearchableSelect
                options={primaryDrugsOptions}
                value={form.primary_drugs}
                onValueChange={(v) =>
                  updateField("step5_1", "primary_drugs", v)
                }
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
                onValueChange={(v) => updateField("step5_1", "other_drugs", v)}
                placeholder="Select other drug"
                searchPlaceholder="Search other drugs..."
                emptyMessage="No other drug found."
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Textarea
              value={form.title}
              onChange={(e) => updateField("step5_1", "title", e.target.value)}
              className="resize-y min-h-[40px]"
            />
          </div>


          {/* Row 3: disease type / patient segment / line of therapy */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Disease Type</Label>
              <SearchableSelect
                options={diseaseTypeOptions}
                value={form.disease_type}
                onValueChange={(v) => updateField("step5_1", "disease_type", v)}
                placeholder="Select disease type"
                searchPlaceholder="Search disease types..."
                emptyMessage="No disease type found."
              />
            </div>
            <div className="space-y-2">
              <Label>Patient Segment</Label>
              <SearchableSelect
                options={patientSegmentOptions}
                value={form.patient_segment}
                onValueChange={(v) =>
                  updateField("step5_1", "patient_segment", v)
                }
                placeholder="Select segment"
                searchPlaceholder="Search patient segments..."
                emptyMessage="No patient segment found."
              />
            </div>
            <div className="space-y-2">
              <Label>Line Of Therapy</Label>
              <SearchableSelect
                options={lineOfTherapyOptions}
                value={form.line_of_therapy}
                onValueChange={(v) =>
                  updateField("step5_1", "line_of_therapy", v)
                }
                placeholder="Select line of therapy"
                searchPlaceholder="Search lines of therapy..."
                emptyMessage="No line of therapy found."
              />
            </div>
          </div>

          {/* Row 4: reference links / trial tags */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label>Reference Links</Label>
              <div className="space-y-2">
                {form.reference_links.map((val, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Textarea
                      value={val}
                      onChange={(e) => updateReferenceLink(idx, e.target.value)}
                      placeholder="https://..."
                      rows={2}
                    />
                    {idx === 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addReferenceLinkField}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeReferenceLink(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Trial Tags</Label>
              <SearchableSelect
                options={trialTagsOptions}
                value={form.trial_tags}
                onValueChange={(v) => updateField("step5_1", "trial_tags", v)}
                placeholder="Select trial tag"
                searchPlaceholder="Search trial tags..."
                emptyMessage="No trial tag found."
              />
            </div>
          </div>

          {/* Row 5: sponsor fields */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Sponsor & Collaborators</Label>
              <SearchableSelect
                options={sponsorOptions}
                value={form.sponsor_collaborators}
                onValueChange={(v) =>
                  updateField("step5_1", "sponsor_collaborators", v)
                }
                placeholder="Select sponsor"
                searchPlaceholder="Search sponsors..."
                emptyMessage="No sponsor found."
              />
            </div>
            <div className="space-y-2">
              <Label>Sponsor Field of Activity</Label>
              <SearchableSelect
                options={sponsorFieldOptions}
                value={form.sponsor_field_activity}
                onValueChange={(v) =>
                  updateField("step5_1", "sponsor_field_activity", v)
                }
                placeholder="Select field"
                searchPlaceholder="Search sponsor fields..."
                emptyMessage="No sponsor field found."
              />
            </div>
            <div className="space-y-2">
              <Label>Associated CRO</Label>
              <SearchableSelect
                options={croOptions}
                value={form.associated_cro}
                onValueChange={(v) =>
                  updateField("step5_1", "associated_cro", v)
                }
                placeholder="Select CRO"
                searchPlaceholder="Search CROs..."
                emptyMessage="No CRO found."
              />
            </div>
          </div>

          {/* Row 6: countries / region / record status */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Countries</Label>
              <SearchableSelect
                options={countriesOptions}
                value={form.countries}
                onValueChange={(v) => updateField("step5_1", "countries", v)}
                placeholder="Select countries"
                searchPlaceholder="Search countries..."
                emptyMessage="No country found."
              />
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <SearchableSelect
                options={regionOptions}
                value={form.region}
                onValueChange={(v) => updateField("step5_1", "region", v)}
                placeholder="Select region"
                searchPlaceholder="Search regions..."
                emptyMessage="No region found."
              />
            </div>
            <div className="space-y-2">
              <Label>Trial Record Status</Label>
              <SearchableSelect
                options={trialRecordStatusOptions}
                value={form.trial_record_status}
                onValueChange={(v) =>
                  updateField("step5_1", "trial_record_status", v)
                }
                placeholder="Select status"
                searchPlaceholder="Search trial record status..."
                emptyMessage="No trial record status found."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button asChild>
              <Link href="/admin/therapeutics/new/5-2">Next</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}