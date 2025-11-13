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

import { formatDateToMMDDYYYY } from "@/lib/date-utils";
import { normalizePhaseValue } from "@/lib/search-utils";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Eye, Plus, Search, Loader2, Filter, Clock, Edit, ChevronDown, Settings, Download, Save, ExternalLink, Maximize2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { TherapeuticAdvancedSearchModal, TherapeuticSearchCriteria } from "@/components/therapeutic-advanced-search-modal";
import { TherapeuticFilterModal, TherapeuticFilterState } from "@/components/therapeutic-filter-modal";
import { SaveQueryModal } from "@/components/save-query-modal";
import { QueryHistoryModal } from "@/components/query-history-modal";
import { QueryLogsModal } from "@/components/query-logs-modal";
import { CustomizeColumnModal, ColumnSettings, DEFAULT_COLUMN_SETTINGS, COLUMN_OPTIONS } from "@/components/customize-column-modal";
import { usersApi } from "@/app/_lib/api";
import { ScrollArea ,ScrollBar} from "@/components/ui/scroll-area";

// Types based on the API response
interface TherapeuticTrial {
  trial_id: string;
  overview: {
    id: string;
    therapeutic_area: string;
    trial_identifier: string[];
    trial_id?: string; // New field for TB-XXXXXX format
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
    attachment: string | null;
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
  const { toast } = useToast();
  const [trials, setTrials] = useState<TherapeuticTrial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrial, setSelectedTrial] = useState<TherapeuticTrial | null>(
    null
  );
  const [deletingTrials, setDeletingTrials] = useState<Record<string, boolean>>(
    {}
  );
  const [isDeletingAllTrials, setIsDeletingAllTrials] = useState(false);
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
    trialRecordStatus: [],
    // Additional fields from trial creation form
    otherDrugs: [],
    regions: [],
    ageMin: [],
    ageMax: [],
    subjectType: [],
    ecogPerformanceStatus: [],
    priorTreatments: [],
    biomarkerRequirements: [],
    estimatedEnrollment: [],
    actualEnrollment: [],
    enrollmentStatus: [],
    recruitmentPeriod: [],
    studyCompletionDate: [],
    primaryCompletionDate: [],
    populationDescription: [],
    studySites: [],
    principalInvestigators: [],
    siteStatus: [],
    siteCountries: [],
    siteRegions: [],
    siteContactInfo: [],
    trialResults: [],
    trialOutcomeContent: [],
    resultsAvailable: [],
    endpointsMet: [],
    adverseEventsReported: [],
    studyStartDate: [],
    firstPatientIn: [],
    lastPatientIn: [],
    studyEndDate: [],
    interimAnalysisDates: [],
    finalAnalysisDate: [],
    regulatorySubmissionDate: [],
    purposeOfTrial: [],
    summary: [],
    primaryOutcomeMeasures: [],
    otherOutcomeMeasures: [],
    studyDesignKeywords: [],
    studyDesign: [],
    treatmentRegimen: [],
    numberOfArms: [],
    inclusionCriteria: [],
    exclusionCriteria: [],
    ageFrom: [],
    ageTo: [],
    gender: [],
    targetNoVolunteers: [],
    actualEnrolledVolunteers: [],
    startDateEstimated: [],
    trialEndDateEstimated: [],
    trialOutcome: [],
    adverseEventReported: [],
    adverseEventType: [],
    treatmentForAdverseEvents: [],
    totalSites: [],
    siteNotes: [],
    publicationType: [],
    registryName: [],
    studyType: []
  });
  const [saveQueryModalOpen, setSaveQueryModalOpen] = useState(false);
  const [queryHistoryModalOpen, setQueryHistoryModalOpen] = useState(false);
  const [queryLogsModalOpen, setQueryLogsModalOpen] = useState(false);
  const [editingQueryId, setEditingQueryId] = useState<string | null>(null);
  const [editingQueryTitle, setEditingQueryTitle] = useState<string>("");
  const [editingQueryDescription, setEditingQueryDescription] = useState<string>("");
  
  // Sorting state
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  
  // Column customization state
  const [customizeColumnModalOpen, setCustomizeColumnModalOpen] = useState(false);
  const [columnSettings, setColumnSettings] = useState<ColumnSettings>(DEFAULT_COLUMN_SETTINGS);
  const isDevMode = process.env.NODE_ENV === "development";
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Multiple selection state
  const [selectedTrials, setSelectedTrials] = useState<Set<string>>(new Set());
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [showViewSelectedButton, setShowViewSelectedButton] = useState(false);
  
  // User name mapping cache
  const [userNameMap, setUserNameMap] = useState<Record<string, string>>({});

  // Populate user name mapping cache from trials data
  const populateUserNameMap = async (trialsData: TherapeuticTrial[]) => {
    const userIds = new Set<string>();
    
    // Collect all unique user IDs from logs
    trialsData.forEach(trial => {
      if (trial.logs && trial.logs.length > 0) {
        trial.logs.forEach(log => {
          if (log.last_modified_user && log.last_modified_user.trim() !== "") {
            userIds.add(log.last_modified_user);
          }
        });
      }
    });
    
    // Fetch users and build mapping
    try {
      const users = await usersApi.list();
      const newMap: Record<string, string> = {};
      
      userIds.forEach(userId => {
        // Check if it's already "Admin" or "admin"
        const lowerUserId = userId.toLowerCase();
        if (lowerUserId === 'admin' || lowerUserId === 'administrator') {
          newMap[userId] = 'Admin';
          return;
        }
        
        // Check if it's a UUID (user ID format)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(userId)) {
          const user = users.find((u: any) => u.id === userId);
          if (user && user.username) {
            newMap[userId] = user.username;
          } else {
            // Default to "Admin" if user not found
            newMap[userId] = 'Admin';
          }
        } else {
          // If it's not a UUID, it might already be a username/name
          newMap[userId] = userId;
        }
      });
      
      setUserNameMap(prev => ({ ...prev, ...newMap }));
      console.log('User name mapping populated:', newMap);
    } catch (error) {
      console.log('Error populating user name map:', error);
    }
  };

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
      
      // Pre-populate user name mapping cache
      populateUserNameMap(trialsWithLocalUpdates);
      
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
    try {
      console.log("[AdminTherapeuticsPage] Clearing therapeutic trial cache keys");
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (
          key === "therapeuticTrials" ||
          key.startsWith("trial_")
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => {
        console.log("[AdminTherapeuticsPage] Removing localStorage key:", key);
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.warn("[AdminTherapeuticsPage] Failed to clear trial cache:", error);
    }
  };


  const deleteAllTrials = async () => {
    if (!isDevMode) {
      toast({
        title: "Restricted",
        description: "Bulk delete is only available in development mode.",
        variant: "destructive",
      });
      return;
    }

    if (
      !confirm(
        "This will permanently delete ALL trials from the development database. Are you sure you want to continue?"
      )
    ) {
      return;
    }

    const currentUserId = localStorage.getItem("userId");
    if (!currentUserId) {
      toast({
        title: "Error",
        description: "User ID not found",
        variant: "destructive",
      });
      return;
    }

    setIsDeletingAllTrials(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/therapeutic/all-trials/dev`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ user_id: currentUserId }),
        }
      );

      if (response.ok) {
        const data = await response.json().catch(() => null);
        console.log("[AdminTherapeuticsPage] Delete all trials response:", data);
        clearCache();
        setTrials([]);
        setSelectedTrials(new Set());
        setIsSelectAllChecked(false);
        toast({
          title: "All trials deleted",
          description: `Removed ${data?.deleted_count ?? 0} trial(s) from the development database.`,
        });
        await fetchTrials(true);
      } else {
        const errorPayload = await response.json().catch(() => null);
        console.error(
          "[AdminTherapeuticsPage] Delete all trials failed:",
          errorPayload
        );
        toast({
          title: "Error",
          description:
            errorPayload?.message || "Failed to delete all trials",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(
        "[AdminTherapeuticsPage] Delete all trials exception:",
        error
      );
      toast({
        title: "Error",
        description: "Failed to delete all trials",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAllTrials(false);
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
    const popup = window.open(
      `/admin/therapeutics/edit/${trialId}`,
      `edit_trial_${trialId}`,
      "width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no"
    );
    if (!popup) {
      toast({
        title: "Popup blocked",
        description: "Please allow popups for this site to edit trials.",
        variant: "destructive",
      });
    }
  };

  // Handle advanced search
  const handleAdvancedSearch = (criteria: TherapeuticSearchCriteria[]) => {
    console.log('Advanced search criteria:', criteria);
    
    const startTime = Date.now();
    
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
    
    // Log advanced search execution
    const executionTime = Date.now() - startTime;
    const queryLog = {
      id: Date.now().toString(),
      queryId: 'advanced_search_' + Date.now(),
      queryTitle: 'Advanced Search',
      queryDescription: `Advanced search with ${criteria.length} criteria`,
      executedAt: new Date().toISOString(),
      executedBy: 'current_user',
      queryType: 'advanced_search' as const,
      criteria: criteria,
      filters: appliedFilters,
      searchTerm: searchTerm,
      resultCount: trials.length, // This will be updated after filtering
      executionTime: executionTime
    };
    
    // Save to localStorage
    const existingLogs = JSON.parse(localStorage.getItem('queryExecutionLogs') || '[]');
    existingLogs.unshift(queryLog);
    localStorage.setItem('queryExecutionLogs', JSON.stringify(existingLogs));
  };

  // Handle advanced search modal close
  const handleAdvancedSearchModalChange = (open: boolean) => {
    setIsAdvancedSearchOpen(open);
    // Clear editing state when modal closes
    if (!open) {
      setEditingQueryId(null);
      setEditingQueryTitle("");
      setEditingQueryDescription("");
    }
  };

  // Handle load query from history
  const handleLoadQuery = (queryData: any) => {
    console.log('Loading query data:', queryData);
    
    const startTime = Date.now();
    
    // Load search criteria if available
    if (queryData.searchCriteria && Array.isArray(queryData.searchCriteria)) {
      setAdvancedSearchCriteria(queryData.searchCriteria);
    }
    
    // Load filters if available
    if (queryData.filters) {
      setAppliedFilters(queryData.filters);
    }
    
    // Load search term if available
    if (queryData.searchTerm) {
      setSearchTerm(queryData.searchTerm);
    }
    
    // Log query execution with proper metadata
    const executionTime = Date.now() - startTime;
    const queryLog = {
      id: Date.now().toString(),
      queryId: queryData.queryId || 'unknown',
      queryTitle: queryData.queryTitle || 'Unknown Query',
      queryDescription: queryData.queryDescription || null,
      executedAt: new Date().toISOString(),
      executedBy: 'current_user', // You can replace this with actual user info
      queryType: 'saved_query' as const,
      criteria: queryData.searchCriteria,
      filters: queryData.filters,
      searchTerm: queryData.searchTerm,
      resultCount: trials.length, // This will be updated after filtering
      executionTime: executionTime
    };
    
    // Save to localStorage
    const existingLogs = JSON.parse(localStorage.getItem('queryExecutionLogs') || '[]');
    existingLogs.unshift(queryLog); // Add to beginning of array
    localStorage.setItem('queryExecutionLogs', JSON.stringify(existingLogs));
    
    toast({
      title: "Query Loaded",
      description: "Query has been loaded successfully",
    });
  };

  // Handle execute query from logs
  const handleExecuteQueryFromLog = (queryData: any) => {
    console.log('Executing query from log:', queryData);
    
    // Load search criteria if available
    if (queryData.searchCriteria && Array.isArray(queryData.searchCriteria)) {
      setAdvancedSearchCriteria(queryData.searchCriteria);
    }
    
    // Load filters if available
    if (queryData.filters) {
      setAppliedFilters(queryData.filters);
    }
    
    // Load search term if available
    if (queryData.searchTerm) {
      setSearchTerm(queryData.searchTerm);
    }
    
    toast({
      title: "Query Executed",
      description: `"${queryData.queryTitle}" has been applied to your current view`,
    });
  };

  // Handle edit query from history
  const handleEditQuery = (queryData: any) => {
    console.log('Editing query data:', queryData);
    
    // Store the query being edited
    setEditingQueryId(queryData.queryId);
    setEditingQueryTitle(queryData.queryTitle || "");
    setEditingQueryDescription(queryData.queryDescription || "");
    
    // Load search criteria if available
    if (queryData.searchCriteria && Array.isArray(queryData.searchCriteria)) {
      setAdvancedSearchCriteria(queryData.searchCriteria);
    }
    
    // Load filters if available
    if (queryData.filters) {
      setAppliedFilters(queryData.filters);
    }
    
    // Load search term if available
    if (queryData.searchTerm) {
      setSearchTerm(queryData.searchTerm);
    }
    
    // Open the Advanced Search modal with the loaded data
    setIsAdvancedSearchOpen(true);
  };

  // Handle save query success
  const handleSaveQuerySuccess = () => {
    // Clear editing state after successful save
    setEditingQueryId(null);
    setEditingQueryTitle("");
    setEditingQueryDescription("");
  };

  // Handle search term change
  const handleSearchTermChange = (value: string) => {
    console.log('Search term changed:', {
      previousValue: searchTerm,
      newValue: value,
      trimmedValue: value.trim(),
      totalTrials: trials.length
    });
    setSearchTerm(value);
  };

  // Handle filter application
  const handleApplyFilters = (filters: TherapeuticFilterState) => {
    const startTime = Date.now();
    
    setAppliedFilters(filters);
    const activeFilterCount = Object.values(filters).reduce((count, arr) => count + arr.length, 0);
    
    // Log filter execution
    const executionTime = Date.now() - startTime;
    const queryLog = {
      id: Date.now().toString(),
      queryId: 'filter_' + Date.now(),
      queryTitle: 'Filter Application',
      queryDescription: `Applied ${activeFilterCount} filter criteria`,
      executedAt: new Date().toISOString(),
      executedBy: 'current_user',
      queryType: 'filter' as const,
      criteria: advancedSearchCriteria,
      filters: filters,
      searchTerm: searchTerm,
      resultCount: trials.length, // This will be updated after filtering
      executionTime: executionTime
    };
    
    // Save to localStorage
    const existingLogs = JSON.parse(localStorage.getItem('queryExecutionLogs') || '[]');
    existingLogs.unshift(queryLog);
    localStorage.setItem('queryExecutionLogs', JSON.stringify(existingLogs));
    
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
    // Helper to get user name synchronously (using cache)
    const getUserNameSync = (userId: string): string => {
      if (!userId || userId.trim() === "") return "";
      
      // Check cache first
      if (userNameMap[userId]) {
        return userNameMap[userId];
      }
      
      // Check if it's already "Admin" or "admin"
      const lowerUserId = userId.toLowerCase();
      if (lowerUserId === 'admin' || lowerUserId === 'administrator') {
        return 'Admin';
      }
      
      // If it's not in cache and not "admin", return as-is (will be resolved later)
      return userId;
    };
    if (criteria.length === 0) return true;

    // Debug: Log all trials and their trial_tags/disease_type for debugging
    if (criteria.some(c => c.field === "trial_tags")) {
      console.log('All trials trial_tags and disease_type:', trials.map(t => ({
        id: t.trial_id,
        title: t.overview?.title || "N/A",
        trial_tags: t.overview?.trial_tags || "N/A",
        disease_type: t.overview?.disease_type || "N/A",
        combined: `${t.overview?.trial_tags || ""} ${t.overview?.disease_type || ""}`.trim()
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

        // Logs fields
        case "last_modified_date":
          // Get the most recent last_modified_date from logs array
          if (trial.logs && trial.logs.length > 0) {
            const dates = trial.logs
              .map(log => log.last_modified_date)
              .filter(date => date !== null && date !== undefined)
              .sort()
              .reverse(); // Most recent first
            fieldValue = dates.length > 0 ? dates[0] : "";
            console.log('last_modified_date search:', { trialId: trial.trial_id, fieldValue, dates });
          } else {
            fieldValue = "";
          }
          break;
        case "last_modified_user":
          // Get all unique last_modified_user values from logs array and convert IDs to names
          if (trial.logs && trial.logs.length > 0) {
            const users = trial.logs
              .map(log => {
                const userId = log.last_modified_user;
                if (!userId || userId.trim() === "") return null;
                
                // Convert user ID to name using cached mapping
                return getUserNameSync(userId);
              })
              .filter(user => user !== null && user !== undefined && user.trim() !== "")
              .filter((user, index, self) => self.indexOf(user) === index); // Get unique values
            
            fieldValue = users.join(", ");
            console.log('last_modified_user search:', { trialId: trial.trial_id, fieldValue, users });
          } else {
            fieldValue = "";
          }
          break;

        default:
          fieldValue = "";
      }

      // Apply the operator
      const targetValue = fieldValue.toLowerCase();

      // Special handling for dropdown fields that should use exact matching
      const dropdownFields = [
        'trial_phase', 'status', 'therapeutic_area', 'disease_type', 
        'patient_segment', 'line_of_therapy', 'trial_record_status',
        'sex', 'healthy_volunteers', 'trial_outcome', 'adverse_event_reported'
      ];

      // For dropdown fields, if the operator is "contains" but we're searching for exact values,
      // we should use exact matching instead
      if (dropdownFields.includes(field) && (operator === "contains" || operator === "is")) {
        const searchValue = typeof value === 'string' ? value.toLowerCase() : '';
        
        // Check if the search value matches exactly or if it's a partial match within the field
        if (targetValue === searchValue) {
          return true;
        }
        
        // For trial_phase specifically, handle all variations
        if (field === 'trial_phase') {
          const normalizedSearch = normalizePhaseValue(searchValue).toLowerCase();
          const normalizedTarget = normalizePhaseValue(targetValue).toLowerCase();
          
          // Check for exact match
          if (normalizedTarget === normalizedSearch) {
            return true;
          }
          
          // For "is" operator, only do exact matching after normalization
          if (operator === "is") {
            return false; // No partial matching for "is" operator
          }
          
          // Check for partial matches (e.g., "Phase 3" should match "Phase III") - only for "contains"
          const phaseEquivalents = {
            'phase i': ['phase 1', 'phase i', 'phase 1/2', 'phase_i', 'phase_1', 'phase_i_ii', 'phase_1_2'],
            'phase ii': ['phase 2', 'phase ii', 'phase 2/3', 'phase_ii', 'phase_2', 'phase_ii_iii', 'phase_2_3'],
            'phase iii': ['phase 3', 'phase iii', 'phase_iii', 'phase_3', 'phase_iii_iv', 'phase_3_4'],
            'phase iv': ['phase 4', 'phase iv', 'phase_iv', 'phase_4'],
            'phase 1': ['phase i', 'phase 1', 'phase 1/2', 'phase_i', 'phase_1', 'phase_i_ii', 'phase_1_2'],
            'phase 2': ['phase ii', 'phase 2', 'phase 2/3', 'phase_ii', 'phase_2', 'phase_ii_iii', 'phase_2_3'],
            'phase 3': ['phase iii', 'phase 3', 'phase_iii', 'phase_3', 'phase_iii_iv', 'phase_3_4'],
            'phase 4': ['phase iv', 'phase 4', 'phase_iv', 'phase_4']
          };
          
          // Check if search value matches any equivalent
          for (const [key, equivalents] of Object.entries(phaseEquivalents)) {
            if (key === normalizedSearch) {
              return equivalents.some(equiv => normalizedTarget.includes(equiv));
            }
          }
          
          // Also check if target contains search (for cases like "Phase 1/2" matching "Phase 1")
          return normalizedTarget.includes(normalizedSearch) || normalizedSearch.includes(normalizedTarget);
        }
        
        // For other dropdown fields, use exact matching
        return targetValue === searchValue;
      }

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

      // Special handling for date fields
      const dateFields = ['created_at', 'updated_at', 'last_modified_date', 'start_date_estimated', 'trial_end_date_estimated'];
      if (dateFields.includes(field)) {
        // Parse dates for comparison
        const parseDate = (dateStr: string): Date | null => {
          if (!dateStr || dateStr.trim() === '') return null;
          
          // Try multiple date formats
          const formats = [
            /^\d{4}-\d{2}-\d{2}/, // YYYY-MM-DD
            /^\d{2}\/\d{2}\/\d{4}/, // MM/DD/YYYY
            /^\d{2}-\d{2}-\d{4}/, // MM-DD-YYYY
          ];
          
          let date: Date | null = null;
          try {
            // Try ISO format first
            if (dateStr.match(/^\d{4}-\d{2}-\d{2}/)) {
              date = new Date(dateStr);
            } else if (dateStr.match(/^\d{2}[\/-]\d{2}[\/-]\d{4}/)) {
              // MM/DD/YYYY or MM-DD-YYYY
              const parts = dateStr.split(/[\/-]/);
              if (parts.length === 3) {
                date = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
              }
            }
            
            if (!date || isNaN(date.getTime())) {
              return null;
            }
            return date;
          } catch (e) {
            console.log('Date parsing error:', e, 'for value:', dateStr);
            return null;
          }
        };

        const trialDate = parseDate(fieldValue);
        const searchDate = parseDate(value as string);

        console.log('Date field search:', { field, fieldValue, searchValue: value, trialDate, searchDate, operator });

        if (!trialDate || !searchDate) {
          // If either date is invalid, fall back to string comparison
          console.log('Date parsing failed, using string comparison');
          switch (operator) {
            case "contains":
              return targetValue.includes(searchValue);
            case "equals":
            case "is":
              return targetValue === searchValue;
            case "not_equals":
            case "is_not":
              return targetValue !== searchValue;
            default:
              return false;
          }
        }

        // Date comparison
        const comparisonResult = (() => {
          switch (operator) {
            case "equals":
            case "is":
              return trialDate.getTime() === searchDate.getTime();
            case "not_equals":
            case "is_not":
              return trialDate.getTime() !== searchDate.getTime();
            case "greater_than":
              return trialDate.getTime() > searchDate.getTime();
            case "greater_than_equal":
              return trialDate.getTime() >= searchDate.getTime();
            case "less_than":
              return trialDate.getTime() < searchDate.getTime();
            case "less_than_equal":
              return trialDate.getTime() <= searchDate.getTime();
            case "contains":
              // For date fields, "contains" means same day (ignore time)
              return trialDate.toDateString() === searchDate.toDateString();
            default:
              return false;
          }
        })();
        
        console.log('Date comparison result:', { comparisonResult, operator });
        return comparisonResult;
      }

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
      // Core fields
      case "therapeuticArea": return trial.overview?.therapeutic_area || "";
      case "diseaseType": return trial.overview?.disease_type || "";
      case "primaryDrug": return trial.overview?.primary_drugs || "";
      case "trialPhase": return trial.overview?.trial_phase || "";
      case "patientSegment": return trial.overview?.patient_segment || "";
      case "lineOfTherapy": return trial.overview?.line_of_therapy || "";
      case "countries": return trial.overview?.countries || "";
      case "sponsorsCollaborators": 
      case "sponsor": return trial.overview?.sponsor_collaborators || "";
      case "fieldOfActivity": return trial.overview?.sponsor_field_activity || "";
      case "associatedCro": return trial.overview?.associated_cro || "";
      case "trialTags": return trial.overview?.trial_tags || "";
      case "sex": return trial.criteria[0]?.sex || "";
      case "healthyVolunteers": return trial.criteria[0]?.healthy_volunteers || "";
      case "trialRecordStatus": return trial.overview?.trial_record_status || "";
      case "otherDrugs": return trial.overview?.other_drugs || "";
      case "regions": return trial.overview?.region || "";
      case "ageMin": return trial.criteria[0]?.age_from || "";
      case "ageMax": return trial.criteria[0]?.age_to || "";
      case "subjectType": return trial.criteria[0]?.subject_type || "";
      
      // Enrollment & Study data
      case "estimatedEnrollment":
      case "targetNoVolunteers": return trial.criteria[0]?.target_no_volunteers?.toString() || "0";
      case "actualEnrollment":
      case "actualEnrolledVolunteers": return trial.criteria[0]?.actual_enrolled_volunteers?.toString() || "0";
      
      // Timing fields
      case "studyStartDate":
      case "startDateEstimated": return trial.timing[0]?.start_date_estimated || "";
      case "studyEndDate":
      case "trialEndDateEstimated": return trial.timing[0]?.trial_end_date_estimated || "";
      
      // Outcomes fields
      case "purposeOfTrial": return trial.outcomes[0]?.purpose_of_trial || "";
      case "summary": return trial.outcomes[0]?.summary || "";
      case "primaryOutcomeMeasures": return trial.outcomes[0]?.primary_outcome_measure || "";
      case "otherOutcomeMeasures": return trial.outcomes[0]?.other_outcome_measure || "";
      case "studyDesignKeywords": return trial.outcomes[0]?.study_design_keywords || "";
      case "studyDesign": return trial.outcomes[0]?.study_design || "";
      case "treatmentRegimen": return trial.outcomes[0]?.treatment_regimen || "";
      case "numberOfArms": return trial.outcomes[0]?.number_of_arms?.toString() || "0";
      
      // Criteria fields
      case "inclusionCriteria": return trial.criteria[0]?.inclusion_criteria || "";
      case "exclusionCriteria": return trial.criteria[0]?.exclusion_criteria || "";
      case "ageFrom": return trial.criteria[0]?.age_from || "";
      case "ageTo": return trial.criteria[0]?.age_to || "";
      case "gender": return trial.criteria[0]?.sex || "";
      
      // Results fields
      case "trialOutcome":
      case "trialOutcomeContent": return trial.results[0]?.trial_outcome || "";
      case "trialResults": return trial.results[0]?.trial_results?.join(", ") || "";
      case "adverseEventReported":
      case "adverseEventsReported": return trial.results[0]?.adverse_event_reported || "";
      case "adverseEventType": return trial.results[0]?.adverse_event_type || "";
      case "treatmentForAdverseEvents": return trial.results[0]?.treatment_for_adverse_events || "";
      
      // Sites fields
      case "totalSites": return trial.sites[0]?.total?.toString() || "0";
      case "siteNotes": return trial.sites[0]?.notes || "";
      
      // Additional fields
      case "publicationType": return "";
      case "registryName": return "";
      case "studyType": return "";
      
      // Legacy support
      case "trial_id": return trial.overview.trial_id || trial.trial_id;
      case "therapeutic_area": return trial.overview?.therapeutic_area || "";
      case "disease_type": return trial.overview?.disease_type || "";
      case "primary_drug": return trial.overview?.primary_drugs || "";
      case "trial_status": return trial.overview?.status || "";
      case "phase": return trial.overview?.trial_phase || "";
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

  // Get available sort options based on currently visible columns
  const getAvailableSortOptions = () => {
    return COLUMN_OPTIONS.filter((opt) => columnSettings[opt.key]);
  };

  // Filter trials based on search term, advanced search criteria, and filters
  const filteredTrials = trials.filter((trial) => {
    // Basic search term filter - search across multiple fields
    const matchesSearchTerm = (() => {
      // If search term is empty or only whitespace, match all
      if (!searchTerm || !searchTerm.trim()) {
        return true;
      }
      
      // Trim and normalize search term
      const trimmedSearch = searchTerm.trim();
      const searchLower = trimmedSearch.toLowerCase();
      
      // Build comprehensive searchable text from all relevant fields
      const searchableFields = [
        // Trial ID fields
        trial.trial_id || "",
        trial.overview?.trial_id || "",
        trial.overview?.id || "",
        // Overview fields
        trial.overview?.title || "",
        trial.overview?.therapeutic_area || "",
        trial.overview?.disease_type || "",
        trial.overview?.sponsor_collaborators || "",
        trial.overview?.sponsor_field_activity || "",
        trial.overview?.associated_cro || "",
        trial.overview?.primary_drugs || "",
        trial.overview?.other_drugs || "",
        trial.overview?.patient_segment || "",
        trial.overview?.line_of_therapy || "",
        trial.overview?.trial_tags || "",
        trial.overview?.countries || "",
        trial.overview?.region || "",
        trial.overview?.trial_record_status || "",
        trial.overview?.trial_phase || "",
        trial.overview?.status || "",
        // Trial identifiers and references
        ...(trial.overview?.trial_identifier || []),
        ...(trial.overview?.reference_links || []),
        // Outcomes fields
        trial.outcomes?.[0]?.purpose_of_trial || "",
        trial.outcomes?.[0]?.summary || "",
        trial.outcomes?.[0]?.primary_outcome_measure || "",
        trial.outcomes?.[0]?.other_outcome_measure || "",
        trial.outcomes?.[0]?.study_design_keywords || "",
        trial.outcomes?.[0]?.study_design || "",
        trial.outcomes?.[0]?.treatment_regimen || "",
        // Criteria fields
        trial.criteria?.[0]?.inclusion_criteria || "",
        trial.criteria?.[0]?.exclusion_criteria || "",
        trial.criteria?.[0]?.subject_type || "",
        trial.criteria?.[0]?.sex || "",
        trial.criteria?.[0]?.healthy_volunteers || "",
        trial.criteria?.[0]?.age_from || "",
        trial.criteria?.[0]?.age_to || "",
        // Results fields
        trial.results?.[0]?.trial_outcome || "",
        ...(trial.results?.[0]?.trial_results || []),
        trial.results?.[0]?.adverse_event_reported || "",
        trial.results?.[0]?.adverse_event_type || "",
        trial.results?.[0]?.treatment_for_adverse_events || "",
        // Sites fields
        trial.sites?.[0]?.notes || "",
        trial.sites?.[0]?.total?.toString() || "",
      ];
      
      // Join all searchable fields and normalize
      const searchableText = searchableFields
        .filter(field => field !== null && field !== undefined && field !== "")
        .join(" ")
        .toLowerCase()
        .trim();
      
      // Perform case-insensitive search
      const matches = searchableText.includes(searchLower);
      
      // Debug logging (only log when search term is provided)
      if (trimmedSearch && matches) {
        console.log('Search match found:', {
          trialId: trial.trial_id,
          title: trial.overview?.title,
          searchTerm: trimmedSearch,
          matchedFields: searchableFields.filter(f => 
            f && f.toString().toLowerCase().includes(searchLower)
          ).slice(0, 3) // Log first 3 matching fields
        });
      }
      
      return matches;
    })();

    // Advanced search filter
    const matchesAdvancedSearch = applyAdvancedSearchFilter(trial, advancedSearchCriteria);

    // Apply filters
    const matchesFilters = (
      (appliedFilters.therapeuticAreas.length === 0 ||
        (trial.overview?.therapeutic_area && appliedFilters.therapeuticAreas.includes(trial.overview.therapeutic_area))) &&
      (appliedFilters.statuses.length === 0 ||
        (trial.overview?.status && appliedFilters.statuses.includes(trial.overview.status))) &&
      (appliedFilters.diseaseTypes.length === 0 ||
        (trial.overview?.disease_type && appliedFilters.diseaseTypes.includes(trial.overview.disease_type))) &&
      (appliedFilters.primaryDrugs.length === 0 ||
        (trial.overview?.primary_drugs && appliedFilters.primaryDrugs.some(drug =>
          trial.overview.primary_drugs.toLowerCase().includes(drug.toLowerCase())))) &&
      (appliedFilters.trialPhases.length === 0 ||
        (trial.overview?.trial_phase && appliedFilters.trialPhases.includes(trial.overview.trial_phase))) &&
      (appliedFilters.countries.length === 0 ||
        (trial.overview?.countries && appliedFilters.countries.some(country =>
          trial.overview.countries.toLowerCase().includes(country.toLowerCase())))) &&
      (appliedFilters.sponsorsCollaborators.length === 0 ||
        (trial.overview?.sponsor_collaborators && appliedFilters.sponsorsCollaborators.some(sponsor =>
          trial.overview.sponsor_collaborators.toLowerCase().includes(sponsor.toLowerCase())))) &&
      (appliedFilters.trialRecordStatus.length === 0 ||
        (trial.overview?.trial_record_status && appliedFilters.trialRecordStatus.includes(trial.overview.trial_record_status))) &&
      (appliedFilters.patientSegments.length === 0 ||
        (trial.overview?.patient_segment && appliedFilters.patientSegments.includes(trial.overview.patient_segment))) &&
      (appliedFilters.lineOfTherapy.length === 0 ||
        (trial.overview?.line_of_therapy && appliedFilters.lineOfTherapy.includes(trial.overview.line_of_therapy))) &&
      (appliedFilters.trialTags.length === 0 ||
        (trial.overview?.trial_tags && appliedFilters.trialTags.some(tag =>
          trial.overview.trial_tags.toLowerCase().includes(tag.toLowerCase())))) &&
      (appliedFilters.sex.length === 0 ||
        (trial.criteria.length > 0 && trial.criteria[0]?.sex && appliedFilters.sex.includes(trial.criteria[0].sex))) &&
      (appliedFilters.healthyVolunteers.length === 0 ||
        (trial.criteria.length > 0 && trial.criteria[0]?.healthy_volunteers && appliedFilters.healthyVolunteers.includes(trial.criteria[0].healthy_volunteers)))
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

  // Log search results summary when filters change
  useEffect(() => {
    console.log('Search results summary:', {
      totalTrials: trials.length,
      filteredTrials: filteredTrials.length,
      searchTerm: searchTerm || '(empty)',
      hasAdvancedSearch: advancedSearchCriteria.length > 0,
      hasFilters: Object.values(appliedFilters).some(arr => arr.length > 0),
      currentPage: currentPage,
      itemsPerPage: itemsPerPage
    });
  }, [filteredTrials.length, searchTerm, advancedSearchCriteria.length, appliedFilters, currentPage, itemsPerPage, trials.length]);

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

    // Listen for custom refresh event from edit pages
    const handleRefreshFromEdit = () => {
      console.log('Refresh triggered from edit page, refreshing data...');
      fetchTrials(true);
    };

    window.addEventListener('refreshFromEdit', handleRefreshFromEdit);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('refreshFromEdit', handleRefreshFromEdit);
    };
  }, []);

  // Debug: Log trials data when filter modal opens
  useEffect(() => {
    if (filterModalOpen) {
      console.log('Main page: Passing trials to filter modal:', trials.length, trials)
    }
  }, [filterModalOpen, trials]);

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
    return formatDateToMMDDYYYY(dateString);
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

  const handleViewSelectedTrials = (openInTabs: boolean = false) => {
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
      // Open in new tabs - backend view
      selectedTrialIds.forEach(trialId => {
        window.open(`/admin/therapeutics/${trialId}/backend`, '_blank');
      });
    } else {
      // Open in popup windows - backend view (default)
      selectedTrialIds.forEach((trialId, index) => {
        const popup = window.open(
          `/admin/therapeutics/${trialId}/backend`,
          `trial_backend_${trialId}`,
          `width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no,left=${100 + (index * 50)},top=${100 + (index * 50)}`
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
      description: `Opened ${selectedTrialIds.length} trial${selectedTrialIds.length > 1 ? 's' : ''} in backend view successfully.`,
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

  // Note: Do not block render with a loading screen; render UI immediately

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
          <Button onClick={() => {
            const popup = window.open(
              "/admin/therapeutics/new/5-consolidated",
              "add_new_trial",
              "width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no"
            );
            if (!popup) {
              toast({
                title: "Popup blocked",
                description: "Please allow popups for this site to add new trials.",
                variant: "destructive",
              });
            }
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Trial
          </Button>
          {isDevMode && (
            <Button
              variant="destructive"
              onClick={deleteAllTrials}
              disabled={isDeletingAllTrials}
              className="flex items-center"
            >
              {isDeletingAllTrials ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Trials (Dev)
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search trials by title, therapeutic area, disease type, drugs, sponsor, etc..."
            value={searchTerm}
            onChange={(e) => handleSearchTermChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {(searchTerm || advancedSearchCriteria.length > 0 || Object.values(appliedFilters).some(arr => arr.length > 0)) && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              console.log('Clearing all filters and search term');
              setSearchTerm("");
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
                trialRecordStatus: [],
                // Additional fields from trial creation form
                otherDrugs: [],
                regions: [],
                ageMin: [],
                ageMax: [],
                subjectType: [],
                ecogPerformanceStatus: [],
                priorTreatments: [],
                biomarkerRequirements: [],
                estimatedEnrollment: [],
                actualEnrollment: [],
                enrollmentStatus: [],
                recruitmentPeriod: [],
                studyCompletionDate: [],
                primaryCompletionDate: [],
                populationDescription: [],
                studySites: [],
                principalInvestigators: [],
                siteStatus: [],
                siteCountries: [],
                siteRegions: [],
                siteContactInfo: [],
                trialResults: [],
                trialOutcomeContent: [],
                resultsAvailable: [],
                endpointsMet: [],
                adverseEventsReported: [],
                studyStartDate: [],
                firstPatientIn: [],
                lastPatientIn: [],
                studyEndDate: [],
                interimAnalysisDates: [],
                finalAnalysisDate: [],
                regulatorySubmissionDate: [],
                purposeOfTrial: [],
                summary: [],
                primaryOutcomeMeasures: [],
                otherOutcomeMeasures: [],
                studyDesignKeywords: [],
                studyDesign: [],
                treatmentRegimen: [],
                numberOfArms: [],
                inclusionCriteria: [],
                exclusionCriteria: [],
                ageFrom: [],
                ageTo: [],
                gender: [],
                targetNoVolunteers: [],
                actualEnrolledVolunteers: [],
                startDateEstimated: [],
                trialEndDateEstimated: [],
                trialOutcome: [],
                adverseEventReported: [],
                adverseEventType: [],
                treatmentForAdverseEvents: [],
                totalSites: [],
                siteNotes: [],
                publicationType: [],
                registryName: [],
                studyType: []
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
                onClick={() => handleViewSelectedTrials(false)}
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300"
              >
                <Maximize2 className="h-4 w-4 mr-2" />
                Open in Popups (Default)
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

      {/* Sort By Dropdown and Query Actions */}
      <div className="flex items-center justify-between">
        {/* Left side - Sort and Customize Columns */}
        <div className="flex items-center space-x-2">
          <div className="relative" ref={sortDropdownRef}>
            <Button
              variant="outline"
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            >
              <ChevronDown className="h-4 w-4 mr-2" />
              {sortField ? (
                <>
                  {COLUMN_OPTIONS.find(opt => opt.key === sortField)?.label || "Sort By"}
                  <span className="ml-2 text-xs">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                </>
              ) : (
                "Sort By"
              )}
            </Button>
          {sortDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-[450px] overflow-y-auto">
              <div className="py-1">
                {getAvailableSortOptions().map((option) => (
                  <button
                    key={option.key}
                    onClick={() => {
                      handleSort(option.key);
                      setSortDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                      sortField === option.key ? "bg-blue-50 font-semibold text-blue-700" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option.label}</span>
                      {sortField === option.key && (
                        <span className="text-xs font-bold">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
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
        
        {/* Right side - Query Action Buttons */}
        <div className="flex items-center space-x-2">
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
            onClick={() => setQueryLogsModalOpen(true)}
            className="bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200"
          >
            <Clock className="h-4 w-4 mr-2" />
            Query Logs
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card ">
        {/* Desktop / larger screens → normal table */}
        <ScrollArea className="rounded-md border">
          <div className="">
        <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-12">
                  <Checkbox
                    checked={isSelectAllChecked}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Trial ID</TableHead>
                <TableHead>Title</TableHead>
                {columnSettings.therapeuticArea && <TableHead>Therapeutic Area</TableHead>}
                {columnSettings.diseaseType && <TableHead>Disease Type</TableHead>}
                {columnSettings.primaryDrug && <TableHead>Primary Drug</TableHead>}
                {columnSettings.trialPhase && <TableHead>Trial Phase</TableHead>}
                {columnSettings.patientSegment && <TableHead>Patient Segment</TableHead>}
                {columnSettings.lineOfTherapy && <TableHead>Line of Therapy</TableHead>}
                {columnSettings.countries && <TableHead>Countries</TableHead>}
                {columnSettings.sponsorsCollaborators && <TableHead>Sponsors & Collaborators</TableHead>}
                {columnSettings.sponsor && <TableHead>Sponsor</TableHead>}
                {columnSettings.fieldOfActivity && <TableHead>Field of Activity</TableHead>}
                {columnSettings.associatedCro && <TableHead>Associated CRO</TableHead>}
                {columnSettings.trialTags && <TableHead>Trial Tags</TableHead>}
                {columnSettings.sex && <TableHead>Sex</TableHead>}
                {columnSettings.healthyVolunteers && <TableHead>Healthy Volunteers</TableHead>}
                {columnSettings.trialRecordStatus && <TableHead>Trial Record Status</TableHead>}
                {columnSettings.otherDrugs && <TableHead>Other Drugs</TableHead>}
                {columnSettings.regions && <TableHead>Regions</TableHead>}
                {columnSettings.ageMin && <TableHead>Age Min</TableHead>}
                {columnSettings.ageMax && <TableHead>Age Max</TableHead>}
                {columnSettings.subjectType && <TableHead>Subject Type</TableHead>}
                {columnSettings.ecogPerformanceStatus && <TableHead>ECOG Status</TableHead>}
                {columnSettings.priorTreatments && <TableHead>Prior Treatments</TableHead>}
                {columnSettings.biomarkerRequirements && <TableHead>Biomarker Requirements</TableHead>}
                {columnSettings.estimatedEnrollment && <TableHead>Est. Enrollment</TableHead>}
                {columnSettings.actualEnrollment && <TableHead>Actual Enrollment</TableHead>}
                {columnSettings.enrollmentStatus && <TableHead>Enrollment Status</TableHead>}
                {columnSettings.recruitmentPeriod && <TableHead>Recruitment Period</TableHead>}
                {columnSettings.studyCompletionDate && <TableHead>Study Completion</TableHead>}
                {columnSettings.primaryCompletionDate && <TableHead>Primary Completion</TableHead>}
                {columnSettings.populationDescription && <TableHead>Population</TableHead>}
                {columnSettings.studySites && <TableHead>Study Sites</TableHead>}
                {columnSettings.principalInvestigators && <TableHead>Principal Investigators</TableHead>}
                {columnSettings.siteStatus && <TableHead>Site Status</TableHead>}
                {columnSettings.siteCountries && <TableHead>Site Countries</TableHead>}
                {columnSettings.siteRegions && <TableHead>Site Regions</TableHead>}
                {columnSettings.siteContactInfo && <TableHead>Site Contact Info</TableHead>}
                {columnSettings.trialResults && <TableHead>Trial Results</TableHead>}
                {columnSettings.trialOutcomeContent && <TableHead>Trial Outcome Content</TableHead>}
                {columnSettings.resultsAvailable && <TableHead>Results Available</TableHead>}
                {columnSettings.endpointsMet && <TableHead>Endpoints Met</TableHead>}
                {columnSettings.adverseEventsReported && <TableHead>Adverse Events</TableHead>}
                {columnSettings.studyStartDate && <TableHead>Study Start Date</TableHead>}
                {columnSettings.firstPatientIn && <TableHead>First Patient In</TableHead>}
                {columnSettings.lastPatientIn && <TableHead>Last Patient In</TableHead>}
                {columnSettings.studyEndDate && <TableHead>Study End Date</TableHead>}
                {columnSettings.interimAnalysisDates && <TableHead>Interim Analysis</TableHead>}
                {columnSettings.finalAnalysisDate && <TableHead>Final Analysis</TableHead>}
                {columnSettings.regulatorySubmissionDate && <TableHead>Regulatory Submission</TableHead>}
                {columnSettings.purposeOfTrial && <TableHead>Purpose of Trial</TableHead>}
                {columnSettings.summary && <TableHead>Summary</TableHead>}
                {columnSettings.primaryOutcomeMeasures && <TableHead>Primary Outcome</TableHead>}
                {columnSettings.otherOutcomeMeasures && <TableHead>Other Outcome</TableHead>}
                {columnSettings.studyDesignKeywords && <TableHead>Study Design Keywords</TableHead>}
                {columnSettings.studyDesign && <TableHead>Study Design</TableHead>}
                {columnSettings.treatmentRegimen && <TableHead>Treatment Regimen</TableHead>}
                {columnSettings.numberOfArms && <TableHead>Number of Arms</TableHead>}
                {columnSettings.inclusionCriteria && <TableHead>Inclusion Criteria</TableHead>}
                {columnSettings.exclusionCriteria && <TableHead>Exclusion Criteria</TableHead>}
                {columnSettings.ageFrom && <TableHead>Age From</TableHead>}
                {columnSettings.ageTo && <TableHead>Age To</TableHead>}
                {columnSettings.gender && <TableHead>Gender</TableHead>}
                {columnSettings.targetNoVolunteers && <TableHead>Target Volunteers</TableHead>}
                {columnSettings.actualEnrolledVolunteers && <TableHead>Actual Volunteers</TableHead>}
                {columnSettings.startDateEstimated && <TableHead>Start Date Est.</TableHead>}
                {columnSettings.trialEndDateEstimated && <TableHead>End Date Est.</TableHead>}
                {columnSettings.trialOutcome && <TableHead>Trial Outcome</TableHead>}
                {columnSettings.adverseEventReported && <TableHead>Adverse Event</TableHead>}
                {columnSettings.adverseEventType && <TableHead>Adverse Event Type</TableHead>}
                {columnSettings.treatmentForAdverseEvents && <TableHead>Treatment for AE</TableHead>}
                {columnSettings.totalSites && <TableHead>Total Sites</TableHead>}
                {columnSettings.siteNotes && <TableHead>Site Notes</TableHead>}
                {columnSettings.publicationType && <TableHead>Publication Type</TableHead>}
                {columnSettings.registryName && <TableHead>Registry Name</TableHead>}
                {columnSettings.studyType && <TableHead>Study Type</TableHead>}
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="">
              {paginatedTrials.map((trial) => (
                <TableRow key={trial.trial_id} className="hover:bg-muted/40">
                  <TableCell>
                    <Checkbox
                      checked={selectedTrials.has(trial.trial_id)}
                      onCheckedChange={(checked) => handleSelectTrial(trial.trial_id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-mono max-w-[140px] truncate" title={trial.overview.trial_id || trial.trial_id}>
                    {trial.overview.trial_id || (trial.trial_id ? `${trial.trial_id.slice(0, 8)}...` : "-")}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={trial.overview.title}>
                    {trial.overview.title || "Untitled"}
                  </TableCell>
                  {columnSettings.therapeuticArea && (
                    <TableCell className="max-w-[150px] truncate">{trial.overview.therapeutic_area || "N/A"}</TableCell>
                  )}
                  {columnSettings.diseaseType && (
                    <TableCell className="max-w-[150px] truncate">{trial.overview.disease_type || "N/A"}</TableCell>
                  )}
                  {columnSettings.primaryDrug && (
                    <TableCell className="max-w-[150px] truncate">{trial.overview.primary_drugs || "N/A"}</TableCell>
                  )}
                  {columnSettings.trialPhase && (
                    <TableCell>{trial.overview.trial_phase || "N/A"}</TableCell>
                  )}
                  {columnSettings.patientSegment && (
                    <TableCell className="max-w-[150px] truncate">{trial.overview.patient_segment || "N/A"}</TableCell>
                  )}
                  {columnSettings.lineOfTherapy && (
                    <TableCell className="max-w-[150px] truncate">{trial.overview.line_of_therapy || "N/A"}</TableCell>
                  )}
                  {columnSettings.countries && (
                    <TableCell className="max-w-[150px] truncate">{trial.overview.countries || "N/A"}</TableCell>
                  )}
                  {columnSettings.sponsorsCollaborators && (
                    <TableCell className="max-w-[150px] truncate">{trial.overview.sponsor_collaborators || "N/A"}</TableCell>
                  )}
                  {columnSettings.sponsor && (
                    <TableCell className="max-w-[150px] truncate">{trial.overview.sponsor_collaborators || "N/A"}</TableCell>
                  )}
                  {columnSettings.fieldOfActivity && (
                    <TableCell className="max-w-[150px] truncate">{trial.overview.sponsor_field_activity || "N/A"}</TableCell>
                  )}
                  {columnSettings.associatedCro && (
                    <TableCell className="max-w-[150px] truncate">{trial.overview.associated_cro || "N/A"}</TableCell>
                  )}
                  {columnSettings.trialTags && (
                    <TableCell className="max-w-[150px] truncate">{trial.overview.trial_tags || "N/A"}</TableCell>
                  )}
                  {columnSettings.sex && (
                    <TableCell>{trial.criteria[0]?.sex || "N/A"}</TableCell>
                  )}
                  {columnSettings.healthyVolunteers && (
                    <TableCell>{trial.criteria[0]?.healthy_volunteers || "N/A"}</TableCell>
                  )}
                  {columnSettings.trialRecordStatus && (
                    <TableCell className="max-w-[120px] truncate">{trial.overview.trial_record_status || "N/A"}</TableCell>
                  )}
                  {columnSettings.otherDrugs && (
                    <TableCell className="max-w-[150px] truncate">{trial.overview.other_drugs || "N/A"}</TableCell>
                  )}
                  {columnSettings.regions && (
                    <TableCell className="max-w-[120px] truncate">{trial.overview.region || "N/A"}</TableCell>
                  )}
                  {columnSettings.ageMin && (
                    <TableCell>{trial.criteria[0]?.age_from || "N/A"}</TableCell>
                  )}
                  {columnSettings.ageMax && (
                    <TableCell>{trial.criteria[0]?.age_to || "N/A"}</TableCell>
                  )}
                  {columnSettings.subjectType && (
                    <TableCell>{trial.criteria[0]?.subject_type || "N/A"}</TableCell>
                  )}
                  {columnSettings.ecogPerformanceStatus && (
                    <TableCell>N/A</TableCell>
                  )}
                  {columnSettings.priorTreatments && (
                    <TableCell>N/A</TableCell>
                  )}
                  {columnSettings.biomarkerRequirements && (
                    <TableCell>N/A</TableCell>
                  )}
                  {columnSettings.estimatedEnrollment && (
                    <TableCell>{trial.criteria[0]?.target_no_volunteers || "N/A"}</TableCell>
                  )}
                  {columnSettings.actualEnrollment && (
                    <TableCell>{trial.criteria[0]?.actual_enrolled_volunteers || "N/A"}</TableCell>
                  )}
                  {columnSettings.enrollmentStatus && (
                    <TableCell>{trial.overview.status || "N/A"}</TableCell>
                  )}
                  {columnSettings.recruitmentPeriod && (
                    <TableCell>N/A</TableCell>
                  )}
                  {columnSettings.studyCompletionDate && (
                    <TableCell className="text-sm">{formatDate(trial.timing[0]?.trial_end_date_estimated) || "N/A"}</TableCell>
                  )}
                  {columnSettings.primaryCompletionDate && (
                    <TableCell className="text-sm">{formatDate(trial.timing[0]?.trial_end_date_estimated) || "N/A"}</TableCell>
                  )}
                  {columnSettings.populationDescription && (
                    <TableCell className="max-w-[150px] truncate">{trial.overview.patient_segment || "N/A"}</TableCell>
                  )}
                  {columnSettings.studySites && (
                    <TableCell>{trial.sites[0]?.total || "N/A"}</TableCell>
                  )}
                  {columnSettings.principalInvestigators && (
                    <TableCell>N/A</TableCell>
                  )}
                  {columnSettings.siteStatus && (
                    <TableCell>{trial.overview.status || "N/A"}</TableCell>
                  )}
                  {columnSettings.siteCountries && (
                    <TableCell className="max-w-[120px] truncate">{trial.overview.countries || "N/A"}</TableCell>
                  )}
                  {columnSettings.siteRegions && (
                    <TableCell className="max-w-[120px] truncate">{trial.overview.region || "N/A"}</TableCell>
                  )}
                  {columnSettings.siteContactInfo && (
                    <TableCell>N/A</TableCell>
                  )}
                  {columnSettings.trialResults && (
                    <TableCell className="max-w-[150px] truncate">
                      {trial.results[0]?.trial_results?.join(", ") || "N/A"}
                    </TableCell>
                  )}
                  {columnSettings.trialOutcomeContent && (
                    <TableCell className="max-w-[150px] truncate">{trial.results[0]?.trial_outcome || "N/A"}</TableCell>
                  )}
                  {columnSettings.resultsAvailable && (
                    <TableCell>{trial.results?.length > 0 ? "Yes" : "No"}</TableCell>
                  )}
                  {columnSettings.endpointsMet && (
                    <TableCell>N/A</TableCell>
                  )}
                  {columnSettings.adverseEventsReported && (
                    <TableCell>{trial.results[0]?.adverse_event_reported || "N/A"}</TableCell>
                  )}
                  {columnSettings.studyStartDate && (
                    <TableCell className="text-sm">{formatDate(trial.timing[0]?.start_date_estimated) || "N/A"}</TableCell>
                  )}
                  {columnSettings.firstPatientIn && (
                    <TableCell className="text-sm">{formatDate(trial.timing[0]?.start_date_estimated) || "N/A"}</TableCell>
                  )}
                  {columnSettings.lastPatientIn && (
                    <TableCell>N/A</TableCell>
                  )}
                  {columnSettings.studyEndDate && (
                    <TableCell className="text-sm">{formatDate(trial.timing[0]?.trial_end_date_estimated) || "N/A"}</TableCell>
                  )}
                  {columnSettings.interimAnalysisDates && (
                    <TableCell>N/A</TableCell>
                  )}
                  {columnSettings.finalAnalysisDate && (
                    <TableCell>N/A</TableCell>
                  )}
                  {columnSettings.regulatorySubmissionDate && (
                    <TableCell>N/A</TableCell>
                  )}
                  {columnSettings.purposeOfTrial && (
                    <TableCell className="max-w-[200px] truncate">{trial.outcomes[0]?.purpose_of_trial || "N/A"}</TableCell>
                  )}
                  {columnSettings.summary && (
                    <TableCell className="max-w-[200px] truncate">{trial.outcomes[0]?.summary || "N/A"}</TableCell>
                  )}
                  {columnSettings.primaryOutcomeMeasures && (
                    <TableCell className="max-w-[200px] truncate">{trial.outcomes[0]?.primary_outcome_measure || "N/A"}</TableCell>
                  )}
                  {columnSettings.otherOutcomeMeasures && (
                    <TableCell className="max-w-[200px] truncate">{trial.outcomes[0]?.other_outcome_measure || "N/A"}</TableCell>
                  )}
                  {columnSettings.studyDesignKeywords && (
                    <TableCell className="max-w-[150px] truncate">{trial.outcomes[0]?.study_design_keywords || "N/A"}</TableCell>
                  )}
                  {columnSettings.studyDesign && (
                    <TableCell className="max-w-[150px] truncate">{trial.outcomes[0]?.study_design || "N/A"}</TableCell>
                  )}
                  {columnSettings.treatmentRegimen && (
                    <TableCell className="max-w-[150px] truncate">{trial.outcomes[0]?.treatment_regimen || "N/A"}</TableCell>
                  )}
                  {columnSettings.numberOfArms && (
                    <TableCell>{trial.outcomes[0]?.number_of_arms || "N/A"}</TableCell>
                  )}
                  {columnSettings.inclusionCriteria && (
                    <TableCell className="max-w-[200px] truncate">{trial.criteria[0]?.inclusion_criteria || "N/A"}</TableCell>
                  )}
                  {columnSettings.exclusionCriteria && (
                    <TableCell className="max-w-[200px] truncate">{trial.criteria[0]?.exclusion_criteria || "N/A"}</TableCell>
                  )}
                  {columnSettings.ageFrom && (
                    <TableCell>{trial.criteria[0]?.age_from || "N/A"}</TableCell>
                  )}
                  {columnSettings.ageTo && (
                    <TableCell>{trial.criteria[0]?.age_to || "N/A"}</TableCell>
                  )}
                  {columnSettings.gender && (
                    <TableCell>{trial.criteria[0]?.sex || "N/A"}</TableCell>
                  )}
                  {columnSettings.targetNoVolunteers && (
                    <TableCell>{trial.criteria[0]?.target_no_volunteers || "N/A"}</TableCell>
                  )}
                  {columnSettings.actualEnrolledVolunteers && (
                    <TableCell>{trial.criteria[0]?.actual_enrolled_volunteers || "N/A"}</TableCell>
                  )}
                  {columnSettings.startDateEstimated && (
                    <TableCell className="text-sm">{formatDate(trial.timing[0]?.start_date_estimated) || "N/A"}</TableCell>
                  )}
                  {columnSettings.trialEndDateEstimated && (
                    <TableCell className="text-sm">{formatDate(trial.timing[0]?.trial_end_date_estimated) || "N/A"}</TableCell>
                  )}
                  {columnSettings.trialOutcome && (
                    <TableCell>{trial.results[0]?.trial_outcome || "N/A"}</TableCell>
                  )}
                  {columnSettings.adverseEventReported && (
                    <TableCell>{trial.results[0]?.adverse_event_reported || "N/A"}</TableCell>
                  )}
                  {columnSettings.adverseEventType && (
                    <TableCell className="max-w-[120px] truncate">{trial.results[0]?.adverse_event_type || "N/A"}</TableCell>
                  )}
                  {columnSettings.treatmentForAdverseEvents && (
                    <TableCell className="max-w-[150px] truncate">{trial.results[0]?.treatment_for_adverse_events || "N/A"}</TableCell>
                  )}
                  {columnSettings.totalSites && (
                    <TableCell>{trial.sites[0]?.total || "N/A"}</TableCell>
                  )}
                  {columnSettings.siteNotes && (
                    <TableCell className="max-w-[150px] truncate">{trial.sites[0]?.notes || "N/A"}</TableCell>
                  )}
                  {columnSettings.publicationType && (
                    <TableCell>N/A</TableCell>
                  )}
                  {columnSettings.registryName && (
                    <TableCell>N/A</TableCell>
                  )}
                  {columnSettings.studyType && (
                    <TableCell>N/A</TableCell>
                  )}
                  <TableCell className="text-sm">{formatDate(trial.overview.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="outline" size="sm" onClick={() => {
                        router.push(`/admin/therapeutics/${trial.trial_id}`); 
                      }}>
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
          <ScrollBar orientation="horizontal" />

        </ScrollArea>

        {/* Mobile / small screens → cards */}
        <div className="block md:hidden space-y-4 p-2">
          {paginatedTrials.map((trial) => (
            <Card key={trial.trial_id} className="shadow-sm">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Trial ID: <span className="font-mono">
                      {trial.overview.trial_id || trial.trial_id.slice(0, 8) + '...'}
                    </span></p>
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
                      <Button variant="outline" size="sm" onClick={() => {
                        const popup = window.open(
                          `/admin/therapeutics/${trial.trial_id}/backend`,
                          `trial_backend_${trial.trial_id}`,
                          `width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no`
                        );
                        if (!popup) {
                          toast({
                            title: "Popup blocked",
                            description: "Please allow popups for this site to view trial backend data.",
                            variant: "destructive",
                          });
                        }
                      }}>
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
        onOpenChange={handleAdvancedSearchModalChange}
        onApplySearch={handleAdvancedSearch}
        trials={trials}
        currentFilters={appliedFilters}
        initialCriteria={advancedSearchCriteria}
        editingQueryId={editingQueryId}
        editingQueryTitle={editingQueryTitle}
        editingQueryDescription={editingQueryDescription}
        onSaveQuerySuccess={handleSaveQuerySuccess}
      />

      {/* Filter Modal */}
      <TherapeuticFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        onApplyFilters={handleApplyFilters}
        currentFilters={appliedFilters}
        trials={trials}
      />

      {/* Save Query Modal */}
      <SaveQueryModal
        open={saveQueryModalOpen}
        onOpenChange={setSaveQueryModalOpen}
        currentFilters={appliedFilters}
        currentSearchCriteria={advancedSearchCriteria}
        searchTerm={searchTerm}
        onSaveSuccess={handleSaveQuerySuccess}
        editingQueryId={editingQueryId}
        editingQueryTitle={editingQueryTitle}
        editingQueryDescription={editingQueryDescription}
      />

      {/* Query History Modal */}
      <QueryHistoryModal
        open={queryHistoryModalOpen}
        onOpenChange={setQueryHistoryModalOpen}
        onLoadQuery={handleLoadQuery}
        onEditQuery={handleEditQuery}
      />

      {/* Query Logs Modal */}
      <QueryLogsModal
        open={queryLogsModalOpen}
        onOpenChange={setQueryLogsModalOpen}
        onExecuteQuery={handleExecuteQueryFromLog}
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
