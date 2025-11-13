"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Eye, EyeOff, Upload, FileText, Image, Link as LinkIcon } from "lucide-react";
import CustomDateInput from "@/components/ui/custom-date-input";
import { useEditTherapeuticForm } from "../../../context/edit-form-context";
import { useToast } from "@/hooks/use-toast";

export default function SitesSection() {
  const {
    formData,
    updateField,
    addReference,
    removeReference,
    updateReference,
  } = useEditTherapeuticForm();
  const { toast } = useToast();
  const form = formData.step5_6;

  console.log("📋 SitesSection (Edit) - Current form data:", form);
  console.log("🎯 Key Sites values:", {
    study_start_date: form.study_start_date,
    references_count: form.references?.length,
    references: form.references,
  });
  
  // Log each reference individually
  if (form.references && form.references.length > 0) {
    form.references.forEach((ref: any, index: number) => {
      console.log(`  Reference ${index}:`, {
        id: ref.id,
        date: ref.date,
        registryType: ref.registryType,
        content: ref.content?.substring(0, 50),
        viewSource: ref.viewSource,
        attachments_count: ref.attachments?.length || 0,
        isVisible: ref.isVisible,
      });
    });
  }

  // Registry type options (same as in Timings)
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
  const handleAddReference = () => {
    console.log("Adding reference to step5_6");
    addReference("step5_6", "references");
  };
  
  const handleRemoveReference = (index: number) => {
    console.log("Removing reference from step5_6:", index);
    removeReference("step5_6", "references", index);
  };
  
  const handleUpdateReference = (index: number, field: string, value: any) => {
    console.log(`Updating reference ${index}, field: ${field}`, value);
    updateReference("step5_6", "references", index, { [field]: value });
  };

  const getAttachmentDisplayMeta = (attachment: any) => {
    console.log("🧾 Building attachment display meta:", attachment);

    const defaultMeta = {
      name: "Attachment",
      url: "",
      isImage: false,
    };

    if (!attachment) {
      return defaultMeta;
    }

    const extractNameFromUrl = (rawUrl: string) => {
      try {
        const parsedUrl = new URL(rawUrl);
        const segments = parsedUrl.pathname.split("/").filter(Boolean);
        return decodeURIComponent(segments.pop() || "Attachment");
      } catch {
        const segments = rawUrl.split("/").filter(Boolean);
        return decodeURIComponent(segments.pop() || "Attachment");
      }
    };

    if (typeof attachment === "string") {
      const trimmed = attachment.trim();
      if (!trimmed) {
        return defaultMeta;
      }

      const isUrl = /^https?:\/\//i.test(trimmed);
      const name = isUrl ? extractNameFromUrl(trimmed) : trimmed;
      const url = isUrl ? trimmed : "";
      const isImage = /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(name) || /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(url);

      return {
        name,
        url,
        isImage,
      };
    }

    if (typeof attachment === "object") {
      const possibleUrl =
        typeof attachment.url === "string"
          ? attachment.url
          : typeof attachment.href === "string"
          ? attachment.href
          : typeof attachment.link === "string"
          ? attachment.link
          : "";
      const name =
        typeof attachment.name === "string" && attachment.name
          ? attachment.name
          : possibleUrl
          ? extractNameFromUrl(possibleUrl)
          : "Attachment";

      const isImage =
        /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(name) ||
        (possibleUrl ? /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(possibleUrl) : false);

      return {
        name,
        url: possibleUrl,
        isImage,
      };
    }

    return defaultMeta;
  };

  // Handle file upload for attachments
  const handleFileUpload = (index: number, files: FileList | null) => {
    if (files) {
      const fileData = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        lastModified: file.lastModified
      }));
      
      const currentAttachments = form.references[index]?.attachments || [];
      handleUpdateReference(index, "attachments", [...currentAttachments, ...fileData]);
      
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) uploaded successfully`,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Total No of Sites */}
      <div className="space-y-2">
        <Label>Total No of Sites</Label>
        <Input
          type="number"
          value={form.study_start_date || ""}
          onChange={(e) => updateField("step5_6", "study_start_date", e.target.value)}
          className="border-gray-600 focus:border-gray-800 focus:ring-gray-800 w-32"
        />
      </div>

      {/* References/Notes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold">Notes</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddReference}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Note
          </Button>
        </div>
        
        <div className="space-y-6">
          {(form.references || []).map((reference: any, index: number) => (
            <Card key={reference.id} className="border border-gray-200">
              <CardContent className="p-6 space-y-4">
                {/* Reference Header */}
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Note {index + 1}</h4>
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
                    {(form.references || []).length > 1 && (
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
                      value={reference.date || ""}
                      onChange={(value) => handleUpdateReference(index, "date", value)}
                      placeholder="Select date"
                      className="w-full"
                    />
                  </div>

                  {/* Registry Type */}
                  <div className="space-y-2">
                    <Label htmlFor={`ref-registry-${index}`}>Registry Type</Label>
                    <Select
                      value={reference.registryType || ""}
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
                    placeholder="Enter note content here..."
                    value={reference.content || ""}
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
                    value={reference.viewSource || ""}
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
                      {reference.attachments.map((attachment: any, attIndex: number) => {
                        const meta = getAttachmentDisplayMeta(attachment);
                        
                        return (
                          <div key={attIndex} className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded border">
                            {meta.isImage ? (
                              <Image className="h-4 w-4 text-blue-600" />
                            ) : (
                              <FileText className="h-4 w-4 text-gray-600" />
                            )}
                            <span className="flex-1 truncate">{meta.name}</span>
                            {meta.url ? (
                              <a
                                href={meta.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs"
                              >
                                <LinkIcon className="h-3 w-3" />
                                View
                              </a>
                            ) : (
                              <span className="text-xs text-gray-400">No preview</span>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedAttachments = reference.attachments.filter((_: any, i: number) => i !== attIndex);
                                handleUpdateReference(index, "attachments", updatedAttachments);
                              }}
                              className="text-red-500 hover:text-red-700 p-0 h-auto"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
