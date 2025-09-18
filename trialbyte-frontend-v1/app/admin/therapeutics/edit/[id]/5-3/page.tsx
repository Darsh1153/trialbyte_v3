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

export default function EditTherapeuticsStep5_3() {
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
  const form = formData.step5_3;

  const handleSaveStep = async () => {
    try {
      setIsSavingStep(true);
      await saveTrial(params.id as string);
      toast({
        title: "Success",
        description: "Step 5-3 saved successfully!",
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
              <h1 className="text-2xl font-bold text-gray-800">Edit Clinical Trial - Step 5-3</h1>
              <p className="text-gray-600">Eligibility Criteria</p>
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
              <Link href={`/admin/therapeutics/edit/${params.id}/5-4`}>
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
                step <= 3
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
            <CardTitle className="text-lg font-semibold text-gray-700">Eligibility Criteria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Inclusion Criteria */}
            <div className="space-y-2">
              <Label>Inclusion Criteria</Label>
              {form.inclusion_criteria.map((criteria, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Textarea
                    value={criteria}
                    onChange={(e) => updateArrayItem("step5_3", "inclusion_criteria", index, e.target.value)}
                    placeholder="Enter inclusion criteria"
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_3", "inclusion_criteria", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_3", "inclusion_criteria", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Inclusion Criteria
              </Button>
            </div>

            {/* Exclusion Criteria */}
            <div className="space-y-2">
              <Label>Exclusion Criteria</Label>
              {form.exclusion_criteria.map((criteria, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Textarea
                    value={criteria}
                    onChange={(e) => updateArrayItem("step5_3", "exclusion_criteria", index, e.target.value)}
                    placeholder="Enter exclusion criteria"
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_3", "exclusion_criteria", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_3", "exclusion_criteria", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Exclusion Criteria
              </Button>
            </div>

            {/* Age Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Age</Label>
                <Input
                  value={form.age_min}
                  onChange={(e) => updateField("step5_3", "age_min", e.target.value)}
                  placeholder="Enter minimum age"
                  type="number"
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Age</Label>
                <Input
                  value={form.age_max}
                  onChange={(e) => updateField("step5_3", "age_max", e.target.value)}
                  placeholder="Enter maximum age"
                  type="number"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender</Label>
              <Input
                value={form.gender}
                onChange={(e) => updateField("step5_3", "gender", e.target.value)}
                placeholder="Enter gender requirements"
              />
            </div>

            {/* ECOG Performance Status */}
            <div className="space-y-2">
              <Label>ECOG Performance Status</Label>
              <Input
                value={form.ecog_performance_status}
                onChange={(e) => updateField("step5_3", "ecog_performance_status", e.target.value)}
                placeholder="Enter ECOG performance status"
              />
            </div>

            {/* Prior Treatments */}
            <div className="space-y-2">
              <Label>Prior Treatments</Label>
              {form.prior_treatments.map((treatment, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={treatment}
                    onChange={(e) => updateArrayItem("step5_3", "prior_treatments", index, e.target.value)}
                    placeholder="Enter prior treatment"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_3", "prior_treatments", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_3", "prior_treatments", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Prior Treatment
              </Button>
            </div>

            {/* Biomarker Requirements */}
            <div className="space-y-2">
              <Label>Biomarker Requirements</Label>
              {form.biomarker_requirements.map((biomarker, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={biomarker}
                    onChange={(e) => updateArrayItem("step5_3", "biomarker_requirements", index, e.target.value)}
                    placeholder="Enter biomarker requirement"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_3", "biomarker_requirements", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_3", "biomarker_requirements", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Biomarker Requirement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
