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
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Loader2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useContent } from "@/hooks/use-content";
import { useDrugNames } from "@/hooks/use-drug-names";

interface DrugFormData {
  overview: {
    drug_name_lab_code: string;
    generic_name: string;
    other_name: string;
    primary_name: string;
    global_status: string;
    development_status: string;
    drug_summary: string;
    originator: string;
    other_active_companies: string;
    therapeutic_area: string;
    disease_type: string;
    regulatory_designations: string;
    source_links: string;
    drug_record_status: string;
  };
  drugActivity: {
    mechanism_of_action: string;
    biological_target: string;
    delivery_route: string;
    drug_technology: string;
    delivery_medium: string;
  };
  development: {
    disease_type: string;
    therapeutic_class: string;
    company: string;
    company_type: string;
    status: string;
    reference: string;
    add_attachments: string[];
    add_links: string[];
  };
  otherSources: {
    pipelineData: string;
    pressReleases: string;
    publications: string;
  };
  licensingMarketing: {
    agreement: string;
    marketing_approvals: string;
    licensing_availability: string;
  };
  logs: {
    drug_changes_log: string;
    notes: string;
  };
}

const steps = [
  { id: 1, title: "Overview", description: "Basic drug information" },
  { id: 2, title: "Drug Activity", description: "Mechanism and biological details" },
  { id: 3, title: "Development", description: "Development status and company info" },
  { id: 4, title: "Other Sources", description: "Additional data sources" },
  { id: 5, title: "Licensing & Marketing", description: "Commercial information" },
  { id: 6, title: "Logs", description: "Change logs and notes" },
];

