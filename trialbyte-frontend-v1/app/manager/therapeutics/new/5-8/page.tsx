"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import { useRouter } from "next/navigation";
import FormProgress from "../components/form-progress";

export default function TherapeuticsStep5_8() {
  const router = useRouter();
  const { formData, updateField, resetForm } = useTherapeuticForm();
  const [loading, setLoading] = useState(false);
  const form = formData.step5_8;

  const finish = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        toast({
          title: "Error",
          description: "User ID not found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      console.log("Creating therapeutic trial...");

      // Helper function to validate and format dates
      const formatDate = (dateValue: string): string => {
        if (!dateValue || dateValue.trim() === "") {
          return new Date().toISOString().split("T")[0]; // Default to today
        }

        // Check if it's already in YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
          return dateValue;
        }

        // Try to parse and format the date
        const parsedDate = new Date(dateValue);
        if (isNaN(parsedDate.getTime())) {
          return new Date().toISOString().split("T")[0]; // Default to today if invalid
        }

        return parsedDate.toISOString().split("T")[0];
      };

      // Helper function to ensure string values
      const ensureString = (value: any): string => {
        if (value === null || value === undefined) return "";
        return String(value).trim();
      };

      // Helper function to ensure number values
      const ensureNumber = (value: any, defaultValue: number = 0): number => {
        if (value === null || value === undefined || value === "")
          return defaultValue;
        const num = Number(value);
        return isNaN(num) ? defaultValue : num;
      };

      // Prepare the payload in the exact format specified
      const therapeuticPayload = {
        user_id: userId,
        overview: {
          therapeutic_area: ensureString(formData.step5_1.therapeutic_area),
          trial_identifier: formData.step5_1.trial_identifier.filter(Boolean),
          trial_phase: ensureString(formData.step5_1.trial_phase),
          status: ensureString(formData.step5_1.status),
          primary_drugs: ensureString(formData.step5_1.primary_drugs),
          other_drugs: ensureString(formData.step5_1.other_drugs),
          title: ensureString(formData.step5_1.title),
          disease_type: ensureString(formData.step5_1.disease_type),
          patient_segment: ensureString(formData.step5_1.patient_segment),
          line_of_therapy: ensureString(formData.step5_1.line_of_therapy),
          reference_links: formData.step5_1.reference_links.filter(Boolean),
          trial_tags: ensureString(formData.step5_1.trial_tags),
          sponsor_collaborators: ensureString(
            formData.step5_1.sponsor_collaborators
          ),
          sponsor_field_activity: ensureString(
            formData.step5_1.sponsor_field_activity
          ),
          associated_cro: ensureString(formData.step5_1.associated_cro),
          countries: ensureString(formData.step5_1.countries),
          region: ensureString(formData.step5_1.region),
          trial_record_status: ensureString(
            formData.step5_1.trial_record_status
          ),
        },
        outcome: {
          purpose_of_trial: ensureString(formData.step5_2.purpose_of_trial),
          summary: ensureString(formData.step5_2.summary),
          primary_outcome_measure:
            formData.step5_2.primaryOutcomeMeasures
              .filter(Boolean)
              .join(", ") || "",
          other_outcome_measure:
            formData.step5_2.otherOutcomeMeasures.filter(Boolean).join(", ") ||
            "",
          study_design_keywords: ensureString(
            formData.step5_2.study_design_keywords
          ),
          study_design: ensureString(formData.step5_2.study_design),
          treatment_regimen: ensureString(formData.step5_2.treatment_regimen),
          number_of_arms: ensureNumber(formData.step5_2.number_of_arms, 1),
        },
        criteria: {
          inclusion_criteria:
            formData.step5_3.inclusion_criteria.filter(Boolean).join("; ") ||
            "",
          exclusion_criteria:
            formData.step5_3.exclusion_criteria.filter(Boolean).join("; ") ||
            "",
          age_from: ensureString(formData.step5_3.age_min || "18"),
          age_to: ensureString(formData.step5_3.age_max || "75"),
          sex: ensureString(formData.step5_3.gender || "All"),
          subject_type: "Patients",
          healthy_volunteers: "false",
          target_no_volunteers: 100,
          actual_enrolled_volunteers: 0,
        },
        timing: {
          start_date_estimated: formatDate(formData.step5_4.recruitment_period),
          trial_end_date_estimated: formatDate(
            formData.step5_4.study_completion_date
          ),
        },
        results: {
          trial_outcome: ensureString(
            formData.step5_7.primary_endpoint_results || "Pending"
          ),
          reference: ensureString(formData.step5_7.conclusion || ""),
          trial_results: [
            ensureString(
              formData.step5_7.primary_endpoint_results || "Not yet available"
            ),
          ],
          adverse_event_reported:
            formData.step5_7.adverse_events.filter(Boolean).length > 0
              ? "true"
              : "false",
        },
        sites: {
          total: ensureNumber(
            formData.step5_5.study_sites.filter(Boolean).length,
            1
          ),
          notes:
            formData.step5_5.study_sites.filter(Boolean).join("; ") ||
            "Multiple sites",
        },
        other: {
          data: "Additional trial information from therapeutic form",
        },
        logs: {
          trial_changes_log: "Trial created via therapeutic form",
          trial_added_date: new Date().toISOString().split("T")[0],
        },
        notes: {
          date_type: formatDate(formData.step5_8.date_type),
          notes: ensureString(formData.step5_8.notes || "Initial trial setup"),
          link: ensureString(formData.step5_8.link || ""),
        },
      };

      console.log("Sending therapeutic payload:", therapeuticPayload);

      // Send to the new API endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/therapeutic/create-therapeutic`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(therapeuticPayload),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();
      console.log("Therapeutic trial created successfully:", result);

      toast({
        title: "Success!",
        description: "Therapeutic trial created successfully",
      });

      // Reset form and redirect
      resetForm();
      router.push("/admin/therapeutics");
    } catch (error) {
      console.error("Error creating therapeutic trial:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create therapeutic trial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FormProgress currentStep={8} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">5.8 — Notes & Documentation</h1>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link href="/admin/therapeutics/new/5-7">Previous</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Notes & Documentation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Type */}
          <div className="space-y-2">
            <Label>Date Type</Label>
            <Input
              type="date"
              value={form.date_type}
              onChange={(e) =>
                updateField("step5_8", "date_type", e.target.value)
              }
              placeholder="Select a date"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => updateField("step5_8", "notes", e.target.value)}
              placeholder="Add any additional notes or documentation..."
              rows={4}
            />
          </div>

          {/* Link */}
          <div className="space-y-2">
            <Label>Link</Label>
            <Input
              value={form.link}
              onChange={(e) => updateField("step5_8", "link", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href="/admin/therapeutics/new/5-7">Previous</Link>
            </Button>
            <Button
              onClick={finish}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Creating..." : "Finish & Create Trial"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
