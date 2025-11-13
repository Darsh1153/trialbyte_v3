"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { useEditTherapeuticForm } from "../../../context/edit-form-context";
import { useDynamicDropdown } from "@/hooks/use-dynamic-dropdown";
import { useParams } from "next/navigation";
import { useTherapeuticTrial } from "@/hooks/use-therapeutic-trial";
import { useEffect, useRef } from "react";

const volunteerFieldCandidates: Record<"target" | "actual", string[]> = {
  target: [
    "target_no_volunteers",
    "targetNoVolunteers",
    "target_no_of_volunteers",
    "target_number_of_volunteers",
    "target_volunteers",
    "targetVolunteers",
    "estimated_enrollment",
    "enrollment_target",
  ],
  actual: [
    "actual_enrolled_volunteers",
    "actualEnrolledVolunteers",
    "actual_no_of_volunteers",
    "actual_number_of_volunteers",
    "enrolled_volunteers",
    "enrolledVolunteers",
    "actual_enrollment",
  ],
};

const normalizeVolunteerValue = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value.toString() : null;
  }

  const stringValue = String(value).trim();
  return stringValue ? stringValue : null;
};

const resolveVolunteerValue = (trial: any, type: "target" | "actual"): string => {
  const sources: any[] = [];

  if (trial?.criteria) {
    if (Array.isArray(trial.criteria)) {
      sources.push(...trial.criteria);
    } else {
      sources.push(trial.criteria);
    }
  }

  if (trial?.participationCriteria) {
    if (Array.isArray(trial.participationCriteria)) {
      sources.push(...trial.participationCriteria);
    } else {
      sources.push(trial.participationCriteria);
    }
  }

  if (trial?.participation) {
    sources.push(trial.participation);
  }

  if (trial?.timing) {
    if (Array.isArray(trial.timing)) {
      sources.push(...trial.timing);
    } else {
      sources.push(trial.timing);
    }
  }

  if (trial?.overview) {
    sources.push(trial.overview);
  }

  if (trial?.population) {
    sources.push(trial.population);
  }

  for (const source of sources) {
    if (!source) continue;
    for (const key of volunteerFieldCandidates[type]) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const resolved = normalizeVolunteerValue(source[key]);
        if (resolved !== null) {
          return resolved;
        }
      }
    }
  }

  return "";
};

