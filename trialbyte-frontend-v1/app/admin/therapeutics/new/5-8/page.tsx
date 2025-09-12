"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import { useToast } from "@/hooks/use-toast";
import FormProgress from "../components/form-progress";

export default function TherapeuticsStep5_8() {
  const { formData, updateField, getFormData } = useTherapeuticForm();
  const form = formData.step5_8;
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  // Helper functions
  const ensureString = (value: any): string => {
    return value ? String(value).trim() : "";
  };

  const ensureNumber = (value: any, defaultValue: number = 0): number => {
    const num = parseInt(String(value));
    return isNaN(num) ? defaultValue : num;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return new Date().toISOString().split("T")[0];
    try {
      return new Date(dateString).toISOString().split("T")[0];
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  };

  // Create trial function
  const createTrial = async () => {
    try {
      setIsCreating(true);
      const allFormData = getFormData();
      
      // Transform the form data to match the API structure
      const therapeuticPayload = {
        user_id: "admin", // Admin user ID
        overview: {
          therapeutic_area: ensureString(allFormData.step5_1.therapeutic_area),
          trial_identifier: allFormData.step5_1.trial_identifier.filter(Boolean),
          trial_phase: ensureString(allFormData.step5_1.trial_phase),
          status: ensureString(allFormData.step5_1.status),
          primary_drugs: ensureString(allFormData.step5_1.primary_drugs),
          other_drugs: ensureString(allFormData.step5_1.other_drugs),
          title: ensureString(allFormData.step5_1.title),
          disease_type: ensureString(allFormData.step5_1.disease_type),
          patient_segment: ensureString(allFormData.step5_1.patient_segment),
          line_of_therapy: ensureString(allFormData.step5_1.line_of_therapy),
          reference_links: allFormData.step5_1.reference_links.filter(Boolean),
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
          start_date_estimated: formatDate(allFormData.step5_6.study_start_date),
          trial_end_date_estimated: formatDate(allFormData.step5_6.study_end_date),
        },
        results: {
          trial_outcome: ensureString(allFormData.step5_5.principal_investigators[0] || "Pending"),
          reference: ensureString(allFormData.step5_5.principal_investigators[1] || ""),
          trial_results: [ensureString(allFormData.step5_5.principal_investigators[0] || "Not yet available")],
          adverse_event_reported: allFormData.step5_5.site_regions.filter(Boolean).length > 0 ? "true" : "false",
        },
        sites: {
          total: ensureNumber(allFormData.step5_5.study_sites.filter(Boolean).length, 1),
          notes: allFormData.step5_5.study_sites.filter(Boolean).join("; ") || "Multiple sites",
        },
        other: {
          data: "Additional trial information from therapeutic form",
        },
        logs: {
          trial_changes_log: "Trial created via therapeutic form",
          trial_added_date: new Date().toISOString().split("T")[0],
        },
        notes: {
          date_type: formatDate(allFormData.step5_8.date_type),
          notes: ensureString(allFormData.step5_8.notes || "Initial trial setup"),
          link: ensureString(allFormData.step5_8.link || ""),
        },
      };

      console.log("Sending therapeutic payload:", therapeuticPayload);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/therapeutic/create-therapeutic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(therapeuticPayload),
        credentials: 'include',
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok) {
        toast({
          title: "Success",
          description: "Therapeutic trial created successfully!",
        });
        router.push("/admin/therapeutics");
      } else {
        console.error("API Error:", result);
        throw new Error(result.message || "Failed to create trial");
      }
    } catch (error) {
      console.error("Error creating trial:", error);
      toast({
        title: "Error",
        description: "Failed to create therapeutic trial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <FormProgress currentStep={8} />

      {/* Top Buttons */}
      <div className="flex justify-between w-full gap-3">
        <Button variant="outline" asChild>
          <Link href="/admin/therapeutics">Cancel</Link>
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/therapeutics/new/5-7">Previous</Link>
          </Button>
          <Button
            className="text-white font-medium px-6 py-2"
            style={{ backgroundColor: "#204B73" }}
            onClick={createTrial}
            disabled={isCreating}
          >
            {isCreating ? "Creating Trial..." : "Finish and Create Trial"}
          </Button>
        </div>
      </div>

      {/* Logs Section */}
      <Card className="border rounded-xl shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label className="font-semibold">Trial Changes Log</Label>
            <Input 
              placeholder="" 
              value={form.date_type}
              onChange={(e) => updateField("step5_8", "date_type", e.target.value)}
              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
            />
          </div>

          {/* Trial Dates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Trial added Date</Label>
              <Input 
                type="date" 
                placeholder="" 
                value={form.notes}
                onChange={(e) => updateField("step5_8", "notes", e.target.value)}
                className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Modified Date</Label>
              <Input 
                type="date" 
                placeholder="" 
                value={form.link}
                onChange={(e) => updateField("step5_8", "link", e.target.value)}
                className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              />
            </div>
            <div className="space-y-2">
              <Label>Last Modified User</Label>
              <Input placeholder="" className="border-gray-600 focus:border-gray-800 focus:ring-gray-800" />
            </div>
          </div>

          {/* Full Review Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-2 mt-6">
              <Checkbox id="fullReview" />
              <Label htmlFor="fullReview">Full Review</Label>
            </div>
            <div className="space-y-2">
              <Label>Full Review User</Label>
              <Input placeholder="" className="border-gray-600 focus:border-gray-800 focus:ring-gray-800" />
            </div>
            <div className="space-y-2">
              <Label>Next Review Date</Label>
              <Input type="date" placeholder="" className="border-gray-600 focus:border-gray-800 focus:ring-gray-800" />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea 
              rows={4} 
              placeholder="" 
              value={form.notes}
              onChange={(e) => updateField("step5_8", "notes", e.target.value)}
              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
