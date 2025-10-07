"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";
import { useToast } from "@/hooks/use-toast";

export default function TherapeuticsStep5_6() {
  const { formData, updateField, saveTrial } = useTherapeuticForm();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
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
      setIsSaving(true);
      const result = await saveTrial();
      
      if (result.success) {
        // Get the first trial identifier for the success message
        const trialId = formData.step5_1.trial_identifier && formData.step5_1.trial_identifier.length > 0 
          ? formData.step5_1.trial_identifier[0] 
          : "Trial";
        
        toast({
          title: "Success",
          description: `${trialId} created successfully`,
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
      <FormProgress currentStep={6} />

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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Notes</Label>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addNote}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>

             <div className="space-y-4">
               {notes.map((note: string, index: number) => (
                 <div
                   key={index}
                   className="border-2 border-gray-600 rounded-lg bg-gray-50"
                 >
                   <div className="flex items-center justify-between p-3 border-b border-gray-300">
                     <span className="text-sm font-medium text-gray-700">
                       Note {index + 1}
                     </span>
                     <Button
                       type="button"
                       variant="ghost"
                       size="icon"
                       onClick={() => toggleNoteExpansion(index)}
                       className="text-gray-600 hover:text-gray-800"
                     >
                       {expandedNotes.has(index) ? (
                         <ChevronUp className="h-4 w-4" />
                       ) : (
                         <ChevronDown className="h-4 w-4" />
                       )}
                     </Button>
                   </div>
                   {expandedNotes.has(index) && (
                     <div className="p-3">
                       <Textarea
                         rows={4}
                         value={note}
                         onChange={(e) => updateNote(index, e.target.value)}
                         placeholder="Enter locations and contacts related information..."
                         className="border-gray-600 focus:border-gray-800 focus:ring-gray-800 bg-white"
                       />
                     </div>
                   )}
                 </div>
               ))}
             </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end">
            <Button asChild className="px-8 bg-[#204B73] text-white">
              <Link href="/admin/therapeutics/new/5-7">Next</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
