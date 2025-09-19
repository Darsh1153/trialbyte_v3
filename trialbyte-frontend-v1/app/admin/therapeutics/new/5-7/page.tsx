"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { Plus, X, Eye, EyeOff, Upload, Link as LinkIcon } from "lucide-react";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function TherapeuticsStep5_7() {
  const { 
    formData, 
    addArrayItem, 
    removeArrayItem, 
    updateArrayItem, 
    addComplexArrayItem,
    updateComplexArrayItem,
    toggleArrayItemVisibility,
    saveTrial 
  } = useTherapeuticForm();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const form = formData.step5_7;

  const [activeTab, setActiveTab] = useState("pipeline_data");

  // Dropdown options
  const publicationTypeOptions: SearchableSelectOption[] = [
    { value: "company_presentation", label: "Company Presentation" },
    { value: "sec_filing", label: "SEC Filing" },
    { value: "company_conference_report", label: "Company Conference Report" },
    { value: "revenue_reports", label: "Revenue Reports" },
    { value: "others", label: "Others" },
  ];

  const registryNameOptions: SearchableSelectOption[] = [
    { value: "euctr", label: "EUCTR" },
    { value: "ctri", label: "CTRI" },
    { value: "anzctr", label: "ANZCTR" },
    { value: "slctr", label: "SLCTR" },
    { value: "chictr", label: "ChiCTR" },
    { value: "chinese_fda", label: "Chinese FDA" },
    { value: "canadian_cancer_trials", label: "Canadian Cancer Trials" },
    { value: "health_canada", label: "Health Canada" },
    { value: "brazil_ctr", label: "Brazil CTR" },
    { value: "german_ctr", label: "German CTR" },
    { value: "cuban_ctr", label: "Cuban CTR" },
    { value: "iran_ctr", label: "Iran CTR" },
    { value: "lebanon_ctr", label: "Lebanon CTR" },
    { value: "pactr", label: "PACTR" },
    { value: "umin", label: "UMIN" },
  ];

  const studyTypeOptions: SearchableSelectOption[] = [
    { value: "follow_up_study", label: "Follow up Study" },
    { value: "observational_study", label: "Observational study" },
    { value: "other_study", label: "Other Study" },
  ];

  const tabs = [
    { key: "pipeline_data", label: "Pipeline Data" },
    { key: "press_releases", label: "Press Releases" },
    { key: "publications", label: "Publications" },
    { key: "trial_registries", label: "Trial Registries" },
    { key: "associated_studies", label: "Associated Studies" },
  ];

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const result = await saveTrial();
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
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
      <FormProgress currentStep={7} />

      {/* Top Buttons */}
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
          {/* Tab Navigation */}
          <div className="flex gap-2 border-b pb-2">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                type="button"
                variant={activeTab === tab.key ? "default" : "outline"}
                className={`text-sm px-4 py-2 ${
                  activeTab === tab.key
                    ? "bg-[#204B73] text-white hover:bg-[#204B73]/90"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Active Tab Content */}
          <div className="space-y-2">
            <Label className="text-base font-medium">
              {tabs.find((t) => t.key === activeTab)?.label}
            </Label>

            <div className="space-y-4">
              {(form[activeTab as keyof typeof form] as any[]).map(
                (item: any, idx: number) => (
                  <div key={item.id || idx} className={`space-y-2 p-4 border rounded-lg ${!item.isVisible ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
                    {/* Pipeline Data */}
                    {activeTab === "pipeline_data" && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="w-1/4">
                            <Label className="text-sm">Pipeline Date</Label>
                            <Input
                              type="date"
                              value={item.date || ""}
                              onChange={(e) =>
                                updateComplexArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  { date: e.target.value }
                                )
                              }
                              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm">Pipeline Information</Label>
                            <Textarea
                              rows={3}
                              placeholder="Enter pipeline information..."
                              value={item.information || ""}
                              onChange={(e) =>
                                updateComplexArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  { information: e.target.value }
                                )
                              }
                              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-1/2">
                            <Label className="text-sm">URL</Label>
                            <div className="relative">
                              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="https://..."
                                value={item.url || ""}
                                onChange={(e) =>
                                  updateComplexArrayItem(
                                    "step5_7",
                                    activeTab,
                                    idx,
                                    { url: e.target.value }
                                  )
                                }
                                className="pl-10 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                              />
                            </div>
                          </div>
                          <div className="w-1/2">
                            <Label className="text-sm">Upload File</Label>
                            <div className="relative">
                              <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    updateComplexArrayItem(
                                      "step5_7",
                                      activeTab,
                                      idx,
                                      { file: file.name }
                                    );
                                  }
                                }}
                                className="pl-10 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Press Releases */}
                    {activeTab === "press_releases" && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="w-1/4">
                            <Label className="text-sm">Press Release Date</Label>
                            <Input
                              type="date"
                              value={item.date || ""}
                              onChange={(e) =>
                                updateComplexArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  { date: e.target.value }
                                )
                              }
                              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            />
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm">Press Release Title</Label>
                            <Input
                              placeholder="Enter press release title..."
                              value={item.title || ""}
                              onChange={(e) =>
                                updateComplexArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  { title: e.target.value }
                                )
                              }
                              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-1/2">
                            <Label className="text-sm">URL</Label>
                            <div className="relative">
                              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="https://..."
                                value={item.url || ""}
                                onChange={(e) =>
                                  updateComplexArrayItem(
                                    "step5_7",
                                    activeTab,
                                    idx,
                                    { url: e.target.value }
                                  )
                                }
                                className="pl-10 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                              />
                            </div>
                          </div>
                          <div className="w-1/2">
                            <Label className="text-sm">Upload File</Label>
                            <div className="relative">
                              <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    updateComplexArrayItem(
                                      "step5_7",
                                      activeTab,
                                      idx,
                                      { file: file.name }
                                    );
                                  }
                                }}
                                className="pl-10 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Publications */}
                    {activeTab === "publications" && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="w-1/2">
                            <Label className="text-sm">Publication Type</Label>
                            <SearchableSelect
                              options={publicationTypeOptions}
                              value={item.type || ""}
                              onValueChange={(value) =>
                                updateComplexArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  { type: value }
                                )
                              }
                              placeholder="Select publication type"
                              searchPlaceholder="Search publication type..."
                              emptyMessage="No publication type found."
                              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            />
                          </div>
                          <div className="w-1/2">
                            <Label className="text-sm">Publication Title</Label>
                            <Input
                              placeholder="Enter publication title..."
                              value={item.title || ""}
                              onChange={(e) =>
                                updateComplexArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  { title: e.target.value }
                                )
                              }
                              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-1/2">
                            <Label className="text-sm">URL</Label>
                            <div className="relative">
                              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="https://..."
                                value={item.url || ""}
                                onChange={(e) =>
                                  updateComplexArrayItem(
                                    "step5_7",
                                    activeTab,
                                    idx,
                                    { url: e.target.value }
                                  )
                                }
                                className="pl-10 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                              />
                            </div>
                          </div>
                          <div className="w-1/2">
                            <Label className="text-sm">Upload File</Label>
                            <div className="relative">
                              <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    updateComplexArrayItem(
                                      "step5_7",
                                      activeTab,
                                      idx,
                                      { file: file.name }
                                    );
                                  }
                                }}
                                className="pl-10 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Trial Registries */}
                    {activeTab === "trial_registries" && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="w-1/2">
                            <Label className="text-sm">Registry Name</Label>
                            <SearchableSelect
                              options={registryNameOptions}
                              value={item.registry || ""}
                              onValueChange={(value) =>
                                updateComplexArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  { registry: value }
                                )
                              }
                              placeholder="Select registry name"
                              searchPlaceholder="Search registry..."
                              emptyMessage="No registry found."
                              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            />
                          </div>
                          <div className="w-1/2">
                            <Label className="text-sm">Registry Identifier</Label>
                            <Input
                              placeholder="Enter registry identifier..."
                              value={item.identifier || ""}
                              onChange={(e) =>
                                updateComplexArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  { identifier: e.target.value }
                                )
                              }
                              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-1/2">
                            <Label className="text-sm">URL</Label>
                            <div className="relative">
                              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="https://..."
                                value={item.url || ""}
                                onChange={(e) =>
                                  updateComplexArrayItem(
                                    "step5_7",
                                    activeTab,
                                    idx,
                                    { url: e.target.value }
                                  )
                                }
                                className="pl-10 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                              />
                            </div>
                          </div>
                          <div className="w-1/2">
                            <Label className="text-sm">Upload File</Label>
                            <div className="relative">
                              <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    updateComplexArrayItem(
                                      "step5_7",
                                      activeTab,
                                      idx,
                                      { file: file.name }
                                    );
                                  }
                                }}
                                className="pl-10 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Associated Studies */}
                    {activeTab === "associated_studies" && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <div className="w-1/2">
                            <Label className="text-sm">Study Type</Label>
                            <SearchableSelect
                              options={studyTypeOptions}
                              value={item.type || ""}
                              onValueChange={(value) =>
                                updateComplexArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  { type: value }
                                )
                              }
                              placeholder="Select study type"
                              searchPlaceholder="Search study type..."
                              emptyMessage="No study type found."
                              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            />
                          </div>
                          <div className="w-1/2">
                            <Label className="text-sm">Study Title</Label>
                            <Input
                              placeholder="Enter study title..."
                              value={item.title || ""}
                              onChange={(e) =>
                                updateComplexArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  { title: e.target.value }
                                )
                              }
                              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-1/2">
                            <Label className="text-sm">URL</Label>
                            <div className="relative">
                              <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="https://..."
                                value={item.url || ""}
                                onChange={(e) =>
                                  updateComplexArrayItem(
                                    "step5_7",
                                    activeTab,
                                    idx,
                                    { url: e.target.value }
                                  )
                                }
                                className="pl-10 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                              />
                            </div>
                          </div>
                          <div className="w-1/2">
                            <Label className="text-sm">Upload File</Label>
                            <div className="relative">
                              <Upload className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    updateComplexArrayItem(
                                      "step5_7",
                                      activeTab,
                                      idx,
                                      { file: file.name }
                                    );
                                  }
                                }}
                                className="pl-10 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => toggleArrayItemVisibility("step5_7", activeTab, idx)}
                          className={item.isVisible ? "text-green-600 hover:text-green-700 hover:bg-green-50" : "text-gray-600 hover:text-gray-700 hover:bg-gray-50"}
                        >
                          {item.isVisible ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                          {item.isVisible ? "Visible" : "Hidden"}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        {idx === 0 ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const templates = {
                                pipeline_data: { date: "", information: "", url: "", file: "", isVisible: true },
                                press_releases: { date: "", title: "", url: "", file: "", isVisible: true },
                                publications: { type: "", title: "", url: "", file: "", isVisible: true },
                                trial_registries: { registry: "", identifier: "", url: "", file: "", isVisible: true },
                                associated_studies: { type: "", title: "", url: "", file: "", isVisible: true },
                              };
                              addComplexArrayItem("step5_7", activeTab, templates[activeTab as keyof typeof templates]);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem("step5_7", activeTab, idx)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/therapeutics/new/5-8">Next</Link>
        </Button>
      </div>
    </div>
  );
}
