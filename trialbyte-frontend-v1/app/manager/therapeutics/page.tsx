"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTrial, setEditingTrial] = useState<TherapeuticTrial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Submit delete request to pending changes
  const submitDeleteRequest = async (trialId: string) => {
    if (!confirm("Are you sure you want to request deletion of this trial?")) return;

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

      const changeData = {
        target_table: "therapeutic_trial",
        target_record_id: trialId,
        proposed_data: {
          deletion_reason: "Duplicate entry found"
        },
        change_type: "DELETE",
        submitted_by: currentUserId
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/pending-changes/submitChange`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changeData),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Delete request submitted successfully. Waiting for admin approval.",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to submit delete request",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting delete request:", error);
      toast({
        title: "Error",
        description: "Failed to submit delete request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit update request to pending changes
  const submitUpdateRequest = async (trialId: string, updatedData: any) => {
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

      const changeData = {
        target_table: "therapeutic_trial",
        target_record_id: trialId,
        proposed_data: updatedData,
        change_type: "UPDATE",
        submitted_by: currentUserId
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/pending-changes/submitChange`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(changeData),
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Update request submitted successfully. Waiting for admin approval.",
        });
        setIsEditDialogOpen(false);
        setEditingTrial(null);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to submit update request",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting update request:", error);
      toast({
        title: "Error",
        description: "Failed to submit update request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle opening edit modal
  const handleEditClick = (trial: TherapeuticTrial) => {
    setEditingTrial(JSON.parse(JSON.stringify(trial))); // Deep copy
    setIsEditDialogOpen(true);
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
                        onClick={() => handleEditClick(trial)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      {/* Delete Trial */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => submitDeleteRequest(trial.trial_id)}
                        disabled={isSubmitting}
                        className="text-red-600 hover:text-red-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Submitting...
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Trial - {editingTrial?.overview.title}</DialogTitle>
          </DialogHeader>
          {editingTrial && (
            <div className="space-y-6">
              {/* Overview Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={editingTrial.overview.title || ""}
                        onChange={(e) => {
                          setEditingTrial({
                            ...editingTrial,
                            overview: {
                              ...editingTrial.overview,
                              title: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Therapeutic Area</Label>
                      <Input
                        value={editingTrial.overview.therapeutic_area || ""}
                        onChange={(e) => {
                          setEditingTrial({
                            ...editingTrial,
                            overview: {
                              ...editingTrial.overview,
                              therapeutic_area: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Disease Type</Label>
                      <Input
                        value={editingTrial.overview.disease_type || ""}
                        onChange={(e) => {
                          setEditingTrial({
                            ...editingTrial,
                            overview: {
                              ...editingTrial.overview,
                              disease_type: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Status</Label>
                      <Select
                        value={editingTrial.overview.status || ""}
                        onValueChange={(value) => {
                          setEditingTrial({
                            ...editingTrial,
                            overview: {
                              ...editingTrial.overview,
                              status: value,
                            },
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Planned">Planned</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Terminated">Terminated</SelectItem>
                          <SelectItem value="Suspended">Suspended</SelectItem>
                          <SelectItem value="Draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Phase</Label>
                      <Input
                        value={editingTrial.overview.trial_phase || ""}
                        onChange={(e) => {
                          setEditingTrial({
                            ...editingTrial,
                            overview: {
                              ...editingTrial.overview,
                              trial_phase: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                    <div>
                      <Label>Sponsor</Label>
                      <Input
                        value={editingTrial.overview.sponsor_collaborators || ""}
                        onChange={(e) => {
                          setEditingTrial({
                            ...editingTrial,
                            overview: {
                              ...editingTrial.overview,
                              sponsor_collaborators: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingTrial(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => submitUpdateRequest(editingTrial.trial_id, editingTrial.overview)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Update Request"
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
