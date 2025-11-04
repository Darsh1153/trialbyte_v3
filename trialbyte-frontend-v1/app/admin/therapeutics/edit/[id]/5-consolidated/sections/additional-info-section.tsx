"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { Plus, X, Eye, EyeOff, Upload, Link as LinkIcon, Image, FileText } from "lucide-react";
import { useEditTherapeuticForm } from "../../../context/edit-form-context";
import { useToast } from "@/hooks/use-toast";
import { UploadButton } from "@/lib/uploadthing";

export default function AdditionalInfoSection() {
  const { 
    formData, 
    updateComplexArrayItem,
    addComplexArrayItem,
    removeArrayItem, 
    toggleArrayItemVisibility,
  } = useEditTherapeuticForm();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pipeline_data");
  const form = formData.step5_7;

  console.log("📋 AdditionalInfoSection (Edit) - Current form data:", form);
  console.log("🎯 Active tab:", activeTab, "Items:", ((form as any)[activeTab] || []).length);

  // Dropdown options - matching old page exactly
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

  const currentItems = (form as any)[activeTab] || [];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b pb-2 overflow-x-auto">
        {tabs.map((tab) => (
          <Button
            key={tab.key}
            type="button"
            variant={activeTab === tab.key ? "default" : "outline"}
            className={`text-sm px-4 py-2 whitespace-nowrap ${
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

      {/* Section Header */}
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">
          {tabs.find((t) => t.key === activeTab)?.label}
        </Label>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {currentItems.length > 0 ? (
          currentItems.map((item: any, idx: number) => (
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
                      <div className="mt-1">
                        <UploadButton
                          endpoint="therapeuticFileUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              // Update the file field with the uploaded file name
                              updateComplexArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                { file: res[0].name }
                              );
                              // Update the URL field with the uploaded file URL
                              updateComplexArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                { url: res[0].url }
                              );
                              toast({
                                title: "Success",
                                description: "File uploaded successfully!",
                              });
                            }
                          }}
                          onUploadError={(error: Error) => {
                            console.error("UploadThing error:", error);
                            console.error("Error details:", {
                              name: error.name,
                              message: error.message,
                              stack: error.stack,
                              cause: (error as any).cause
                            });
                            toast({
                              title: "Error",
                              description: `Upload failed: ${error.message}`,
                              variant: "destructive",
                            });
                          }}
                          appearance={{
                            button: "ut-ready:bg-[#204B73] ut-uploading:cursor-not-allowed rounded-md bg-[#204B73] px-4 py-2 text-sm font-medium text-white hover:bg-[#204B73]/90",
                            allowedContent: "hidden",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Display uploaded file with preview */}
                  {item.file && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded border">
                      {item.file.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ? (
                        <Image className="h-4 w-4 text-blue-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-600" />
                      )}
                      <span className="flex-1">{item.file}</span>
                      {item.url && item.file.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            window.open(item.url, '_blank');
                          }}
                          className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                        >
                          Preview
                        </Button>
                      )}
                    </div>
                  )}
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
                  <div className="w-full">
                    <Label className="text-sm">Description</Label>
                    <Textarea
                      rows={3}
                      placeholder="Enter press release description..."
                      value={item.description || ""}
                      onChange={(e) =>
                        updateComplexArrayItem(
                          "step5_7",
                          activeTab,
                          idx,
                          { description: e.target.value }
                        )
                      }
                      className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                    />
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
                      <div className="mt-1">
                        <UploadButton
                          endpoint="therapeuticFileUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              updateComplexArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                { file: res[0].name }
                              );
                              updateComplexArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                { url: res[0].url }
                              );
                              toast({
                                title: "Success",
                                description: "File uploaded successfully!",
                              });
                            }
                          }}
                          onUploadError={(error: Error) => {
                            console.error("UploadThing error:", error);
                            console.error("Error details:", {
                              name: error.name,
                              message: error.message,
                              stack: error.stack,
                              cause: (error as any).cause
                            });
                            toast({
                              title: "Error",
                              description: `Upload failed: ${error.message}`,
                              variant: "destructive",
                            });
                          }}
                          appearance={{
                            button: "ut-ready:bg-[#204B73] ut-uploading:cursor-not-allowed rounded-md bg-[#204B73] px-4 py-2 text-sm font-medium text-white hover:bg-[#204B73]/90",
                            allowedContent: "hidden",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Display uploaded file with preview */}
                  {item.file && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded border">
                      {item.file.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ? (
                        <Image className="h-4 w-4 text-blue-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-600" />
                      )}
                      <span className="flex-1">{item.file}</span>
                      {item.url && item.file.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            window.open(item.url, '_blank');
                          }}
                          className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                        >
                          Preview
                        </Button>
                      )}
                    </div>
                  )}
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
                  <div className="w-full">
                    <Label className="text-sm">Description</Label>
                    <Textarea
                      rows={3}
                      placeholder="Enter publication description..."
                      value={item.description || ""}
                      onChange={(e) =>
                        updateComplexArrayItem(
                          "step5_7",
                          activeTab,
                          idx,
                          { description: e.target.value }
                        )
                      }
                      className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                    />
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
                      <div className="mt-1">
                        <UploadButton
                          endpoint="therapeuticFileUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              updateComplexArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                { file: res[0].name }
                              );
                              updateComplexArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                { url: res[0].url }
                              );
                              toast({
                                title: "Success",
                                description: "File uploaded successfully!",
                              });
                            }
                          }}
                          onUploadError={(error: Error) => {
                            console.error("UploadThing error:", error);
                            console.error("Error details:", {
                              name: error.name,
                              message: error.message,
                              stack: error.stack,
                              cause: (error as any).cause
                            });
                            toast({
                              title: "Error",
                              description: `Upload failed: ${error.message}`,
                              variant: "destructive",
                            });
                          }}
                          appearance={{
                            button: "ut-ready:bg-[#204B73] ut-uploading:cursor-not-allowed rounded-md bg-[#204B73] px-4 py-2 text-sm font-medium text-white hover:bg-[#204B73]/90",
                            allowedContent: "hidden",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Display uploaded file with preview */}
                  {item.file && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded border">
                      {item.file.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ? (
                        <Image className="h-4 w-4 text-blue-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-600" />
                      )}
                      <span className="flex-1">{item.file}</span>
                      {item.url && item.file.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            window.open(item.url, '_blank');
                          }}
                          className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                        >
                          Preview
                        </Button>
                      )}
                    </div>
                  )}
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
                  <div className="w-full">
                    <Label className="text-sm">Description</Label>
                    <Textarea
                      rows={3}
                      placeholder="Enter trial registry description..."
                      value={item.description || ""}
                      onChange={(e) =>
                        updateComplexArrayItem(
                          "step5_7",
                          activeTab,
                          idx,
                          { description: e.target.value }
                        )
                      }
                      className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                    />
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
                      <div className="mt-1">
                        <UploadButton
                          endpoint="therapeuticFileUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              updateComplexArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                { file: res[0].name }
                              );
                              updateComplexArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                { url: res[0].url }
                              );
                              toast({
                                title: "Success",
                                description: "File uploaded successfully!",
                              });
                            }
                          }}
                          onUploadError={(error: Error) => {
                            console.error("UploadThing error:", error);
                            console.error("Error details:", {
                              name: error.name,
                              message: error.message,
                              stack: error.stack,
                              cause: (error as any).cause
                            });
                            toast({
                              title: "Error",
                              description: `Upload failed: ${error.message}`,
                              variant: "destructive",
                            });
                          }}
                          appearance={{
                            button: "ut-ready:bg-[#204B73] ut-uploading:cursor-not-allowed rounded-md bg-[#204B73] px-4 py-2 text-sm font-medium text-white hover:bg-[#204B73]/90",
                            allowedContent: "hidden",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Display uploaded file with preview */}
                  {item.file && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded border">
                      {item.file.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ? (
                        <Image className="h-4 w-4 text-blue-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-600" />
                      )}
                      <span className="flex-1">{item.file}</span>
                      {item.url && item.file.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            window.open(item.url, '_blank');
                          }}
                          className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                        >
                          Preview
                        </Button>
                      )}
                    </div>
                  )}
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
                  <div className="w-full">
                    <Label className="text-sm">Description</Label>
                    <Textarea
                      rows={3}
                      placeholder="Enter associated study description..."
                      value={item.description || ""}
                      onChange={(e) =>
                        updateComplexArrayItem(
                          "step5_7",
                          activeTab,
                          idx,
                          { description: e.target.value }
                        )
                      }
                      className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                    />
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
                      <div className="mt-1">
                        <UploadButton
                          endpoint="therapeuticFileUploader"
                          onClientUploadComplete={(res) => {
                            if (res && res[0]) {
                              updateComplexArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                { file: res[0].name }
                              );
                              updateComplexArrayItem(
                                "step5_7",
                                activeTab,
                                idx,
                                { url: res[0].url }
                              );
                              toast({
                                title: "Success",
                                description: "File uploaded successfully!",
                              });
                            }
                          }}
                          onUploadError={(error: Error) => {
                            console.error("UploadThing error:", error);
                            console.error("Error details:", {
                              name: error.name,
                              message: error.message,
                              stack: error.stack,
                              cause: (error as any).cause
                            });
                            toast({
                              title: "Error",
                              description: `Upload failed: ${error.message}`,
                              variant: "destructive",
                            });
                          }}
                          appearance={{
                            button: "ut-ready:bg-[#204B73] ut-uploading:cursor-not-allowed rounded-md bg-[#204B73] px-4 py-2 text-sm font-medium text-white hover:bg-[#204B73]/90",
                            allowedContent: "hidden",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Display uploaded file with preview */}
                  {item.file && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded border">
                      {item.file.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) ? (
                        <Image className="h-4 w-4 text-blue-600" />
                      ) : (
                        <FileText className="h-4 w-4 text-gray-600" />
                      )}
                      <span className="flex-1">{item.file}</span>
                      {item.url && item.file.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            window.open(item.url, '_blank');
                          }}
                          className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                        >
                          Preview
                        </Button>
                      )}
                    </div>
                  )}
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
                          press_releases: { date: "", title: "", description: "", url: "", file: "", isVisible: true },
                          publications: { type: "", title: "", description: "", url: "", file: "", isVisible: true },
                          trial_registries: { registry: "", identifier: "", description: "", url: "", file: "", isVisible: true },
                          associated_studies: { type: "", title: "", description: "", url: "", file: "", isVisible: true },
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
          ))
        ) : (
          <div className="space-y-2 p-4 border rounded-lg bg-white">
            <p className="text-gray-500 text-center mb-4">
              No {tabs.find((t) => t.key === activeTab)?.label.toLowerCase()} added yet.
            </p>
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const templates = {
                    pipeline_data: { date: "", information: "", url: "", file: "", isVisible: true },
                    press_releases: { date: "", title: "", description: "", url: "", file: "", isVisible: true },
                    publications: { type: "", title: "", description: "", url: "", file: "", isVisible: true },
                    trial_registries: { registry: "", identifier: "", description: "", url: "", file: "", isVisible: true },
                    associated_studies: { type: "", title: "", description: "", url: "", file: "", isVisible: true },
                  };
                  addComplexArrayItem("step5_7", activeTab, templates[activeTab as keyof typeof templates]);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add {tabs.find((t) => t.key === activeTab)?.label.slice(0, -1)}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
