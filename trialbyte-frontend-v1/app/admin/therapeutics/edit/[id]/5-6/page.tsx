"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import { useEditTherapeuticForm } from "../../context/edit-form-context";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditTherapeuticsStep5_6() {
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
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const [isSavingStep, setIsSavingStep] = useState(false);
  const form = formData.step5_6;

  const handleSaveStep = async () => {
    try {
      setIsSavingStep(true);
      await saveTrial(params.id as string);
      toast({
        title: "Success",
        description: "Step 5-6 saved successfully!",
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
              <h1 className="text-2xl font-bold text-gray-800">Edit Clinical Trial - Step 5-6</h1>
              <p className="text-gray-600">Timeline & Milestones</p>
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
              <Link href={`/admin/therapeutics/edit/${params.id}/5-7`}>
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
                step <= 6
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
            <CardTitle className="text-lg font-semibold text-gray-700">Timeline & Milestones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Study Start Date</Label>
                <Input
                  value={form.study_start_date}
                  onChange={(e) => updateField("step5_6", "study_start_date", e.target.value)}
                  placeholder="Enter study start date"
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <Label>Study End Date</Label>
                <Input
                  value={form.study_end_date}
                  onChange={(e) => updateField("step5_6", "study_end_date", e.target.value)}
                  placeholder="Enter study end date"
                  type="date"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Patient In</Label>
                <Input
                  value={form.first_patient_in}
                  onChange={(e) => updateField("step5_6", "first_patient_in", e.target.value)}
                  placeholder="Enter first patient in date"
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <Label>Last Patient In</Label>
                <Input
                  value={form.last_patient_in}
                  onChange={(e) => updateField("step5_6", "last_patient_in", e.target.value)}
                  placeholder="Enter last patient in date"
                  type="date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Interim Analysis Dates</Label>
              {form.interim_analysis_dates.map((date, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={date}
                    onChange={(e) => updateArrayItem("step5_6", "interim_analysis_dates", index, e.target.value)}
                    placeholder="Enter interim analysis date"
                    type="date"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_6", "interim_analysis_dates", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_6", "interim_analysis_dates", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Interim Analysis Date
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Final Analysis Date</Label>
                <Input
                  value={form.final_analysis_date}
                  onChange={(e) => updateField("step5_6", "final_analysis_date", e.target.value)}
                  placeholder="Enter final analysis date"
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <Label>Regulatory Submission Date</Label>
                <Input
                  value={form.regulatory_submission_date}
                  onChange={(e) => updateField("step5_6", "regulatory_submission_date", e.target.value)}
                  placeholder="Enter regulatory submission date"
                  type="date"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
