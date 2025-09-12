"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { Plus, X } from "lucide-react";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";

export default function TherapeuticsStep5_7() {
  const { formData, addArrayItem, removeArrayItem, updateArrayItem } =
    useTherapeuticForm();
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
        >
          Save Changes
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
              {(form[activeTab as keyof typeof form] as string[]).map(
                (item: string, idx: number) => (
                  <div key={idx} className="space-y-2">
                    {/* Pipeline Data */}
                    {activeTab === "pipeline_data" && (
                      <div className="flex gap-2">
                        <div className="w-1/4">
                          <Label className="text-sm">Pipeline Date</Label>
                          <Input
                            type="date"
                            value={item}
                            onChange={(e) =>
                              updateArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                e.target.value
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
                            value={item}
                            onChange={(e) =>
                              updateArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                e.target.value
                              )
                            }
                            className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                          />
                        </div>
                      </div>
                    )}

                    {/* Press Releases */}
                    {activeTab === "press_releases" && (
                      <div className="flex gap-2">
                        <div className="w-1/4">
                          <Label className="text-sm">Press Release Date</Label>
                          <Input
                            type="date"
                            value={item}
                            onChange={(e) =>
                              updateArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                e.target.value
                              )
                            }
                            className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-sm">
                            Press Release Content
                          </Label>
                          <Textarea
                            rows={3}
                            placeholder="Enter press release content..."
                            value={item}
                            onChange={(e) =>
                              updateArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* Publications */}
                    {activeTab === "publications" && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="w-1/2">
                            <Label className="text-sm">Publication Type</Label>
                            <SearchableSelect
                              options={publicationTypeOptions}
                              value={item}
                              onValueChange={(value) =>
                                updateArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  value
                                )
                              }
                              placeholder="Select publication type"
                              searchPlaceholder="Search publication type..."
                              emptyMessage="No publication type found."
                              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            />
                          </div>
                          <div className="w-1/4">
                            <Label className="text-sm">Date</Label>
                            <Input
                              type="date"
                              value={item}
                              onChange={(e) =>
                                updateArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm">
                            Publication Content
                          </Label>
                          <Textarea
                            rows={3}
                            placeholder="Enter publication content..."
                            value={item}
                            onChange={(e) =>
                              updateArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* Trial Registries */}
                    {activeTab === "trial_registries" && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="w-1/2">
                            <Label className="text-sm">Registry Name</Label>
                            <SearchableSelect
                              options={registryNameOptions}
                              value={item}
                              onValueChange={(value) =>
                                updateArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  value
                                )
                              }
                              placeholder="Select registry name"
                              searchPlaceholder="Search registry..."
                              emptyMessage="No registry found."
                              className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            />
                          </div>
                          <div className="w-1/4">
                            <Label className="text-sm">
                              Last Updated Date
                            </Label>
                            <Input
                              type="date"
                              value={item}
                              onChange={(e) =>
                                updateArrayItem(
                                  "step5_7",
                                  activeTab,
                                  idx,
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm">
                            Registry Information
                          </Label>
                          <Textarea
                            rows={3}
                            placeholder="Enter trial registry information..."
                            value={item}
                            onChange={(e) =>
                              updateArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* Associated Studies */}
                    {activeTab === "associated_studies" && (
                      <div className="flex gap-2">
                        <div className="w-1/4">
                          <Label className="text-sm">Study Type</Label>
                          <SearchableSelect
                            options={studyTypeOptions}
                            value={item}
                            onValueChange={(value) =>
                              updateArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                value
                              )
                            }
                            placeholder="Select study type"
                            searchPlaceholder="Search study type..."
                            emptyMessage="No study type found."
                            className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                          />
                        </div>
                        <div className="flex-1">
                          <Label className="text-sm">Study Information</Label>
                          <Textarea
                            rows={3}
                            placeholder="Enter associated study information..."
                            value={item}
                            onChange={(e) =>
                              updateArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2">
                      {idx === 0 ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => addArrayItem("step5_7", activeTab)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() =>
                            removeArrayItem("step5_7", activeTab, idx)
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
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
