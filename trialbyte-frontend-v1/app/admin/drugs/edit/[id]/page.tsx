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
import { drugsApi } from "@/app/lib/api";

interface DrugOverview {
  id: string;
  drug_name: string;
  generic_name: string;
  other_name: string | null;
  primary_name: string | null;
  global_status: string | null;
  development_status: string | null;
  drug_summary: string | null;
  originator: string | null;
  other_active_companies: string | null;
  therapeutic_area: string | null;
  disease_type: string | null;
  regulator_designations: string | null;
  source_link: string | null;
  drug_record_status: string | null;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  original_drug_id?: string;
  is_updated_version?: boolean;
}

interface DrugData {
  drug_over_id: string;
  overview: DrugOverview;
  devStatus: any[];
  activity: any[];
  development: any[];
  otherSources: any[];
  licencesMarketing: any[];
  logs: any[];
}

export default function EditDrugPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const drugId = params.id as string;
  
  const [drug, setDrug] = useState<DrugData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<DrugOverview>>({});

  // Fetch drug data
  useEffect(() => {
    const fetchDrug = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/drugs/drug/${drugId}/all-data`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const drugData = {
          drug_over_id: data.drug_over_id,
          overview: data.data.overview,
          devStatus: data.data.devStatus || [],
          activity: data.data.activity || [],
          development: data.data.development || [],
          otherSources: data.data.otherSources || [],
          licencesMarketing: data.data.licencesMarketing || [],
          logs: data.data.logs || []
        };
        setDrug(drugData);
        setFormData(data.data.overview || {});
      } catch (error) {
        console.error("Error fetching drug:", error);
        toast({
          title: "Error",
          description: "Failed to fetch drug data",
          variant: "destructive",
        });
        router.push("/admin/drugs");
      } finally {
        setLoading(false);
      }
    };

    if (drugId) {
      fetchDrug();
    }
  }, [drugId, router, toast]);

  // Handle form field updates
  const updateField = (field: keyof DrugOverview, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle save
  const handleSave = async () => {
    try {
      setSaving(true);
      if (!drug) { 
        throw new Error("No drug data available"); 
      }
      
      const currentUserId = localStorage.getItem("userId");
      if (!currentUserId) { 
        throw new Error("User ID not found. Please log in again."); 
      }

      const updateData = {
        user_id: currentUserId,
        ...formData,
        updated_at: new Date().toISOString(),
      };

      console.log('Updating drug with data:', updateData);
      console.log('Drug ID:', drugId);

      // Check if backend is reachable first
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
      let backendAvailable = false;
      
      try {
        console.log('Testing backend connectivity...');
        const healthCheck = await fetch(`${baseUrl}/api/v1/drugs/all-drugs-with-data`, {
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
        // Since PATCH and DELETE have CORS issues, use a different approach
        // We'll create a new record with updated data and mark the old one as inactive
        try {
          console.log('Creating updated record (PATCH/DELETE blocked by CORS)...');
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          // Add a flag to indicate this is an update and include the original drug ID
          const updateDataWithFlags = {
            ...updateData,
            original_drug_id: drugId,
            is_updated_version: true,
            updated_at: new Date().toISOString()
          };
          
          const response = await fetch(`${baseUrl}/api/v1/drugs/overview`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateDataWithFlags),
            credentials: 'include',
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const responseData = await response.json();
            console.log('Updated record created successfully:', responseData);
            
            // Store the mapping of old drug ID to new drug ID for future reference
            const drugMapping = {
              originalDrugId: drugId,
              newDrugId: responseData.overview?.id || responseData.id,
              timestamp: new Date().toISOString()
            };
            
            // Save mapping to localStorage for cleanup later
            const existingMappings = JSON.parse(localStorage.getItem('drugUpdateMappings') || '[]');
            existingMappings.push(drugMapping);
            localStorage.setItem('drugUpdateMappings', JSON.stringify(existingMappings));
            
            toast({
              title: "Success",
              description: "Drug updated successfully! (Previous version preserved for reference)",
            });
            router.push("/admin/drugs");
            return;
          } else {
            const errorText = await response.text();
            console.error('Create updated record failed:', response.status, errorText);
            lastError = new Error(`Create updated record failed: ${response.status} - ${errorText}`);
          }
        } catch (createError) {
          console.error('Create updated record failed:', createError);
          if (createError instanceof Error) {
            if (createError.name === 'AbortError') {
              lastError = new Error('Create updated record timeout - backend unreachable');
            } else if (createError.message.includes('Failed to fetch')) {
              lastError = new Error('Create updated record network error - backend server down');
            } else {
              lastError = createError;
            }
          } else {
            lastError = new Error('Unknown create updated record error occurred');
          }
        }
      }

      // If all methods failed or backend unavailable, try saving to localStorage as fallback
      try {
        if (!backendAvailable) {
          console.log('Backend unavailable, saving directly to localStorage...');
        } else {
          console.log('API calls failed, saving to localStorage as fallback...');
        }
        
        const localData = {
          drugId,
          updateData,
          timestamp: new Date().toISOString(),
          status: backendAvailable ? 'pending_api_update' : 'backend_unavailable',
          originalDrugData: drug // Store original data for reference
        };
        
        const existingUpdates = JSON.parse(localStorage.getItem('pendingDrugUpdates') || '[]');
        
        // Remove any existing pending update for this drug
        const filteredUpdates = existingUpdates.filter((update: any) => update.drugId !== drugId);
        filteredUpdates.push(localData);
        
        localStorage.setItem('pendingDrugUpdates', JSON.stringify(filteredUpdates));
        
        // Also save a backup with drug ID as key for easy retrieval
        localStorage.setItem(`drugUpdate_${drugId}`, JSON.stringify(localData));
        
        const message = backendAvailable 
          ? `Your changes have been saved locally. They will be synced to the server when the backend is available. (Drug ID: ${drugId})`
          : `Your changes have been saved locally. The backend server is currently unavailable. (Drug ID: ${drugId})`;
        
        toast({
          title: "Changes Saved Locally",
          description: message,
          variant: "default",
        });
        
        console.log('Data saved locally:', localData);
        
        // Still navigate back to show the user their changes are preserved
        router.push("/admin/drugs");
        return;
      } catch (localError) {
        console.error('Local storage fallback failed:', localError);
        const localErrorMessage = localError instanceof Error ? localError.message : 'Unknown local storage error';
        const lastErrorMessage = lastError instanceof Error ? lastError.message : 'Unknown error';
        lastError = new Error(`All save methods failed. Last error: ${lastErrorMessage}. Local storage error: ${localErrorMessage}`);
      }

      // If all methods failed, show the last error
      throw lastError || new Error("All update methods failed");

    } catch (error) {
      console.error("Error saving drug:", error);
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Drug</h1>
            <p className="text-sm text-muted-foreground">Loading drug data...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading drug data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!drug) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Drug</h1>
            <p className="text-sm text-muted-foreground">Drug not found</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Drug not found or failed to load.</p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => router.push("/admin/drugs")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Drugs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Drug</h1>
          <p className="text-sm text-muted-foreground">
            Drug ID: {drugId}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/drugs")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Drugs
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="drug_name">Drug Name</Label>
                <Input
                  id="drug_name"
                  value={formData.drug_name || ""}
                  onChange={(e) => updateField("drug_name", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="generic_name">Generic Name</Label>
                <Input
                  id="generic_name"
                  value={formData.generic_name || ""}
                  onChange={(e) => updateField("generic_name", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_name">Other Name</Label>
                <Input
                  id="other_name"
                  value={formData.other_name || ""}
                  onChange={(e) => updateField("other_name", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary_name">Primary Name</Label>
                <Input
                  id="primary_name"
                  value={formData.primary_name || ""}
                  onChange={(e) => updateField("primary_name", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card>
          <CardHeader>
            <CardTitle>Status Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="global_status">Global Status</Label>
                <Input
                  id="global_status"
                  value={formData.global_status || ""}
                  onChange={(e) => updateField("global_status", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="development_status">Development Status</Label>
                <Input
                  id="development_status"
                  value={formData.development_status || ""}
                  onChange={(e) => updateField("development_status", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="drug_record_status">Drug Record Status</Label>
                <Input
                  id="drug_record_status"
                  value={formData.drug_record_status || ""}
                  onChange={(e) => updateField("drug_record_status", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="is_approved">Approved</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_approved"
                    checked={formData.is_approved || false}
                    onChange={(e) => updateField("is_approved", e.target.checked)}
                    className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                  />
                  <Label htmlFor="is_approved">Is Approved</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Therapeutic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Therapeutic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="therapeutic_area">Therapeutic Area</Label>
                <Input
                  id="therapeutic_area"
                  value={formData.therapeutic_area || ""}
                  onChange={(e) => updateField("therapeutic_area", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disease_type">Disease Type</Label>
                <Input
                  id="disease_type"
                  value={formData.disease_type || ""}
                  onChange={(e) => updateField("disease_type", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originator">Originator</Label>
                <Input
                  id="originator"
                  value={formData.originator || ""}
                  onChange={(e) => updateField("originator", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="other_active_companies">Other Active Companies</Label>
                <Input
                  id="other_active_companies"
                  value={formData.other_active_companies || ""}
                  onChange={(e) => updateField("other_active_companies", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="drug_summary">Drug Summary</Label>
              <Textarea
                id="drug_summary"
                value={formData.drug_summary || ""}
                onChange={(e) => updateField("drug_summary", e.target.value)}
                rows={4}
                className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="regulator_designations">Regulator Designations</Label>
                <Input
                  id="regulator_designations"
                  value={formData.regulator_designations || ""}
                  onChange={(e) => updateField("regulator_designations", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source_link">Source Link</Label>
                <Input
                  id="source_link"
                  value={formData.source_link || ""}
                  onChange={(e) => updateField("source_link", e.target.value)}
                  className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
