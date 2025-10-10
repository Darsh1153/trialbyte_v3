"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NotesSection } from "@/components/notes-section";
import { useContent } from "@/hooks/use-content";

interface DrugFormData {
  overview: {
    drug_name: string;
    generic_name: string;
    therapeutic_area: string;
    disease_type: string;
    is_approved: boolean;
    drug_summary?: string;
    originator?: string;
    other_active_companies?: string;
    global_status?: string;
    development_status?: string;
    regulator_designations?: string;
    source_link?: string;
  };
  devStatus: {
    disease_type: string;
    therapeutic_class: string;
    company: string;
    status: string;
    company_type?: string;
    reference?: {
      source?: string;
      type?: string;
      url?: string | null;
    } | null;
  };
  activity: {
    mechanism_of_action: string;
    biological_target: string;
    delivery_route: string;
    drug_technology?: string;
    delivery_medium?: string;
  };
  development: {
    preclinical: string;
    status: string;
    sponsor: string;
    trial_id?: string;
    title?: string;
    primary_drugs?: string;
  };
  otherSources: {
    data: string;
  };
  licencesMarketing: {
    agreement: string;
    marketing_approvals: string;
    licensing_availability?: string;
  };
  logs: {
    drug_changes_log: string;
    notes: string;
  };
}

const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Drug name and basic details",
  },
  {
    id: 2,
    title: "Development Status",
    description: "Company and development info",
  },
  { id: 3, title: "Mechanism of Action", description: "How the drug works" },
  {
    id: 4,
    title: "Clinical Development",
    description: "Development stages and trials",
  },
  {
    id: 5,
    title: "Marketing & Licensing",
    description: "Commercial information",
  },
  {
    id: 6,
    title: "Additional Details",
    description: "Extra information and notes",
  },
  { id: 7, title: "Review & Submit", description: "Review all information" },
];

