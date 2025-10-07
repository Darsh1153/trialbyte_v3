"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check, Loader2, Plus, X, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEditDrugForm } from "../context/edit-drug-form-context";
import { useDrugNames } from "@/hooks/use-drug-names";

const steps = [
  { id: 1, title: "Overview", description: "Basic drug information" },
  { id: 2, title: "Drug Activity", description: "Mechanism and biological details" },
  { id: 3, title: "Development", description: "Development status and company info" },
  { id: 4, title: "Other Sources", description: "Additional data sources" },
  { id: 5, title: "Licensing & Marketing", description: "Commercial information" },
  { id: 6, title: "Logs", description: "Change logs and notes" },
];

export default function EditDrugPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { addDrugName, getPrimaryNameOptions } = useDrugNames();
  const { formData, updateField, addArrayItem, removeArrayItem, updateArrayItem, saveDrug, isLoading, isSaving } = useEditDrugForm();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState("pipeline_data");

  const drugId = params.id as string;

  // Options for searchable dropdowns
  const primaryNameOptions: SearchableSelectOption[] = [
    ...getPrimaryNameOptions().map(drug => ({
      value: drug.value,
      label: drug.label
    }))
  ];

  const globalStatusOptions: SearchableSelectOption[] = [
    { value: "clinical_phase_1", label: "Clinical Phase I" },
    { value: "clinical_phase_2", label: "Clinical Phase II" },
    { value: "clinical_phase_3", label: "Clinical Phase III" },
    { value: "clinical_phase_4", label: "Clinical Phase IV" },
    { value: "discontinued", label: "Discontinued" },
    { value: "launched", label: "Launched" },
    { value: "no_development_reported", label: "No Development Reported" },
    { value: "preclinical", label: "Preclinical" },
  ];

  const developmentStatusOptions: SearchableSelectOption[] = [
    { value: "active_development", label: "Active development" },
    { value: "discontinued", label: "Discontinued" },
    { value: "marketed", label: "Marketed" },
  ];

  const originatorOptions: SearchableSelectOption[] = [
    { value: "pfizer", label: "Pfizer" },
    { value: "novartis", label: "Novartis" },
    { value: "roche", label: "Roche" },
    { value: "merck", label: "Merck" },
    { value: "bristol_myers_squibb", label: "Bristol Myers Squibb" },
    { value: "johnson_johnson", label: "Johnson & Johnson" },
    { value: "gilead", label: "Gilead" },
    { value: "amgen", label: "Amgen" },
    { value: "biogen", label: "Biogen" },
    { value: "regeneron", label: "Regeneron" },
  ];

  const therapeuticAreaOptions: SearchableSelectOption[] = [
    { value: "oncology", label: "Oncology" },
    { value: "cardiology", label: "Cardiology" },
    { value: "neurology", label: "Neurology" },
    { value: "immunology", label: "Immunology" },
    { value: "infectious_diseases", label: "Infectious Diseases" },
    { value: "metabolic_disorders", label: "Metabolic Disorders" },
    { value: "respiratory", label: "Respiratory" },
    { value: "gastroenterology", label: "Gastroenterology" },
    { value: "dermatology", label: "Dermatology" },
    { value: "ophthalmology", label: "Ophthalmology" },
  ];

  const diseaseTypeOptions: SearchableSelectOption[] = [
    { value: "cancer", label: "Cancer" },
    { value: "diabetes", label: "Diabetes" },
    { value: "alzheimers", label: "Alzheimer's Disease" },
    { value: "parkinsons", label: "Parkinson's Disease" },
    { value: "multiple_sclerosis", label: "Multiple Sclerosis" },
    { value: "rheumatoid_arthritis", label: "Rheumatoid Arthritis" },
    { value: "lupus", label: "Lupus" },
    { value: "crohns_disease", label: "Crohn's Disease" },
    { value: "ulcerative_colitis", label: "Ulcerative Colitis" },
    { value: "psoriasis", label: "Psoriasis" },
  ];

  const regulatoryDesignationsOptions: SearchableSelectOption[] = [
    { value: "orphan_drug", label: "Orphan Drug" },
    { value: "breakthrough_therapy", label: "Breakthrough Therapy" },
    { value: "fast_track", label: "Fast Track" },
    { value: "priority_review", label: "Priority Review" },
    { value: "accelerated_approval", label: "Accelerated Approval" },
    { value: "conditional_approval", label: "Conditional Approval" },
    { value: "emergency_use_authorization", label: "Emergency Use Authorization" },
  ];

  const drugRecordStatusOptions: SearchableSelectOption[] = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "pending", label: "Pending" },
    { value: "archived", label: "Archived" },
  ];

  const mechanismOfActionOptions: SearchableSelectOption[] = [
    { value: "enzyme_inhibitor", label: "Enzyme Inhibitor" },
    { value: "receptor_antagonist", label: "Receptor Antagonist" },
    { value: "receptor_agonist", label: "Receptor Agonist" },
    { value: "ion_channel_modulator", label: "Ion Channel Modulator" },
    { value: "monoclonal_antibody", label: "Monoclonal Antibody" },
    { value: "small_molecule", label: "Small Molecule" },
    { value: "gene_therapy", label: "Gene Therapy" },
    { value: "cell_therapy", label: "Cell Therapy" },
  ];

  const biologicalTargetOptions: SearchableSelectOption[] = [
    { value: "protein", label: "Protein" },
    { value: "enzyme", label: "Enzyme" },
    { value: "receptor", label: "Receptor" },
    { value: "ion_channel", label: "Ion Channel" },
    { value: "dna", label: "DNA" },
    { value: "rna", label: "RNA" },
    { value: "lipid", label: "Lipid" },
    { value: "carbohydrate", label: "Carbohydrate" },
  ];

  const deliveryRouteOptions: SearchableSelectOption[] = [
    { value: "oral", label: "Oral" },
    { value: "intravenous", label: "Intravenous" },
    { value: "subcutaneous", label: "Subcutaneous" },
    { value: "intramuscular", label: "Intramuscular" },
    { value: "topical", label: "Topical" },
    { value: "inhalation", label: "Inhalation" },
    { value: "transdermal", label: "Transdermal" },
    { value: "intranasal", label: "Intranasal" },
  ];

  const drugTechnologyOptions: SearchableSelectOption[] = [
    { value: "small_molecule", label: "Small Molecule" },
    { value: "biologic", label: "Biologic" },
    { value: "monoclonal_antibody", label: "Monoclonal Antibody" },
    { value: "vaccine", label: "Vaccine" },
    { value: "gene_therapy", label: "Gene Therapy" },
    { value: "cell_therapy", label: "Cell Therapy" },
    { value: "rna_therapy", label: "RNA Therapy" },
    { value: "protein_therapy", label: "Protein Therapy" },
  ];

  const deliveryMediumOptions: SearchableSelectOption[] = [
    { value: "tablet", label: "Tablet" },
    { value: "capsule", label: "Capsule" },
    { value: "injection", label: "Injection" },
    { value: "cream", label: "Cream" },
    { value: "gel", label: "Gel" },
    { value: "patch", label: "Patch" },
    { value: "inhaler", label: "Inhaler" },
    { value: "spray", label: "Spray" },
  ];

  const companyTypeOptions: SearchableSelectOption[] = [
    { value: "pharmaceutical", label: "Pharmaceutical" },
    { value: "biotechnology", label: "Biotechnology" },
    { value: "medical_device", label: "Medical Device" },
    { value: "diagnostics", label: "Diagnostics" },
    { value: "contract_research", label: "Contract Research" },
    { value: "academic", label: "Academic" },
    { value: "government", label: "Government" },
    { value: "non_profit", label: "Non-Profit" },
  ];

  const handleSubmit = async () => {
    try {
      await saveDrug(drugId);
      toast({
        title: "Success",
        description: "Drug updated successfully",
        duration: 5000,
      });
      // Add refresh parameter to trigger table refresh
      router.push("/admin/drugs?refresh=true");
    } catch (error) {
      console.error("Error updating drug:", error);
      toast({
        title: "Error",
        description: "Failed to update drug",
        variant: "destructive",
      });
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
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
            {/* First Row: Drug Name, Generic Name, Other Name */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="drug_name" className="text-sm font-medium text-gray-700">Drug Name</Label>
                <div className="relative">
                  <Textarea
                    id="drug_name"
                    value={formData.overview.drug_name}
                    onChange={(e) => updateField("overview", "drug_name", e.target.value)}
                    placeholder=""
                    rows={2}
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                  <Plus 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                    onClick={() => {
                      if (formData.overview.drug_name.trim()) {
                        addDrugName(formData.overview.drug_name, 'drug_name');
                        toast({
                          title: "Added to Primary Name",
                          description: `"${formData.overview.drug_name}" added to Primary Name dropdown`,
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
                    value={formData.overview.generic_name}
                    onChange={(e) => updateField("overview", "generic_name", e.target.value)}
                    placeholder=""
                    rows={2}
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                  <Plus 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                    onClick={() => {
                      if (formData.overview.generic_name.trim()) {
                        addDrugName(formData.overview.generic_name, 'generic_name');
                        toast({
                          title: "Added to Primary Name",
                          description: `"${formData.overview.generic_name}" added to Primary Name dropdown`,
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
                    value={formData.overview.other_name}
                    onChange={(e) => updateField("overview", "other_name", e.target.value)}
                    placeholder=""
                    rows={2}
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                  <Plus 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer hover:text-gray-600" 
                    onClick={() => {
                      if (formData.overview.other_name.trim()) {
                        addDrugName(formData.overview.other_name, 'other_name');
                        toast({
                          title: "Added to Primary Name",
                          description: `"${formData.overview.other_name}" added to Primary Name dropdown`,
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
                  value={formData.overview.primary_name}
                  onValueChange={(value) => updateField("overview", "primary_name", value)}
                  placeholder="Select or enter primary name"
                  searchPlaceholder="Search primary names..."
                  emptyMessage="No primary names found."
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="global_status" className="text-sm font-medium text-gray-700">Global Status</Label>
                <SearchableSelect
                  options={globalStatusOptions}
                  value={formData.overview.global_status}
                  onValueChange={(value) => updateField("overview", "global_status", value)}
                  placeholder="Select global status"
                  searchPlaceholder="Search global status..."
                  emptyMessage="No global status found."
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="development_status" className="text-sm font-medium text-gray-700">Development Status</Label>
                <SearchableSelect
                  options={developmentStatusOptions}
                  value={formData.overview.development_status}
                  onValueChange={(value) => updateField("overview", "development_status", value)}
                  placeholder="Select development status"
                  searchPlaceholder="Search development status..."
                  emptyMessage="No development status found."
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
            </div>

            {/* Third Row: Drug Summary */}
            <div className="space-y-2">
              <Label htmlFor="drug_summary" className="text-sm font-medium text-gray-700">Drug Summary</Label>
              <Textarea
                id="drug_summary"
                value={formData.overview.drug_summary}
                onChange={(e) => updateField("overview", "drug_summary", e.target.value)}
                placeholder="Enter drug summary"
                rows={3}
                className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              />
            </div>

            {/* Fourth Row: Originator, Other Active Companies, Therapeutic Area */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originator" className="text-sm font-medium text-gray-700">Originator</Label>
                <SearchableSelect
                  options={originatorOptions}
                  value={formData.overview.originator}
                  onValueChange={(value) => updateField("overview", "originator", value)}
                  placeholder="Select originator"
                  searchPlaceholder="Search originator..."
                  emptyMessage="No originator found."
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_active_companies" className="text-sm font-medium text-gray-700">Other Active Companies</Label>
                <Textarea
                  id="other_active_companies"
                  value={formData.overview.other_active_companies}
                  onChange={(e) => updateField("overview", "other_active_companies", e.target.value)}
                  placeholder="Enter other active companies"
                  rows={2}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="therapeutic_area" className="text-sm font-medium text-gray-700">Therapeutic Area</Label>
                <SearchableSelect
                  options={therapeuticAreaOptions}
                  value={formData.overview.therapeutic_area}
                  onValueChange={(value) => updateField("overview", "therapeutic_area", value)}
                  placeholder="Select therapeutic area"
                  searchPlaceholder="Search therapeutic area..."
                  emptyMessage="No therapeutic area found."
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
            </div>

            {/* Fifth Row: Disease Type, Regulatory Designations */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="disease_type" className="text-sm font-medium text-gray-700">Disease Type</Label>
                <SearchableSelect
                  options={diseaseTypeOptions}
                  value={formData.overview.disease_type}
                  onValueChange={(value) => updateField("overview", "disease_type", value)}
                  placeholder="Select disease type"
                  searchPlaceholder="Search disease type..."
                  emptyMessage="No disease type found."
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="regulator_designations" className="text-sm font-medium text-gray-700">Regulator Designations</Label>
                <SearchableSelect
                  options={regulatoryDesignationsOptions}
                  value={formData.overview.regulatory_designations}
                  onValueChange={(value) => updateField("overview", "regulatory_designations", value)}
                  placeholder="Select regulatory designations"
                  searchPlaceholder="Search regulatory designations..."
                  emptyMessage="No regulatory designations found."
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
            </div>

            {/* Bottom Row: Source Link, Drug Record Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source_link" className="text-sm font-medium text-gray-700">Source Link</Label>
                <div className="relative">
                  <Textarea
                    id="source_link"
                    value={formData.overview.source_links}
                    onChange={(e) => updateField("overview", "source_links", e.target.value)}
                    placeholder=""
                    rows={2}
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                  <Plus className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="drug_record_status" className="text-sm font-medium text-gray-700">Drug Record Status</Label>
                <SearchableSelect
                  options={drugRecordStatusOptions}
                  value={formData.overview.drug_record_status}
                  onValueChange={(value) => updateField("overview", "drug_record_status", value)}
                  placeholder="Select drug record status"
                  searchPlaceholder="Search drug record status..."
                  emptyMessage="No drug record status found."
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
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
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {/* First Row: Mechanism of Action, Biological Target */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Mechanism of action</Label>
                <SearchableSelect
                  options={mechanismOfActionOptions}
                  value={formData.activity.mechanism_of_action}
                  onValueChange={(value) => updateField("activity", "mechanism_of_action", value)}
                  placeholder="Select mechanism of action"
                  searchPlaceholder="Search mechanism of action..."
                  emptyMessage="No mechanism of action found."
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Biological target</Label>
                <SearchableSelect
                  options={biologicalTargetOptions}
                  value={formData.activity.biological_target}
                  onValueChange={(value) => updateField("activity", "biological_target", value)}
                  placeholder="Select biological target"
                  searchPlaceholder="Search biological target..."
                  emptyMessage="No biological target found."
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
            </div>

            {/* Second Row: Delivery Route, Drug Technology */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Delivery route</Label>
                <SearchableSelect
                  options={deliveryRouteOptions}
                  value={formData.activity.delivery_route}
                  onValueChange={(value) => updateField("activity", "delivery_route", value)}
                  placeholder="Select delivery route"
                  searchPlaceholder="Search delivery route..."
                  emptyMessage="No delivery route found."
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Drug technology</Label>
                <SearchableSelect
                  options={drugTechnologyOptions}
                  value={formData.activity.drug_technology}
                  onValueChange={(value) => updateField("activity", "drug_technology", value)}
                  placeholder="Select drug technology"
                  searchPlaceholder="Search drug technology..."
                  emptyMessage="No drug technology found."
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
            </div>

            {/* Third Row: Delivery Medium */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Delivery medium</Label>
                <SearchableSelect
                  options={deliveryMediumOptions}
                  value={formData.activity.delivery_medium}
                  onValueChange={(value) => updateField("activity", "delivery_medium", value)}
                  placeholder="Select delivery medium"
                  searchPlaceholder="Search delivery medium..."
                  emptyMessage="No delivery medium found."
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
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
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Development</h3>

            {/* Development Status Information */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-700">Development Status</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Disease Type</Label>
                  <SearchableSelect
                    options={diseaseTypeOptions}
                    value={formData.devStatus.disease_type}
                    onValueChange={(value) => updateField("devStatus", "disease_type", value)}
                    placeholder="Select disease type"
                    searchPlaceholder="Search disease type..."
                    emptyMessage="No disease type found."
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Therapeutic Class</Label>
                  <Input
                    value={formData.devStatus.therapeutic_class}
                    onChange={(e) => updateField("devStatus", "therapeutic_class", e.target.value)}
                    placeholder="Enter therapeutic class"
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Company</Label>
                  <Input
                    value={formData.devStatus.company}
                    onChange={(e) => updateField("devStatus", "company", e.target.value)}
                    placeholder="Enter company name"
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Company Type</Label>
                  <SearchableSelect
                    options={companyTypeOptions}
                    value={formData.devStatus.company_type}
                    onValueChange={(value) => updateField("devStatus", "company_type", value)}
                    placeholder="Select company type"
                    searchPlaceholder="Search company type..."
                    emptyMessage="No company type found."
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <SearchableSelect
                    options={developmentStatusOptions}
                    value={formData.devStatus.status}
                    onValueChange={(value) => updateField("devStatus", "status", value)}
                    placeholder="Select status"
                    searchPlaceholder="Search status..."
                    emptyMessage="No status found."
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Reference</Label>
                  <Input
                    value={formData.devStatus.reference}
                    onChange={(e) => updateField("devStatus", "reference", e.target.value)}
                    placeholder="Enter reference"
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
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
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {/* Other Sources Card with Tabs */}
            <Card className="border rounded-lg shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Other sources</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Tab Navigation */}
                <div className="flex gap-2 border-b pb-2 px-6 pt-4">
                  {[
                    { key: "pipeline_data", label: "Pipeline Data" },
                    { key: "press_releases", label: "Press Releases" },
                    { key: "publications", label: "Publications" },
                  ].map((tab) => (
                    <Button
                      key={tab.key}
                      type="button"
                      variant={activeTab === tab.key ? "default" : "outline"}
                      onClick={() => setActiveTab(tab.key)}
                      className="text-sm"
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === "pipeline_data" && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">Pipeline Data</Label>
                      <Textarea
                        value={formData.otherSources.pipelineData}
                        onChange={(e) => updateField("otherSources", "pipelineData", e.target.value)}
                        placeholder="Enter pipeline data information"
                        rows={6}
                        className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                      />
                    </div>
                  )}

                  {activeTab === "press_releases" && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">Press Releases</Label>
                      <Textarea
                        value={formData.otherSources.pressReleases}
                        onChange={(e) => updateField("otherSources", "pressReleases", e.target.value)}
                        placeholder="Enter press releases information"
                        rows={6}
                        className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                      />
                    </div>
                  )}

                  {activeTab === "publications" && (
                    <div className="space-y-4">
                      <Label className="text-sm font-medium text-gray-700">Publications</Label>
                      <Textarea
                        value={formData.otherSources.publications}
                        onChange={(e) => updateField("otherSources", "publications", e.target.value)}
                        placeholder="Enter publications information"
                        rows={6}
                        className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
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
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {/* Agreement */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Agreement</Label>
              {formData.licencesMarketing.agreement_rows?.map((row, index) => (
                <div key={index} className="relative">
                  <Textarea
                    value={row}
                    onChange={(e) => updateArrayItem("licencesMarketing", "agreement_rows", index, e.target.value)}
                    placeholder="Enter agreement details"
                    rows={2}
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("licencesMarketing", "agreement_rows", index)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem("licencesMarketing", "agreement_rows", "")}
                className="text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Agreement
              </Button>
            </div>

            {/* Marketing Approvals */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Marketing Approvals</Label>
              {formData.licencesMarketing.marketing_approvals_rows?.map((row, index) => (
                <div key={index} className="relative">
                  <Textarea
                    value={row}
                    onChange={(e) => updateArrayItem("licencesMarketing", "marketing_approvals_rows", index, e.target.value)}
                    placeholder="Enter marketing approval details"
                    rows={2}
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("licencesMarketing", "marketing_approvals_rows", index)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem("licencesMarketing", "marketing_approvals_rows", "")}
                className="text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Marketing Approval
              </Button>
            </div>

            {/* Licensing Availability */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Licensing Availability</Label>
              {formData.licencesMarketing.licensing_availability_rows?.map((row, index) => (
                <div key={index} className="relative">
                  <Textarea
                    value={row}
                    onChange={(e) => updateArrayItem("licencesMarketing", "licensing_availability_rows", index, e.target.value)}
                    placeholder="Enter licensing availability details"
                    rows={2}
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                  {index > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem("licencesMarketing", "licensing_availability_rows", index)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem("licencesMarketing", "licensing_availability_rows", "")}
                className="text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Licensing Availability
              </Button>
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
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {/* Drug Changes Log */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Drug Changes Log</Label>
              <Input
                value={formData.logs.drug_changes_log}
                onChange={(e) => updateField("logs", "drug_changes_log", e.target.value)}
                placeholder="Enter drug changes log"
                className="w-full border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              />
            </div>

            {/* First Row: Created Date, Last Modified Date, Last Modified User */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Drug Added Date</Label>
                <Input
                  type="date"
                  value={formData.logs.drug_added_date}
                  onChange={(e) => updateField("logs", "drug_added_date", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Last Modified Date</Label>
                <Input
                  type="date"
                  value={formData.logs.last_modified_date}
                  onChange={(e) => updateField("logs", "last_modified_date", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Last Modified User</Label>
                <Input
                  value={formData.logs.last_modified_user}
                  onChange={(e) => updateField("logs", "last_modified_user", e.target.value)}
                  placeholder="Enter last modified user"
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
            </div>

            {/* Second Row: Full Review User, Full Review Checkbox, Next Review Date */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Full Review User</Label>
                <Input
                  value={formData.logs.full_review_user}
                  onChange={(e) => updateField("logs", "full_review_user", e.target.value)}
                  placeholder="Enter full review user"
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Full Review</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="full_review"
                    checked={formData.logs.full_review}
                    onCheckedChange={(checked) => updateField("logs", "full_review", checked)}
                  />
                  <Label htmlFor="full_review" className="text-sm">Mark as fully reviewed</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Next Review Date</Label>
                <Input
                  type="date"
                  value={formData.logs.next_review_date}
                  onChange={(e) => updateField("logs", "next_review_date", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Notes</Label>
              <Textarea
                value={formData.logs.notes}
                onChange={(e) => updateField("logs", "notes", e.target.value)}
                placeholder="Enter additional notes"
                rows={4}
                className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EAF8FF] to-white p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading drug data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF8FF] to-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Drug</h1>
            <p className="text-sm text-gray-600">Modify drug information across all sections</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/admin/drugs")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Drugs
          </Button>
        </div>

        {/* Step Navigation */}
        <div className="flex items-center space-x-2">
          {steps.map((step) => (
            <Button
              key={step.id}
              variant={currentStep === step.id ? "default" : "outline"}
              onClick={() => setCurrentStep(step.id)}
              className="flex-1"
            >
              {step.title}
            </Button>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <p className="text-sm text-gray-600">{steps[currentStep - 1].description}</p>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/drugs")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <div className="flex space-x-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            )}
            {currentStep < steps.length && (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {currentStep === steps.length && (
              <Button
                onClick={handleSubmit}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating Drug...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Update Drug
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}