export default function NewDrugPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addDrugName, getPrimaryNameOptions } = useDrugNames();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("Pipeline Data");

  // Options for searchable dropdowns
  const primaryNameOptions: SearchableSelectOption[] = [
    ...getPrimaryNameOptions().map(drug => ({
      value: drug.value,
      label: drug.label
    }))
  ];

  const globalStatusOptions: SearchableSelectOption[] = [
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "discontinued", label: "Discontinued" },
    { value: "phase_3", label: "Phase III" },
    { value: "phase_2", label: "Phase II" },
    { value: "phase_1", label: "Phase I" },
  ];

  const developmentStatusOptions: SearchableSelectOption[] = [
    { value: "market", label: "Market" },
    { value: "phase_3", label: "Phase III" },
    { value: "phase_2", label: "Phase II" },
    { value: "phase_1", label: "Phase I" },
    { value: "preclinical", label: "Preclinical" },
    { value: "discontinued", label: "Discontinued" },
  ];

  const originatorOptions: SearchableSelectOption[] = [
    { value: "pfizer", label: "Pfizer" },
    { value: "novartis", label: "Novartis" },
    { value: "roche", label: "Roche" },
    { value: "merck", label: "Merck" },
    { value: "johnson_johnson", label: "Johnson & Johnson" },
  ];

  const otherActiveCompaniesOptions: SearchableSelectOption[] = [
    { value: "multiple", label: "Multiple Companies" },
    { value: "generic_manufacturers", label: "Generic Manufacturers" },
    { value: "biosimilar_companies", label: "Biosimilar Companies" },
  ];

  const therapeuticAreaOptions: SearchableSelectOption[] = [
    { value: "oncology", label: "Oncology" },
    { value: "cardiology", label: "Cardiology" },
    { value: "neurology", label: "Neurology" },
    { value: "immunology", label: "Immunology" },
    { value: "endocrinology", label: "Endocrinology" },
  ];

  const diseaseTypeOptions: SearchableSelectOption[] = [
    { value: "lung_cancer", label: "Lung Cancer" },
    { value: "breast_cancer", label: "Breast Cancer" },
    { value: "diabetes", label: "Diabetes" },
    { value: "hypertension", label: "Hypertension" },
    { value: "alzheimers", label: "Alzheimer's Disease" },
  ];

  const regulatoryDesignationsOptions: SearchableSelectOption[] = [
    { value: "breakthrough_therapy", label: "Breakthrough Therapy" },
    { value: "fast_track", label: "Fast Track" },
    { value: "orphan_drug", label: "Orphan Drug" },
    { value: "priority_review", label: "Priority Review" },
  ];

  const drugRecordStatusOptions: SearchableSelectOption[] = [
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
    { value: "under_review", label: "Under Review" },
  ];

  const drugTechnologyOptions: SearchableSelectOption[] = [
    { value: "proprietary", label: "Proprietary" },
    { value: "licensed", label: "Licensed" },
    { value: "partnership", label: "Partnership" },
    { value: "open_source", label: "Open Source" },
  ];

  const { content, updateContent, resetContent } = useContent<DrugFormData>({
    overview: {
      drug_name_lab_code: "",
      generic_name: "",
      other_name: "",
      primary_name: "",
      global_status: "",
      development_status: "",
      drug_summary: "",
      originator: "",
      other_active_companies: "",
      therapeutic_area: "",
      disease_type: "",
      regulatory_designations: "",
      source_links: "",
      drug_record_status: "",
    },
    drugActivity: {
      mechanism_of_action: "",
      biological_target: "",
      delivery_route: "",
      drug_technology: "",
      delivery_medium: "",
    },
    development: {
      disease_type: "",
      therapeutic_class: "",
      company: "",
      company_type: "",
      status: "",
      reference: "",
      add_attachments: [],
      add_links: [],
    },
    otherSources: {
      pipelineData: "",
      pressReleases: "",
      publications: ""
    },
    licensingMarketing: {
      agreement: "",
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
        return content.overview.drug_name_lab_code.trim() !== "";
      case 2:
        return content.drugActivity.mechanism_of_action.trim() !== "";
      case 3:
        return (
          content.development.company.trim() !== "" &&
          content.development.therapeutic_class.trim() !== ""
        );
      case 4:
        return true; // Optional step
      case 5:
        return true; // Optional step
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

      console.log("Submitting drug data:", content);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/drugs/create-drug`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: currentUserId,
            ...content,
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
      case 1: // Overview Tab
        return (
          <div className="space-y-6">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/drugs")}
              >
                Cancel
              </Button>
              <Button
                className="text-white font-medium px-6 py-2"
                style={{ backgroundColor: '#204B73' }}
              >
                Save Changes
              </Button>
            </div>
            {/* First Row: Drug Name, Generic Name, Other Name */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="drug_name_lab_code" className="text-sm font-medium text-gray-700">Drug Name - Lab code</Label>
                <div className="relative">
                  <Textarea
                    id="drug_name_lab_code"
                    value={content.overview.drug_name_lab_code}
                    onChange={(e) =>
                      updateContent("overview", {
                        ...content.overview,
                        drug_name_lab_code: e.target.value
                      })
                    }
                    placeholder=""
                    rows={2}
                    className="border-gray-300"
                  />
                  <Plus 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                    onClick={() => {
                      if (content.overview.drug_name_lab_code.trim()) {
                        addDrugName(content.overview.drug_name_lab_code, 'drug_name_lab_code');
                        toast({
                          title: "Added to Primary Name",
                          description: `"${content.overview.drug_name_lab_code}" added to Primary Name dropdown`,
                        });
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="generic_name" className="text-sm font-medium text-gray-700">Generic Name</Label>
                <div className="relative">
                  <Textarea
                    id="generic_name"
                    value={content.overview.generic_name}
                    onChange={(e) =>
                      updateContent("overview", {
                        ...content.overview,
                        generic_name: e.target.value,
                      })
                    }
                    placeholder=""
                    rows={2}
                    className="border-gray-300"
                  />
                  <Plus 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                    onClick={() => {
                      if (content.overview.generic_name.trim()) {
                        addDrugName(content.overview.generic_name, 'generic_name');
                        toast({
                          title: "Added to Primary Name",
                          description: `"${content.overview.generic_name}" added to Primary Name dropdown`,
                        });
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_name" className="text-sm font-medium text-gray-700">Other Name</Label>
                <div className="relative">
                  <Textarea
                    id="other_name"
                    value={content.overview.other_name}
                    onChange={(e) =>
                      updateContent("overview", {
                        ...content.overview,
                        other_name: e.target.value,
                      })
                    }
                    placeholder=""
                    rows={2}
                    className="border-gray-300"
                  />
                  <Plus 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                    onClick={() => {
                      if (content.overview.other_name.trim()) {
                        addDrugName(content.overview.other_name, 'other_name');
                        toast({
                          title: "Added to Primary Name",
                          description: `"${content.overview.other_name}" added to Primary Name dropdown`,
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Second Row: Primary Name, Global Status, Development Status */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary_name" className="text-sm font-medium text-gray-700">Primary Name</Label>
                <SearchableSelect
                  options={primaryNameOptions}
                  value={content.overview.primary_name}
                  onValueChange={(value) =>
                    updateContent("overview", {
                      ...content.overview,
                      primary_name: value,
                    })
                  }
                  placeholder="Select primary name"
                  searchPlaceholder="Search primary name..."
                  emptyMessage="No primary name found."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="global_status" className="text-sm font-medium text-gray-700">Global Status</Label>
                <SearchableSelect
                  options={globalStatusOptions}
                  value={content.overview.global_status}
                  onValueChange={(value) =>
                    updateContent("overview", {
                      ...content.overview,
                      global_status: value,
                    })
                  }
                  placeholder="Select global status"
                  searchPlaceholder="Search global status..."
                  emptyMessage="No global status found."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="development_status" className="text-sm font-medium text-gray-700">Development status</Label>
                <SearchableSelect
                  options={developmentStatusOptions}
                  value={content.overview.development_status}
                  onValueChange={(value) =>
                    updateContent("overview", {
                      ...content.overview,
                      development_status: value,
                    })
                  }
                  placeholder="Select development status"
                  searchPlaceholder="Search development status..."
                  emptyMessage="No development status found."
                />
              </div>
            </div>

            {/* Drug Summary */}
            <div className="space-y-2">
              <Label htmlFor="drug_summary" className="text-sm font-medium text-gray-700">Drug Summary</Label>
              <div className="relative">
                <Textarea
                  id="drug_summary"
                  value={content.overview.drug_summary}
                  onChange={(e) =>
                    updateContent("overview", {
                      ...content.overview,
                      drug_summary: e.target.value,
                    })
                  }
                  placeholder=""
                  rows={4}
                  className="min-h-[120px] border-gray-300"
                />
              </div>
            </div>

            {/* Third Row: Originator, Other Active Companies */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originator" className="text-sm font-medium text-gray-700">Originator</Label>
                <SearchableSelect
                  options={originatorOptions}
                  value={content.overview.originator}
                  onValueChange={(value) =>
                    updateContent("overview", {
                      ...content.overview,
                      originator: value,
                    })
                  }
                  placeholder="Select originator"
                  searchPlaceholder="Search originator..."
                  emptyMessage="No originator found."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_active_companies" className="text-sm font-medium text-gray-700">Other Active Companies</Label>
                <SearchableSelect
                  options={otherActiveCompaniesOptions}
                  value={content.overview.other_active_companies}
                  onValueChange={(value) =>
                    updateContent("overview", {
                      ...content.overview,
                      other_active_companies: value,
                    })
                  }
                  placeholder="Select other active companies"
                  searchPlaceholder="Search other active companies..."
                  emptyMessage="No other active companies found."
                />
              </div>
            </div>

            {/* Fourth Row: Therapeutic Area, Disease Type, Regulatory Designations */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="therapeutic_area" className="text-sm font-medium text-gray-700">Clinical Trials Area</Label>
                <SearchableSelect
                  options={therapeuticAreaOptions}
                  value={content.overview.therapeutic_area}
                  onValueChange={(value) =>
                    updateContent("overview", {
                      ...content.overview,
                      therapeutic_area: value,
                    })
                  }
                  placeholder="Select therapeutic area"
                  searchPlaceholder="Search therapeutic area..."
                  emptyMessage="No therapeutic area found."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disease_type" className="text-sm font-medium text-gray-700">Disease Type</Label>
                <SearchableSelect
                  options={diseaseTypeOptions}
                  value={content.overview.disease_type}
                  onValueChange={(value) =>
                    updateContent("overview", {
                      ...content.overview,
                      disease_type: value,
                    })
                  }
                  placeholder="Select disease type"
                  searchPlaceholder="Search disease type..."
                  emptyMessage="No disease type found."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regulatory_designations" className="text-sm font-medium text-gray-700">Regulatory Designations</Label>
                <SearchableSelect
                  options={regulatoryDesignationsOptions}
                  value={content.overview.regulatory_designations}
                  onValueChange={(value) =>
                    updateContent("overview", {
                      ...content.overview,
                      regulatory_designations: value,
                    })
                  }
                  placeholder="Select regulatory designations"
                  searchPlaceholder="Search regulatory designations..."
                  emptyMessage="No regulatory designations found."
                />
              </div>
            </div>

            {/* Bottom Row: Source Links, Drug Record Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source_links" className="text-sm font-medium text-gray-700">Source Links</Label>
                <div className="relative">
                  <Textarea
                    id="source_links"
                    value={content.overview.source_links}
                    onChange={(e) =>
                      updateContent("overview", {
                        ...content.overview,
                        source_links: e.target.value,
                      })
                    }
                    placeholder=""
                    rows={2}
                    className="border-gray-300"
                  />
                  <Plus className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="drug_record_status" className="text-sm font-medium text-gray-700">Drug Record Status</Label>
                <SearchableSelect
                  options={drugRecordStatusOptions}
                  value={content.overview.drug_record_status}
                  onValueChange={(value) =>
                    updateContent("overview", {
                      ...content.overview,
                      drug_record_status: value,
                    })
                  }
                  placeholder="Select drug record status"
                  searchPlaceholder="Search drug record status..."
                  emptyMessage="No drug record status found."
                />
              </div>
            </div>
          </div>
        );

      case 2: // Drug Activity Tab
        return (
          <div className="space-y-6">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/drugs")}
              >
                Cancel
              </Button>
              <Button
                className="text-white font-medium px-6 py-2"
                style={{ backgroundColor: '#204B73' }}
              >
                Save Changes
              </Button>
            </div>
            {/* First Row: Mechanism of Action, Biological Target */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mechanism_of_action" className="text-sm font-medium text-gray-700">Mechanism of action</Label>
                <Textarea
                  id="mechanism_of_action"
                  value={content.drugActivity.mechanism_of_action}
                  onChange={(e) =>
                    updateContent("drugActivity", {
                      ...content.drugActivity,
                      mechanism_of_action: e.target.value,
                    })
                  }
                  placeholder=""
                  rows={4}
                  className="min-h-[120px] border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="biological_target" className="text-sm font-medium text-gray-700">Biological target</Label>
                <Textarea
                  id="biological_target"
                  value={content.drugActivity.biological_target}
                  onChange={(e) =>
                    updateContent("drugActivity", {
                      ...content.drugActivity,
                      biological_target: e.target.value,
                    })
                  }
                  placeholder=""
                  rows={4}
                  className="min-h-[120px] border-gray-300"
                />
              </div>
            </div>

            {/* Full Width: Drug Technology */}
            <div className="space-y-2">
              <Label htmlFor="drug_technology" className="text-sm font-medium text-gray-700">Drug Technology</Label>
              <Textarea
                id="drug_technology"
                value={content.drugActivity.drug_technology}
                onChange={(e) =>
                  updateContent("drugActivity", {
                    ...content.drugActivity,
                    drug_technology: e.target.value,
                  })
                }
                placeholder=""
                rows={6}
                className="min-h-[150px] border-gray-300"
              />
            </div>

            {/* Second Row: Delivery Route, Delivery Medium */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="delivery_route" className="text-sm font-medium text-gray-700">Delivery Route</Label>
                <Textarea
                  id="delivery_route"
                  value={content.drugActivity.delivery_route}
                  onChange={(e) =>
                    updateContent("drugActivity", {
                      ...content.drugActivity,
                      delivery_route: e.target.value,
                    })
                  }
                  placeholder=""
                  rows={4}
                  className="min-h-[120px] border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery_medium" className="text-sm font-medium text-gray-700">Delivery Medium</Label>
                <Textarea
                  id="delivery_medium"
                  value={content.drugActivity.delivery_medium}
                  onChange={(e) =>
                    updateContent("drugActivity", {
                      ...content.drugActivity,
                      delivery_medium: e.target.value,
                    })
                  }
                  placeholder=""
                  rows={4}
                  className="min-h-[120px] border-gray-300"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Development Tab
        return (
          <div className="space-y-6 p-6 border border-gray-200 rounded-lg bg-white">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/drugs")}
              >
                Cancel
              </Button>
              <Button
                className="text-white font-medium px-6 py-2"
                style={{ backgroundColor: '#204B73' }}
              >
                Save Changes
              </Button>
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Development</h3>

            {/* Preclinical Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-base font-semibold text-gray-900">
                  Preclinical
                </label>
                <button type="button">
                  <Plus className="h-5 w-5 text-gray-400 cursor-pointer" />
                </button>
              </div>
              <Textarea
                value={content.development.reference || ''}
                onChange={(e) => updateContent("development", {
                  ...content.development,
                  reference: e.target.value,
                })}
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Clinical Section */}
            <div className="space-y-4">
              <label className="text-base font-semibold text-gray-900">
                Clinical
              </label>

              {/* Clinical Trials Table */}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-300">
                  <div className="p-3 text-sm font-medium text-gray-700 border-r border-gray-300">
                    Trial ID
                  </div>
                  <div className="p-3 text-sm font-medium text-gray-700 border-r border-gray-300">
                    Title
                  </div>
                  <div className="p-3 text-sm font-medium text-gray-700 border-r border-gray-300">
                    Primary Drugs
                  </div>
                  <div className="p-3 text-sm font-medium text-gray-700 border-r border-gray-300">
                    Status
                  </div>
                  <div className="p-3 text-sm font-medium text-gray-700">Sponsor</div>
                </div>

                {/* Table Row */}
                <div className="grid grid-cols-5">
                  <div className="p-3 border-r border-gray-300">
                    <Textarea
                      value={content.development.disease_type || ''}
                      onChange={(e) => updateContent("development", {
                        ...content.development,
                        disease_type: e.target.value,
                      })}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    <Textarea
                      value={content.development.therapeutic_class || ''}
                      onChange={(e) => updateContent("development", {
                        ...content.development,
                        therapeutic_class: e.target.value,
                      })}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    <Textarea
                      value={content.development.company || ''}
                      onChange={(e) => updateContent("development", {
                        ...content.development,
                        company: e.target.value,
                      })}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="p-3 border-r border-gray-300">
                    <Textarea
                      value={content.development.company_type || ''}
                      onChange={(e) => updateContent("development", {
                        ...content.development,
                        company_type: e.target.value,
                      })}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="p-3">
                    <Textarea
                      value={content.development.status || ''}
                      onChange={(e) => updateContent("development", {
                        ...content.development,
                        status: e.target.value,
                      })}
                      rows={2}
                      className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        );

      case 4: // Other Sources Tab
        return (
          <div className="space-y-6">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/drugs")}
              >
                Cancel
              </Button>
              <Button
                className="text-white font-medium px-6 py-2"
                style={{ backgroundColor: '#204B73' }}
              >
                Save Changes
              </Button>
            </div>
            {/* Pipeline Data */}
            <div className="space-y-2">
              <Label htmlFor="pipeline_data" className="text-sm font-medium text-gray-700">Pipeline Data</Label>
              <Textarea
                id="pipeline_data"
                value={content.otherSources.pipelineData}
                onChange={(e) =>
                  updateContent("otherSources", {
                    ...content.otherSources,
                    pipelineData: e.target.value,
                  })
                }
                placeholder="Enter pipeline data information..."
                rows={4}
                className="min-h-[120px] border-gray-300"
              />
            </div>

            {/* Press Releases */}
            <div className="space-y-2">
              <Label htmlFor="press_releases" className="text-sm font-medium text-gray-700">Press Releases</Label>
              <Textarea
                id="press_releases"
                value={content.otherSources.pressReleases}
                onChange={(e) =>
                  updateContent("otherSources", {
                    ...content.otherSources,
                    pressReleases: e.target.value,
                  })
                }
                placeholder="Enter press release information..."
                rows={4}
                className="min-h-[120px] border-gray-300"
              />
            </div>

            {/* Publications */}
            <div className="space-y-2">
              <Label htmlFor="publications" className="text-sm font-medium text-gray-700">Publications</Label>
              <Textarea
                id="publications"
                value={content.otherSources.publications}
                onChange={(e) =>
                  updateContent("otherSources", {
                    ...content.otherSources,
                    publications: e.target.value,
                  })
                }
                placeholder="Enter publication information..."
                rows={4}
                className="min-h-[120px] border-gray-300"
              />
            </div>
          </div>
        );


      case 5: // Licensing & Marketing Tab
        return (
          <div className="space-y-6">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/drugs")}
              >
                Cancel
              </Button>
              <Button
                className="text-white font-medium px-6 py-2"
                style={{ backgroundColor: '#204B73' }}
              >
                Save Changes
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="agreement">Agreement Type</Label>
                <SearchableSelect
                  options={drugTechnologyOptions}
                  value={content.licensingMarketing.agreement}
                  onValueChange={(value) =>
                    updateContent("licensingMarketing", {
                      ...content.licensingMarketing,
                      agreement: value,
                    })
                  }
                  placeholder="Select drug technology"
                  searchPlaceholder="Search drug technology..."
                  emptyMessage="No drug technology found."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="licensing_availability">Licensing Availability</Label>
                <Textarea
                  id="licensing_availability"
                  value={content.licensingMarketing.licensing_availability}
                  onChange={(e) =>
                    updateContent("licensingMarketing", {
                      ...content.licensingMarketing,
                      licensing_availability: e.target.value,
                    })
                  }
                  placeholder=""
                  rows={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketing_approvals">Marketing Approvals</Label>
              <Textarea
                id="marketing_approvals"
                value={content.licensingMarketing.marketing_approvals}
                onChange={(e) =>
                  updateContent("licensingMarketing", {
                    ...content.licensingMarketing,
                    marketing_approvals: e.target.value,
                  })
                }
                placeholder=""
                rows={4}
                className="min-h-[120px]"
              />
            </div>
          </div>
        );

      case 6: // Logs Tab
        return (
          <div className="space-y-6">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/drugs")}
              >
                Cancel
              </Button>
              <Button
                className="text-white font-medium px-6 py-2"
                style={{ backgroundColor: '#204B73' }}
              >
                Save Changes
              </Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="drug_changes_log">Drug Changes Log</Label>
              <Textarea
                id="drug_changes_log"
                value={content.logs.drug_changes_log}
                onChange={(e) =>
                  updateContent("logs", {
                    ...content.logs,
                    drug_changes_log: e.target.value,
                  })
                }
                placeholder=""
                rows={4}
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={content.logs.notes}
                onChange={(e) =>
                  updateContent("logs", {
                    ...content.logs,
                    notes: e.target.value,
                  })
                }
                placeholder=""
                rows={4}
                className="min-h-[120px]"
              />
            </div>
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
          {/* Header content can be added here if needed */}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="rounded-lg" style={{ backgroundColor: '#61CCFA66' }}>
        <div className="flex">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-all border-b-2 ${currentStep === step.id
                ? "text-white border-b-transparent"
                : "text-gray-700 border-b-transparent hover:bg-white hover:bg-opacity-20"
                }`}
              style={{
                backgroundColor: currentStep === step.id ? '#204B73' : 'transparent'
              }}
            >
              {step.title}
            </button>
          ))}
        </div>
      </div>

      {/* Active Tab Content Header */}
      <div
        className="rounded-lg p-4"
        style={{ backgroundColor: '#204B73' }}
      >
        <h2 className="text-white text-lg font-semibold">
          {steps.find(step => step.id === currentStep)?.title}
        </h2>
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

