"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import NotesSection, { NoteItem } from "@/components/notes-section";
import { useEditTherapeuticForm } from "../../context/edit-form-context";
import FormProgress from "../../components/form-progress";
import { useToast } from "@/hooks/use-toast";
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
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set([0]));

  // Use interim_analysis_dates as notes array, default with one empty string
  const notes = form.interim_analysis_dates && form.interim_analysis_dates.length > 0 ? form.interim_analysis_dates : [""];

  const addNote = () => {
    const updated = [...notes, ""];
    updateField("step5_6", "interim_analysis_dates", updated);
    // Add the new note to expanded state
    setExpandedNotes(prev => new Set([...prev, updated.length - 1]));
  };

  const updateNote = (index: number, value: string) => {
    const updated = [...notes];
    updated[index] = value;
    updateField("step5_6", "interim_analysis_dates", updated);
  };

  const toggleNoteExpansion = (index: number) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
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
      <FormProgress currentStep={6} />

      {/* Header Buttons */}
      <div className="flex justify-end w-full gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/therapeutics")}
            >
          Cancel
            </Button>
            <Button
          className="text-white font-medium px-6 py-2"
          style={{ backgroundColor: "#204B73" }}
          onClick={handleSaveChanges}
              disabled={isSavingStep || isSaving}
        >
          {isSavingStep || isSaving ? "Saving..." : "Save Changes"}
            </Button>
        </div>

      <Card>
          <CardContent className="space-y-6">
          {/* Total No of Sites */}
          <div className="space-y-2 mt-4">
            <Label>Total No of Sites</Label>
                <Input
              type="number"
              value={form.study_start_date || ""}
              onChange={(e) =>
                updateField("step5_6", "study_start_date", e.target.value)
              }
              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800 w-32"
            />
            </div>

          {/* Notes */}
            {/* Notes Section */}
            <NotesSection
              title="Interim Analysis Notes"
              notes={notes.map((note: string, index: number) => ({
                id: `note-${index}`,
                date: new Date().toISOString().split("T")[0],
                type: "Analysis",
                content: note,
                sourceType: "",
                sourceUrl: "",
                attachments: [],
                isVisible: true
              }))}
              onAddNote={() => addNote()}
              onUpdateNote={(index, updatedNote) => {
                updateNote(index, updatedNote.content || "");
              }}
              onRemoveNote={(index) => {
                const updated = notes.filter((_, i) => i !== index);
                updateField("step5_6", "interim_analysis_dates", updated);
              }}
              noteTypes={[
                "Interim",
                "Full Results",
                "Primary Endpoint Results",
                "Analysis"
              ]}
              sourceTypes={[
                "PubMed",
                "Journals",
                "Conferences"
              ]}
            />

          {/* Navigation */}
          <div className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href={`/admin/therapeutics/edit/${params.id}/5-5`}>Previous</Link>
                  </Button>
            <Button asChild className="px-8 bg-[#204B73] text-white">
              <Link href={`/admin/therapeutics/edit/${params.id}/5-7`}>Next</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}