"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { drugsApi } from "../../lib/api";
import { Trash2, Eye, Plus, Search, Loader2, Filter, Clock } from "lucide-react";
import { DrugAdvancedSearchModal, DrugSearchCriteria } from "@/components/drug-advanced-search-modal";
import { DrugFilterModal, DrugFilterState } from "@/components/drug-filter-modal";
import { SaveQueryModal } from "@/components/save-query-modal";
import { QueryHistoryModal } from "@/components/query-history-modal";

// Types based on the new API response
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
}

interface DevStatus {
  id: string;
  drug_over_id: string;
  disease_type: string | null;
  therapeutic_class: string | null;
  company: string | null;
  company_type: string | null;
  status: string | null;
  reference: string | null;
}

interface Activity {
  id: string;
  drug_over_id: string;
  mechanism_of_action: string | null;
  biological_target: string | null;
  drug_technology: string | null;
  delivery_route: string | null;
  delivery_medium: string | null;
}

interface Development {
  id: string;
  drug_over_id: string;
  preclinical: string | null;
  trial_id: string | null;
  title: string | null;
  primary_drugs: string | null;
  status: string | null;
  sponsor: string | null;
}

interface OtherSources {
  id: string;
  drug_over_id: string;
  data: string | null;
}

interface LicencesMarketing {
  id: string;
  drug_over_id: string;
  agreement: string | null;
  licensing_availability: string | null;
  marketing_approvals: string | null;
}

interface Logs {
  id: string;
  drug_over_id: string;
  drug_changes_log: string | null;
  created_date: string | null;
  last_modified_user: string | null;
  full_review_user: string | null;
  next_review_date: string | null;
  notes: string | null;
}

interface DrugData {
  drug_over_id: string;
  overview: DrugOverview;
  devStatus: DevStatus[];
  activity: Activity[];
  development: Development[];
  otherSources: OtherSources[];
  licencesMarketing: LicencesMarketing[];
  logs: Logs[];
}

interface ApiResponse {
  message: string;
  total_drugs: number;
  drugs: DrugData[];
}

