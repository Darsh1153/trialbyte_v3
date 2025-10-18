"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ChevronDown, ChevronUp, X } from "lucide-react";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";
import { useToast } from "@/hooks/use-toast";

export default function TherapeuticsStep5_6() {
  const { formData, updateField, addArrayItem, removeArrayItem, saveTrial } = useTherapeuticForm();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const form = formData.step5_6;
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const result = await saveTrial();
      
      if (result.success) {
        // Get the first trial identifier for the success message
        // Use the generated trial identifier from the response
        const trialId = result.trialIdentifier || "Trial";
        
        toast({
          title: "Success",
          description: `A trial with ID of ${trialId} is created`,
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

          {/* Simple Notes Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Notes</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem("step5_6", "notes")}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Note
              </Button>
            </div>

            <div className="space-y-3">
              {form.notes.map((note, index) => (
                <div key={index} className="relative">
                  <Textarea
                    rows={3}
                    placeholder="Enter note here..."
                    value={note}
                    onChange={(e) => updateField("step5_6", "notes", form.notes.map((n, i) => i === index ? e.target.value : n))}
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800 pr-12"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {form.notes.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => removeArrayItem("step5_6", "notes", index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="rounded-full h-8 w-8"
                      onClick={() => addArrayItem("step5_6", "notes")}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
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
