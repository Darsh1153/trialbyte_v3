"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import NotesSection, { NoteItem } from "@/components/notes-section";
import { useEditTherapeuticForm } from "../../context/edit-form-context";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditTherapeuticsStep5_8() {
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
  const form = formData.step5_8;

  const handleSaveStep = async () => {
    try {
      setIsSavingStep(true);
      await saveTrial(params.id as string);
      toast({
        title: "Success",
        description: "Step 5-8 saved successfully!",
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

  const handleFinish = async () => {
    try {
      setIsSavingStep(true);
      await saveTrial(params.id as string);
      toast({
        title: "Success",
        description: "Clinical trial updated successfully!",
      });
      router.push("/admin/therapeutics");
    } catch (error) {
      console.error("Error finishing:", error);
      toast({
        title: "Error",
        description: "Failed to finish editing. Please try again.",
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
              <h1 className="text-2xl font-bold text-gray-800">Edit Clinical Trial - Step 5-8</h1>
              <p className="text-gray-600">Additional Information</p>
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
            <Button
              onClick={handleFinish}
              disabled={isSavingStep || isSaving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSavingStep || isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finishing...
                </>
              ) : (
                "Finish Editing"
              )}
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= 8
                  ? "bg-[#204B73] text-white"
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
            <CardTitle className="text-lg font-semibold text-gray-700">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notes Section */}
            <NotesSection
              title="Notes & Documentation"
              notes={form.notes.map(note => ({
                id: note.id || Date.now().toString(),
                date: note.date || new Date().toISOString().split("T")[0],
                type: note.type || "General",
                content: note.content || "",
                sourceLink: note.sourceLink,
                attachments: note.attachments,
                isVisible: note.isVisible !== false
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

            <div className="space-y-2">
              <Label>Attachments</Label>
              {form.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={attachment}
                    onChange={(e) => updateArrayItem("step5_8", "attachments", index, e.target.value)}
                    placeholder="Enter attachment URL or name"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_8", "attachments", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_8", "attachments", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Attachment
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Regulatory Links</Label>
              {form.regulatory_links.map((link, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={link}
                    onChange={(e) => updateArrayItem("step5_8", "regulatory_links", index, e.target.value)}
                    placeholder="Enter regulatory link"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_8", "regulatory_links", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_8", "regulatory_links", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Regulatory Link
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Publication Links</Label>
              {form.publication_links.map((link, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={link}
                    onChange={(e) => updateArrayItem("step5_8", "publication_links", index, e.target.value)}
                    placeholder="Enter publication link"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_8", "publication_links", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_8", "publication_links", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Publication Link
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Additional Resources</Label>
              {form.additional_resources.map((resource, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={resource}
                    onChange={(e) => updateArrayItem("step5_8", "additional_resources", index, e.target.value)}
                    placeholder="Enter additional resource"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeArrayItem("step5_8", "additional_resources", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => addArrayItem("step5_8", "additional_resources", "")}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Additional Resource
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
