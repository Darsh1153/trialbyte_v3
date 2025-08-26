"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Edit, Trash2, Eye, Plus, Search, Loader2 } from "lucide-react";

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

interface ApiResponse {
  message: string;
  total_trials: number;
  trials: TherapeuticTrial[];
}

export default function AdminTherapeuticsPage() {
  const [trials, setTrials] = useState<TherapeuticTrial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrial, setSelectedTrial] = useState<TherapeuticTrial | null>(
    null
  );
  const [deletingTrials, setDeletingTrials] = useState<Record<string, boolean>>(
    {}
  );

  // Fetch trials data
  const fetchTrials = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/therapeutic/all-trials-with-data`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      setTrials(data.trials);
    } catch (error) {
      console.error("Error fetching trials:", error);
      toast({
        title: "Error",
        description: "Failed to fetch trials data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete trial
  const deleteTrial = async (trialId: string) => {
    if (!confirm("Are you sure you want to delete this trial?")) return;

    try {
      setDeletingTrials((prev) => ({ ...prev, [trialId]: true }));

      const currentUserId = localStorage.getItem("userId");
      if (!currentUserId) {
        toast({
          title: "Error",
          description: "User ID not found",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/therapeutic/trial/${trialId}/${currentUserId}/delete-all`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Trial deleted successfully",
        });
        // Refresh the list
        fetchTrials();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete trial",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting trial:", error);
      toast({
        title: "Error",
        description: "Failed to delete trial",
        variant: "destructive",
      });
    } finally {
      setDeletingTrials((prev) => ({ ...prev, [trialId]: false }));
    }
  };

  // Handle edit button click
  const handleEditClick = () => {
    toast({
      title: "Contact Required",
      description: "Please contact the Manager for editing this trial",
      variant: "default",
    });
  };

  // Filter trials based on search term
  const filteredTrials = trials.filter(
    (trial) =>
      trial.overview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.overview.therapeutic_area
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      trial.overview.disease_type
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      trial.overview.sponsor_collaborators
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchTrials();
  }, []);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      Planned: "bg-amber-100 text-amber-700",
      Active: "bg-emerald-100 text-emerald-700",
      Completed: "bg-teal-100 text-teal-700",
      Terminated: "bg-red-100 text-red-700",
      Suspended: "bg-orange-100 text-orange-700",
      Draft: "bg-gray-100 text-gray-700",
    };
    return statusColors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Therapeutics</h1>
            <p className="text-sm text-muted-foreground">Loading trials...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Therapeutics</h1>
          <p className="text-sm text-muted-foreground">
            Browse and manage all trials. Total: {trials.length}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/therapeutics/new/5-1">
            <Plus className="h-4 w-4 mr-2" />
            New Therapeutic
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search trials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Trial ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Therapeutic Area</TableHead>
                <TableHead>Disease Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Phase</TableHead>
                <TableHead>Sponsor</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrials.map((trial) => (
                <TableRow key={trial.trial_id} className="hover:bg-muted/40">
                  <TableCell className="font-mono text-sm">
                    {trial.trial_id.slice(0, 8)}...
                  </TableCell>
                  <TableCell
                    className="max-w-[200px] truncate"
                    title={trial.overview.title}
                  >
                    {trial.overview.title || "Untitled"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {trial.overview.therapeutic_area || "N/A"}
                    </Badge>
                  </TableCell>
                  <TableCell>{trial.overview.disease_type || "N/A"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(trial.overview.status)}>
                      {trial.overview.status || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>{trial.overview.trial_phase || "N/A"}</TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {trial.overview.sponsor_collaborators || "N/A"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(trial.overview.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {/* View Details */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Trial Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Overview */}
                            <Card>
                              <CardHeader>
                                <CardTitle>Overview</CardTitle>
                              </CardHeader>
                              <CardContent className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label className="font-semibold">
                                    Title:
                                  </Label>
                                  <p>{trial.overview.title || "N/A"}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">
                                    Therapeutic Area:
                                  </Label>
                                  <p>
                                    {trial.overview.therapeutic_area || "N/A"}
                                  </p>
                                </div>
                                <div>
                                  <Label className="font-semibold">
                                    Disease Type:
                                  </Label>
                                  <p>{trial.overview.disease_type || "N/A"}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">
                                    Status:
                                  </Label>
                                  <p>{trial.overview.status || "N/A"}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">
                                    Phase:
                                  </Label>
                                  <p>{trial.overview.trial_phase || "N/A"}</p>
                                </div>
                                <div>
                                  <Label className="font-semibold">
                                    Sponsor:
                                  </Label>
                                  <p>
                                    {trial.overview.sponsor_collaborators ||
                                      "N/A"}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Outcomes */}
                            {trial.outcomes.length > 0 && (
                              <Card>
                                <CardHeader>
                                  <CardTitle>Outcomes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p>
                                    <strong>Purpose:</strong>{" "}
                                    {trial.outcomes[0].purpose_of_trial ||
                                      "N/A"}
                                  </p>
                                  <p>
                                    <strong>Summary:</strong>{" "}
                                    {trial.outcomes[0].summary || "N/A"}
                                  </p>
                                  <p>
                                    <strong>Design:</strong>{" "}
                                    {trial.outcomes[0].study_design || "N/A"}
                                  </p>
                                </CardContent>
                              </Card>
                            )}

                            {/* Criteria */}
                            {trial.criteria.length > 0 && (
                              <Card>
                                <CardHeader>
                                  <CardTitle>Eligibility Criteria</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p>
                                    <strong>Age Range:</strong>{" "}
                                    {trial.criteria[0].age_from || "N/A"} -{" "}
                                    {trial.criteria[0].age_to || "N/A"}
                                  </p>
                                  <p>
                                    <strong>Sex:</strong>{" "}
                                    {trial.criteria[0].sex || "N/A"}
                                  </p>
                                  <p>
                                    <strong>Inclusion:</strong>{" "}
                                    {trial.criteria[0].inclusion_criteria ||
                                      "N/A"}
                                  </p>
                                </CardContent>
                              </Card>
                            )}

                            {/* Sites */}
                            {trial.sites.length > 0 && (
                              <Card>
                                <CardHeader>
                                  <CardTitle>Study Sites</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p>
                                    <strong>Total Sites:</strong>{" "}
                                    {trial.sites[0].total || "N/A"}
                                  </p>
                                  <p>
                                    <strong>Notes:</strong>{" "}
                                    {trial.sites[0].notes || "N/A"}
                                  </p>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Edit Trial */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEditClick}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* Delete Trial */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTrial(trial.trial_id)}
                        disabled={deletingTrials[trial.trial_id]}
                        className="text-red-600 hover:text-red-700"
                      >
                        {deletingTrials[trial.trial_id] ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Deleting...
                          </>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption>
              Showing {filteredTrials.length} of {trials.length} therapeutics
            </TableCaption>
          </Table>
        </div>
      </div>
    </div>
  );
}
