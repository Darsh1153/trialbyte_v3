"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Eye, EyeOff, Upload, FileText, Image } from "lucide-react";
import CustomDateInput from "@/components/ui/custom-date-input";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function TherapeuticsStep5_4() {
  const { formData, updateField, addReference, removeReference, updateReference, saveTrial } = useTherapeuticForm();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const form = formData.step5_4;

  // Create a state structure for the table data
  const getTableValue = (row: string, col: string) => {
    const key = `${row.toLowerCase()}_${col.replace(/\s+/g, "_").toLowerCase()}`;
    return (form as any)[key] || "";
  };

  const updateTableValue = (row: string, col: string, value: string) => {
    const key = `${row.toLowerCase()}_${col.replace(/\s+/g, "_").toLowerCase()}`;
    updateField("step5_4", key as any, value);
  };

  // Columns for the top table
  const columns = [
    "Start Date",
    "Inclusion Period",
    "Enrollment Closed Date",
    "Primary Outcome Duration",
    "Trial End Date",
    "Result Duration",
    "Result Published Date",
  ];

  // Rows (labels at the start)
  const rows = ["Actual", "Benchmark", "Estimated"];

  // Registry type options
  const registryTypes = [
    "ClinicalTrials.gov",
    "EU Clinical Trials Database",
    "WHO ICTRP",
    "ISRCTN",
    "JPRN",
    "ANZCTR",
    "CTRI",
    "DRKS",
    "Other"
  ];

  // Helper functions for references
  const handleAddReference = () => addReference("step5_4", "references");
  const handleRemoveReference = (index: number) => removeReference("step5_4", "references", index);
  const handleUpdateReference = (index: number, field: string, value: any) => {
    updateReference("step5_4", "references", index, { [field]: value });
  };

  // Handle file upload for attachments
  const handleFileUpload = (index: number, files: FileList | null) => {
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      const currentAttachments = form.references[index]?.attachments || [];
      handleUpdateReference(index, "attachments", [...currentAttachments, ...fileNames]);
    }
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
      <FormProgress currentStep={4} />

      {/* Header Buttons */}
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
        <CardContent className="space-y-8">
          {/* Top Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-2"></th>
                  {columns.map((col) => (
                    <th key={col} className="text-left p-2 text-sm font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row}>
                    <td className="p-2 font-medium">{row}</td>
                    {columns.map((col, i) => (
                      <td key={i} className="p-2">
                        {col.includes("Date") ? (
                          <CustomDateInput
                            value={getTableValue(row, col)}
                            onChange={(value) => updateTableValue(row, col, value)}
                            placeholder="Month Day Year"
                            className="w-full border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                          />
                        ) : (
                          <Input
                            type="text"
                            className="w-full border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            value={getTableValue(row, col)}
                            onChange={(e) => updateTableValue(row, col, e.target.value)}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Overall Duration Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap">
                Overall duration to Complete
              </Label>
              <Input
                type="number"
                className="w-24 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                placeholder="Months"
                value={form.estimated_enrollment || ""}
                onChange={(e) =>
                  updateField("step5_4", "estimated_enrollment", e.target.value)
                }
              />
              <span className="text-sm text-gray-500">(months)</span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap">
                Overall duration to publish result
              </Label>
              <Input
                type="number"
                className="w-24 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                placeholder="Months"
                value={form.actual_enrollment || ""}
                onChange={(e) =>
                  updateField("step5_4", "actual_enrollment", e.target.value)
                }
              />
              <span className="text-sm text-gray-500">(months)</span>
            </div>
          </div>

          {/* References */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">References</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddReference}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Reference
              </Button>
            </div>
            
            <div className="space-y-6">
              {form.references.map((reference, index) => (
                <Card key={reference.id} className="border border-gray-200">
                  <CardContent className="p-6 space-y-4">
                    {/* Reference Header */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Reference {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateReference(index, "isVisible", !reference.isVisible)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {reference.isVisible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        {form.references.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveReference(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Reference Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Date */}
                      <div className="space-y-2">
                        <Label htmlFor={`ref-date-${index}`}>Date</Label>
                        <CustomDateInput
                          value={reference.date}
                          onChange={(value) => handleUpdateReference(index, "date", value)}
                          placeholder="Select date"
                          className="w-full"
                        />
                      </div>

                      {/* Registry Type */}
                      <div className="space-y-2">
                        <Label htmlFor={`ref-registry-${index}`}>Registry Type</Label>
                        <Select
                          value={reference.registryType}
                          onValueChange={(value) => handleUpdateReference(index, "registryType", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select registry type" />
                          </SelectTrigger>
                          <SelectContent>
                            {registryTypes.map((type) => (
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
                      <Label htmlFor={`ref-content-${index}`}>Content</Label>
                      <Textarea
                        id={`ref-content-${index}`}
                        rows={4}
                        placeholder="Enter reference content here..."
                        value={reference.content}
                        onChange={(e) => handleUpdateReference(index, "content", e.target.value)}
                        className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                      />
                    </div>

                    {/* View Source URL */}
                    <div className="space-y-2">
                      <Label htmlFor={`ref-source-${index}`}>View Source (URL)</Label>
                      <Input
                        id={`ref-source-${index}`}
                        type="url"
                        placeholder="https://example.com"
                        value={reference.viewSource}
                        onChange={(e) => handleUpdateReference(index, "viewSource", e.target.value)}
                        className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                      />
                    </div>

                    {/* Attachments */}
                    <div className="space-y-2">
                      <Label htmlFor={`ref-attachments-${index}`}>Attachments</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id={`ref-attachments-${index}`}
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.txt"
                          onChange={(e) => handleFileUpload(index, e.target.files)}
                          className="flex-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload
                        </Button>
                      </div>
                      
                      {/* Display uploaded files */}
                      {reference.attachments && reference.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {reference.attachments.map((attachment, attIndex) => (
                            <div key={attIndex} className="flex items-center gap-2 text-sm text-gray-600">
                              {attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <Image className="h-4 w-4" />
                              ) : (
                                <FileText className="h-4 w-4" />
                              )}
                              <span>{attachment}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedAttachments = reference.attachments.filter((_, i) => i !== attIndex);
                                  handleUpdateReference(index, "attachments", updatedAttachments);
                                }}
                                className="text-red-500 hover:text-red-700 p-0 h-auto"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Preview Section */}
                    {reference.content && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Preview</Label>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-800 whitespace-pre-wrap">{reference.content}</p>
                          {reference.viewSource && (
                            <div className="mt-2">
                              <a
                                href={reference.viewSource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                              >
                                View Source →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href="/admin/therapeutics/new/5-3">Previous</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/therapeutics/new/5-5">Next</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
