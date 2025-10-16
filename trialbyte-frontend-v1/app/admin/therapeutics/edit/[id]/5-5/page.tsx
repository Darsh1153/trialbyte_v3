"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Check, ChevronsUpDown, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { useEditTherapeuticForm } from "../../context/edit-form-context";
import FormProgress from "../../components/form-progress";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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
      <FormProgress currentStep={5} />

      {/* Top buttons */}
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

          {/* Trial Results */}
            <div className="space-y-2">
            <Label>Trial Results</Label>
            <div className="space-y-3">
              {(form.site_regions || []).length > 0 ? (
                (form.site_regions || []).map((result, index) => (
                  <div key={index} className="relative">
                    <Textarea
                      rows={3}
                      placeholder="Enter trial results here..."
                      value={result}
                      onChange={(e) => updateArrayItem("step5_5", "site_regions", index, e.target.value)}
                      className="border-gray-600 focus:border-gray-800 focus:ring-gray-800 pr-12"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      {(form.site_regions || []).length > 1 && (
                  <Button
                          type="button"
                    variant="outline"
                          size="icon"
                          className="rounded-full h-8 w-8"
                          onClick={() => removeArrayItem("step5_5", "site_regions", index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={() => addArrayItem("step5_5", "site_regions", "")}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                </div>
                ))
              ) : (
                <div className="relative">
                  <Textarea
                    rows={3}
                    placeholder="Enter trial results here..."
                    value=""
                    onChange={(e) => {
                      // Add the first trial result
                      addArrayItem("step5_5", "site_regions", "");
                      updateArrayItem("step5_5", "site_regions", 0, e.target.value);
                    }}
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800 pr-12"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
              <Button
                      type="button"
                variant="outline"
                      size="icon"
                      className="rounded-full h-8 w-8"
                      onClick={() => addArrayItem("step5_5", "site_regions", "")}
              >
                      <Plus className="h-4 w-4" />
              </Button>
                  </div>
                </div>
              )}
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
          <div className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href={`/admin/therapeutics/edit/${params.id}/5-4`}>Previous</Link>
            </Button>
            <Button asChild>
              <Link href={`/admin/therapeutics/edit/${params.id}/5-6`}>Next</Link>
            </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}