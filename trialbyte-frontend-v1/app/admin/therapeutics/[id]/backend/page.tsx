"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Maximize2, Minimize2, X, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect, SearchableSelectOption } from "@/components/ui/searchable-select";
import { useEditTherapeuticForm } from "../../edit/context/edit-form-context";
import FormProgress from "../../edit/components/form-progress";

// Types based on the API response
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
  outcomes: Array<{
    id: string;
    trial_id: string;
    purpose_of_trial: string;
    summary: string;
    primary_outcome_measure: string;
    other_outcome_measure: string;
    study_design_keywords: string;
    study_design: string;
    treatment_regimen: string;
    number_of_arms: number;
  }>;
  criteria: Array<{
    id: string;
    trial_id: string;
    inclusion_criteria: string;
    exclusion_criteria: string;
    age_from: string;
    subject_type: string;
    age_to: string;
    sex: string;
    healthy_volunteers: string;
    target_no_volunteers: number;
    actual_enrolled_volunteers: number | null;
  }>;
  timing: Array<{
    id: string;
    trial_id: string;
    start_date_estimated: string | null;
    trial_end_date_estimated: string | null;
  }>;
  results: Array<{
    id: string;
    trial_id: string;
    trial_outcome: string;
    reference: string;
    trial_results: string[];
    adverse_event_reported: string;
    adverse_event_type: string | null;
    treatment_for_adverse_events: string | null;
  }>;
  sites: Array<{
    id: string;
    trial_id: string;
    total: number;
    notes: string;
  }>;
  other: Array<{
    id: string;
    trial_id: string;
    data: string;
  }>;
  logs: Array<{
    id: string;
    trial_id: string;
    trial_changes_log: string;
    trial_added_date: string;
    last_modified_date: string | null;
    last_modified_user: string | null;
    full_review_user: string | null;
    next_review_date: string | null;
  }>;
  notes: Array<{
    id: string;
    trial_id: string;
    date_type: string;
    notes: string;
    link: string;
    attachments: string[] | null;
  }>;
}

