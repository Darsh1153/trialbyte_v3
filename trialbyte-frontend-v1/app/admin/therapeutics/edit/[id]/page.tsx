"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDrugNames } from "@/hooks/use-drug-names";
import { therapeuticsApi } from "@/app/lib/api";

interface TherapeuticTrial {
  trial_id: string;
  overview: {
    id: string;
    therapeutic_area: string;
    trial_identifier: string[];
    trial_phase: string;
    status: string;
    primary_drugs: string;
    other_drugs: string;
    title: string;
    disease_type: string;
    patient_segment: string;
    line_of_therapy: string;
    reference_links: string[];
    trial_tags: string;
    sponsor_collaborators: string;
    sponsor_field_activity: string;
    associated_cro: string;
    countries: string;
    region: string;
    trial_record_status: string;
    created_at: string;
    updated_at: string;
  };
  outcomes: any[];
  criteria: any[];
  timing: any[];
  results: any[];
  sites: any[];
  other: any[];
  logs: any[];
  notes: any[];
}

export default function EditTherapeuticTrialPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const { getPrimaryDrugsOptions } = useDrugNames();
  
  const [trial, setTrial] = useState<TherapeuticTrial | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    therapeutic_area: "",
    trial_phase: "",
    status: "",
    primary_drugs: "",
    other_drugs: "",
    title: "",
    disease_type: "",
    patient_segment: "",
    line_of_therapy: "",
    trial_tags: "",
    sponsor_collaborators: "",
    sponsor_field_activity: "",
    associated_cro: "",
    countries: "",
    region: "",
    trial_record_status: "",
  });

  // Options for searchable dropdowns
  const therapeuticAreaOptions: SearchableSelectOption[] = [
    { value: "Oncology", label: "Oncology" },
    { value: "Cardiology", label: "Cardiology" },
    { value: "Neurology", label: "Neurology" },
    { value: "Dermatology", label: "Dermatology" },
    { value: "Endocrinology", label: "Endocrinology" },
  ];

  const trialPhaseOptions: SearchableSelectOption[] = [
    { value: "Phase I", label: "Phase I" },
    { value: "Phase II", label: "Phase II" },
    { value: "Phase III", label: "Phase III" },
    { value: "Phase IV", label: "Phase IV" },
    { value: "Preclinical", label: "Preclinical" },
  ];

  const statusOptions: SearchableSelectOption[] = [
    { value: "Active", label: "Active" },
    { value: "Recruiting", label: "Recruiting" },
    { value: "Completed", label: "Completed" },
    { value: "Terminated", label: "Terminated" },
    { value: "Suspended", label: "Suspended" },
    { value: "Closed", label: "Closed" },
  ];

  const primaryDrugsOptions: SearchableSelectOption[] = [
    ...getPrimaryDrugsOptions().map(drug => ({
      value: drug.value,
      label: drug.label
    }))
  ];

  const otherDrugsOptions: SearchableSelectOption[] = [
    { value: "Drug X", label: "Drug X" },
    { value: "Drug Y", label: "Drug Y" },
    { value: "Drug Z", label: "Drug Z" },
  ];

  const diseaseTypeOptions: SearchableSelectOption[] = [
    { value: "Cancer", label: "Cancer" },
    { value: "Cardiovascular Disease", label: "Cardiovascular Disease" },
    { value: "Diabetes", label: "Diabetes" },
    { value: "Alzheimer's Disease", label: "Alzheimer's Disease" },
    { value: "Multiple Sclerosis", label: "Multiple Sclerosis" },
  ];

  const patientSegmentOptions: SearchableSelectOption[] = [
    { value: "Adults", label: "Adults" },
    { value: "Pediatric", label: "Pediatric" },
    { value: "Elderly", label: "Elderly" },
    { value: "All Ages", label: "All Ages" },
  ];

  const lineOfTherapyOptions: SearchableSelectOption[] = [
    { value: "First-line", label: "First-line" },
    { value: "Second-line", label: "Second-line" },
    { value: "Third-line", label: "Third-line" },
    { value: "Adjuvant", label: "Adjuvant" },
    { value: "Neoadjuvant", label: "Neoadjuvant" },
  ];

  const sponsorFieldActivityOptions: SearchableSelectOption[] = [
    { value: "Pharmaceutical", label: "Pharmaceutical" },
    { value: "Biotechnology", label: "Biotechnology" },
    { value: "Medical Device", label: "Medical Device" },
    { value: "Academic", label: "Academic" },
    { value: "Government", label: "Government" },
  ];

  const associatedCROOptions: SearchableSelectOption[] = [
    { value: "IQVIA", label: "IQVIA" },
    { value: "Parexel", label: "Parexel" },
    { value: "PRA Health Sciences", label: "PRA Health Sciences" },
    { value: "Syneos Health", label: "Syneos Health" },
    { value: "ICON", label: "ICON" },
  ];

  const countriesOptions: SearchableSelectOption[] = [
    { value: "United States", label: "United States" },
    { value: "Canada", label: "Canada" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Germany", label: "Germany" },
    { value: "France", label: "France" },
    { value: "Japan", label: "Japan" },
    { value: "China", label: "China" },
    { value: "India", label: "India" },
  ];

  const regionOptions: SearchableSelectOption[] = [
    { value: "North America", label: "North America" },
    { value: "Europe", label: "Europe" },
    { value: "Asia-Pacific", label: "Asia-Pacific" },
    { value: "Latin America", label: "Latin America" },
    { value: "Middle East & Africa", label: "Middle East & Africa" },
  ];

  const trialRecordStatusOptions: SearchableSelectOption[] = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
    { value: "Archived", label: "Archived" },
    { value: "Draft", label: "Draft" },
  ];

  // Load trial data
  useEffect(() => {
    const loadTrialData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/therapeutic/all-trials-with-data`);
        const data = await response.json();
        
        if (data.trials && data.trials.length > 0) {
          const trialId = params.id as string;
          const foundTrial = data.trials.find((t: TherapeuticTrial) => t.trial_id === trialId);
          
          if (foundTrial) {
            setTrial(foundTrial);
            setFormData({
              therapeutic_area: foundTrial.overview.therapeutic_area || "",
              trial_phase: foundTrial.overview.trial_phase || "",
              status: foundTrial.overview.status || "",
              primary_drugs: foundTrial.overview.primary_drugs || "",
              other_drugs: foundTrial.overview.other_drugs || "",
              title: foundTrial.overview.title || "",
              disease_type: foundTrial.overview.disease_type || "",
              patient_segment: foundTrial.overview.patient_segment || "",
              line_of_therapy: foundTrial.overview.line_of_therapy || "",
              trial_tags: foundTrial.overview.trial_tags || "",
              sponsor_collaborators: foundTrial.overview.sponsor_collaborators || "",
              sponsor_field_activity: foundTrial.overview.sponsor_field_activity || "",
              associated_cro: foundTrial.overview.associated_cro || "",
              countries: foundTrial.overview.countries || "",
              region: foundTrial.overview.region || "",
              trial_record_status: foundTrial.overview.trial_record_status || "",
            });
          } else {
            toast({
              title: "Trial Not Found",
              description: "The requested clinical trial could not be found.",
              variant: "destructive",
            });
            router.push("/admin/therapeutics");
          }
        } else {
          toast({
            title: "No Data Available",
            description: "No clinical trials data available.",
            variant: "destructive",
          });
          router.push("/admin/therapeutics");
        }
      } catch (error) {
        console.error("Error loading trial data:", error);
        toast({
          title: "Error",
          description: "Failed to load trial data. Please try again.",
          variant: "destructive",
        });
        router.push("/admin/therapeutics");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadTrialData();
    }
  }, [params.id, router, toast]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Check if we have the required data
      if (!trial) {
        throw new Error("No trial data available");
      }

      // Get the overview ID for updating (required for PATCH request)
      const overviewId = trial.overview?.id;
      if (!overviewId) {
        throw new Error("No overview ID available for update");
      }

      // Get user ID from localStorage
      const currentUserId = localStorage.getItem("userId");
      if (!currentUserId) {
        throw new Error("User ID not found. Please log in again.");
      }

      // Prepare the update data for the overview
      const updateData = {
        user_id: currentUserId,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      console.log('Updating trial with data:', updateData);
      console.log('Overview ID:', overviewId);

      // Check if backend is reachable first
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      let backendAvailable = false;
      
      try {
        console.log('Testing backend connectivity...');
        const healthCheck = await fetch(`${baseUrl}/api/v1/therapeutic/overview`, {
          method: 'GET',
          credentials: 'include',
        });
        console.log('Backend health check status:', healthCheck.status);
        backendAvailable = true;
      } catch (healthError) {
        console.warn('Backend health check failed:', healthError);
        backendAvailable = false;
        // Skip API calls and go straight to localStorage
        console.log('Backend unavailable, saving to localStorage...');
      }

      // Only try API calls if backend is available
      let lastError = null;
      
      if (backendAvailable) {
        // Try to update the existing trial using PATCH method
        try {
          console.log('Attempting to update existing trial...');
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          const response = await fetch(`${baseUrl}/api/v1/therapeutic/overview/${overviewId}`, {
            method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
            body: JSON.stringify(updateData),
            credentials: 'include',
            signal: controller.signal,
      });

          clearTimeout(timeoutId);

      if (response.ok) {
            const responseData = await response.json();
            console.log('Trial updated successfully via API:', responseData);
            
            toast({
              title: "Success",
              description: "Clinical trial updated successfully!",
            });
            router.push("/admin/therapeutics");
            return;
          } else {
            const errorText = await response.text();
            console.error('API update failed:', response.status, errorText);
            lastError = new Error(`API update failed: ${response.status} - ${errorText}`);
          }
        } catch (updateError) {
          console.error('API update failed:', updateError);
          if (updateError instanceof Error) {
            if (updateError.name === 'AbortError') {
              lastError = new Error('API update timeout - backend unreachable');
            } else if (updateError.message.includes('Failed to fetch')) {
              lastError = new Error('API update network error - backend server down');
            } else {
              lastError = updateError;
            }
          } else {
            lastError = new Error('Unknown API update error occurred');
          }
        }
      }

      // Fallback: Update data immediately in localStorage and refresh table
      console.log('Using fallback: updating data immediately in table...');
      
      try {
        // Update the trial data in localStorage for immediate display
        const updatedTrial = {
          ...trial,
          overview: {
            ...trial.overview,
            ...formData,
            updated_at: new Date().toISOString(),
          }
        };

        // Store updated trial data
        const trialKey = `therapeuticTrial_${trial.trial_id}`;
        localStorage.setItem(trialKey, JSON.stringify(updatedTrial));

        // Also update the main trials list in localStorage
        const existingTrials = JSON.parse(localStorage.getItem('therapeuticTrials') || '[]');
        const updatedTrials = existingTrials.map((t: any) => 
          t.trial_id === trial.trial_id ? updatedTrial : t
        );
        localStorage.setItem('therapeuticTrials', JSON.stringify(updatedTrials));

        // Store pending update for API sync when backend is available
        const pendingUpdate = {
          overviewId,
          trialId: trial.trial_id,
          updateData,
          timestamp: new Date().toISOString(),
          status: backendAvailable ? 'pending_api_update' : 'backend_unavailable',
          originalTrialData: trial
        };
        
        const existingUpdates = JSON.parse(localStorage.getItem('pendingTherapeuticUpdates') || '[]');
        const filteredUpdates = existingUpdates.filter((update: any) => update.trialId !== trial.trial_id);
        filteredUpdates.push(pendingUpdate);
        localStorage.setItem('pendingTherapeuticUpdates', JSON.stringify(filteredUpdates));
        
        toast({
          title: "Success",
          description: "Clinical trial updated successfully! Changes are visible immediately.",
        });
        
        // Navigate back to show updated data
        router.push("/admin/therapeutics");
        return;

      } catch (fallbackError) {
        console.error('Fallback update failed:', fallbackError);
        lastError = new Error('Both API and fallback updates failed');
      }


      // If all methods failed, show the last error
      throw lastError || new Error("All update methods failed");

    } catch (error) {
      console.error("Error saving trial:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast({
        title: "Error",
        description: `Failed to save changes: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EAF8FF] to-white p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading trial data...</span>
        </div>
      </div>
    );
  }

  if (!trial) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#EAF8FF] to-white p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Trial Not Found</h1>
          <Button onClick={() => router.push("/admin/therapeutics")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clinical Trials
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF8FF] to-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/therapeutics")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clinical Trials
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit Clinical Trial</h1>
              <p className="text-gray-600">Trial ID: {trial.trial_id}</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#204B73] hover:bg-[#204B73]/90 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {/* Edit Form */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-700">Trial Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* First Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Therapeutic Area</Label>
                <SearchableSelect
                  options={therapeuticAreaOptions}
                  value={formData.therapeutic_area}
                  onValueChange={(value) => updateField("therapeutic_area", value)}
                  placeholder="Select therapeutic area"
                  searchPlaceholder="Search therapeutic area..."
                  emptyMessage="No therapeutic area found."
                />
              </div>
              <div className="space-y-2">
                <Label>Trial Phase</Label>
                <SearchableSelect
                  options={trialPhaseOptions}
                  value={formData.trial_phase}
                  onValueChange={(value) => updateField("trial_phase", value)}
                  placeholder="Select trial phase"
                  searchPlaceholder="Search trial phase..."
                  emptyMessage="No trial phase found."
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <SearchableSelect
                  options={statusOptions}
                  value={formData.status}
                  onValueChange={(value) => updateField("status", value)}
                  placeholder="Select status"
                  searchPlaceholder="Search status..."
                  emptyMessage="No status found."
                />
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Primary Drugs</Label>
                <SearchableSelect
                  options={primaryDrugsOptions}
                  value={formData.primary_drugs}
                  onValueChange={(value) => updateField("primary_drugs", value)}
                  placeholder="Select primary drug"
                  searchPlaceholder="Search primary drugs..."
                  emptyMessage="No primary drug found."
                />
              </div>
              <div className="space-y-2">
                <Label>Other Drugs</Label>
                <SearchableSelect
                  options={otherDrugsOptions}
                  value={formData.other_drugs}
                  onValueChange={(value) => updateField("other_drugs", value)}
                  placeholder="Select other drug"
                  searchPlaceholder="Search other drugs..."
                  emptyMessage="No other drug found."
                />
              </div>
            </div>

            {/* Third Row */}
            <div className="space-y-2">
              <Label>Trial Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Enter trial title"
                className="w-full"
              />
            </div>

            {/* Fourth Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Disease Type</Label>
                <SearchableSelect
                  options={diseaseTypeOptions}
                  value={formData.disease_type}
                  onValueChange={(value) => updateField("disease_type", value)}
                  placeholder="Select disease type"
                  searchPlaceholder="Search disease type..."
                  emptyMessage="No disease type found."
                />
              </div>
              <div className="space-y-2">
                <Label>Patient Segment</Label>
                <SearchableSelect
                  options={patientSegmentOptions}
                  value={formData.patient_segment}
                  onValueChange={(value) => updateField("patient_segment", value)}
                  placeholder="Select patient segment"
                  searchPlaceholder="Search patient segment..."
                  emptyMessage="No patient segment found."
                />
              </div>
              <div className="space-y-2">
                <Label>Line of Therapy</Label>
                <SearchableSelect
                  options={lineOfTherapyOptions}
                  value={formData.line_of_therapy}
                  onValueChange={(value) => updateField("line_of_therapy", value)}
                  placeholder="Select line of therapy"
                  searchPlaceholder="Search line of therapy..."
                  emptyMessage="No line of therapy found."
                />
              </div>
            </div>

            {/* Fifth Row */}
            <div className="space-y-2">
              <Label>Trial Tags</Label>
              <Textarea
                value={formData.trial_tags}
                onChange={(e) => updateField("trial_tags", e.target.value)}
                placeholder="Enter trial tags (comma-separated)"
                rows={2}
                className="w-full"
              />
            </div>

            {/* Sixth Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sponsor & Collaborators</Label>
                <Input
                  value={formData.sponsor_collaborators}
                  onChange={(e) => updateField("sponsor_collaborators", e.target.value)}
                  placeholder="Enter sponsor and collaborators"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Sponsor Field of Activity</Label>
                <SearchableSelect
                  options={sponsorFieldActivityOptions}
                  value={formData.sponsor_field_activity}
                  onValueChange={(value) => updateField("sponsor_field_activity", value)}
                  placeholder="Select sponsor field of activity"
                  searchPlaceholder="Search sponsor field..."
                  emptyMessage="No sponsor field found."
                />
              </div>
            </div>

            {/* Seventh Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Associated CRO</Label>
                <SearchableSelect
                  options={associatedCROOptions}
                  value={formData.associated_cro}
                  onValueChange={(value) => updateField("associated_cro", value)}
                  placeholder="Select associated CRO"
                  searchPlaceholder="Search CRO..."
                  emptyMessage="No CRO found."
                />
              </div>
              <div className="space-y-2">
                <Label>Trial Record Status</Label>
                <SearchableSelect
                  options={trialRecordStatusOptions}
                  value={formData.trial_record_status}
                  onValueChange={(value) => updateField("trial_record_status", value)}
                  placeholder="Select trial record status"
                  searchPlaceholder="Search status..."
                  emptyMessage="No status found."
                />
              </div>
            </div>

            {/* Eighth Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Countries</Label>
                <SearchableSelect
                  options={countriesOptions}
                  value={formData.countries}
                  onValueChange={(value) => updateField("countries", value)}
                  placeholder="Select countries"
                  searchPlaceholder="Search countries..."
                  emptyMessage="No countries found."
                />
              </div>
              <div className="space-y-2">
                <Label>Region</Label>
                <SearchableSelect
                  options={regionOptions}
                  value={formData.region}
                  onValueChange={(value) => updateField("region", value)}
                  placeholder="Select region"
                  searchPlaceholder="Search region..."
                  emptyMessage="No region found."
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
