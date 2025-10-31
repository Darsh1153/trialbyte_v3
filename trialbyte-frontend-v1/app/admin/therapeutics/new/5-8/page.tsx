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
import { Plus, X, Eye, EyeOff } from "lucide-react";
import NotesSection, { NoteItem } from "@/components/notes-section";
import CustomDateInput from "@/components/ui/custom-date-input";
import TrialChangesLog from "@/components/trial-changes-log";

export default function TherapeuticsStep5_8() {
  const { 
    formData, 
    updateField, 
    getFormData, 
    saveTrial,
    addNote,
    updateNote,
    removeNote,
    toggleNoteVisibility
  } = useTherapeuticForm();
  const form = formData.step5_8;
  const router = useRouter();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Full Review states
  const [fullReviewChecked, setFullReviewChecked] = useState(false);
  const [fullReviewUser, setFullReviewUser] = useState("");
  const [nextReviewDate, setNextReviewDate] = useState("");

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
  
  // Calculate date + 90 days
  const calculateNextReviewDate = (): string => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 90);
    return futureDate.toISOString().split("T")[0];
  };
  
  // Handle Full Review checkbox change
  const handleFullReviewChange = (checked: boolean) => {
    setFullReviewChecked(checked);
    if (checked) {
      // Auto-populate fields when checked
      setFullReviewUser("admin");
      setNextReviewDate(calculateNextReviewDate());
    } else {
      // Clear fields when unchecked
      setFullReviewUser("");
      setNextReviewDate("");
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
          last_modified_date: new Date().toISOString(),
          last_modified_user: "admin",
          full_review_user: fullReviewUser || null,
          next_review_date: nextReviewDate ? formatDate(nextReviewDate) : null,
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
        // Always use the auto-generated trial_id (TB-000XXX format)
        const trialId = result.trial_id || "Trial";
        toast({
          title: "Success",
          description: `A trial with ID of ${trialId} is created`,
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

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const result = await saveTrial();
      
      if (result.success) {
        // Always use the auto-generated trial_id (TB-000XXX format)
        const trialId = result.trialId || "Trial";
        
        toast({
          title: "Success",
          description: `A trial with ID of ${trialId} is created`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save trial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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

      {/* Trial Creation & Modification Info */}
      <Card className="border rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Creation Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700">Trial Creation</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Created Date:</span>
                  <span className="text-gray-600">
                    {form.creationInfo?.createdDate 
                      ? new Date(form.creationInfo.createdDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Not available'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Created User:</span>
                  <span className="text-gray-600">{form.creationInfo?.createdUser || 'admin'}</span>
                </div>
              </div>
            </div>

            {/* Modification Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-700">Last Modification</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Last Modified Date:</span>
                  <span className="text-gray-600">
                    {form.modificationInfo?.lastModifiedDate 
                      ? new Date(form.modificationInfo.lastModifiedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Not available'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Last Modified User:</span>
                  <span className="text-gray-600">{form.modificationInfo?.lastModifiedUser || 'admin'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Total Modifications:</span>
                  <span className="text-gray-600">{form.modificationInfo?.modificationCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trial Changes Log */}
      <TrialChangesLog changesLog={form.changesLog} />

      {/* Internal Note Section */}
      <Card className="border rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="internalNote" className="text-sm font-medium">Internal Note</Label>
              <Textarea
                id="internalNote"
                rows={4}
                placeholder="Enter internal notes here..."
                value={form.internalNote || ""}
                onChange={(e) => updateField("step5_8", "internalNote", e.target.value)}
                className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review and Notes Section */}
      <Card className="border rounded-xl shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Full Review Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="fullReview" 
                checked={fullReviewChecked}
                onCheckedChange={handleFullReviewChange}
              />
              <Label htmlFor="fullReview">Full Review</Label>
            </div>
            <div className="space-y-2">
              <Label>Full Review User</Label>
              <Input 
                placeholder="User name" 
                value={fullReviewUser}
                onChange={(e) => setFullReviewUser(e.target.value)}
                readOnly={fullReviewChecked}
                className={`border-gray-600 focus:border-gray-800 focus:ring-gray-800 ${fullReviewChecked ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Next Review Date</Label>
              <CustomDateInput 
                placeholder="Month Day Year"
                value={nextReviewDate}
                onChange={(value) => setNextReviewDate(value)}
                readOnly={fullReviewChecked}
                className={`border-gray-600 focus:border-gray-800 focus:ring-gray-800 ${fullReviewChecked ? 'bg-gray-50' : ''}`}
              />
            </div>
          </div>

          {/* Notes Section */}
          <NotesSection
            title="Notes & Documentation"
            notes={form.notes.map(note => ({
              id: note.id,
              date: note.date,
              type: note.type || "General",
              content: note.content,
              sourceLink: note.sourceLink,
              sourceType: note.sourceType,
              sourceUrl: note.sourceUrl,
              attachments: note.attachments || [],
              isVisible: note.isVisible
            }))}
            onAddNote={() => addNote("step5_8", "notes")}
            onUpdateNote={(index, updatedNote) => {
              updateNote("step5_8", "notes", index, updatedNote);
            }}
            onRemoveNote={(index) => removeNote("step5_8", "notes", index)}
            onToggleVisibility={(index) => toggleNoteVisibility("step5_8", "notes", index)}
            noteTypes={[
              "General",
              "Clinical",
              "Regulatory", 
              "Safety",
              "Efficacy",
              "Protocol",
              "Site",
              "Patient",
              "Adverse Event",
              "Publication",
              "Press Release",
              "Other"
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
