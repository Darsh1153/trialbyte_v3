"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Plus, X, Check, ChevronsUpDown } from "lucide-react";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useDynamicDropdown } from "@/hooks/use-dynamic-dropdown";

export default function TherapeuticsStep5_2() {
  const {
    formData,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
    saveTrial,
  } = useTherapeuticForm();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const form = formData.step5_2;

  // Study Design Keywords options - fetch from database with fallback
  const { options: studyDesignKeywordsOptions } = useDynamicDropdown({
    categoryName: 'study_design_keywords',
    fallbackOptions: [
      { value: "placebo_control", label: "Placebo-control" },
      { value: "active_control", label: "Active control" },
      { value: "randomized", label: "Randomized" },
      { value: "non_randomized", label: "Non-Randomized" },
      { value: "multiple_blinded", label: "Multiple-Blinded" },
      { value: "single_blinded", label: "Single-Blinded" },
      { value: "open", label: "Open" },
      { value: "multi_centre", label: "Multi-centre" },
      { value: "safety", label: "Safety" },
      { value: "efficacy", label: "Efficacy" },
      { value: "tolerability", label: "Tolerability" },
      { value: "pharmacokinetics", label: "Pharmacokinetics" },
      { value: "pharmacodynamics", label: "Pharmacodynamics" },
      { value: "interventional", label: "Interventional" },
      { value: "treatment", label: "Treatment" },
      { value: "parallel_assignment", label: "Parallel Assignment" },
      { value: "single_group_assignment", label: "Single group assignment" },
      { value: "prospective", label: "Prospective" },
      { value: "cohort", label: "Cohort" },
    ]
  });

  const studyDesignKeywords = studyDesignKeywordsOptions.map(opt => opt.label);

  const addPrimaryOutcome = () =>
    addArrayItem("step5_2", "primaryOutcomeMeasures");
  const updatePrimaryOutcome = (index: number, value: string) =>
    updateArrayItem("step5_2", "primaryOutcomeMeasures", index, value);
  const removePrimaryOutcome = (index: number) =>
    removeArrayItem("step5_2", "primaryOutcomeMeasures", index);

  const addOtherOutcome = () => addArrayItem("step5_2", "otherOutcomeMeasures");
  const updateOtherOutcome = (index: number, value: string) =>
    updateArrayItem("step5_2", "otherOutcomeMeasures", index, value);
  const removeOtherOutcome = (index: number) =>
    removeArrayItem("step5_2", "otherOutcomeMeasures", index);

  // Handle study design keyword selection
  const handleKeywordToggle = (keyword: string) => {
    const currentKeywords = form.study_design_keywords || [];
    const isSelected = currentKeywords.includes(keyword);
    
    if (isSelected) {
      // Remove keyword
      const updatedKeywords = currentKeywords.filter(k => k !== keyword);
      updateField("step5_2", "study_design_keywords", updatedKeywords);
    } else {
      // Add keyword
      const updatedKeywords = [...currentKeywords, keyword];
      updateField("step5_2", "study_design_keywords", updatedKeywords);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const result = await saveTrial();
      
      if (result.success) {
        // Always use the auto-generated trial_id (TB-000XXX format)
        const trialId = result.trialId || "Trial";
        
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
    <div className="min-h-screen bg-gray-50">
      <FormProgress currentStep={2} />

      <div className="bg-white shadow-sm rounded-b-lg">
        <div className="flex items-center justify-between p-4 border-b">
          {/* Action Buttons */}
          <div className="flex justify-end w-full gap-3">
            <Button 
              variant="outline"
              asChild
            >
              <Link href="/admin/therapeutics">Cancel</Link>
            </Button>
            <Button 
              className="text-white font-medium px-6 py-2"
              style={{ backgroundColor: '#204B73' }}
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? "Creating..." : "Create a Record"}
            </Button>
          </div>
        </div>

        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">{/* Content container with fixed height */}

          <Card>
            <CardContent className="space-y-6">
              {/* Purpose of Trial */}
              <div className="space-y-2">
                <Label>Purpose of Trial</Label>
                <Textarea
                  value={form.purpose_of_trial}
                  onChange={(e) =>
                    updateField("step5_2", "purpose_of_trial", e.target.value)
                  }
                  placeholder="Describe the primary purpose of this clinical trial..."
                  rows={3}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>

              {/* Summary */}
              <div className="space-y-2">
                <Label>Summary</Label>
                <Textarea
                  value={form.summary}
                  onChange={(e) =>
                    updateField("step5_2", "summary", e.target.value)
                  }
                  placeholder="Provide a brief summary of the trial..."
                  rows={4}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>

              {/* Primary Outcome Measures */}
              <div className="space-y-2">
                <Label>Primary Outcome Measures</Label>
                <div className="space-y-2">
                  {form.primaryOutcomeMeasures.map((measure, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Textarea
                        value={measure}
                        onChange={(e) => updatePrimaryOutcome(idx, e.target.value)}
                        placeholder="e.g., Overall Survival, Progression-Free Survival"
                        rows={2}
                        className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                      />
                      {idx === 0 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addPrimaryOutcome}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removePrimaryOutcome(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Outcome Measures */}
              <div className="space-y-2">
                <Label>Other Outcome Measures</Label>
                <div className="space-y-2">
                  {form.otherOutcomeMeasures.map((measure, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Textarea
                        value={measure}
                        onChange={(e) => updateOtherOutcome(idx, e.target.value)}
                        placeholder="e.g., Quality of Life, Safety Measures"
                        rows={2}
                        className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                      />
                      {idx === 0 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addOtherOutcome}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeOtherOutcome(idx)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Design Keywords and Study Design - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Study Design Keywords</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                      >
                        {form.study_design_keywords && form.study_design_keywords.length > 0
                          ? `${form.study_design_keywords.length} keyword(s) selected`
                          : "Select keywords..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search keywords..." />
                        <CommandList>
                          <CommandEmpty>No keywords found.</CommandEmpty>
                          <CommandGroup>
                            {studyDesignKeywords.map((keyword) => (
                              <CommandItem
                                key={keyword}
                                value={keyword}
                                onSelect={() => handleKeywordToggle(keyword)}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  checked={(form.study_design_keywords || []).includes(keyword)}
                                  className="border-gray-600 data-[state=checked]:bg-gray-800 data-[state=checked]:border-gray-800"
                                />
                                <span>{keyword}</span>
                                <Check
                                  className={`ml-auto h-4 w-4 ${
                                    (form.study_design_keywords || []).includes(keyword)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {form.study_design_keywords && form.study_design_keywords.length > 0 && (
                    <div className="text-sm text-gray-600 mt-2">
                      Selected: {form.study_design_keywords.join(", ")}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Study Design</Label>
                  <Textarea
                    value={form.study_design}
                    onChange={(e) =>
                      updateField("step5_2", "study_design", e.target.value)
                    }
                    placeholder="Describe the study design in detail..."
                    rows={8}
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                </div>
              </div>

              {/* Treatment Regimen */}
              <div className="space-y-2">
                <Label>Treatment Regimen</Label>
                <Textarea
                  value={form.treatment_regimen}
                  onChange={(e) =>
                    updateField("step5_2", "treatment_regimen", e.target.value)
                  }
                  placeholder="Describe the treatment regimen..."
                  rows={3}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>

              {/* Number of Arms */}
              <div className="space-y-2">
                <Label>Number of Arms</Label>
                <Input
                  type="number"
                  value={form.number_of_arms}
                  onChange={(e) =>
                    updateField("step5_2", "number_of_arms", e.target.value)
                  }
                  placeholder="e.g., 2"
                  min="1"
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800 w-32"
                />
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" asChild>
                  <Link href="/admin/therapeutics/new/5-1">Previous</Link>
                </Button>
                <Button asChild>
                  <Link href="/admin/therapeutics/new/5-3">Next</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>{/* Close content container */}
      </div>{/* Close main container */}
    </div>
  );
}