export default function NewDrugPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { content, updateContent, resetContent } = useContent<DrugFormData>({
    overview: {
      drug_name: "",
      generic_name: "",
      therapeutic_area: "",
      disease_type: "",
      is_approved: true,
      drug_summary: "",
      originator: "",
      other_active_companies: "",
      global_status: "",
      development_status: "",
      regulator_designations: "",
      source_link: "",
    },
    devStatus: {
      disease_type: "",
      therapeutic_class: "",
      company: "",
      status: "Approved",
      company_type: "",
      reference: {
        source: "",
        type: "documentation",
        url: null,
      },
    },
    activity: {
      mechanism_of_action: "",
      biological_target: "",
      delivery_route: "",
      drug_technology: "",
      delivery_medium: "",
    },
    development: {
      preclinical: "",
      status: "Market",
      sponsor: "",
      trial_id: "",
      title: "",
      primary_drugs: "",
    },
    otherSources: {
      data: "",
    },
    licencesMarketing: {
      agreement: "Proprietary",
      marketing_approvals: "",
      licensing_availability: "",
    },
    logs: {
      drug_changes_log: "Initial creation",
      notes: "",
    },
  });

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1:
        return content.overview.drug_name.trim() !== "";
      case 2:
        return (
          content.devStatus.company.trim() !== "" &&
          content.devStatus.therapeutic_class.trim() !== ""
        );
      case 3:
        return content.activity.mechanism_of_action.trim() !== "";
      case 4:
        return content.development.sponsor.trim() !== "";
      case 5:
        return content.licencesMarketing.marketing_approvals.trim() !== "";
      case 6:
        return true; // Optional step
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const currentUserId = localStorage.getItem("userId");

      if (!currentUserId) {
        toast({
          title: "Error",
          description: "User ID not found",
          variant: "destructive",
        });
        return;
      }

      // Clean up reference field - if source is empty, send null instead of empty object
      const cleanedContent = {
        ...content,
        devStatus: {
          ...content.devStatus,
          reference: content.devStatus.reference?.source?.trim()
            ? content.devStatus.reference
            : null,
        },
      };

      // Log the cleaned content for debugging
      console.log("Submitting drug data:", cleanedContent);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/drugs/create-drug`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: currentUserId,
            ...cleanedContent,
          }),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Drug created successfully",
        });
        resetContent();
        router.push("/admin/drugs");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to create drug",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating drug:", error);
      toast({
        title: "Error",
        description: "Failed to create drug",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Drug Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="drug_name">Drug Name *</Label>
                  <Input
                    id="drug_name"
                    value={content.overview.drug_name}
                    onChange={(e) =>
                      updateContent("overview", {
                        ...content.overview,
                        drug_name: e.target.value,
                      })
                    }
                    placeholder="Enter drug name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="generic_name">Generic Name</Label>
                  <Input
                    id="generic_name"
                    value={content.overview.generic_name}
                    onChange={(e) =>
                      updateContent("overview", {
                        ...content.overview,
                        generic_name: e.target.value,
                      })
                    }
                    placeholder="Enter generic name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="therapeutic_area">Therapeutic Area</Label>
                  <Input
                    id="therapeutic_area"
                    value={content.overview.therapeutic_area}
                    onChange={(e) =>
                      updateContent("overview", {
                        ...content.overview,
                        therapeutic_area: e.target.value,
                      })
                    }
                    placeholder="Enter therapeutic area"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disease_type">Disease Type</Label>
                  <Input
                    id="disease_type"
                    value={content.overview.disease_type}
                    onChange={(e) =>
                      updateContent("overview", {
                        ...content.overview,
                        disease_type: e.target.value,
                      })
                    }
                    placeholder="Enter disease type"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originator">Originator Company</Label>
                  <Input
                    id="originator"
                    value={content.overview.originator}
                    onChange={(e) =>
                      updateContent("overview", {
                        ...content.overview,
                        originator: e.target.value,
                      })
                    }
                    placeholder="Enter originator company"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_approved">Approval Status</Label>
                  <Select
                    value={content.overview.is_approved ? "true" : "false"}
                    onValueChange={(value) =>
                      updateContent("overview", {
                        ...content.overview,
                        is_approved: value === "true",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Approved</SelectItem>
                      <SelectItem value="false">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="drug_summary">Drug Summary</Label>
                  <Textarea
                    id="drug_summary"
                    value={content.overview.drug_summary}
                    onChange={(e) =>
                      updateContent("overview", {
                        ...content.overview,
                        drug_summary: e.target.value,
                      })
                    }
                    placeholder="Enter drug summary"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Development Status</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="therapeutic_class">Therapeutic Class *</Label>
                  <Input
                    id="therapeutic_class"
                    value={content.devStatus.therapeutic_class}
                    onChange={(e) =>
                      updateContent("devStatus", {
                        ...content.devStatus,
                        therapeutic_class: e.target.value,
                      })
                    }
                    placeholder="Enter therapeutic class"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={content.devStatus.company}
                    onChange={(e) =>
                      updateContent("devStatus", {
                        ...content.devStatus,
                        company: e.target.value,
                      })
                    }
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dev_status">Development Status</Label>
                  <Select
                    value={content.devStatus.status}
                    onValueChange={(value) =>
                      updateContent("devStatus", {
                        ...content.devStatus,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                      <SelectItem value="Phase I">Phase I</SelectItem>
                      <SelectItem value="Phase II">Phase II</SelectItem>
                      <SelectItem value="Phase III">Phase III</SelectItem>
                      <SelectItem value="Phase IV">Phase IV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_type">Company Type</Label>
                  <Input
                    id="company_type"
                    value={content.devStatus.company_type}
                    onChange={(e) =>
                      updateContent("devStatus", {
                        ...content.devStatus,
                        company_type: e.target.value,
                      })
                    }
                    placeholder="Enter company type"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="reference_source">Reference Source</Label>
                  <p className="text-xs text-muted-foreground mb-1">
                    This will be stored as a structured JSON object in the
                    database
                  </p>
                  <Input
                    id="reference_source"
                    value={content.devStatus.reference?.source || ""}
                    onChange={(e) =>
                      updateContent("devStatus", {
                        ...content.devStatus,
                        reference: {
                          ...content.devStatus.reference,
                          source: e.target.value,
                        },
                      })
                    }
                    placeholder="Enter reference source"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="reference_type">Reference Type</Label>
                  <Select
                    value={content.devStatus.reference?.type || "documentation"}
                    onValueChange={(value) =>
                      updateContent("devStatus", {
                        ...content.devStatus,
                        reference: {
                          ...content.devStatus.reference,
                          type: value,
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documentation">
                        Documentation
                      </SelectItem>
                      <SelectItem value="research_paper">
                        Research Paper
                      </SelectItem>
                      <SelectItem value="clinical_trial">
                        Clinical Trial
                      </SelectItem>
                      <SelectItem value="regulatory">Regulatory</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="reference_url">
                    Reference URL (Optional)
                  </Label>
                  <Input
                    id="reference_url"
                    value={content.devStatus.reference?.url || ""}
                    onChange={(e) =>
                      updateContent("devStatus", {
                        ...content.devStatus,
                        reference: {
                          ...content.devStatus.reference,
                          url: e.target.value || null,
                        },
                      })
                    }
                    placeholder="Enter reference URL"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Leave reference source empty to store as null in database
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mechanism of Action</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="mechanism_of_action">
                    Mechanism of Action *
                  </Label>
                  <Textarea
                    id="mechanism_of_action"
                    value={content.activity.mechanism_of_action}
                    onChange={(e) =>
                      updateContent("activity", {
                        ...content.activity,
                        mechanism_of_action: e.target.value,
                      })
                    }
                    placeholder="Describe how the drug works"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="biological_target">Biological Target</Label>
                  <Input
                    id="biological_target"
                    value={content.activity.biological_target}
                    onChange={(e) =>
                      updateContent("activity", {
                        ...content.activity,
                        biological_target: e.target.value,
                      })
                    }
                    placeholder="Enter biological target"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_route">Delivery Route</Label>
                  <Input
                    id="delivery_route"
                    value={content.activity.delivery_route}
                    onChange={(e) =>
                      updateContent("activity", {
                        ...content.activity,
                        delivery_route: e.target.value,
                      })
                    }
                    placeholder="Enter delivery route"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="drug_technology">Drug Technology</Label>
                  <Input
                    id="drug_technology"
                    value={content.activity.drug_technology}
                    onChange={(e) =>
                      updateContent("activity", {
                        ...content.activity,
                        drug_technology: e.target.value,
                      })
                    }
                    placeholder="Enter drug technology"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery_medium">Delivery Medium</Label>
                  <Input
                    id="delivery_medium"
                    value={content.activity.delivery_medium}
                    onChange={(e) =>
                      updateContent("activity", {
                        ...content.activity,
                        delivery_medium: e.target.value,
                      })
                    }
                    placeholder="Enter delivery medium"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Development</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preclinical">Preclinical Status</Label>
                  <Select
                    value={content.development.preclinical}
                    onValueChange={(value) =>
                      updateContent("development", {
                        ...content.development,
                        preclinical: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dev_status">Development Status</Label>
                  <Select
                    value={content.development.status}
                    onValueChange={(value) =>
                      updateContent("development", {
                        ...content.development,
                        status: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Market">Market</SelectItem>
                      <SelectItem value="Phase I">Phase I</SelectItem>
                      <SelectItem value="Phase II">Phase II</SelectItem>
                      <SelectItem value="Phase III">Phase III</SelectItem>
                      <SelectItem value="Phase IV">Phase IV</SelectItem>
                      <SelectItem value="Preclinical">Preclinical</SelectItem>
                      <SelectItem value="Discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsor">Sponsor *</Label>
                  <Input
                    id="sponsor"
                    value={content.development.sponsor}
                    onChange={(e) =>
                      updateContent("development", {
                        ...content.development,
                        sponsor: e.target.value,
                      })
                    }
                    placeholder="Enter sponsor name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trial_id">Trial ID</Label>
                  <Input
                    id="trial_id"
                    value={content.development.trial_id}
                    onChange={(e) =>
                      updateContent("development", {
                        ...content.development,
                        trial_id: e.target.value,
                      })
                    }
                    placeholder="Enter trial ID"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="title">Trial Title</Label>
                  <Input
                    id="title"
                    value={content.development.title}
                    onChange={(e) =>
                      updateContent("development", {
                        ...content.development,
                        title: e.target.value,
                      })
                    }
                    placeholder="Enter trial title"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="primary_drugs">Primary Drugs</Label>
                  <Input
                    id="primary_drugs"
                    value={content.development.primary_drugs}
                    onChange={(e) =>
                      updateContent("development", {
                        ...content.development,
                        primary_drugs: e.target.value,
                      })
                    }
                    placeholder="Enter primary drugs"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Marketing & Licensing</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agreement">Agreement Type</Label>
                  <Select
                    value={content.licencesMarketing.agreement}
                    onValueChange={(value) =>
                      updateContent("licencesMarketing", {
                        ...content.licencesMarketing,
                        agreement: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Proprietary">Proprietary</SelectItem>
                      <SelectItem value="Licensed">Licensed</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                      <SelectItem value="Open Source">Open Source</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licensing_availability">
                    Licensing Availability
                  </Label>
                  <Input
                    id="licensing_availability"
                    value={content.licencesMarketing.licensing_availability}
                    onChange={(e) =>
                      updateContent("licencesMarketing", {
                        ...content.licencesMarketing,
                        licensing_availability: e.target.value,
                      })
                    }
                    placeholder="Enter licensing availability"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="marketing_approvals">
                    Marketing Approvals *
                  </Label>
                  <Input
                    id="marketing_approvals"
                    value={content.licencesMarketing.marketing_approvals}
                    onChange={(e) =>
                      updateContent("licencesMarketing", {
                        ...content.licencesMarketing,
                        marketing_approvals: e.target.value,
                      })
                    }
                    placeholder="Enter marketing approvals (e.g., FDA, EMA)"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="other_sources">Additional Data Sources</Label>
                  <Textarea
                    id="other_sources"
                    value={content.otherSources.data}
                    onChange={(e) =>
                      updateContent("otherSources", {
                        ...content.otherSources,
                        data: e.target.value,
                      })
                    }
                    placeholder="Enter additional information from other sources"
                    rows={3}
                  />
                </div>
                
                {/* Notes Section */}
                <NotesSection
                  title="Notes & Documentation"
                  notes={content.logs?.notes ? (Array.isArray(content.logs.notes) ? content.logs.notes : [{
                    id: "1",
                    date: new Date().toISOString().split("T")[0],
                    type: "General",
                    content: content.logs.notes,
                    sourceLink: "",
                    attachments: [],
                    isVisible: true
                  }]) : []}
                  onAddNote={() => {
                    const newNote = {
                      id: Date.now().toString(),
                      date: new Date().toISOString().split("T")[0],
                      type: "General",
                      content: "",
                      sourceLink: "",
                      attachments: [],
                      isVisible: true
                    };
                    const currentNotes = Array.isArray(content.logs?.notes) ? content.logs.notes : [];
                    updateContent("logs", {
                      ...content.logs,
                      notes: [...currentNotes, newNote]
                    });
                  }}
                  onUpdateNote={(index, updatedNote) => {
                    const currentNotes = Array.isArray(content.logs?.notes) ? content.logs.notes : [];
                    const updatedNotes = currentNotes.map((note, i) => 
                      i === index ? { ...note, ...updatedNote } : note
                    );
                    updateContent("logs", {
                      ...content.logs,
                      notes: updatedNotes
                    });
                  }}
                  onRemoveNote={(index) => {
                    const currentNotes = Array.isArray(content.logs?.notes) ? content.logs.notes : [];
                    const updatedNotes = currentNotes.filter((_, i) => i !== index);
                    updateContent("logs", {
                      ...content.logs,
                      notes: updatedNotes
                    });
                  }}
                  noteTypes={[
                    "General",
                    "Development",
                    "Regulatory",
                    "Safety",
                    "Efficacy",
                    "Clinical",
                    "Manufacturing",
                    "Marketing",
                    "Other"
                  ]}
                />
              </CardContent>
            </Card>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review All Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Basic Information</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Drug Name:</strong>{" "}
                        {content.overview.drug_name || "Not provided"}
                      </p>
                      <p>
                        <strong>Generic Name:</strong>{" "}
                        {content.overview.generic_name || "Not provided"}
                      </p>
                      <p>
                        <strong>Therapeutic Area:</strong>{" "}
                        {content.overview.therapeutic_area || "Not provided"}
                      </p>
                      <p>
                        <strong>Disease Type:</strong>{" "}
                        {content.overview.disease_type || "Not provided"}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {content.overview.is_approved ? "Approved" : "Pending"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Development Status</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Company:</strong>{" "}
                        {content.devStatus.company || "Not provided"}
                      </p>
                      <p>
                        <strong>Therapeutic Class:</strong>{" "}
                        {content.devStatus.therapeutic_class || "Not provided"}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {content.devStatus.status || "Not provided"}
                      </p>
                      <p>
                        <strong>Reference:</strong>{" "}
                        {content.devStatus.reference?.source ? (
                          <>
                            {content.devStatus.reference.source}(
                            {content.devStatus.reference.type})
                            {content.devStatus.reference.url && (
                              <span className="block text-xs text-muted-foreground">
                                URL: {content.devStatus.reference.url}
                              </span>
                            )}
                          </>
                        ) : (
                          "Not provided"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Mechanism of Action</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Mechanism:</strong>{" "}
                        {content.activity.mechanism_of_action || "Not provided"}
                      </p>
                      <p>
                        <strong>Biological Target:</strong>{" "}
                        {content.activity.biological_target || "Not provided"}
                      </p>
                      <p>
                        <strong>Delivery Route:</strong>{" "}
                        {content.activity.delivery_route || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Clinical Development</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Sponsor:</strong>{" "}
                        {content.development.sponsor || "Not provided"}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        {content.development.status || "Not provided"}
                      </p>
                      <p>
                        <strong>Preclinical:</strong>{" "}
                        {content.development.preclinical || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Marketing & Licensing</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Agreement:</strong>{" "}
                      {content.licencesMarketing.agreement || "Not provided"}
                    </p>
                    <p>
                      <strong>Marketing Approvals:</strong>{" "}
                      {content.licencesMarketing.marketing_approvals ||
                        "Not provided"}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Additional Information</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Additional Data Sources:</strong>{" "}
                      {content.otherSources.data || "Not provided"}
                    </p>
                    <p>
                      <strong>Notes:</strong>{" "}
                      {content.logs.notes || "Not provided"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.push("/admin/drugs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Drugs
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Drug</h1>
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep === step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : isStepComplete(step.id)
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-muted border-muted-foreground text-muted-foreground"
                }`}
              >
                {isStepComplete(step.id) ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    currentStep === step.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mx-4 ${
                  isStepComplete(step.id) ? "bg-green-500" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">{renderStepContent()}</div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-2">
          {currentStep < steps.length ? (
            <Button onClick={nextStep} disabled={!isStepComplete(currentStep)}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Drug...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Create Drug
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
