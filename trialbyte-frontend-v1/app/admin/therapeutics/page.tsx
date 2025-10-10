"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "@/hooks/use-toast";
import { Trash2, Eye, Plus, Search, Loader2, Filter, Clock, Edit, ChevronDown, Settings, Download, Save, ExternalLink, Maximize2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TherapeuticAdvancedSearchModal, TherapeuticSearchCriteria } from "@/components/therapeutic-advanced-search-modal";
import { TherapeuticFilterModal, TherapeuticFilterState } from "@/components/therapeutic-filter-modal";
import { SaveQueryModal } from "@/components/save-query-modal";
import { QueryHistoryModal } from "@/components/query-history-modal";
import { CustomizeColumnModal, ColumnSettings, DEFAULT_COLUMN_SETTINGS } from "@/components/customize-column-modal";

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
    original_trial_id?: string;
    is_updated_version?: boolean;
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
  const router = useRouter();
  const [trials, setTrials] = useState<TherapeuticTrial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrial, setSelectedTrial] = useState<TherapeuticTrial | null>(
    null
  );
  const [deletingTrials, setDeletingTrials] = useState<Record<string, boolean>>(
    {}
  );
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedSearchCriteria, setAdvancedSearchCriteria] = useState<TherapeuticSearchCriteria[]>([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<TherapeuticFilterState>({
    therapeuticAreas: [],
    statuses: [],
    diseaseTypes: [],
    primaryDrugs: [],
    trialPhases: [],
    patientSegments: [],
    lineOfTherapy: [],
    countries: [],
    sponsorsCollaborators: [],
    sponsorFieldActivity: [],
    associatedCro: [],
    trialTags: [],
    sex: [],
    healthyVolunteers: [],
    trialRecordStatus: []
  });
  const [saveQueryModalOpen, setSaveQueryModalOpen] = useState(false);
  const [queryHistoryModalOpen, setQueryHistoryModalOpen] = useState(false);
  
  // Sorting state
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  
  // Column customization state
  const [customizeColumnModalOpen, setCustomizeColumnModalOpen] = useState(false);
  const [columnSettings, setColumnSettings] = useState<ColumnSettings>(DEFAULT_COLUMN_SETTINGS);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Multiple selection state
  const [selectedTrials, setSelectedTrials] = useState<Set<string>>(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [showViewSelectedButton, setShowViewSelectedButton] = useState(false);

  // Fetch trials data
  // Filter function to show only the latest version of each record
  const filterLatestVersions = (trials: TherapeuticTrial[]) => {
    const trialMap = new Map<string, TherapeuticTrial>();

    trials.forEach(trial => {
      const key = trial.overview?.title || trial.trial_id;

      // If this trial has an original_trial_id, it's an updated version
      if (trial.overview?.original_trial_id) {
        // This is an updated version, replace the original
        trialMap.set(key, trial);
      } else if (!trialMap.has(key)) {
        // This is an original version, add it if we don't have a newer version
        trialMap.set(key, trial);
      }
      // If we already have a newer version, skip this old one
    });

    return Array.from(trialMap.values());
  };

  // Apply localStorage updates to trials data
  const applyLocalStorageUpdates = (trials: TherapeuticTrial[]) => {
    try {
      // Get the main trials list from localStorage
      const localTrials = JSON.parse(localStorage.getItem('therapeuticTrials') || '[]');
      
      if (localTrials.length === 0) {
        return trials;
      }

      // Create a map of local trials for quick lookup
      const localTrialMap = new Map<string, TherapeuticTrial>();
      localTrials.forEach((trial: TherapeuticTrial) => {
        localTrialMap.set(trial.trial_id, trial);
      });

      // Apply local updates to API trials
      const updatedTrials = trials.map(trial => {
        const localTrial = localTrialMap.get(trial.trial_id);
        
        if (localTrial && localTrial.overview) {
          // Check if local trial has more recent updates or if it was recently updated
          const localUpdatedAt = new Date(localTrial.overview.updated_at || 0);
          const apiUpdatedAt = new Date(trial.overview.updated_at || 0);
          const recentlyUpdated = localStorage.getItem(`trial_updated_${trial.trial_id}`);
          
          if (localUpdatedAt > apiUpdatedAt || recentlyUpdated) {
            console.log('Applying localStorage update for trial:', trial.trial_id);
            // Clear the update flag after applying
            if (recentlyUpdated) {
              localStorage.removeItem(`trial_updated_${trial.trial_id}`);
            }
            return localTrial;
          }
        }
        
        return trial;
      });

      return updatedTrials;
    } catch (error) {
      console.error('Error applying localStorage updates:', error);
      return trials;
    }
  };


  // Clean up old versions (optional - can be called manually)
  const cleanupOldVersions = () => {
    const mappings = JSON.parse(localStorage.getItem('trialUpdateMappings') || '[]');
    if (mappings.length > 0) {
      console.log('Found trial update mappings:', mappings);
      console.log('Old versions can be cleaned up from the database if needed');
      // In a real scenario, you might want to call an API to delete old versions
    }
  };

  const fetchTrials = async (forceRefresh = false) => {
    try {
      setLoading(true);
      
      // Only use localStorage cache if not forcing refresh
      if (!forceRefresh) {
        const localTrials = JSON.parse(localStorage.getItem('therapeuticTrials') || '[]');
        if (localTrials.length > 0) {
          console.log('Using cached trials data from localStorage');
          // Apply localStorage updates to cached data
          const trialsWithLocalUpdates = applyLocalStorageUpdates(localTrials);
          setTrials(trialsWithLocalUpdates);
          setLoading(false);
        }
      }

      // Then fetch fresh data from API
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
      const allTrials = data.trials || [];

      // Filter out old versions and only show the latest version of each record
      const filteredTrials = filterLatestVersions(allTrials);
      
      // Apply localStorage updates to show the latest edited values
      const trialsWithLocalUpdates = applyLocalStorageUpdates(filteredTrials);
      
      // Use the updated data (API + localStorage updates) as the source of truth
      setTrials(trialsWithLocalUpdates);
      
      // Update localStorage with the combined data (API + local updates)
      localStorage.setItem('therapeuticTrials', JSON.stringify(trialsWithLocalUpdates));
      
    } catch (error) {
      console.error("Error fetching trials:", error);
      
      // If API fails, try to use localStorage data
      const localTrials = JSON.parse(localStorage.getItem('therapeuticTrials') || '[]');
      if (localTrials.length > 0) {
        console.log('API failed, using localStorage data');
        // Apply localStorage updates to cached data as well
        const trialsWithLocalUpdates = applyLocalStorageUpdates(localTrials);
        setTrials(trialsWithLocalUpdates);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch trials data",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Clear cache function
  const clearCache = () => {
    localStorage.removeItem('therapeuticTrials');
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
          credentials: "include",
        }
      );

      if (response.ok) {
        // Clear localStorage cache to prevent stale data
        clearCache();
        
        // Optimistically remove the trial from the current state
        setTrials(prevTrials => prevTrials.filter(trial => trial.trial_id !== trialId));
        
        toast({
          title: "Success",
          description: "Trial deleted successfully",
        });
        
        // Refresh the list to ensure consistency (force refresh from API)
        await fetchTrials(true);
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
  const handleEditClick = (trialId: string) => {
    router.push(`/admin/therapeutics/edit/${trialId}`);
  };

  // Handle advanced search
  const handleAdvancedSearch = (criteria: TherapeuticSearchCriteria[]) => {
    console.log('Advanced search criteria:', criteria);
    
    // Debug: Check if any trials contain "bladder" in any field
    const bladderTrials = trials.filter(trial => {
      const searchText = JSON.stringify(trial).toLowerCase();
      return searchText.includes('bladder');
    });
    
    console.log('Trials containing "bladder":', bladderTrials.map(t => ({
      id: t.trial_id,
      title: t.overview.title,
      trial_tags: t.overview.trial_tags,
      disease_type: t.overview.disease_type,
      therapeutic_area: t.overview.therapeutic_area
    })));
    
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
  const handleApplyFilters = (filters: TherapeuticFilterState) => {
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

  // Apply advanced search criteria to filter trials
  const applyAdvancedSearchFilter = (trial: TherapeuticTrial, criteria: TherapeuticSearchCriteria[]): boolean => {
    if (criteria.length === 0) return true;

    // Debug: Log all trials and their trial_tags/disease_type for debugging
    if (criteria.some(c => c.field === "trial_tags")) {
      console.log('All trials trial_tags and disease_type:', trials.map(t => ({
        id: t.trial_id,
        title: t.overview.title,
        trial_tags: t.overview.trial_tags,
        disease_type: t.overview.disease_type,
        combined: `${t.overview.trial_tags || ""} ${t.overview.disease_type || ""}`.trim()
      })));
    }

    const results = criteria.map((criterion) => {
      const { field, operator, value } = criterion;
      let fieldValue = "";

      // Get the field value from the trial data
      switch (field) {
        // Overview fields
        case "title":
          fieldValue = trial.overview.title || "";
          break;
        case "therapeutic_area":
          fieldValue = trial.overview.therapeutic_area || "";
          break;
        case "trial_identifier":
          fieldValue = trial.overview.trial_identifier?.join(", ") || "";
          break;
        case "trial_phase":
          fieldValue = trial.overview.trial_phase || "";
          break;
        case "status":
          fieldValue = trial.overview.status || "";
          break;
        case "primary_drugs":
          fieldValue = trial.overview.primary_drugs || "";
          break;
        case "other_drugs":
          fieldValue = trial.overview.other_drugs || "";
          break;
        case "disease_type":
          fieldValue = trial.overview.disease_type || "";
          break;
        case "patient_segment":
          fieldValue = trial.overview.patient_segment || "";
          break;
        case "line_of_therapy":
          fieldValue = trial.overview.line_of_therapy || "";
          break;
        case "trial_tags":
          // Search in both trial_tags and disease_type since the UI shows disease_type as tags
          const trialTags = trial.overview.trial_tags || "";
          const diseaseType = trial.overview.disease_type || "";
          fieldValue = `${trialTags} ${diseaseType}`.trim();
          break;
        case "sponsor_collaborators":
          fieldValue = trial.overview.sponsor_collaborators || "";
          break;
        case "sponsor_field_activity":
          fieldValue = trial.overview.sponsor_field_activity || "";
          break;
        case "associated_cro":
          fieldValue = trial.overview.associated_cro || "";
          break;
        case "countries":
          fieldValue = trial.overview.countries || "";
          break;
        case "region":
          fieldValue = trial.overview.region || "";
          break;
        case "trial_record_status":
          fieldValue = trial.overview.trial_record_status || "";
          break;
        case "created_at":
          fieldValue = trial.overview.created_at || "";
          break;
        case "updated_at":
          fieldValue = trial.overview.updated_at || "";
          break;

        // Outcomes fields
        case "purpose_of_trial":
          fieldValue = trial.outcomes.length > 0 ? (trial.outcomes[0].purpose_of_trial || "") : "";
          break;
        case "summary":
          fieldValue = trial.outcomes.length > 0 ? (trial.outcomes[0].summary || "") : "";
          break;
        case "primary_outcome_measure":
          fieldValue = trial.outcomes.length > 0 ? (trial.outcomes[0].primary_outcome_measure || "") : "";
          break;
        case "other_outcome_measure":
          fieldValue = trial.outcomes.length > 0 ? (trial.outcomes[0].other_outcome_measure || "") : "";
          break;
        case "study_design_keywords":
          fieldValue = trial.outcomes.length > 0 ? (trial.outcomes[0].study_design_keywords || "") : "";
          break;
        case "study_design":
          fieldValue = trial.outcomes.length > 0 ? (trial.outcomes[0].study_design || "") : "";
          break;
        case "treatment_regimen":
          fieldValue = trial.outcomes.length > 0 ? (trial.outcomes[0].treatment_regimen || "") : "";
          break;
        case "number_of_arms":
          fieldValue = trial.outcomes.length > 0 ? (trial.outcomes[0].number_of_arms?.toString() || "") : "";
          break;

        // Criteria fields
        case "inclusion_criteria":
          fieldValue = trial.criteria.length > 0 ? (trial.criteria[0].inclusion_criteria || "") : "";
          break;
        case "exclusion_criteria":
          fieldValue = trial.criteria.length > 0 ? (trial.criteria[0].exclusion_criteria || "") : "";
          break;
        case "age_from":
          fieldValue = trial.criteria.length > 0 ? (trial.criteria[0].age_from || "") : "";
          break;
        case "age_to":
          fieldValue = trial.criteria.length > 0 ? (trial.criteria[0].age_to || "") : "";
          break;
        case "subject_type":
          fieldValue = trial.criteria.length > 0 ? (trial.criteria[0].subject_type || "") : "";
          break;
        case "sex":
          fieldValue = trial.criteria.length > 0 ? (trial.criteria[0].sex || "") : "";
          break;
        case "healthy_volunteers":
          fieldValue = trial.criteria.length > 0 ? (trial.criteria[0].healthy_volunteers || "") : "";
          break;
        case "target_no_volunteers":
          fieldValue = trial.criteria.length > 0 ? (trial.criteria[0].target_no_volunteers?.toString() || "") : "";
          break;
        case "actual_enrolled_volunteers":
          fieldValue = trial.criteria.length > 0 ? (trial.criteria[0].actual_enrolled_volunteers?.toString() || "") : "";
          break;

        // Timing fields
        case "start_date_estimated":
          fieldValue = trial.timing.length > 0 ? (trial.timing[0].start_date_estimated || "") : "";
          break;
        case "trial_end_date_estimated":
          fieldValue = trial.timing.length > 0 ? (trial.timing[0].trial_end_date_estimated || "") : "";
          break;

        // Results fields
        case "trial_outcome":
          fieldValue = trial.results.length > 0 ? (trial.results[0].trial_outcome || "") : "";
          break;
        case "trial_results":
          fieldValue = trial.results.length > 0 ? (trial.results[0].trial_results?.join(", ") || "") : "";
          break;
        case "adverse_event_reported":
          fieldValue = trial.results.length > 0 ? (trial.results[0].adverse_event_reported || "") : "";
          break;
        case "adverse_event_type":
          fieldValue = trial.results.length > 0 ? (trial.results[0].adverse_event_type || "") : "";
          break;
        case "treatment_for_adverse_events":
          fieldValue = trial.results.length > 0 ? (trial.results[0].treatment_for_adverse_events || "") : "";
          break;

        // Sites fields
        case "total_sites":
          fieldValue = trial.sites.length > 0 ? (trial.sites[0].total?.toString() || "") : "";
          break;
        case "site_notes":
          fieldValue = trial.sites.length > 0 ? (trial.sites[0].notes || "") : "";
          break;

        default:
          fieldValue = "";
      }

      // Apply the operator
      const targetValue = fieldValue.toLowerCase();

      // Special handling for trial_tags with multiple values
      if (field === "trial_tags" && Array.isArray(value)) {
        // For multiple tags, all tags must be present (AND logic)
        // Handle different possible formats of trial_tags data
        const trialTagsString = fieldValue.toLowerCase();
        
        // Check if all tags are present in the trial_tags string
        const allTagsPresent = value.every(tag => {
          const tagLower = tag.toLowerCase().trim();
          // Check for exact word match or comma-separated match
          return trialTagsString.includes(tagLower) || 
                 trialTagsString.split(/[,\s]+/).includes(tagLower);
        });
        
        console.log('Trial Tags Search Debug:', {
          fieldValue,
          searchTags: value,
          allTagsPresent,
          trialTagsString,
          trialTags: trial.overview.trial_tags,
          diseaseType: trial.overview.disease_type
        });
        
        return allTagsPresent;
      }

      const searchValue = typeof value === 'string' ? value.toLowerCase() : '';

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
          return parseFloat(fieldValue) > parseFloat(value as string);
        case "greater_than_equal":
          return parseFloat(fieldValue) >= parseFloat(value as string);
        case "less_than":
          return parseFloat(fieldValue) < parseFloat(value as string);
        case "less_than_equal":
          return parseFloat(fieldValue) <= parseFloat(value as string);
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

  // Sorting functions
  const getSortValue = (trial: TherapeuticTrial, field: string): string | number => {
    switch (field) {
      case "trial_id": return trial.trial_id;
      case "therapeutic_area": return trial.overview.therapeutic_area;
      case "disease_type": return trial.overview.disease_type;
      case "primary_drug": return trial.overview.primary_drugs;
      case "trial_status": return trial.overview.status;
      case "sponsor": return trial.overview.sponsor_collaborators;
      case "phase": return trial.overview.trial_phase;
      case "enrollment": return trial.criteria[0]?.target_no_volunteers?.toString() || "0";
      default: return "";
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle sort direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleColumnSettingsChange = (newSettings: ColumnSettings) => {
    setColumnSettings(newSettings);
    // Save to localStorage
    localStorage.setItem('adminTrialColumnSettings', JSON.stringify(newSettings));
  };

  // Filter trials based on search term, advanced search criteria, and filters
  const filteredTrials = trials.filter((trial) => {
    // Basic search term filter
    const matchesSearchTerm = searchTerm === "" ||
      trial.overview.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.overview.therapeutic_area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.overview.disease_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.overview.sponsor_collaborators.toLowerCase().includes(searchTerm.toLowerCase());

    // Advanced search filter
    const matchesAdvancedSearch = applyAdvancedSearchFilter(trial, advancedSearchCriteria);

    // Apply filters
    const matchesFilters = (
      (appliedFilters.therapeuticAreas.length === 0 ||
        appliedFilters.therapeuticAreas.includes(trial.overview.therapeutic_area)) &&
      (appliedFilters.statuses.length === 0 ||
        appliedFilters.statuses.includes(trial.overview.status)) &&
      (appliedFilters.diseaseTypes.length === 0 ||
        appliedFilters.diseaseTypes.includes(trial.overview.disease_type)) &&
      (appliedFilters.primaryDrugs.length === 0 ||
        appliedFilters.primaryDrugs.some(drug =>
          trial.overview.primary_drugs.toLowerCase().includes(drug.toLowerCase()))) &&
      (appliedFilters.trialPhases.length === 0 ||
        appliedFilters.trialPhases.includes(trial.overview.trial_phase)) &&
      (appliedFilters.countries.length === 0 ||
        appliedFilters.countries.some(country =>
          trial.overview.countries.toLowerCase().includes(country.toLowerCase()))) &&
      (appliedFilters.sponsorsCollaborators.length === 0 ||
        appliedFilters.sponsorsCollaborators.some(sponsor =>
          trial.overview.sponsor_collaborators.toLowerCase().includes(sponsor.toLowerCase()))) &&
      (appliedFilters.trialRecordStatus.length === 0 ||
        appliedFilters.trialRecordStatus.includes(trial.overview.trial_record_status)) &&
      (appliedFilters.patientSegments.length === 0 ||
        appliedFilters.patientSegments.includes(trial.overview.patient_segment)) &&
      (appliedFilters.lineOfTherapy.length === 0 ||
        appliedFilters.lineOfTherapy.includes(trial.overview.line_of_therapy)) &&
      (appliedFilters.trialTags.length === 0 ||
        appliedFilters.trialTags.some(tag =>
          trial.overview.trial_tags.toLowerCase().includes(tag.toLowerCase()))) &&
      (appliedFilters.sex.length === 0 ||
        trial.criteria.length > 0 && appliedFilters.sex.includes(trial.criteria[0].sex)) &&
      (appliedFilters.healthyVolunteers.length === 0 ||
        trial.criteria.length > 0 && appliedFilters.healthyVolunteers.includes(trial.criteria[0].healthy_volunteers))
    );

    return matchesSearchTerm && matchesAdvancedSearch && matchesFilters;
  }).sort((a, b) => {
    if (!sortField) return 0; // No sorting if no field selected

    const aValue = getSortValue(a, sortField);
    const bValue = getSortValue(b, sortField);

    // Handle string comparisons
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      return sortDirection === 'asc' ? comparison : -comparison;
    }

    // Handle numeric comparisons
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Mixed types - convert to string
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    const comparison = aStr.localeCompare(bStr);
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Pagination logic
  const totalItems = filteredTrials.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTrials = filteredTrials.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, advancedSearchCriteria, appliedFilters, itemsPerPage]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchTrials();
    
    // Load column settings from localStorage
    const savedSettings = localStorage.getItem('adminTrialColumnSettings');
    if (savedSettings) {
      try {
        setColumnSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading column settings:', error);
      }
    }
  }, []);

  // Refresh data when page becomes visible (e.g., returning from edit page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing data...');
        fetchTrials(true); // Force refresh to get latest data
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh when window gains focus (alternative to visibility change)
    const handleFocus = () => {
      console.log('Window gained focus, refreshing data...');
      fetchTrials(true);
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Multiple selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allTrialIds = new Set(paginatedTrials.map(trial => trial.trial_id));
      setSelectedTrials(allTrialIds);
      setIsSelectAllChecked(true);
    } else {
      setSelectedTrials(new Set());
      setIsSelectAllChecked(false);
    }
  };

  const handleSelectTrial = (trialId: string, checked: boolean) => {
    const newSelectedTrials = new Set(selectedTrials);
    if (checked) {
      newSelectedTrials.add(trialId);
    } else {
      newSelectedTrials.delete(trialId);
    }
    setSelectedTrials(newSelectedTrials);
    
    // Update select all checkbox state
    setIsSelectAllChecked(newSelectedTrials.size === paginatedTrials.length);
  };

  const handleViewSelectedTrials = (openInTabs: boolean = true) => {
    if (selectedTrials.size === 0) {
      toast({
        title: "No trials selected",
        description: "Please select at least one trial to view.",
        variant: "destructive",
      });
      return;
    }

    const selectedTrialIds = Array.from(selectedTrials);
    
    if (openInTabs) {
      // Open in new tabs
      selectedTrialIds.forEach(trialId => {
        window.open(`/admin/therapeutics/${trialId}`, '_blank');
      });
    } else {
      // Open in popup windows
      selectedTrialIds.forEach((trialId, index) => {
        const popup = window.open(
          `/admin/therapeutics/${trialId}`,
          `trial_${trialId}`,
          `width=1200,height=800,scrollbars=yes,resizable=yes,left=${100 + (index * 50)},top=${100 + (index * 50)}`
        );
        if (!popup) {
          toast({
            title: "Popup blocked",
            description: "Please allow popups for this site to open multiple trials.",
            variant: "destructive",
          });
        }
      });
    }

    toast({
      title: "Trials opened",
      description: `Opened ${selectedTrialIds.length} trial${selectedTrialIds.length > 1 ? 's' : ''} successfully.`,
    });
  };

  const handleExportSelected = () => {
    if (selectedTrials.size === 0) {
      toast({
        title: "No trials selected",
        description: "Please select at least one trial to export.",
        variant: "destructive",
      });
      return;
    }

    const selectedTrialData = trials.filter(trial => selectedTrials.has(trial.trial_id));
    
    // Create CSV content
    const csvContent = [
      // Header
      ['Trial ID', 'Title', 'Therapeutic Area', 'Disease Type', 'Status', 'Phase', 'Sponsor', 'Created Date'].join(','),
      // Data rows
      ...selectedTrialData.map(trial => [
        trial.trial_id,
        `"${trial.overview.title || 'Untitled'}"`,
        `"${trial.overview.therapeutic_area || 'N/A'}"`,
        `"${trial.overview.disease_type || 'N/A'}"`,
        `"${trial.overview.status || 'Unknown'}"`,
        `"${trial.overview.trial_phase || 'N/A'}"`,
        `"${trial.overview.sponsor_collaborators || 'N/A'}"`,
        `"${formatDate(trial.overview.created_at)}"`
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `therapeutic_trials_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: `Exported ${selectedTrialData.length} trial${selectedTrialData.length > 1 ? 's' : ''} to CSV.`,
    });
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
            <h1 className="text-2xl font-bold">Clinical Trials</h1>
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
          <h1 className="text-2xl font-bold">Clinical Trials</h1>
          <p className="text-sm text-muted-foreground">
            Browse and manage all trials. Total: {trials.length}
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
        <div className="flex items-center space-x-2 ml-5">
          <Button
            variant="outline"
            onClick={() => setSaveQueryModalOpen(true)}
            className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Query
          </Button>
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
          <Button asChild>
            <Link href="/admin/therapeutics/new/5-1">
              <Plus className="h-4 w-4 mr-2" />
              Add New Trials
            </Link>
          </Button>
        </div>
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
        {(advancedSearchCriteria.length > 0 || Object.values(appliedFilters).some(arr => arr.length > 0)) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAdvancedSearchCriteria([]);
              setAppliedFilters({
                therapeuticAreas: [],
                statuses: [],
                diseaseTypes: [],
                primaryDrugs: [],
                trialPhases: [],
                patientSegments: [],
                lineOfTherapy: [],
                countries: [],
                sponsorsCollaborators: [],
                sponsorFieldActivity: [],
                associatedCro: [],
                trialTags: [],
                sex: [],
                healthyVolunteers: [],
                trialRecordStatus: []
              });
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Selection Controls */}
      {selectedTrials.size > 0 && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-blue-800">
              {selectedTrials.size} trial{selectedTrials.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewSelectedTrials(true)}
                className="bg-white hover:bg-gray-50 text-blue-700 border-blue-300"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Tabs
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewSelectedTrials(false)}
                className="bg-white hover:bg-gray-50 text-blue-700 border-blue-300"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Open in Popups
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportSelected}
                className="bg-white hover:bg-gray-50 text-green-700 border-green-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTrials(new Set());
              setIsSelectAllChecked(false);
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear Selection
          </Button>
        </div>
      )}

      {/* Sort By Dropdown */}
      <div className="flex items-center space-x-2">
        <div className="relative" ref={sortDropdownRef}>
          <Button
            variant="outline"
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
            className="bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            Sort By
            {sortField && (
              <span className="ml-2 text-xs">
                {sortDirection === "asc" ? "↑" : "↓"}
              </span>
            )}
          </Button>
          {sortDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <div className="py-1">
                <button
                  onClick={() => {
                    handleSort("trial_id");
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    sortField === "trial_id" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Trial ID</span>
                    {sortField === "trial_id" && (
                      <span className="text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    handleSort("therapeutic_area");
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    sortField === "therapeutic_area" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Therapeutic Area</span>
                    {sortField === "therapeutic_area" && (
                      <span className="text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    handleSort("disease_type");
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    sortField === "disease_type" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Disease Type</span>
                    {sortField === "disease_type" && (
                      <span className="text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    handleSort("primary_drug");
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    sortField === "primary_drug" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Primary Drug</span>
                    {sortField === "primary_drug" && (
                      <span className="text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    handleSort("trial_status");
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    sortField === "trial_status" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Trial Status</span>
                    {sortField === "trial_status" && (
                      <span className="text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    handleSort("sponsor");
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    sortField === "sponsor" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Sponsor</span>
                    {sortField === "sponsor" && (
                      <span className="text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    handleSort("phase");
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    sortField === "phase" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Phase</span>
                    {sortField === "phase" && (
                      <span className="text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  onClick={() => {
                    handleSort("enrollment");
                    setSortDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                    sortField === "enrollment" ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>Enrollment</span>
                    {sortField === "enrollment" && (
                      <span className="text-xs">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
        {sortField && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSortField("");
              setSortDirection("asc");
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Clear Sort
          </Button>
        )}
        <Button
          variant="outline"
          onClick={() => setCustomizeColumnModalOpen(true)}
          className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
        >
          <Settings className="h-4 w-4 mr-2" />
          Customize Columns
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        {/* Desktop / larger screens → normal table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-12">
                  <Checkbox
                    checked={isSelectAllChecked}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                {columnSettings.trialId && <TableHead>Trial ID</TableHead>}
                <TableHead>Title</TableHead>
                {columnSettings.therapeuticArea && <TableHead>Clinical Trials</TableHead>}
                {columnSettings.diseaseType && <TableHead>Disease Type</TableHead>}
                {columnSettings.trialStatus && <TableHead>Status</TableHead>}
                {columnSettings.phase && <TableHead>Phase</TableHead>}
                {columnSettings.sponsor && <TableHead>Sponsor</TableHead>}
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTrials.map((trial) => (
                <TableRow key={trial.trial_id} className="hover:bg-muted/40">
                  <TableCell>
                    <Checkbox
                      checked={selectedTrials.has(trial.trial_id)}
                      onCheckedChange={(checked) => handleSelectTrial(trial.trial_id, checked as boolean)}
                    />
                  </TableCell>
                  {columnSettings.trialId && (
                    <TableCell className="font-mono text-sm">
                      {trial.trial_id.slice(0, 8)}...
                    </TableCell>
                  )}
                  <TableCell className="max-w-[200px] truncate" title={trial.overview.title}>
                    {trial.overview.title || "Untitled"}
                  </TableCell>
                  {columnSettings.therapeuticArea && (
                    <TableCell>
                      <Badge variant="outline">{trial.overview.therapeutic_area || "N/A"}</Badge>
                    </TableCell>
                  )}
                  {columnSettings.diseaseType && (
                    <TableCell>{trial.overview.disease_type || "N/A"}</TableCell>
                  )}
                  {columnSettings.trialStatus && (
                    <TableCell>
                      <Badge className={getStatusColor(trial.overview.status)}>
                        {trial.overview.status || "Unknown"}
                      </Badge>
                    </TableCell>
                  )}
                  {columnSettings.phase && (
                    <TableCell>{trial.overview.trial_phase || "N/A"}</TableCell>
                  )}
                  {columnSettings.sponsor && (
                    <TableCell className="max-w-[150px] truncate">
                      {trial.overview.sponsor_collaborators || "N/A"}
                    </TableCell>
                  )}
                  <TableCell className="text-sm">{formatDate(trial.overview.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/admin/therapeutics/${trial.trial_id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(trial.trial_id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
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
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} Clinical Trials
            </TableCaption>
          </Table>
        </div>

        {/* Mobile / small screens → cards */}
        <div className="block md:hidden space-y-4 p-2">
          {paginatedTrials.map((trial) => (
            <Card key={trial.trial_id} className="shadow-sm">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Trial ID: <span className="font-mono">{trial.trial_id.slice(0, 8)}...</span></p>
                    <p className="font-semibold">{trial.overview.title || "Untitled"}</p>
                    <Badge variant="outline">{trial.overview.therapeutic_area || "N/A"}</Badge>
                    <p className="text-sm">Disease: {trial.overview.disease_type || "N/A"}</p>
                    <p className="text-sm">Status: <span className={getStatusColor(trial.overview.status)}>{trial.overview.status || "Unknown"}</span></p>
                    <p className="text-sm">Phase: {trial.overview.trial_phase || "N/A"}</p>
                    <p className="text-sm">Sponsor: {trial.overview.sponsor_collaborators || "N/A"}</p>
                    <p className="text-sm">Created: {formatDate(trial.overview.created_at)}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Checkbox
                      checked={selectedTrials.has(trial.trial_id)}
                      onCheckedChange={(checked) => handleSelectTrial(trial.trial_id, checked as boolean)}
                    />
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/admin/therapeutics/${trial.trial_id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEditClick(trial.trial_id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTrial(trial.trial_id)}
                        disabled={deletingTrials[trial.trial_id]}
                        className="text-red-600 hover:text-red-700"
                      >
                        {deletingTrials[trial.trial_id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="items-per-page" className="text-sm font-medium">
                Results per page:
              </Label>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => handleItemsPerPageChange(parseInt(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} results
            </div>
          </div>
          
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}

      {/* Advanced Search Modal */}
      <TherapeuticAdvancedSearchModal
        open={isAdvancedSearchOpen}
        onOpenChange={setIsAdvancedSearchOpen}
        onApplySearch={handleAdvancedSearch}
      />

      {/* Filter Modal */}
      <TherapeuticFilterModal
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

      {/* Customize Column Modal */}
      <CustomizeColumnModal
        open={customizeColumnModalOpen}
        onOpenChange={setCustomizeColumnModalOpen}
        columnSettings={columnSettings}
        onColumnSettingsChange={handleColumnSettingsChange}
      />
    </div>
  );
}
