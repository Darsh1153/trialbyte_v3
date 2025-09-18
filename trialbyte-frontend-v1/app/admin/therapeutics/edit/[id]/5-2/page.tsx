"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import { useEditTherapeuticForm } from "../../context/edit-form-context";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditTherapeuticsStep5_2() {
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
  const form = formData.step5_2;

  const handleSaveStep = async () => {
    try {
      setIsSavingStep(true);
      await saveTrial(params.id as string);
      toast({
        title: "Success",
        description: "Step 5-2 saved successfully!",
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
              <h1 className="text-2xl font-bold text-gray-800">Edit Clinical Trial - Step 5-2</h1>
              <p className="text-gray-600">Trial Purpose & Design</p>
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
              <Link href={`/admin/therapeutics/edit/${params.id}/5-3`}>
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
                step <= 2
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
            <CardTitle className="text-lg font-semibold text-gray-700">Trial Purpose & Design</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Purpose of Trial */}
            <div className="space-y-2">
              <Label>Purpose of Trial</Label>
              <Textarea
                value={form.purpose_of_trial}
                onChange={(e) => updateField("step5_2", "purpose_of_trial", e.target.value)}
                placeholder="Enter the purpose of the trial"
                rows={3}
                className="w-full"
              />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label>Summary</Label>
              <Textarea
                value={form.summary}
                onChange={(e) => updateField("step5_2", "summary", e.target.value)}
                placeholder="Enter trial summary"
                rows={4}
                className="w-full"
              />
            </div>

            {/* Primary Outcome Measures */}
            <div className="space-y-2">
              <Label>Primary Outcome Measures</Label>
              {form.primaryOutcomeMeasures.map((measure, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={measure}
                    onChange={(e) => updateArrayItem("step5_2", "primaryOutcomeMeasures", index, e.target.value)}
                    placeholder="Enter primary outcome measure"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_2", "primaryOutcomeMeasures", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_2", "primaryOutcomeMeasures", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Primary Outcome Measure
              </Button>
            </div>

            {/* Other Outcome Measures */}
            <div className="space-y-2">
              <Label>Other Outcome Measures</Label>
              {form.otherOutcomeMeasures.map((measure, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={measure}
                    onChange={(e) => updateArrayItem("step5_2", "otherOutcomeMeasures", index, e.target.value)}
                    placeholder="Enter other outcome measure"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_2", "otherOutcomeMeasures", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_2", "otherOutcomeMeasures", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Other Outcome Measure
              </Button>
            </div>

            {/* Study Design Keywords */}
            <div className="space-y-2">
              <Label>Study Design Keywords</Label>
              <Input
                value={form.study_design_keywords}
                onChange={(e) => updateField("step5_2", "study_design_keywords", e.target.value)}
                placeholder="Enter study design keywords"
                className="w-full"
              />
            </div>

            {/* Study Design */}
            <div className="space-y-2">
              <Label>Study Design</Label>
              <Textarea
                value={form.study_design}
                onChange={(e) => updateField("step5_2", "study_design", e.target.value)}
                placeholder="Enter study design details"
                rows={3}
                className="w-full"
              />
            </div>

            {/* Treatment Regimen */}
            <div className="space-y-2">
              <Label>Treatment Regimen</Label>
              <Textarea
                value={form.treatment_regimen}
                onChange={(e) => updateField("step5_2", "treatment_regimen", e.target.value)}
                placeholder="Enter treatment regimen details"
                rows={3}
                className="w-full"
              />
            </div>

            {/* Number of Arms */}
            <div className="space-y-2">
              <Label>Number of Arms</Label>
              <Input
                value={form.number_of_arms}
                onChange={(e) => updateField("step5_2", "number_of_arms", e.target.value)}
                placeholder="Enter number of arms"
                type="number"
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