export default function TherapeuticBackendView({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  const [trial, setTrial] = useState<TherapeuticTrial | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  const [showRawData, setShowRawData] = useState(false);

  // Resolve params
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  // Fetch trial data
  useEffect(() => {
    if (!resolvedParams) return;

    const fetchTrial = async () => {
      try {
        setLoading(true);
        const trialId = resolvedParams.id;
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/therapeutic/trial/${trialId}/all-data`);
        
        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: "Trial Not Found",
              description: "The requested therapeutic trial could not be found.",
              variant: "destructive",
            });
            router.push("/admin/therapeutics");
            return;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.data) {
          const transformedTrial: TherapeuticTrial = {
            trial_id: data.trial_id,
            overview: {
              id: data.data.overview.id,
              therapeutic_area: data.data.overview.therapeutic_area || "N/A",
              trial_identifier: data.data.overview.trial_identifier || [],
              trial_phase: data.data.overview.trial_phase || "N/A",
              status: data.data.overview.status || "N/A",
              primary_drugs: data.data.overview.primary_drugs || "N/A",
              other_drugs: data.data.overview.other_drugs || "N/A",
              title: data.data.overview.title || "N/A",
              disease_type: data.data.overview.disease_type || "N/A",
              patient_segment: data.data.overview.patient_segment || "N/A",
              line_of_therapy: data.data.overview.line_of_therapy || "N/A",
              reference_links: data.data.overview.reference_links || [],
              trial_tags: data.data.overview.trial_tags || "N/A",
              sponsor_collaborators: data.data.overview.sponsor_collaborators || "N/A",
              sponsor_field_activity: data.data.overview.sponsor_field_activity || "N/A",
              associated_cro: data.data.overview.associated_cro || "N/A",
              countries: data.data.overview.countries || "N/A",
              region: data.data.overview.region || "N/A",
              trial_record_status: data.data.overview.trial_record_status || "N/A",
              created_at: data.data.overview.created_at || "N/A",
              updated_at: data.data.overview.updated_at || "N/A",
            },
            outcomes: data.data.outcomes.map((outcome: any) => ({
              id: outcome.id,
              trial_id: outcome.trial_id,
              purpose_of_trial: outcome.purpose_of_trial || "N/A",
              summary: outcome.summary || "N/A",
              primary_outcome_measure: outcome.primary_outcome_measure || "N/A",
              other_outcome_measure: outcome.other_outcome_measure || "N/A",
              study_design_keywords: outcome.study_design_keywords || "N/A",
              study_design: outcome.study_design || "N/A",
              treatment_regimen: outcome.treatment_regimen || "N/A",
              number_of_arms: outcome.number_of_arms || 0,
            })),
            criteria: data.data.criteria.map((criterion: any) => ({
              id: criterion.id,
              trial_id: criterion.trial_id,
              inclusion_criteria: criterion.inclusion_criteria || "N/A",
              exclusion_criteria: criterion.exclusion_criteria || "N/A",
              age_from: criterion.age_from || "N/A",
              subject_type: criterion.subject_type || "N/A",
              age_to: criterion.age_to || "N/A",
              sex: criterion.sex || "N/A",
              healthy_volunteers: criterion.healthy_volunteers || "N/A",
              target_no_volunteers: criterion.target_no_volunteers || 0,
              actual_enrolled_volunteers: criterion.actual_enrolled_volunteers || null,
            })),
            timing: data.data.timing.map((timing: any) => ({
              id: timing.id,
              trial_id: timing.trial_id,
              start_date_estimated: timing.start_date_estimated || null,
              trial_end_date_estimated: timing.trial_end_date_estimated || null,
            })),
            results: data.data.results.map((result: any) => ({
              id: result.id,
              trial_id: result.trial_id,
              trial_outcome: result.trial_outcome || "N/A",
              reference: result.reference || "N/A",
              trial_results: result.trial_results || [],
              adverse_event_reported: result.adverse_event_reported || "N/A",
              adverse_event_type: result.adverse_event_type || "N/A",
              treatment_for_adverse_events: result.treatment_for_adverse_events || "N/A",
            })),
            sites: data.data.sites.map((site: any) => ({
              id: site.id,
              trial_id: site.trial_id,
              total: site.total || 0,
              notes: site.notes || "N/A",
            })),
            other: data.data.other.map((other: any) => ({
              id: other.id,
              trial_id: other.trial_id,
              data: other.data || "N/A",
            })),
            logs: data.data.logs.map((log: any) => ({
              id: log.id,
              trial_id: log.trial_id,
              trial_changes_log: log.trial_changes_log || "N/A",
              trial_added_date: log.trial_added_date || "N/A",
              last_modified_date: log.last_modified_date || "N/A",
              last_modified_user: log.last_modified_user || "N/A",
              full_review_user: log.full_review_user || "N/A",
              next_review_date: log.next_review_date || "N/A",
            })),
            notes: data.data.notes.map((note: any) => ({
              id: note.id,
              trial_id: note.trial_id,
              date_type: note.date_type || "N/A",
              notes: note.notes || "N/A",
              link: note.link || "N/A",
              attachments: (() => {
                if (Array.isArray(note.attachments)) {
                  return note.attachments;
                } else if (typeof note.attachments === 'string' && note.attachments.trim()) {
                  try {
                    const parsed = JSON.parse(note.attachments);
                    return Array.isArray(parsed) ? parsed : [note.attachments];
                  } catch {
                    return note.attachments.includes(',') 
                      ? note.attachments.split(',').map((item: string) => item.trim()).filter((item: string) => item)
                      : [note.attachments];
                  }
                }
                return [];
              })(),
            })),
          };
          
          setTrial(transformedTrial);
        } else {
          toast({
            title: "No Data Available",
            description: "Unable to load trial data.",
            variant: "destructive",
          });
          router.push("/admin/therapeutics");
        }
      } catch (error) {
        console.error("Error fetching trial:", error);
        toast({
          title: "Error",
          description: "Failed to load trial data.",
          variant: "destructive",
        });
        router.push("/admin/therapeutics");
      } finally {
        setLoading(false);
      }
    };

    fetchTrial();
  }, [resolvedParams, router]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      // Maximize window
      window.moveTo(0, 0);
      window.resizeTo(screen.width, screen.height);
    } else {
      // Restore window
      window.resizeTo(1200, 800);
      window.moveTo(100, 100);
    }
  };

  const closeWindow = () => {
    window.close();
  };

  const copyToClipboard = () => {
    if (trial) {
      navigator.clipboard.writeText(JSON.stringify(trial, null, 2));
      toast({
        title: "Copied to Clipboard",
        description: "Trial data has been copied to clipboard.",
      });
    }
  };

  const downloadJSON = () => {
    if (trial) {
      const dataStr = JSON.stringify(trial, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `trial_${trial.trial_id}_backend_data.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Download Complete",
        description: "Trial backend data has been downloaded.",
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString || dateString === "N/A") return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Loading trial backend data...</p>
        </div>
      </div>
    );
  }

  if (!trial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">Failed to load trial data</p>
          <Button onClick={() => router.push("/admin/therapeutics")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trials
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isMaximized ? 'p-0' : 'p-4'}`}>
      {/* Header with window controls */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/therapeutics")}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trials
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Backend View - Trial {trial.trial_id}
            </h1>
            <p className="text-sm text-gray-500">
              Complete trial data for {trial.overview.title || "Untitled Trial"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Backend Data
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRawData(!showRawData)}
            className="text-gray-600 hover:text-gray-900"
          >
            {showRawData ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showRawData ? "Hide Raw" : "Show Raw"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="text-gray-600 hover:text-gray-900"
          >
            Copy JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadJSON}
            className="text-gray-600 hover:text-gray-900"
          >
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMaximize}
            className="text-gray-600 hover:text-gray-900"
          >
            {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={closeWindow}
            className="text-red-600 hover:text-red-900"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className={`${isMaximized ? 'h-screen' : 'h-[calc(100vh-120px)]'} overflow-auto`}>
        {showRawData ? (
          /* Raw JSON Data Display */
          <Card className="m-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Raw Trial Data (JSON)</span>
                <div className="text-sm text-gray-500">
                  Last Updated: {formatDate(trial.overview.updated_at)}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm font-mono whitespace-pre-wrap">
                {JSON.stringify(trial, null, 2)}
              </pre>
            </CardContent>
          </Card>
        ) : (
          /* Structured Data Display using Edit UI Components */
          <div className="p-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="outcomes">Outcomes</TabsTrigger>
                <TabsTrigger value="criteria">Criteria</TabsTrigger>
                <TabsTrigger value="timing">Timing</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="sites">Sites</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              {/* Overview Tab - Using Edit UI Style */}
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Trial Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Row 1: therapeutic area / trial identifier / phase */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Clinical Trials</Label>
                        <Input value={trial.overview.therapeutic_area} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Trial Identifier</Label>
                        <div className="space-y-2">
                          {trial.overview.trial_identifier.map((identifier, index) => (
                            <Input key={index} value={identifier} readOnly className="bg-gray-50" />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Trial Phase</Label>
                        <Input value={trial.overview.trial_phase} readOnly className="bg-gray-50" />
                      </div>
                    </div>

                    {/* Row 2: status / primary drugs / other drugs */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Input value={trial.overview.status} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary Drugs</Label>
                        <Input value={trial.overview.primary_drugs} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Other Drugs</Label>
                        <Input value={trial.overview.other_drugs} readOnly className="bg-gray-50" />
                      </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Textarea value={trial.overview.title} readOnly className="bg-gray-50" rows={3} />
                    </div>

                    {/* Row 3: disease type / patient segment / line of therapy */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Disease Type</Label>
                        <Input value={trial.overview.disease_type} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Patient Segment</Label>
                        <Input value={trial.overview.patient_segment} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Line Of Therapy</Label>
                        <Input value={trial.overview.line_of_therapy} readOnly className="bg-gray-50" />
                      </div>
                    </div>

                    {/* Row 4: reference links / trial tags */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Reference Links</Label>
                        <div className="space-y-2">
                          {trial.overview.reference_links.map((link, index) => (
                            <Input key={index} value={link} readOnly className="bg-gray-50" />
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Trial Tags</Label>
                        <Input value={trial.overview.trial_tags} readOnly className="bg-gray-50" />
                      </div>
                    </div>

                    {/* Row 5: sponsor fields */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Sponsor & Collaborators</Label>
                        <Input value={trial.overview.sponsor_collaborators} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Sponsor Field of Activity</Label>
                        <Input value={trial.overview.sponsor_field_activity} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Associated CRO</Label>
                        <Input value={trial.overview.associated_cro} readOnly className="bg-gray-50" />
                      </div>
                    </div>

                    {/* Row 6: countries / region / record status */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label>Countries</Label>
                        <Input value={trial.overview.countries} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Region</Label>
                        <Input value={trial.overview.region} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Trial Record Status</Label>
                        <Input value={trial.overview.trial_record_status} readOnly className="bg-gray-50" />
                      </div>
                    </div>

                    {/* Row 7: dates */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Created At</Label>
                        <Input value={formatDate(trial.overview.created_at)} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Updated At</Label>
                        <Input value={formatDate(trial.overview.updated_at)} readOnly className="bg-gray-50" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Outcomes Tab */}
              <TabsContent value="outcomes" className="space-y-4">
                {trial.outcomes.map((outcome, index) => (
                  <Card key={outcome.id}>
                    <CardHeader>
                      <CardTitle>Outcome {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Purpose of Trial</Label>
                        <Textarea value={outcome.purpose_of_trial} readOnly className="bg-gray-50" rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label>Summary</Label>
                        <Textarea value={outcome.summary} readOnly className="bg-gray-50" rows={4} />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary Outcome Measure</Label>
                        <Textarea value={outcome.primary_outcome_measure} readOnly className="bg-gray-50" rows={2} />
                      </div>
                      <div className="space-y-2">
                        <Label>Other Outcome Measure</Label>
                        <Textarea value={outcome.other_outcome_measure} readOnly className="bg-gray-50" rows={2} />
                      </div>
                      <div className="space-y-2">
                        <Label>Study Design Keywords</Label>
                        <Input value={outcome.study_design_keywords} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Study Design</Label>
                        <Textarea value={outcome.study_design} readOnly className="bg-gray-50" rows={4} />
                      </div>
                      <div className="space-y-2">
                        <Label>Treatment Regimen</Label>
                        <Textarea value={outcome.treatment_regimen} readOnly className="bg-gray-50" rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label>Number of Arms</Label>
                        <Input value={outcome.number_of_arms.toString()} readOnly className="bg-gray-50" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Criteria Tab */}
              <TabsContent value="criteria" className="space-y-4">
                {trial.criteria.map((criterion, index) => (
                  <Card key={criterion.id}>
                    <CardHeader>
                      <CardTitle>Criteria {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Inclusion Criteria</Label>
                        <Textarea value={criterion.inclusion_criteria} readOnly className="bg-gray-50" rows={4} />
                      </div>
                      <div className="space-y-2">
                        <Label>Exclusion Criteria</Label>
                        <Textarea value={criterion.exclusion_criteria} readOnly className="bg-gray-50" rows={4} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Age From</Label>
                          <Input value={criterion.age_from} readOnly className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Age To</Label>
                          <Input value={criterion.age_to} readOnly className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Subject Type</Label>
                          <Input value={criterion.subject_type} readOnly className="bg-gray-50" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Sex</Label>
                          <Input value={criterion.sex} readOnly className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Healthy Volunteers</Label>
                          <Input value={criterion.healthy_volunteers} readOnly className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Target Volunteers</Label>
                          <Input value={criterion.target_no_volunteers.toString()} readOnly className="bg-gray-50" />
                        </div>
                      </div>
                      {criterion.actual_enrolled_volunteers && (
                        <div className="space-y-2">
                          <Label>Actual Enrolled Volunteers</Label>
                          <Input value={criterion.actual_enrolled_volunteers.toString()} readOnly className="bg-gray-50" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Timing Tab */}
              <TabsContent value="timing" className="space-y-4">
                {trial.timing.map((timing, index) => (
                  <Card key={timing.id}>
                    <CardHeader>
                      <CardTitle>Timing {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Start Date Estimated</Label>
                          <Input value={formatDate(timing.start_date_estimated) || ""} readOnly className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Trial End Date Estimated</Label>
                          <Input value={formatDate(timing.trial_end_date_estimated) || ""} readOnly className="bg-gray-50" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Results Tab */}
              <TabsContent value="results" className="space-y-4">
                {trial.results.map((result, index) => (
                  <Card key={result.id}>
                    <CardHeader>
                      <CardTitle>Result {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Trial Outcome</Label>
                        <Textarea value={result.trial_outcome} readOnly className="bg-gray-50" rows={3} />
                      </div>
                      <div className="space-y-2">
                        <Label>Reference</Label>
                        <Input value={result.reference} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Trial Results</Label>
                        <div className="space-y-2">
                          {result.trial_results.map((res, idx) => (
                            <Input key={idx} value={res} readOnly className="bg-gray-50" />
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Adverse Event Reported</Label>
                          <Input value={result.adverse_event_reported} readOnly className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Adverse Event Type</Label>
                          <Input value={result.adverse_event_type || "N/A"} readOnly className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Treatment for Adverse Events</Label>
                          <Input value={result.treatment_for_adverse_events || "N/A"} readOnly className="bg-gray-50" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Sites Tab */}
              <TabsContent value="sites" className="space-y-4">
                {trial.sites.map((site, index) => (
                  <Card key={site.id}>
                    <CardHeader>
                      <CardTitle>Site {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Total Sites</Label>
                        <Input value={site.total.toString()} readOnly className="bg-gray-50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea value={site.notes} readOnly className="bg-gray-50" rows={3} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Logs Tab */}
              <TabsContent value="logs" className="space-y-4">
                {trial.logs.map((log, index) => (
                  <Card key={log.id}>
                    <CardHeader>
                      <CardTitle>Log {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Trial Changes Log</Label>
                        <Textarea value={log.trial_changes_log} readOnly className="bg-gray-50" rows={4} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Trial Added Date</Label>
                          <Input value={formatDate(log.trial_added_date)} readOnly className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Modified Date</Label>
                          <Input value={formatDate(log.last_modified_date)} readOnly className="bg-gray-50" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Last Modified User</Label>
                          <Input value={log.last_modified_user ?? ""} readOnly className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Full Review User</Label>
                          <Input value={log.full_review_user ?? ""} readOnly className="bg-gray-50" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Next Review Date</Label>
                        <Input value={formatDate(log.next_review_date)} readOnly className="bg-gray-50" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-4">
                {trial.notes.map((note, index) => (
                  <Card key={note.id}>
                    <CardHeader>
                      <CardTitle>Note {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date Type</Label>
                          <Input value={note.date_type} readOnly className="bg-gray-50" />
                        </div>
                        <div className="space-y-2">
                          <Label>Link</Label>
                          <Input value={note.link} readOnly className="bg-gray-50" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea value={note.notes} readOnly className="bg-gray-50" rows={4} />
                      </div>
                      {note.attachments && note.attachments.length > 0 && (
                        <div className="space-y-2">
                          <Label>Attachments</Label>
                          <div className="space-y-2">
                            {note.attachments.map((attachment, idx) => (
                              <Input key={idx} value={attachment} readOnly className="bg-gray-50" />
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}