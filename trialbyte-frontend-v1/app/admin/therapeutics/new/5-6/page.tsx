"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";

export default function TherapeuticsStep5_6() {
  const { formData, updateField } = useTherapeuticForm();
  const form = formData.step5_6;

  // Use interim_analysis_dates as notes array, default with one empty string
  const notes = form.interim_analysis_dates && form.interim_analysis_dates.length > 0 ? form.interim_analysis_dates : [""];

  const addNote = () => {
    const updated = [...notes, ""];
    updateField("step5_6", "interim_analysis_dates", updated);
  };

  const updateNote = (index: number, value: string) => {
    const updated = [...notes];
    updated[index] = value;
    updateField("step5_6", "interim_analysis_dates", updated);
  };

  const removeNote = (index: number) => {
    const updated = notes.filter((_: string, i: number) => i !== index);
    // Always keep at least one note box
    updateField("step5_6", "interim_analysis_dates", updated.length > 0 ? updated : [""]);
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
              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
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
                   className="relative border-2 border-gray-600 rounded-lg p-3 bg-gray-50"
                 >
                   <Textarea
                     rows={4}
                     value={note}
                     onChange={(e) => updateNote(index, e.target.value)}
                     placeholder="Enter locations and contacts related information..."
                     className="border-gray-600 focus:border-gray-800 focus:ring-gray-800 bg-white"
                   />
                   {notes.length > 1 && (
                     <Button
                       type="button"
                       variant="ghost"
                       size="icon"
                       className="absolute right-2 top-2 text-red-500"
                       onClick={() => removeNote(index)}
                     >
                       <Trash2 className="h-5 w-5" />
                     </Button>
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