export default function EligibilitySection() {
  const params = useParams();
  const trialId = params.id as string;
  const {
    formData,
    updateField,
  } = useEditTherapeuticForm();
  const form = formData.step5_3;
  const hasAutoFilledRef = useRef(false);

  // Use react-query to fetch trial data
  const { data: trialData, isLoading: isTrialLoading } = useTherapeuticTrial(trialId);

  // Auto-fill fields from fetched data
  useEffect(() => {
    if (!trialData || hasAutoFilledRef.current) {
      return;
    }

    const criteria = Array.isArray(trialData.criteria) ? trialData.criteria[0] : trialData.criteria;
    if (!criteria) {
      return;
    }

    const asString = (value: unknown): string => {
      if (value === null || value === undefined) return "";
      return typeof value === "string" ? value : String(value);
    };

    const setIfChanged = (field: keyof typeof form, rawValue: unknown) => {
      const nextValue = asString(rawValue);
      if (nextValue !== "" && form[field] !== nextValue) {
        updateField("step5_3", field as string, nextValue);
      }
    };

    const targetVolunteers = resolveVolunteerValue(trialData, "target");
    const actualVolunteers = resolveVolunteerValue(trialData, "actual");

    console.log("🔄 Auto-filling eligibility fields from react-query data:", {
      subject_type: criteria.subject_type,
      age_from: criteria.age_from,
      age_to: criteria.age_to,
      sex: criteria.sex,
      healthy_volunteers: criteria.healthy_volunteers,
      target_no_volunteers: targetVolunteers,
      actual_enrolled_volunteers: actualVolunteers,
    });

    setIfChanged("subject_type", criteria.subject_type);
    if (targetVolunteers !== "" && form.target_no_volunteers !== targetVolunteers) {
      updateField("step5_3", "target_no_volunteers", targetVolunteers);
    }
    if (actualVolunteers !== "" && form.actual_enrolled_volunteers !== actualVolunteers) {
      updateField("step5_3", "actual_enrolled_volunteers", actualVolunteers);
    }
    setIfChanged("age_min", criteria.age_from);
    setIfChanged("age_max", criteria.age_to);
    setIfChanged("gender", criteria.sex);

    const healthyVolunteers = asString(criteria.healthy_volunteers);
    if (healthyVolunteers !== "" && form.healthy_volunteers[0] !== healthyVolunteers) {
      updateField("step5_3", "healthy_volunteers", [healthyVolunteers]);
    }

    hasAutoFilledRef.current = true;
  }, [
    trialData,
    updateField,
    form.target_no_volunteers,
    form.actual_enrolled_volunteers,
    form.healthy_volunteers,
  ]);

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

  // Fallback options for sex
  const fallbackSexOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "both", label: "Both" },
  ];

  // Fallback options for healthy volunteers
  const fallbackHealthyVolunteersOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
    { value: "no_information", label: "No Information" },
  ];

  // Fetch sex options dynamically from API
  const { options: sexOptions, loading: sexLoading } = useDynamicDropdown({
    categoryName: 'sex',
    fallbackOptions: fallbackSexOptions
  });

  // Fetch healthy volunteers options dynamically from API
  const { options: healthyVolunteersOptions, loading: healthyVolunteersLoading } = useDynamicDropdown({
    categoryName: 'healthy_volunteers',
    fallbackOptions: fallbackHealthyVolunteersOptions
  });

  // Debug logging
  console.log('Sex Options:', sexOptions);
  console.log('Healthy Volunteers Options:', healthyVolunteersOptions);
  console.log('Current Form Gender:', form.gender);
  console.log('Current Form Prior Treatments (Healthy Volunteers):', form.healthy_volunteers);

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
              value={form.age_min[0] || ""}
              onValueChange={(value) => {
                const current = form.age_min || [""];
                const updated = [...current];
                updated[0] = value;
                updateField("step5_3", "age_min", updated);
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
            value={form.subject_type || ""}
            onChange={(e) => updateField("step5_3", "subject_type", e.target.value)}
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
              value={form.age_max[1] || ""}
              onValueChange={(value) => {
                const current = form.age_max || [""];
                const updated = [...current];
                updated[1] = value;
                updateField("step5_3", "age_max", updated);
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
              options={sexOptions}
              value={form.gender || ""}
              onValueChange={(v) => {
                console.log('Sex selected:', v);
                updateField("step5_3", "gender", v);
              }}
              placeholder="Select sex"
              searchPlaceholder="Search sex..."
              emptyMessage={sexLoading ? "Loading options..." : "No option found."}
              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
            />
          </div>
          <div className="space-y-2">
            <Label>Healthy Volunteers</Label>
            <SearchableSelect
              options={healthyVolunteersOptions}
              value={form.healthy_volunteers[0] || ""}
              onValueChange={(v) => {
                console.log('Healthy Volunteers selected:', v);
                updateField("step5_3", "healthy_volunteers", [v]);
              }}
              placeholder="Select"
              searchPlaceholder="Search..."
              emptyMessage={healthyVolunteersLoading ? "Loading options..." : "No option found."}
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
            value={form.target_no_volunteers || ""}
            onChange={(e) => updateField("step5_3", "target_no_volunteers", e.target.value)}
            className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
          />
        </div>
        <div className="space-y-2">
          <Label>Actual Enrolled Volunteers</Label>
          <Input
            type="number"
            placeholder="e.g., 40"
            value={form.actual_enrolled_volunteers || ""}
            onChange={(e) => updateField("step5_3", "actual_enrolled_volunteers", e.target.value)}
            className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
          />
        </div>
      </div>
    </div>
  );
}
