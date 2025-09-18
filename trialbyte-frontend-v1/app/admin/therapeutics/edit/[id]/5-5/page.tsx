"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import { useEditTherapeuticForm } from "../../context/edit-form-context";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditTherapeuticsStep5_5() {
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
  const form = formData.step5_5;

  const handleSaveStep = async () => {
    try {
      setIsSavingStep(true);
      await saveTrial(params.id as string);
      toast({
        title: "Success",
        description: "Step 5-5 saved successfully!",
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
              <h1 className="text-2xl font-bold text-gray-800">Edit Clinical Trial - Step 5-5</h1>
              <p className="text-gray-600">Study Sites</p>
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
              <Link href={`/admin/therapeutics/edit/${params.id}/5-6`}>
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
                step <= 5
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
            <CardTitle className="text-lg font-semibold text-gray-700">Study Sites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Study Sites */}
            <div className="space-y-2">
              <Label>Study Sites</Label>
              {form.study_sites.map((site, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={site}
                    onChange={(e) => updateArrayItem("step5_5", "study_sites", index, e.target.value)}
                    placeholder="Enter study site"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_5", "study_sites", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_5", "study_sites", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Study Site
              </Button>
            </div>

            {/* Principal Investigators */}
            <div className="space-y-2">
              <Label>Principal Investigators</Label>
              {form.principal_investigators.map((investigator, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={investigator}
                    onChange={(e) => updateArrayItem("step5_5", "principal_investigators", index, e.target.value)}
                    placeholder="Enter principal investigator"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_5", "principal_investigators", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_5", "principal_investigators", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Principal Investigator
              </Button>
            </div>

            {/* Site Status */}
            <div className="space-y-2">
              <Label>Site Status</Label>
              <Input
                value={form.site_status}
                onChange={(e) => updateField("step5_5", "site_status", e.target.value)}
                placeholder="Enter site status"
              />
            </div>

            {/* Site Countries */}
            <div className="space-y-2">
              <Label>Site Countries</Label>
              {form.site_countries.map((country, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={country}
                    onChange={(e) => updateArrayItem("step5_5", "site_countries", index, e.target.value)}
                    placeholder="Enter site country"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_5", "site_countries", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_5", "site_countries", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Site Country
              </Button>
            </div>

            {/* Site Regions */}
            <div className="space-y-2">
              <Label>Site Regions</Label>
              {form.site_regions.map((region, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={region}
                    onChange={(e) => updateArrayItem("step5_5", "site_regions", index, e.target.value)}
                    placeholder="Enter site region"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_5", "site_regions", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_5", "site_regions", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Site Region
              </Button>
            </div>

            {/* Site Contact Info */}
            <div className="space-y-2">
              <Label>Site Contact Information</Label>
              {form.site_contact_info.map((contact, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={contact}
                    onChange={(e) => updateArrayItem("step5_5", "site_contact_info", index, e.target.value)}
                    placeholder="Enter site contact information"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_5", "site_contact_info", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_5", "site_contact_info", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Site Contact
              </Button>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="results_available"
                  checked={form.results_available}
                  onCheckedChange={(checked) => updateField("step5_5", "results_available", checked)}
                />
                <Label htmlFor="results_available">Results Available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="endpoints_met"
                  checked={form.endpoints_met}
                  onCheckedChange={(checked) => updateField("step5_5", "endpoints_met", checked)}
                />
                <Label htmlFor="endpoints_met">Endpoints Met</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="adverse_events_reported"
                  checked={form.adverse_events_reported}
                  onCheckedChange={(checked) => updateField("step5_5", "adverse_events_reported", checked)}
                />
                <Label htmlFor="adverse_events_reported">Adverse Events Reported</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
