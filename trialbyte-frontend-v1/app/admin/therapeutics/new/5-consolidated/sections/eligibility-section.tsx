"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { useTherapeuticForm } from "../../context/therapeutic-form-context";

export default function EligibilitySection() {
  const {
    formData,
    updateField,
  } = useTherapeuticForm();
  const form = formData.step5_3;

  const ageNumberOptions: SearchableSelectOption[] = Array.from({ length: 151 }, (_, i) => ({
    value: i.toString(),
    label: i.toString()
  }));

  const ageUnitOptions: SearchableSelectOption[] = [
    { value: "years", label: "Years" },
    { value: "months", label: "Months" },
    { value: "weeks", label: "Weeks" },
    { value: "days", label: "Days" },
  ];

  const genderOptions: SearchableSelectOption[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "both", label: "Both" },
  ];

  const healthyVolunteersOptions: SearchableSelectOption[] = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "no_information", label: "No Information" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Inclusion Criteria</Label>
          <Textarea
            rows={5}
            placeholder="Enter inclusion criteria"
            value={form.inclusion_criteria?.[0] || ""}
            onChange={(e) => updateField("step5_3", "inclusion_criteria", [e.target.value])}
            className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label>Exclusion Criteria</Label>
          <Textarea
            rows={5}
            placeholder="Enter exclusion criteria"
            value={form.exclusion_criteria?.[0] || ""}
            onChange={(e) => updateField("step5_3", "exclusion_criteria", [e.target.value])}
            className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Age From</Label>
          <div className="flex gap-2">
            <SearchableSelect
              options={ageNumberOptions}
              value={form.age_min || ""}
              onValueChange={(value) => updateField("step5_3", "age_min", value)}
              placeholder="0"
              searchPlaceholder="Search age..."
              emptyMessage="No age found."
              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
            />
            <SearchableSelect
              options={ageUnitOptions}
              value={form.biomarker_requirements[0] || ""}
              onValueChange={(value) => {
                const current = form.biomarker_requirements || [""];
                const updated = [...current];
                updated[0] = value;
                updateField("step5_3", "biomarker_requirements", updated);
              }}
              placeholder="Years"
              searchPlaceholder="Search unit..."
              emptyMessage="No unit found."
              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Subject Type</Label>
          <Input
            placeholder="Enter subject type..."
            value={form.ecog_performance_status || ""}
            onChange={(e) => updateField("step5_3", "ecog_performance_status", e.target.value)}
            className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Age To</Label>
          <div className="flex gap-2">
            <SearchableSelect
              options={ageNumberOptions}
              value={form.age_max || ""}
              onValueChange={(value) => updateField("step5_3", "age_max", value)}
              placeholder="150"
              searchPlaceholder="Search age..."
              emptyMessage="No age found."
              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
            />
            <SearchableSelect
              options={ageUnitOptions}
              value={form.biomarker_requirements[1] || ""}
              onValueChange={(value) => {
                const current = form.biomarker_requirements || [""];
                const updated = [...current];
                updated[1] = value;
                updateField("step5_3", "biomarker_requirements", updated);
              }}
              placeholder="Years"
              searchPlaceholder="Search unit..."
              emptyMessage="No unit found."
              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Sex</Label>
            <SearchableSelect
              options={genderOptions}
              value={form.gender || ""}
              onValueChange={(v) => updateField("step5_3", "gender", v)}
              placeholder="Select sex"
              searchPlaceholder="Search sex..."
              emptyMessage="No option found."
              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
            />
          </div>
          <div className="space-y-2">
            <Label>Healthy Volunteers</Label>
            <SearchableSelect
              options={healthyVolunteersOptions}
              value={form.prior_treatments[0] || ""}
              onValueChange={(v) => updateField("step5_3", "prior_treatments", [v])}
              placeholder="Select"
              searchPlaceholder="Search..."
              emptyMessage="No option found."
              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Target No Of Volunteers</Label>
          <Input
            type="number"
            placeholder="e.g., 50"
            value={form.biomarker_requirements[0] || ""}
            onChange={(e) => {
              const current = form.biomarker_requirements || [""];
              const updated = [...current];
              updated[0] = e.target.value;
              updateField("step5_3", "biomarker_requirements", updated);
            }}
            className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label>Actual Enrolled Volunteers</Label>
          <Input
            type="number"
            placeholder="e.g., 40"
            value={form.biomarker_requirements[1] || ""}
            onChange={(e) => {
              const current = form.biomarker_requirements || [""];
              const updated = [...current];
              updated[1] = e.target.value;
              updateField("step5_3", "biomarker_requirements", updated);
            }}
            className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
          />
        </div>
      </div>
    </div>
  );
}
