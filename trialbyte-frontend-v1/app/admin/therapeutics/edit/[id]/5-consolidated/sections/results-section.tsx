"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Plus, X, Check, ChevronsUpDown, Eye, EyeOff } from "lucide-react";
import CustomDateInput from "@/components/ui/custom-date-input";
import { useEditTherapeuticForm } from "../../../context/edit-form-context";
import { useDynamicDropdown } from "@/hooks/use-dynamic-dropdown";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ResultsSection() {
  const {
    formData,
    updateField,
    addSiteNote,
    updateSiteNote,
    removeSiteNote,
    toggleSiteNoteVisibility,
  } = useEditTherapeuticForm();
  const form = formData.step5_5;
  
  // Debug logging for form data
  console.log('🔍 Results Section - Form Data:', {
    trial_outcome: form?.trial_outcome,
    trial_outcome_reference_date: form?.trial_outcome_reference_date,
    trial_outcome_link: form?.trial_outcome_link,
    trial_outcome_content: form?.trial_outcome_content,
    adverse_event_type: form?.adverse_event_type,
    adverse_event_reported: form?.adverse_event_reported,
    site_notes: form?.site_notes?.map((note: any) => ({
      noteType: note.noteType,
      sourceType: note.sourceType,
      viewSource: note.viewSource,
    })),
  });
  
  const [openOutcome, setOpenOutcome] = useState(false);
  const [openAdverseReported, setOpenAdverseReported] = useState(false);
  const [openAdverseType, setOpenAdverseType] = useState(false);

  console.log("📋 ResultsSection - Current form data:", form);
  console.log("🎯 Key dropdown values:", {
    trial_outcome: form.trial_outcome,
    trial_outcome_reference_date: form.trial_outcome_reference_date,
    trial_outcome_link: form.trial_outcome_link,
    adverse_event_reported: form.adverse_event_reported,
    adverse_event_type: form.adverse_event_type,
    site_notes_count: form.site_notes?.length,
  });

  // Trial Outcome options - fetch from database with fallback
  const { options: trialOutcomeOptions } = useDynamicDropdown({
    categoryName: 'trial_outcome',
    fallbackOptions: [
      { value: "completed_primary_endpoints_met", label: "Completed – Primary endpoints met." },
      { value: "completed_primary_endpoints_not_met", label: "Completed – Primary endpoints not met." },
      { value: "completed_outcome_unknown", label: "Completed – Outcome unknown" },
      { value: "completed_outcome_indeterminate", label: "Completed – Outcome indeterminate" },
      { value: "terminated_safety_adverse_effects", label: "Terminated – Safety/adverse effects" },
      { value: "terminated_lack_of_efficacy", label: "Terminated – Lack of efficacy" },
      { value: "terminated_insufficient_enrolment", label: "Terminated – Insufficient enrolment" },
      { value: "terminated_business_drug_strategy_shift", label: "Terminated – Business Decision, Drug strategy shift" },
      { value: "terminated_business_pipeline_reprioritization", label: "Terminated - Business Decision, Pipeline Reprioritization" },
      { value: "terminated_business_other", label: "Terminated - Business Decision, Other" },
      { value: "terminated_lack_of_funding", label: "Terminated – Lack of funding" },
      { value: "terminated_planned_but_never_initiated", label: "Terminated – Planned but never initiated" },
      { value: "terminated_other", label: "Terminated – Other" },
      { value: "terminated_unknown", label: "Terminated – Unknown" },
    ]
  });

  const outcomes = trialOutcomeOptions.map(opt => opt.label);
  const adverseReported = ["Yes", "No"];
  const adverseTypes = ["Mild", "Moderate", "Severe"];

  // Helper function to map trial outcome value to label
  const getTrialOutcomeLabel = (value: string): string => {
    if (!value) return "";
    const option = trialOutcomeOptions.find(opt => opt.value === value || opt.label === value);
    return option ? option.label : value;
  };

  // Helper function to get trial outcome value from label
  const getTrialOutcomeValue = (label: string): string => {
    if (!label) return "";
    const option = trialOutcomeOptions.find(opt => opt.label === label || opt.value === label);
    return option ? option.value : label;
  };

  // Result Type options - fetch from database with fallback
  const { options: resultTypeOptions } = useDynamicDropdown({
    categoryName: 'result_type',
    fallbackOptions: [
      { value: "interim", label: "Interim" },
      { value: "full_results", label: "Full Results" },
      { value: "primary_endpoint_results", label: "Primary Endpoint Results" },
      { value: "analysis", label: "Analysis" },
    ]
  });

  // Helper function to map result type value to label
  const getResultTypeLabel = (value: string): string => {
    if (!value) return "";
    const option = resultTypeOptions.find(opt => opt.value === value || opt.label === value);
    return option ? option.label : value;
  };

  // Helper function to get result type value from label
  const getResultTypeValue = (label: string): string => {
    if (!label) return "";
    const option = resultTypeOptions.find(opt => opt.label === label || opt.value === label);
    return option ? option.value : label;
  };

  const resultTypes = resultTypeOptions.map(opt => opt.label);

  // Source type options
  const sourceTypes = [
    "PubMed",
    "Journals",
    "Conferences"
  ];

  // Helper functions for site notes
  const handleAddSiteNote = () => addSiteNote("step5_5", "site_notes");
  const handleRemoveSiteNote = (index: number) => removeSiteNote("step5_5", "site_notes", index);
  const handleUpdateSiteNote = (index: number, field: string, value: any) => {
    console.log(`Updating site note ${index}, field: ${field}, value:`, value);
    updateSiteNote("step5_5", "site_notes", index, { [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <Label>Results Available</Label>
          <Switch
            checked={form.results_available || false}
            onCheckedChange={(val) => updateField("step5_5", "results_available", val)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label>Endpoints met</Label>
          <Switch
            checked={form.endpoints_met || false}
            onCheckedChange={(val) => updateField("step5_5", "endpoints_met", val)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label>Adverse Events Reported</Label>
          <Switch
            checked={form.adverse_events_reported || false}
            onCheckedChange={(val) => updateField("step5_5", "adverse_events_reported", val)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Trial Outcome</Label>
          <Popover open={openOutcome} onOpenChange={setOpenOutcome}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              >
                {getTrialOutcomeLabel(form.trial_outcome || "") || "Select outcome"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search outcome..." />
                <CommandEmpty>No outcome found.</CommandEmpty>
                <CommandGroup>
                  {outcomes.map((outcome) => (
                    <CommandItem
                      key={outcome}
                      value={outcome}
                      onSelect={() => {
                        const value = getTrialOutcomeValue(outcome);
                        updateField("step5_5", "trial_outcome", value);
                        setOpenOutcome(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          getTrialOutcomeLabel(form.trial_outcome || "") === outcome ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {outcome}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2 border rounded-md p-2">
          <Label>Trial Outcome Reference</Label>
          <CustomDateInput
            value={form.trial_outcome_reference_date || ""}
            onChange={(value) => updateField("step5_5", "trial_outcome_reference_date", value)}
            placeholder="Select date"
            className="w-full border-gray-600 focus:border-gray-800 focus:ring-gray-800"
          />
          
          {/* Trial Outcome Results Content */}
          <div className="space-y-2">
            <Label>Trial Outcome Results Content</Label>
            <Textarea
              rows={3}
              placeholder="Enter trial outcome results content here..."
              value={form.trial_outcome_content || ""}
              onChange={(e) => updateField("step5_5", "trial_outcome_content", e.target.value)}
              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
            />
          </div>
          
          <div className="flex gap-2 mt-2">
            <div className="flex items-center gap-2 flex-1">
              <Label className="whitespace-nowrap">Link</Label>
              <Input
                type="url"
                placeholder="Enter link"
                value={form.trial_outcome_link || ""}
                onChange={(e) => updateField("step5_5", "trial_outcome_link", e.target.value)}
                className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              />
              <Button type="button" variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <Label className="whitespace-nowrap">Attachments</Label>
              <Input
                type="file"
                onChange={(e) => updateField("step5_5", "trial_outcome_attachment", e.target.files?.[0])}
                className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              />
              <Button type="button" variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Site Notes / Results Notes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Results Notes</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSiteNote}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Note
          </Button>
        </div>

        <div className="space-y-4">
          {(form.site_notes || []).map((note: any, index: number) => (
            <Card key={note.id} className={`border border-gray-200 ${!note.isVisible ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
              <CardContent className="p-6 space-y-4">
                {/* Site Note Header */}
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Note #{index + 1}</h4>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSiteNoteVisibility("step5_5", "site_notes", index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {note.isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    {(form.site_notes || []).length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSiteNote(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Site Note Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor={`site-note-date-${index}`}>Date</Label>
                    <CustomDateInput
                      value={note.date || ""}
                      onChange={(value) => handleUpdateSiteNote(index, "date", value)}
                      placeholder="Select date"
                      className="w-full"
                    />
                  </div>

                  {/* Note Type */}
                  <div className="space-y-2">
                    <Label htmlFor={`site-note-type-${index}`}>Result type</Label>
                    <Select
                      value={getResultTypeLabel(note.noteType || "")}
                      onValueChange={(label) => {
                        const value = getResultTypeValue(label);
                        handleUpdateSiteNote(index, "noteType", value);
                      }}
                    >
                      <SelectTrigger className="border-gray-600 focus:border-gray-800 focus:ring-gray-800">
                        <SelectValue placeholder="Select result type" />
                      </SelectTrigger>
                      <SelectContent>
                        {resultTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor={`site-note-content-${index}`}>Content</Label>
                  <Textarea
                    rows={3}
                    placeholder="Enter result note content..."
                    value={note.content || ""}
                    onChange={(e) => handleUpdateSiteNote(index, "content", e.target.value)}
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                </div>

                {/* View Source */}
                <div className="space-y-2">
                  <Label htmlFor={`site-note-source-${index}`}>Source</Label>
                  <Select
                    value={note.sourceType || ""}
                    onValueChange={(value) => handleUpdateSiteNote(index, "sourceType", value)}
                  >
                    <SelectTrigger className="border-gray-600 focus:border-gray-800 focus:ring-gray-800">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceTypes.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <Label htmlFor={`site-note-attachments-${index}`}>Attachments</Label>
                  <Input
                    type="file"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        const fileNames = Array.from(e.target.files).map(file => file.name);
                        const currentAttachments = note.attachments || [];
                        handleUpdateSiteNote(index, "attachments", [...currentAttachments, ...fileNames]);
                      }
                    }}
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                  {note.attachments && note.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {note.attachments.map((attachment: string, attachIndex: number) => (
                        <span
                          key={attachIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                        >
                          {attachment}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Adverse Event */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Adverse Event Reported */}
        <div className="space-y-2">
          <Label>Adverse Event Reported</Label>
          <Popover open={openAdverseReported} onOpenChange={setOpenAdverseReported}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              >
                {form.adverse_event_reported || "Select option"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search option..." />
                <CommandEmpty>No option found.</CommandEmpty>
                <CommandGroup>
                  {adverseReported.map((opt) => (
                    <CommandItem
                      key={opt}
                      value={opt}
                      onSelect={() => {
                        updateField("step5_5", "adverse_event_reported", opt);
                        setOpenAdverseReported(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          form.adverse_event_reported === opt ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {opt}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Adverse Event Type */}
        <div className="space-y-2">
          <Label>Adverse Event Type</Label>
          <Popover open={openAdverseType} onOpenChange={setOpenAdverseType}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              >
                {form.adverse_event_type || "Select type"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search type..." />
                <CommandEmpty>No type found.</CommandEmpty>
                <CommandGroup>
                  {adverseTypes.map((type) => (
                    <CommandItem
                      key={type}
                      value={type}
                      onSelect={() => {
                        updateField("step5_5", "adverse_event_type", type);
                        setOpenAdverseType(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          form.adverse_event_type === type ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {type}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Treatment For Adverse Events */}
      <div className="space-y-2">
        <Label>Treatment For Adverse Events</Label>
        <Textarea
          rows={3}
          placeholder="Describe treatments for adverse events..."
          value={form.treatment_for_adverse_events || ""}
          onChange={(e) => updateField("step5_5", "treatment_for_adverse_events", e.target.value)}
          className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
        />
      </div>
    </div>
  );
}
