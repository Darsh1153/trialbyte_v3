"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useEditTherapeuticForm } from "../../context/edit-form-context";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditTherapeuticsStep5_4() {
  const {
    formData,
    updateField,
    saveTrial,
    isLoading,
    isSaving,
  } = useEditTherapeuticForm();
  const { toast } = useToast();
  const params = useParams();
  const router = useRouter();
  const [isSavingStep, setIsSavingStep] = useState(false);
  const form = formData.step5_4;

  const handleSaveStep = async () => {
    try {
      setIsSavingStep(true);
      await saveTrial(params.id as string);
      toast({
        title: "Success",
        description: "Step 5-4 saved successfully!",
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
              <h1 className="text-2xl font-bold text-gray-800">Edit Clinical Trial - Step 5-4</h1>
              <p className="text-gray-600">Patient Population</p>
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
              <Link href={`/admin/therapeutics/edit/${params.id}/5-5`}>
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
                step <= 4
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
            <CardTitle className="text-lg font-semibold text-gray-700">Patient Population</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Estimated Enrollment</Label>
                <Input
                  value={form.estimated_enrollment}
                  onChange={(e) => updateField("step5_4", "estimated_enrollment", e.target.value)}
                  placeholder="Enter estimated enrollment"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label>Actual Enrollment</Label>
                <Input
                  value={form.actual_enrollment}
                  onChange={(e) => updateField("step5_4", "actual_enrollment", e.target.value)}
                  placeholder="Enter actual enrollment"
                  type="number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Enrollment Status</Label>
              <Input
                value={form.enrollment_status}
                onChange={(e) => updateField("step5_4", "enrollment_status", e.target.value)}
                placeholder="Enter enrollment status"
              />
            </div>

            <div className="space-y-2">
              <Label>Recruitment Period</Label>
              <Input
                value={form.recruitment_period}
                onChange={(e) => updateField("step5_4", "recruitment_period", e.target.value)}
                placeholder="Enter recruitment period"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Study Completion Date</Label>
                <Input
                  value={form.study_completion_date}
                  onChange={(e) => updateField("step5_4", "study_completion_date", e.target.value)}
                  placeholder="Enter study completion date"
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <Label>Primary Completion Date</Label>
                <Input
                  value={form.primary_completion_date}
                  onChange={(e) => updateField("step5_4", "primary_completion_date", e.target.value)}
                  placeholder="Enter primary completion date"
                  type="date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Population Description</Label>
              <Textarea
                value={form.population_description}
                onChange={(e) => updateField("step5_4", "population_description", e.target.value)}
                placeholder="Enter population description"
                rows={4}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