export default function DrugsDashboardPage() {
  const router = useRouter();
  const [drugs, setDrugs] = useState<DrugData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<DrugData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [deletingDrugs, setDeletingDrugs] = useState<Record<string, boolean>>(
    {}
  );
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedSearchCriteria, setAdvancedSearchCriteria] = useState<DrugSearchCriteria[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<DrugFilterState>({
    globalStatuses: [],
    developmentStatuses: [],
    therapeuticAreas: [],
    diseaseTypes: [],
    originators: [],
    otherActiveCompanies: [],
    regulatorDesignations: [],
    drugRecordStatus: [],
    isApproved: [],
    companyTypes: [],
    mechanismOfAction: [],
    biologicalTargets: [],
    drugTechnologies: [],
    deliveryRoutes: [],
    deliveryMediums: []
  });
  const [saveQueryModalOpen, setSaveQueryModalOpen] = useState(false);
  const [queryHistoryModalOpen, setQueryHistoryModalOpen] = useState(false);

  // Fetch drugs data
  const fetchDrugs = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/drugs/all-drugs-with-data`
      );
      const data: ApiResponse = await response.json();
      setDrugs(data.drugs);
    } catch (error) {
      console.error("Error fetching drugs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch drugs data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete drug
  const deleteDrug = async (drugId: string) => {
    if (!confirm("Are you sure you want to delete this drug?")) return;

    try {
      setDeletingDrugs((prev) => ({ ...prev, [drugId]: true }));

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
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/drugs/${drugId}/${currentUserId}/delete-all`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast({
          title: "Success",
          description: "Drug deleted successfully",
        });
        // Refresh the list
        fetchDrugs();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete drug",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting drug:", error);
      toast({
        title: "Error",
        description: "Failed to delete drug",
        variant: "destructive",
      });
    } finally {
      setDeletingDrugs((prev) => ({ ...prev, [drugId]: false }));
    }
  };


  // Handle advanced search
  const handleAdvancedSearch = (criteria: DrugSearchCriteria[]) => {
    setAdvancedSearchCriteria(criteria);
  };

  // Handle load query from history
  const handleLoadQuery = (query: any) => {
    if (query.criteria) {
      setAdvancedSearchCriteria(query.criteria);
      toast({
        title: "Query Loaded",
        description: `Loaded query: ${query.name}`,
      });
    }
  };

  // Handle filter application
  const handleApplyFilters = (filters: DrugFilterState) => {
    setAppliedFilters(filters);
    const activeFilterCount = Object.values(filters).reduce((count, arr) => count + arr.length, 0);
    if (activeFilterCount > 0) {
      toast({
        title: "Filters Applied",
        description: `Applied ${activeFilterCount} filter criteria`,
      });
    } else {
      toast({
        title: "Filters Cleared",
        description: "All filters have been cleared",
      });
    }
  };

  // Apply advanced search criteria to filter drugs
  const applyAdvancedSearchFilter = (drug: DrugData, criteria: DrugSearchCriteria[]): boolean => {
    if (criteria.length === 0) return true;

    const results = criteria.map((criterion) => {
      const { field, operator, value } = criterion;
      let fieldValue = "";

      // Get the field value from the drug data
      switch (field) {
        case "drug_name":
          fieldValue = drug.overview.drug_name || "";
          break;
        case "generic_name":
          fieldValue = drug.overview.generic_name || "";
          break;
        case "other_name":
          fieldValue = drug.overview.other_name || "";
          break;
        case "primary_name":
          fieldValue = drug.overview.primary_name || "";
          break;
        case "global_status":
          fieldValue = drug.overview.global_status || "";
          break;
        case "development_status":
          fieldValue = drug.overview.development_status || "";
          break;
        case "originator":
          fieldValue = drug.overview.originator || "";
          break;
        case "other_active_companies":
          fieldValue = drug.overview.other_active_companies || "";
          break;
        case "therapeutic_area":
          fieldValue = drug.overview.therapeutic_area || "";
          break;
        case "disease_type":
          fieldValue = drug.overview.disease_type || "";
          break;
        case "regulator_designations":
          fieldValue = drug.overview.regulator_designations || "";
          break;
        case "drug_record_status":
          fieldValue = drug.overview.drug_record_status || "";
          break;
        case "is_approved":
          fieldValue = drug.overview.is_approved ? "true" : "false";
          break;
        case "mechanism_of_action":
          fieldValue = drug.activity.length > 0 ? (drug.activity[0].mechanism_of_action || "") : "";
          break;
        case "biological_target":
          fieldValue = drug.activity.length > 0 ? (drug.activity[0].biological_target || "") : "";
          break;
        case "drug_technology":
          fieldValue = drug.activity.length > 0 ? (drug.activity[0].drug_technology || "") : "";
          break;
        case "delivery_route":
          fieldValue = drug.activity.length > 0 ? (drug.activity[0].delivery_route || "") : "";
          break;
        case "delivery_medium":
          fieldValue = drug.activity.length > 0 ? (drug.activity[0].delivery_medium || "") : "";
          break;
        case "company":
          fieldValue = drug.devStatus.length > 0 ? (drug.devStatus[0].company || "") : "";
          break;
        case "company_type":
          fieldValue = drug.devStatus.length > 0 ? (drug.devStatus[0].company_type || "") : "";
          break;
        case "status":
          fieldValue = drug.devStatus.length > 0 ? (drug.devStatus[0].status || "") : "";
          break;
        case "created_at":
          fieldValue = drug.overview.created_at || "";
          break;
        case "updated_at":
          fieldValue = drug.overview.updated_at || "";
          break;
        default:
          fieldValue = "";
      }

      // Apply the operator
      const searchValue = value.toLowerCase();
      const targetValue = fieldValue.toLowerCase();

      switch (operator) {
        case "contains":
          return targetValue.includes(searchValue);
        case "is":
          return targetValue === searchValue;
        case "is_not":
          return targetValue !== searchValue;
        case "starts_with":
          return targetValue.startsWith(searchValue);
        case "ends_with":
          return targetValue.endsWith(searchValue);
        case "equals":
          return targetValue === searchValue;
        case "not_equals":
          return targetValue !== searchValue;
        case "greater_than":
          return parseFloat(fieldValue) > parseFloat(value);
        case "less_than":
          return parseFloat(fieldValue) < parseFloat(value);
        default:
          return true;
      }
    });

    // Apply logic operators
    let finalResult = results[0];
    for (let i = 1; i < results.length; i++) {
      const logic = criteria[i - 1].logic;
      if (logic === "AND") {
        finalResult = finalResult && results[i];
      } else if (logic === "OR") {
        finalResult = finalResult || results[i];
      }
    }

    return finalResult;
  };

  // Filter drugs based on search term, advanced search criteria, and filters
  const filteredDrugs = drugs.filter((drug) => {
    // Basic search term filter
    const matchesSearchTerm = searchTerm === "" || 
      (drug.overview.drug_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (drug.overview.generic_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (drug.overview.therapeutic_area || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (drug.overview.disease_type || "").toLowerCase().includes(searchTerm.toLowerCase());

    // Advanced search filter
    const matchesAdvancedSearch = applyAdvancedSearchFilter(drug, advancedSearchCriteria);

    // Apply filters
    const matchesFilters = (
      (appliedFilters.globalStatuses.length === 0 || 
       appliedFilters.globalStatuses.includes(drug.overview.global_status || "")) &&
      (appliedFilters.developmentStatuses.length === 0 || 
       appliedFilters.developmentStatuses.includes(drug.overview.development_status || "")) &&
      (appliedFilters.therapeuticAreas.length === 0 || 
       appliedFilters.therapeuticAreas.includes(drug.overview.therapeutic_area || "")) &&
      (appliedFilters.diseaseTypes.length === 0 || 
       appliedFilters.diseaseTypes.includes(drug.overview.disease_type || "")) &&
      (appliedFilters.originators.length === 0 || 
       appliedFilters.originators.includes(drug.overview.originator || "")) &&
      (appliedFilters.otherActiveCompanies.length === 0 || 
       appliedFilters.otherActiveCompanies.some(company => 
         (drug.overview.other_active_companies || "").toLowerCase().includes(company.toLowerCase()))) &&
      (appliedFilters.regulatorDesignations.length === 0 || 
       appliedFilters.regulatorDesignations.some(designation => 
         (drug.overview.regulator_designations || "").toLowerCase().includes(designation.toLowerCase()))) &&
      (appliedFilters.drugRecordStatus.length === 0 || 
       appliedFilters.drugRecordStatus.includes(drug.overview.drug_record_status || "")) &&
      (appliedFilters.isApproved.length === 0 || 
       appliedFilters.isApproved.includes(drug.overview.is_approved ? "Yes" : "No")) &&
      (appliedFilters.companyTypes.length === 0 || 
       drug.devStatus.length > 0 && appliedFilters.companyTypes.includes(drug.devStatus[0].company_type || "")) &&
      (appliedFilters.mechanismOfAction.length === 0 || 
       drug.activity.length > 0 && appliedFilters.mechanismOfAction.includes(drug.activity[0].mechanism_of_action || "")) &&
      (appliedFilters.biologicalTargets.length === 0 || 
       drug.activity.length > 0 && appliedFilters.biologicalTargets.includes(drug.activity[0].biological_target || "")) &&
      (appliedFilters.drugTechnologies.length === 0 || 
       drug.activity.length > 0 && appliedFilters.drugTechnologies.includes(drug.activity[0].drug_technology || "")) &&
      (appliedFilters.deliveryRoutes.length === 0 || 
       drug.activity.length > 0 && appliedFilters.deliveryRoutes.includes(drug.activity[0].delivery_route || "")) &&
      (appliedFilters.deliveryMediums.length === 0 || 
       drug.activity.length > 0 && appliedFilters.deliveryMediums.includes(drug.activity[0].delivery_medium || ""))
    );

    return matchesSearchTerm && matchesAdvancedSearch && matchesFilters;
  });

  useEffect(() => {
    fetchDrugs();
  }, []);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      Approved: "bg-emerald-100 text-emerald-700",
      Pending: "bg-amber-100 text-amber-700",
      Rejected: "bg-red-100 text-red-700",
      Discontinued: "bg-gray-100 text-gray-700",
      "Under Review": "bg-blue-100 text-blue-700",
      "Phase I": "bg-purple-100 text-purple-700",
      "Phase II": "bg-indigo-100 text-indigo-700",
      "Phase III": "bg-blue-100 text-blue-700",
      "Phase IV": "bg-green-100 text-green-700",
    };
    return statusColors[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Drugs</h1>
            <p className="text-sm text-muted-foreground">Loading drugs...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading drugs data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Drugs</h1>
          <p className="text-sm text-muted-foreground">
            Browse and manage all drugs. Total: {drugs.length}
            {advancedSearchCriteria.length > 0 && (
              <span className="ml-2 text-blue-600">
                • {advancedSearchCriteria.length} advanced filter{advancedSearchCriteria.length > 1 ? 's' : ''} active
              </span>
            )}
            {Object.values(appliedFilters).some(arr => arr.length > 0) && (
              <span className="ml-2 text-purple-600">
                • {Object.values(appliedFilters).reduce((count, arr) => count + arr.length, 0)} filter{Object.values(appliedFilters).reduce((count, arr) => count + arr.length, 0) > 1 ? 's' : ''} active
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setQueryHistoryModalOpen(true)}
            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
          >
            <Clock className="h-4 w-4 mr-2" />
            Saved Queries
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsAdvancedSearchOpen(true)}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
          >
            <Search className="h-4 w-4 mr-2" />
            Advanced Search
          </Button>
          <Button
            variant="outline"
            onClick={() => setFilterModalOpen(true)}
            className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={() => router.push("/admin/drugs/new")}>
            <Plus className="h-4 w-4 mr-2" />
            New Drug
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search drugs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {(advancedSearchCriteria.length > 0 || Object.values(appliedFilters).some(arr => arr.length > 0)) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAdvancedSearchCriteria([]);
              setAppliedFilters({
                globalStatuses: [],
                developmentStatuses: [],
                therapeuticAreas: [],
                diseaseTypes: [],
                originators: [],
                otherActiveCompanies: [],
                regulatorDesignations: [],
                drugRecordStatus: [],
                isApproved: [],
                companyTypes: [],
                mechanismOfAction: [],
                biologicalTargets: [],
                drugTechnologies: [],
                deliveryRoutes: [],
                deliveryMediums: []
              });
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear Filters
          </Button>
        )}
      </div>

      <div className="rounded-xl border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Drug ID</TableHead>
                <TableHead>Drug Name</TableHead>
                <TableHead>Global Status</TableHead>
                <TableHead>Originator</TableHead>
                <TableHead>Disease Type</TableHead>
                <TableHead>Development Status</TableHead>

                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrugs.map((drug) => (
                <TableRow key={drug.drug_over_id} className="hover:bg-muted/40">
                  <TableCell className="font-mono text-sm">
                    {drug.drug_over_id?.slice(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">
                    {drug.overview.drug_name || ""}
                  </TableCell>
                  <TableCell>{drug.overview.generic_name || ""}</TableCell>
                  <TableCell>{drug.overview.therapeutic_area || ""}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {drug.overview.disease_type || ""}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusColor(
                        drug.overview.is_approved ? "Approved" : "Pending"
                      )}
                    >
                      {drug.overview.is_approved ? "Approved" : "Pending"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm">
                    {formatDate(drug.overview.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {/* View Details */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDrug(drug);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>
                              Drug Details - {drug.overview.drug_name}
                            </DialogTitle>
                          </DialogHeader>
                          {selectedDrug && (
                            <div className="space-y-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle>Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <Label className="font-semibold">
                                      Name:
                                    </Label>
                                    <p>
                                      {selectedDrug.overview.drug_name || ""}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">
                                      Generic Name:
                                    </Label>
                                    <p>
                                      {selectedDrug.overview.generic_name || ""}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">
                                      Therapeutic Area:
                                    </Label>
                                    <p>
                                      {selectedDrug.overview.therapeutic_area ||
                                        ""}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">
                                      Disease Type:
                                    </Label>
                                    <p>
                                      {selectedDrug.overview.disease_type || ""}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">
                                      Status:
                                    </Label>
                                    <p>
                                      {selectedDrug.overview.is_approved
                                        ? "Approved"
                                        : "Pending"}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="font-semibold">
                                      Originator:
                                    </Label>
                                    <p>
                                      {selectedDrug.overview.originator || ""}
                                    </p>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>


                      {/* Delete Drug */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteDrug(drug.drug_over_id)}
                        disabled={deletingDrugs[drug.drug_over_id]}
                        className="text-red-600 hover:text-red-700"
                      >
                        {deletingDrugs[drug.drug_over_id] ? (
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
              Showing {filteredDrugs.length} of {drugs.length} drugs
            </TableCaption>
          </Table>
        </div>
      </div>

      {/* Advanced Search Modal */}
      <DrugAdvancedSearchModal
        open={isAdvancedSearchOpen}
        onOpenChange={setIsAdvancedSearchOpen}
        onApplySearch={handleAdvancedSearch}
      />

      {/* Filter Modal */}
      <DrugFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        onApplyFilters={handleApplyFilters}
        currentFilters={appliedFilters}
      />

      {/* Save Query Modal */}
      <SaveQueryModal
        open={saveQueryModalOpen}
        onOpenChange={setSaveQueryModalOpen}
        currentFilters={appliedFilters}
        currentSearchCriteria={advancedSearchCriteria}
        searchTerm={searchTerm}
      />

      {/* Query History Modal */}
      <QueryHistoryModal
        open={queryHistoryModalOpen}
        onOpenChange={setQueryHistoryModalOpen}
        onLoadQuery={handleLoadQuery}
      />
    </div>
  );
}
