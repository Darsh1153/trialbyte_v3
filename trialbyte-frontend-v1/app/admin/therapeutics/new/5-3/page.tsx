"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

export default function TherapeuticsStep5_3() {
  const {
    formData,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
  } = useTherapeuticForm();
  const form = formData.step5_3;

  // Options for searchable dropdowns
  const genderOptions: SearchableSelectOption[] = [
    { value: "All", label: "All" },
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];

  const ecogPerformanceStatusOptions: SearchableSelectOption[] = [
    { value: "0", label: "0 - Fully active" },
    { value: "1", label: "1 - Restricted in physically strenuous activity" },
    { value: "2", label: "2 - Ambulatory and capable of all self-care" },
    { value: "3", label: "3 - Capable of only limited self-care" },
    { value: "4", label: "4 - Completely disabled" },
  ];

  const addInclusionCriteria = () =>
    addArrayItem("step5_3", "inclusion_criteria");
  const removeInclusionCriteria = (index: number) =>
    removeArrayItem("step5_3", "inclusion_criteria", index);
  const updateInclusionCriteria = (index: number, value: string) =>
    updateArrayItem("step5_3", "inclusion_criteria", index, value);

  const addExclusionCriteria = () =>
    addArrayItem("step5_3", "exclusion_criteria");
  const removeExclusionCriteria = (index: number) =>
    removeArrayItem("step5_3", "exclusion_criteria", index);
  const updateExclusionCriteria = (index: number, value: string) =>
    updateArrayItem("step5_3", "exclusion_criteria", index, value);

  return (
    <div className="space-y-4">
      <FormProgress currentStep={3} />

      <div className="flex justify-end w-full gap-3">
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
          {/* Inclusion Criteria */}
          <div className="space-y-2">
            <Label>Inclusion Criteria</Label>
            <div className="space-y-2">
              {form.inclusion_criteria.map((criteria, idx) => (
                <div key={idx} className="flex gap-2">
                  <Textarea
                    rows={3}
                    placeholder=""
                    value={criteria}
                    onChange={(e) =>
                      updateInclusionCriteria(idx, e.target.value)
                    }
                  />
                  {idx === 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addInclusionCriteria}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeInclusionCriteria(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Exclusion Criteria */}
          <div className="space-y-2">
            <Label>Exclusion Criteria</Label>
            <div className="space-y-2">
              {form.exclusion_criteria.map((criteria, idx) => (
                <div key={idx} className="flex gap-2">
                  <Textarea
                    rows={3}
                    placeholder=""
                    value={criteria}
                    onChange={(e) =>
                      updateExclusionCriteria(idx, e.target.value)
                    }
                  />
                  {idx === 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addExclusionCriteria}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeExclusionCriteria(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Age Range */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Age From</Label>
              <Input
                type="number"
                placeholder="18"
                value={form.age_min}
                onChange={(e) =>
                  updateField("step5_3", "age_min", e.target.value)
                }
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Age To</Label>
              <Input
                type="number"
                placeholder="75"
                value={form.age_max}
                onChange={(e) =>
                  updateField("step5_3", "age_max", e.target.value)
                }
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <SearchableSelect
                options={genderOptions}
                value={form.gender}
                onValueChange={(v) => updateField("step5_3", "gender", v)}
                placeholder="Select gender"
                searchPlaceholder="Search gender..."
                emptyMessage="No gender found."
              />
            </div>
          </div>

          {/* Additional Criteria */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>ECOG Performance Status</Label>
              <SearchableSelect
                options={ecogPerformanceStatusOptions}
                value={form.ecog_performance_status}
                onValueChange={(v) =>
                  updateField("step5_3", "ecog_performance_status", v)
                }
                placeholder="Select ECOG status"
                searchPlaceholder="Search ECOG status..."
                emptyMessage="No ECOG status found."
              />
            </div>
            <div className="space-y-2">
              <Label>Prior Treatments</Label>
              <Textarea
                placeholder="e.g., Chemotherapy, Radiation"
                value={form.prior_treatments[0] || ""}
                onChange={(e) =>
                  updateArrayItem(
                    "step5_3",
                    "prior_treatments",
                    0,
                    e.target.value
                  )
                }
                rows={2}
              />
            </div>
          </div>

          {/* Biomarker Requirements */}
          <div className="space-y-2">
            <Label>Biomarker Requirements</Label>
            <Textarea
              placeholder="e.g., HER2+, EGFR mutation"
              value={form.biomarker_requirements[0] || ""}
              onChange={(e) =>
                updateArrayItem(
                  "step5_3",
                  "biomarker_requirements",
                  0,
                  e.target.value
                )
              }
              rows={2}
            />
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href="/admin/therapeutics/new/5-2">Previous</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/therapeutics/new/5-4">Next</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
