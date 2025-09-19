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

export default function EditTherapeuticsStep5_7() {
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
  const form = formData.step5_7;

  const handleSaveStep = async () => {
    try {
      setIsSavingStep(true);
      await saveTrial(params.id as string);
      toast({
        title: "Success",
        description: "Step 5-7 saved successfully!",
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
              <h1 className="text-2xl font-bold text-gray-800">Edit Clinical Trial - Step 5-7</h1>
              <p className="text-gray-600">Results & Outcomes</p>
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
              <Link href={`/admin/therapeutics/edit/${params.id}/5-8`}>
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
                step <= 7
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
            <CardTitle className="text-lg font-semibold text-gray-700">Results & Outcomes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Primary Endpoint Results</Label>
              <Textarea
                value={form.primary_endpoint_results}
                onChange={(e) => updateField("step5_7", "primary_endpoint_results", e.target.value)}
                placeholder="Enter primary endpoint results"
                rows={3}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Secondary Endpoint Results</Label>
              {form.secondary_endpoint_results.map((result, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Textarea
                    value={result}
                    onChange={(e) => updateArrayItem("step5_7", "secondary_endpoint_results", index, e.target.value)}
                    placeholder="Enter secondary endpoint result"
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_7", "secondary_endpoint_results", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_7", "secondary_endpoint_results", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Secondary Endpoint Result
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Safety Results</Label>
              <Textarea
                value={form.safety_results}
                onChange={(e) => updateField("step5_7", "safety_results", e.target.value)}
                placeholder="Enter safety results"
                rows={3}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Efficacy Results</Label>
              <Textarea
                value={form.efficacy_results}
                onChange={(e) => updateField("step5_7", "efficacy_results", e.target.value)}
                placeholder="Enter efficacy results"
                rows={3}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Statistical Significance</Label>
              <Input
                value={form.statistical_significance}
                onChange={(e) => updateField("step5_7", "statistical_significance", e.target.value)}
                placeholder="Enter statistical significance"
              />
            </div>

            <div className="space-y-2">
              <Label>Adverse Events</Label>
              {form.adverse_events.map((event, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={event}
                    onChange={(e) => updateArrayItem("step5_7", "adverse_events", index, e.target.value)}
                    placeholder="Enter adverse event"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_7", "adverse_events", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_7", "adverse_events", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Adverse Event
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Conclusion</Label>
              <Textarea
                value={form.conclusion}
                onChange={(e) => updateField("step5_7", "conclusion", e.target.value)}
                placeholder="Enter conclusion"
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
