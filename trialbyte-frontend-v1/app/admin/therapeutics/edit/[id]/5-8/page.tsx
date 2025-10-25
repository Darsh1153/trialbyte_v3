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
import { useEditTherapeuticForm } from "../../context/edit-form-context";
import { formatDateTimeToMMDDYYYY } from "@/lib/date-utils";
import FormProgress from "../../components/form-progress";
import { Plus, X, Eye, EyeOff } from "lucide-react";
import NotesSection, { NoteItem } from "@/components/notes-section";
import CustomDateInput from "@/components/ui/custom-date-input";
import TrialChangesLog from "@/components/trial-changes-log";
import { useParams } from "next/navigation";

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
  const form = formData.step5_8;
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const [isSavingStep, setIsSavingStep] = useState(false);

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

  const handleSaveChanges = async () => {
    try {
      setIsSavingStep(true);
      await saveTrial(params.id as string);
      
      toast({
        title: "Success",
        description: "Trial updated successfully",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save trial. Please try again.",
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
      <div className="space-y-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading trial data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FormProgress currentStep={8} />

      {/* Top Buttons */}
      <div className="flex justify-between w-full gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/therapeutics")}
            >
          Cancel
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href={`/admin/therapeutics/edit/${params.id}/5-7`}>Previous</Link>
            </Button>
            <Button
            className="text-white font-medium px-6 py-2"
            style={{ backgroundColor: "#204B73" }}
            onClick={handleSaveChanges}
              disabled={isSavingStep || isSaving}
          >
            {isSavingStep || isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
            className="text-white font-medium px-6 py-2"
            style={{ backgroundColor: "#059669" }}
              onClick={handleFinish}
              disabled={isSavingStep || isSaving}
          >
            {isSavingStep || isSaving ? "Finishing..." : "Finish Editing"}
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
                      ? formatDateTimeToMMDDYYYY(form.creationInfo.createdDate)
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
                      ? formatDateTimeToMMDDYYYY(form.modificationInfo.lastModifiedDate)
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
      <TrialChangesLog changesLog={form.changesLog || []} />

      {/* Review and Notes Section */}
      <Card className="border rounded-xl shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Full Review Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-2">
              <Checkbox id="fullReview" />
              <Label htmlFor="fullReview">Full Review</Label>
            </div>
            <div className="space-y-2">
              <Label>Full Review User</Label>
              <Input placeholder="" className="border-gray-600 focus:border-gray-800 focus:ring-gray-800" />
            </div>
            <div className="space-y-2">
              <Label>Next Review Date</Label>
              <CustomDateInput 
                placeholder="Month Day Year"
                className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              />
            </div>
        </div>

            {/* Notes Section */}
            <NotesSection
              title="Notes & Documentation"
            notes={(form.notes || []).map(note => ({
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
            onAddNote={() => {
              const newNote = {
                id: Date.now().toString(),
                date: new Date().toISOString().split("T")[0],
                type: "General",
                content: "",
                sourceLink: "",
                attachments: [],
                isVisible: true
              };
              addArrayItem("step5_8", "notes", newNote);
            }}
              onUpdateNote={(index, updatedNote) => {
              updateArrayItem("step5_8", "notes", index, updatedNote);
            }}
            onRemoveNote={(index) => removeArrayItem("step5_8", "notes", index)}
            onToggleVisibility={(index) => {
              const currentNote = form.notes[index];
              updateArrayItem("step5_8", "notes", index, { ...currentNote, isVisible: !currentNote.isVisible });
            }}
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