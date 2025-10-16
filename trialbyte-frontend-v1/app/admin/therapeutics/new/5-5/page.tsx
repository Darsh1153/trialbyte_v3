"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Check, ChevronsUpDown, X, Eye, EyeOff, Calendar } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { cn } from "@/lib/utils";
import CustomDateInput from "@/components/ui/custom-date-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TherapeuticsStep5_5() {
  const { 
    formData, 
    updateField, 
    addArrayItem, 
    removeArrayItem, 
    updateArrayItem, 
    addSiteNote,
    updateSiteNote,
    removeSiteNote,
    toggleSiteNoteVisibility,
    saveTrial 
  } = useTherapeuticForm();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const form = formData.step5_5;

  // Local state for searchable dropdowns
  const [openOutcome, setOpenOutcome] = useState(false);
  const [openAdverseReported, setOpenAdverseReported] = useState(false);
  const [openAdverseType, setOpenAdverseType] = useState(false);

  const outcomes = [
    "Completed – Primary endpoints met.",
    "Completed – Primary endpoints not met.",
    "Completed – Outcome unknown",
    "Completed – Outcome indeterminate",
    "Terminated – Safety/adverse effects",
    "Terminated – Lack of efficacy",
    "Terminated – Insufficient enrolment",
    "Terminated – Business Decision, Drug strategy shift",
    "Terminated - Business Decision, Pipeline Reprioritization",
    "Terminated - Business Decision, Other",
    "Terminated – Lack of funding",
    "Terminated – Planned but never initiated",
    "Terminated – Other",
    "Terminated – Unknown"
  ];
  const adverseReported = ["Yes", "No"];
  const adverseTypes = ["Mild", "Moderate", "Severe"];
  
  // Site note type options
  const siteNoteTypes = [
    "Interim",
    "Full Results",
    "Primary Endpoint Results",
    "Analysis"
  ];

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
    updateSiteNote("step5_5", "site_notes", index, { [field]: value });
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
      <FormProgress currentStep={5} />

      {/* Top buttons */}
      <div className="flex justify-end w-full gap-3">
        <Button variant="outline" asChild>
          <Link href="/admin/therapeutics">Cancel</Link>
        </Button>
        <Button
          className="text-white font-medium px-6 py-2"
          style={{ backgroundColor: "#204B73" }}
          onClick={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-6">
          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Label>Results Available</Label>
              <Switch
                checked={form.results_available || false}
                onCheckedChange={(val) =>
                  updateField("step5_5", "results_available", val)
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Label>Endpoints met</Label>
              <Switch
                checked={form.endpoints_met || false}
                onCheckedChange={(val) =>
                  updateField("step5_5", "endpoints_met", val)
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Label>Adverse Events Reported</Label>
              <Switch
                checked={form.adverse_events_reported || false}
                onCheckedChange={(val) =>
                  updateField("step5_5", "adverse_events_reported", val)
                }
              />
            </div>
          </div>

          {/* Trial Outcome + Reference */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Trial Outcome */}
            <div className="space-y-2">
              <Label>Trial Outcome</Label>
              <Popover open={openOutcome} onOpenChange={setOpenOutcome}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  >
                    {form.study_sites[0] || "Select outcome"}
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
                            updateField("step5_5", "study_sites", [outcome]);
                            setOpenOutcome(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              form.study_sites[0] === outcome ? "opacity-100" : "opacity-0"
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

            {/* Trial Outcome Reference */}
            <div className="space-y-2 border rounded-md p-2">
              <Label>Trial Outcome Reference</Label>
              <Input
                type="date"
                value={form.principal_investigators[0] || ""}
                onChange={(e) =>
                  updateField("step5_5", "principal_investigators", [e.target.value])
                }
                className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              />
              
              {/* Trial Outcome Results Content */}
              <div className="space-y-2">
                <Label>Trial Outcome Results Content</Label>
                <Textarea
                  rows={3}
                  placeholder="Enter trial outcome results content here..."
                  value={form.trial_outcome_content || ""}
                  onChange={(e) =>
                    updateField("step5_5", "trial_outcome_content", e.target.value)
                  }
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              
              <div className="flex gap-2 mt-2">
                <div className="flex items-center gap-2 flex-1">
                  <Label className="whitespace-nowrap">Link</Label>
                  <Input
                    type="url"
                    placeholder="Enter link"
                    value={form.site_countries[0] || ""}
                    onChange={(e) =>
                      updateField("step5_5", "site_countries", [e.target.value])
                    }
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
                    onChange={(e) =>
                      updateField("step5_5", "trial_outcome_attachment", e.target.files?.[0])
                    }
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Site Notes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
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
              {form.site_notes.map((note, index) => (
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
                        {form.site_notes.length > 1 && (
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
                          value={note.date}
                          onChange={(value) => handleUpdateSiteNote(index, "date", value)}
                          placeholder="Select date"
                          className="w-full"
                        />
                      </div>

                      {/* Note Type */}
                      <div className="space-y-2">
                        <Label htmlFor={`site-note-type-${index}`}>Result type</Label>
                        <Select
                          value={note.noteType}
                          onValueChange={(value) => handleUpdateSiteNote(index, "noteType", value)}
                        >
                          <SelectTrigger className="border-gray-600 focus:border-gray-800 focus:ring-gray-800">
                            <SelectValue placeholder="Select note type" />
                          </SelectTrigger>
                          <SelectContent>
                            {siteNoteTypes.map((type) => (
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
                        placeholder="Enter site note content..."
                        value={note.content}
                        onChange={(e) => handleUpdateSiteNote(index, "content", e.target.value)}
                        className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                      />
                    </div>

                    {/* View Source */}
                    <div className="space-y-2">
                      <Label htmlFor={`site-note-source-${index}`}>Source</Label>
                      <Select
                        value={note.sourceType}
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
                          {note.attachments.map((attachment, attachIndex) => (
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
                    {form.site_contact_info[0] || "Select option"}
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
                            updateField("step5_5", "site_contact_info", [opt]);
                            setOpenAdverseReported(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              form.site_contact_info[0] === opt ? "opacity-100" : "opacity-0"
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
                    {form.site_contact_info[1] || "Select type"}
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
                            const current = form.site_contact_info || [""];
                            const updated = [...current];
                            updated[1] = type;
                            updateField("step5_5", "site_contact_info", updated);
                            setOpenAdverseType(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              form.site_contact_info[1] === type ? "opacity-100" : "opacity-0"
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
              value={form.site_contact_info[2] || ""}
              onChange={(e) => {
                const current = form.site_contact_info || [""];
                const updated = [...current];
                updated[2] = e.target.value;
                updateField("step5_5", "site_contact_info", updated);
              }}
              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-end">
            <Button asChild>
              <Link href="/admin/therapeutics/new/5-6">Next</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
