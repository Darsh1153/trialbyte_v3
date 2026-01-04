"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Search,
  Filter,
  FileText,
  Upload,
  ChevronLeft,
  MoreHorizontal,
  Bookmark,
  Clock,
  Eye,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDateToMMDDYYYY } from "@/lib/date-utils";
import Image from "next/image";
import { ClinicalTrialFilterModal, ClinicalTrialFilterState } from "@/components/clinical-trial-filter-modal";
import { ClinicalTrialAdvancedSearchModal, ClinicalTrialSearchCriteria } from "@/components/clinical-trial-advanced-search-modal";
import { SaveQueryModal } from "@/components/save-query-modal";
import { QueryHistoryModal } from "@/components/query-history-modal";
import { CustomizeColumnModal, ColumnSettings, DEFAULT_COLUMN_SETTINGS } from "@/components/customize-column-modal";
import { FavoriteTrialsModal } from "@/components/favorite-trials-modal";

// Types based on the therapeutics API response
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

export default function ClinicalTrialDashboard() {
  const router = useRouter();
  const [trials, setTrials] = useState<TherapeuticTrial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [advancedSearchModalOpen, setAdvancedSearchModalOpen] = useState(false);
  const [saveQueryModalOpen, setSaveQueryModalOpen] = useState(false);
  const [queryHistoryModalOpen, setQueryHistoryModalOpen] = useState(false);
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [appliedFilters, setAppliedFilters] = useState<ClinicalTrialFilterState>({
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
    healthyVolunteers: []
  });
  const [appliedSearchCriteria, setAppliedSearchCriteria] = useState<ClinicalTrialSearchCriteria[]>([]);
  const [viewType, setViewType] = useState<'list' | 'card'>('list');
  const [customizeColumnModalOpen, setCustomizeColumnModalOpen] = useState(false);
  const [columnSettings, setColumnSettings] = useState<ColumnSettings>(DEFAULT_COLUMN_SETTINGS);
  const [favoriteTrialsModalOpen, setFavoriteTrialsModalOpen] = useState(false);
  const [favoriteTrials, setFavoriteTrials] = useState<string[]>([]);
  
  // Sorting state
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Fetch trials data using the therapeutics API
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

  useEffect(() => {
    fetchTrials();
    // Load column settings from localStorage
    const savedColumnSettings = localStorage.getItem('trialColumnSettings');
    if (savedColumnSettings) {
      try {
        setColumnSettings(JSON.parse(savedColumnSettings));
      } catch (error) {
        console.error('Error parsing saved column settings:', error);
      }
    }
    
    // Load favorite trials from localStorage
    const savedFavoriteTrials = localStorage.getItem('favoriteTrials');
    if (savedFavoriteTrials) {
      try {
        setFavoriteTrials(JSON.parse(savedFavoriteTrials));
      } catch (error) {
        console.error('Error parsing saved favorite trials:', error);
      }
    }
  }, []);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLogoutDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Logout functionality
  const handleLogout = () => {
    // Clear any stored authentication data (tokens, user data, etc.)
    // This is a placeholder - implement based on your auth system
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    // Navigate to home page
    router.push("/");
  };

  // Helper function to get field value from trial object
  const getFieldValue = (trial: TherapeuticTrial, field: string): string => {
    switch (field) {
      case "disease_type": return trial.overview.disease_type;
      case "therapeutic_area": return trial.overview.therapeutic_area;
      case "trial_phase": return trial.overview.trial_phase;
      case "primary_drugs": return trial.overview.primary_drugs;
      case "trial_status": return trial.overview.status;
      case "sponsor_collaborators": return trial.overview.sponsor_collaborators;
      case "countries": return trial.overview.countries;
      case "patient_segment": return trial.overview.patient_segment;
      case "line_of_therapy": return trial.overview.line_of_therapy;
      case "trial_identifier": return trial.overview.trial_identifier.join(", ");
      case "enrollment": return trial.criteria[0]?.target_no_volunteers?.toString() || "0";
      default: return "";
    }
  };

  // Sorting functions
  const getSortValue = (trial: TherapeuticTrial, field: string): string | number => {
    switch (field) {
      case "trial_id": return trial.trial_id;
      case "therapeutic_area": return trial.overview.therapeutic_area;
      case "disease_type": return trial.overview.disease_type;
      case "primary_drug": return trial.overview.primary_drugs;
      case "trial_status": return trial.overview.status;
      case "sponsor": return trial.overview.sponsor_collaborators || "";
      case "phase": return trial.overview.trial_phase;
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

  // Helper function to evaluate search criteria
  const evaluateCriteria = (fieldValue: string, operator: string, searchValue: string): boolean => {
    const field = fieldValue.toLowerCase();
    const value = searchValue.toLowerCase();
    
    switch (operator) {
      case "contains": return field.includes(value);
      case "is": return field === value;
      case "is_not": return field !== value;
      case "starts_with": return field.startsWith(value);
      case "ends_with": return field.endsWith(value);
      default: return true;
    }
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    return formatDateToMMDDYYYY(dateString);
  };

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      Confirmed: "bg-orange-100 text-orange-700",
      Terminated: "bg-red-100 text-red-700",
      Open: "bg-green-100 text-green-700",
      Closed: "bg-purple-100 text-purple-700",
      Completed: "bg-teal-100 text-teal-700",
      Active: "bg-emerald-100 text-emerald-700",
      Planned: "bg-amber-100 text-amber-700",
      Suspended: "bg-orange-100 text-orange-700",
      Draft: "bg-gray-100 text-gray-700",
    };
    return statusColors[status] || "bg-gray-100 text-gray-700";
  };

  // Apply filters and search criteria, then sort
  const filteredTrials = trials.filter((trial) => {
    // Basic search filter
    const matchesSearch = searchTerm === "" ||
      trial.trial_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.overview.therapeutic_area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.overview.disease_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.overview.primary_drugs.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trial.overview.title.toLowerCase().includes(searchTerm.toLowerCase());

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
       appliedFilters.trialPhases.includes(`Phase ${trial.overview.trial_phase}`)) &&
      (appliedFilters.countries.length === 0 || 
       appliedFilters.countries.some(country => 
         trial.overview.countries.toLowerCase().includes(country.toLowerCase())))
    );

    // Apply advanced search criteria
    const matchesAdvancedSearch = appliedSearchCriteria.length === 0 || 
      appliedSearchCriteria.every(criteria => {
        const fieldValue = getFieldValue(trial, criteria.field);
        return evaluateCriteria(fieldValue, criteria.operator, criteria.value);
      });

    return matchesSearch && matchesFilters && matchesAdvancedSearch;
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

  const handleApplyFilters = (filters: ClinicalTrialFilterState) => {
    setAppliedFilters(filters);
  };

  const handleApplyAdvancedSearch = (criteria: ClinicalTrialSearchCriteria[]) => {
    setAppliedSearchCriteria(criteria);
  };

  const clearAllFilters = () => {
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
      healthyVolunteers: []
    });
    setAppliedSearchCriteria([]);
  };

  const hasActiveFilters = () => {
    return Object.values(appliedFilters).some(filter => filter.length > 0) || 
           appliedSearchCriteria.length > 0;
  };

  const getActiveFilterCount = () => {
    const filterCount = Object.values(appliedFilters).reduce((count, filter) => count + filter.length, 0);
    return filterCount + appliedSearchCriteria.length;
  };

  const handleSaveQuerySuccess = () => {
    toast({
      title: "Success",
      description: "Query saved successfully",
    });
  };

  const handleLoadQuery = (queryData: any) => {
    if (queryData.searchTerm) {
      setSearchTerm(queryData.searchTerm);
    }
    if (queryData.filters) {
      setAppliedFilters(queryData.filters);
    }
    if (queryData.searchCriteria) {
      setAppliedSearchCriteria(queryData.searchCriteria);
    }
  };

  const handleColumnSettingsChange = (newSettings: ColumnSettings) => {
    setColumnSettings(newSettings);
    // Save to localStorage
    localStorage.setItem('trialColumnSettings', JSON.stringify(newSettings));
  };

  // Favorite trials functionality
  const toggleFavoriteTrial = (trialId: string) => {
    setFavoriteTrials(prev => {
      const newFavorites = prev.includes(trialId) 
        ? prev.filter(id => id !== trialId)
        : [...prev, trialId];
      
      // Save to localStorage
      localStorage.setItem('favoriteTrials', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const getFavoriteTrialsData = () => {
    return trials.filter(trial => favoriteTrials.includes(trial.trial_id)).map(trial => ({
      id: trial.trial_id,
      trialId: trial.overview.trial_id || `#${trial.trial_id.slice(0, 6)}`,
      therapeuticArea: trial.overview.therapeutic_area,
      diseaseType: trial.overview.disease_type,
      primaryDrug: trial.overview.primary_drugs,
      status: trial.overview.status,
      sponsor: trial.overview.sponsor_collaborators || "N/A",
      phase: trial.overview.trial_phase
    }));
  };

  // Render card view
  const renderCardView = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrials.map((trial) => (
          <Card 
            key={trial.trial_id} 
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              router.push(`/user/clinical_trial/trials?trialId=${trial.trial_id}`);
            }}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    onClick={(e) => e.stopPropagation()} // Prevent card click when clicking checkbox
                  />
                  <span className="text-blue-600 font-medium">
                    {trial.overview.trial_id || `#${trial.trial_id.slice(0, 6)}`}
                  </span>
                </div>
                <Badge className={getStatusColor(trial.overview.status)}>
                  {trial.overview.status}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {trial.overview.title}
              </h3>

              {/* Key Information */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Therapeutic Area:</span>
                  <span className="text-sm font-medium ml-2">{trial.overview.therapeutic_area}</span>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-600">Disease Type:</span>
                  <span className="font-medium ml-2">{trial.overview.disease_type}</span>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-600">Primary Drug:</span>
                  <span className="font-medium ml-2">{trial.overview.primary_drugs}</span>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-600">Phase:</span>
                  <span className="font-medium ml-2">{trial.overview.trial_phase}</span>
                </div>
                
                <div className="text-sm">
                  <span className="text-gray-600">Sponsor:</span>
                  <span className="font-medium ml-2 truncate">
                    {trial.overview.sponsor_collaborators || "N/A"}
                  </span>
                </div>

                {/* Enrollment info */}
                {trial.criteria[0] && (
                  <div className="text-sm">
                    <span className="text-gray-600">Target Enrollment:</span>
                    <span className="font-medium ml-2">
                      {trial.criteria[0].target_no_volunteers} volunteers
                    </span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Updated: {formatDate(trial.overview.updated_at)}</span>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click when clicking favorite button
                        toggleFavoriteTrial(trial.trial_id);
                      }}
                      className="h-6 w-6 p-0 hover:bg-red-50"
                    >
                      <Heart 
                        className={`h-3 w-3 ${
                          favoriteTrials.includes(trial.trial_id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400 hover:text-red-500'
                        }`}
                      />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click when clicking view button
                        router.push(`/user/clinical_trial/trials?trialId=${trial.trial_id}`);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading trials data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className=" bg-green-500 rounded flex items-center justify-center">
                <Image
                  src="/logo.jpeg"
                  alt="Logo"
                  width={160}
                  height={40}
                  className="h-10 w-auto rounded"
                />{" "}
              </div>
              <Button variant="ghost" size="sm" className="text-gray-600">
                Dashboard
              </Button>
            </div>
            {/* <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Search className="h-4 w-4 mr-2" />
              Trials Search
            </Button> */}
            <Button variant="outline" size="sm" asChild>
              <Link href="/user/clinical_trial/trials">
                <FileText className="h-4 w-4 mr-2" />
                Trials
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-blue-500 font-medium">TrialByte</span>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">✉</span>
              <div className="relative" ref={dropdownRef}>
                <button 
                  className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
                  onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showLogoutDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {showLogoutDropdown && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        setShowLogoutDropdown(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Header */}
      <div className="bg-blue-100 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/user"
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="text-sm">Back</span>
            </Link>
            <span className="text-gray-500 text-sm">/ Forward</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setAdvancedSearchModalOpen(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              Advanced Search
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilterModalOpen(true)}
              className={hasActiveFilters() ? "bg-blue-100 border-blue-400" : ""}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
              {hasActiveFilters() && (
                <Badge className="ml-2 bg-blue-600 text-white text-xs px-1 py-0">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setQueryHistoryModalOpen(true)}
            >
              Saved Queries
            </Button>
            {hasActiveFilters() && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Clear Filters
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-blue-50 px-6 py-3">
        <div className="flex items-center space-x-6 text-sm">
          <span className="flex items-center">
            <span className="font-medium">{trials.length}</span>
            <span className="text-gray-600 ml-1">Total Trials</span>
          </span>
          <span className="flex items-center">
            <span className="font-medium text-blue-600">45%</span>
            <span className="text-gray-600 ml-1">Active Trials</span>
          </span>
          <span className="flex items-center">
            <span className="font-medium text-yellow-600">26%</span>
            <span className="text-gray-600 ml-1">Terminated</span>
          </span>
          <span className="flex items-center">
            <span className="font-medium text-green-600">30%</span>
            <span className="text-gray-600 ml-1">Completed</span>
          </span>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-700 min-h-screen">
          <div className="p-4">
            <Button className="w-full justify-start bg-slate-600 hover:bg-slate-500 text-white">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              View Type
            </Button>
          </div>

          <div className="px-4 py-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className={`w-full justify-start text-white py-2 px-2 ${
                  viewType === 'list' ? 'bg-slate-600' : 'hover:bg-slate-600'
                }`}
                onClick={() => setViewType('list')}
              >
                <span className="text-sm">📋 List view</span>
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start text-white py-2 px-2 ${
                  viewType === 'card' ? 'bg-slate-600' : 'hover:bg-slate-600'
                }`}
                onClick={() => setViewType('card')}
              >
                <span className="text-sm">📊 Card view</span>
              </Button>
            </div>
          </div>

          <div className="px-4 py-2">
            <Button className="w-full justify-start bg-slate-600 hover:bg-slate-500 text-white">
              <MoreHorizontal className="h-4 w-4 mr-2" />
              Sort By
            </Button>
            <div className="space-y-1 mt-2">
              <button
                onClick={() => handleSort("trial_id")}
                className={`w-full text-left text-white text-sm py-2 px-2 rounded hover:bg-slate-600 transition-colors ${
                  sortField === "trial_id" ? "bg-slate-600 font-semibold" : ""
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
                onClick={() => handleSort("therapeutic_area")}
                className={`w-full text-left text-white text-sm py-2 px-2 rounded hover:bg-slate-600 transition-colors ${
                  sortField === "therapeutic_area" ? "bg-slate-600 font-semibold" : ""
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
                onClick={() => handleSort("disease_type")}
                className={`w-full text-left text-white text-sm py-2 px-2 rounded hover:bg-slate-600 transition-colors ${
                  sortField === "disease_type" ? "bg-slate-600 font-semibold" : ""
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
                onClick={() => handleSort("primary_drug")}
                className={`w-full text-left text-white text-sm py-2 px-2 rounded hover:bg-slate-600 transition-colors ${
                  sortField === "primary_drug" ? "bg-slate-600 font-semibold" : ""
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
                onClick={() => handleSort("trial_status")}
                className={`w-full text-left text-white text-sm py-2 px-2 rounded hover:bg-slate-600 transition-colors ${
                  sortField === "trial_status" ? "bg-slate-600 font-semibold" : ""
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
                onClick={() => handleSort("sponsor")}
                className={`w-full text-left text-white text-sm py-2 px-2 rounded hover:bg-slate-600 transition-colors ${
                  sortField === "sponsor" ? "bg-slate-600 font-semibold" : ""
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
                onClick={() => handleSort("phase")}
                className={`w-full text-left text-white text-sm py-2 px-2 rounded hover:bg-slate-600 transition-colors ${
                  sortField === "phase" ? "bg-slate-600 font-semibold" : ""
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
            </div>
          </div>

          <div className="px-4 py-6 space-y-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-slate-600"
              onClick={() => setSaveQueryModalOpen(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Save This Query
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-slate-600"
              onClick={() => setQueryHistoryModalOpen(true)}
            >
              <Clock className="h-4 w-4 mr-2" />
              Query History
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-slate-600"
              onClick={() => setFavoriteTrialsModalOpen(true)}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Favorite Trials
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-slate-600"
              onClick={() => setCustomizeColumnModalOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Customize Column View
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Search */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* View Type and Active Filters */}
          <div className="mb-4 flex items-center justify-between">
            <Badge variant="outline" className="bg-blue-50">
              {viewType === 'list' ? '📋 List view' : '📊 Card view'}
            </Badge>
            
            {hasActiveFilters() && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(appliedFilters).map(([key, values]) => 
                    values.map((value: string) => (
                      <Badge 
                        key={`${key}-${value}`} 
                        variant="outline" 
                        className="bg-blue-100 text-blue-700 text-xs"
                      >
                        {value}
                      </Badge>
                    ))
                  )}
                  {appliedSearchCriteria.map((criteria) => (
                    <Badge 
                      key={criteria.id} 
                      variant="outline" 
                      className="bg-green-100 text-green-700 text-xs"
                    >
                      {criteria.field}: {criteria.value}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Conditional Rendering: Table or Card View */}
          {viewType === 'list' ? (
            <Card className="overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-700">
                  <TableRow>
                    {columnSettings.trialId && (
                      <TableHead className="text-white">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Trial ID</span>
                          <ChevronLeft className="h-3 w-3 rotate-180" />
                        </div>
                      </TableHead>
                    )}
                    {columnSettings.therapeuticArea && (
                      <TableHead className="text-white">
                        <span>Therapeutic Area</span>
                        <ChevronLeft className="h-3 w-3 rotate-180 inline ml-1" />
                      </TableHead>
                    )}
                    {columnSettings.diseaseType && (
                      <TableHead className="text-white">
                        <span>Disease Type</span>
                        <ChevronLeft className="h-3 w-3 rotate-180 inline ml-1" />
                      </TableHead>
                    )}
                    {columnSettings.primaryDrug && (
                      <TableHead className="text-white">
                        <span>Primary Drug</span>
                        <ChevronLeft className="h-3 w-3 rotate-180 inline ml-1" />
                      </TableHead>
                    )}
                    {columnSettings.trialRecordStatus && (
                      <TableHead className="text-white">
                        <span>Trial Status</span>
                        <ChevronLeft className="h-3 w-3 rotate-180 inline ml-1" />
                      </TableHead>
                    )}
                    {columnSettings.sponsorsCollaborators && (
                      <TableHead className="text-white">
                        <span>Sponsor</span>
                        <ChevronLeft className="h-3 w-3 rotate-180 inline ml-1" />
                      </TableHead>
                    )}
                    {columnSettings.trialPhase && (
                      <TableHead className="text-white">
                        <span>Phase</span>
                        <ChevronLeft className="h-3 w-3 rotate-180 inline ml-1" />
                      </TableHead>
                    )}
                    <TableHead className="text-white w-12">
                      <Heart className="h-4 w-4" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrials.map((trial) => (
                    <TableRow 
                      key={trial.trial_id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        // Navigate to trials page with trial data
                        router.push(`/user/clinical_trial/trials?trialId=${trial.trial_id}`);
                      }}
                    >
                      {columnSettings.trialId && (
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <input 
                              type="checkbox" 
                              className="rounded" 
                              onClick={(e) => e.stopPropagation()} // Prevent row click when clicking checkbox
                            />
                            <span className="text-blue-600 font-medium">
                              {trial.overview.trial_id || '#' + trial.trial_id.slice(0, 6)}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      {columnSettings.therapeuticArea && (
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            {trial.overview.therapeutic_area}
                          </div>
                        </TableCell>
                      )}
                      {columnSettings.diseaseType && (
                        <TableCell>{trial.overview.disease_type}</TableCell>
                      )}
                      {columnSettings.primaryDrug && (
                        <TableCell>{trial.overview.primary_drugs}</TableCell>
                      )}
                      {columnSettings.trialRecordStatus && (
                        <TableCell>
                          <Badge className={getStatusColor(trial.overview.status)}>
                            {trial.overview.status}
                          </Badge>
                        </TableCell>
                      )}
                      {columnSettings.sponsorsCollaborators && (
                        <TableCell className="max-w-[150px] truncate">
                          {trial.overview.sponsor_collaborators || "N/A"}
                        </TableCell>
                      )}
                      {columnSettings.trialPhase && (
                        <TableCell>{trial.overview.trial_phase}</TableCell>
                      )}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click when clicking favorite button
                            toggleFavoriteTrial(trial.trial_id);
                          }}
                          className="h-8 w-8 p-0 hover:bg-red-50"
                        >
                          <Heart 
                            className={`h-4 w-4 ${
                              favoriteTrials.includes(trial.trial_id) 
                                ? 'fill-red-500 text-red-500' 
                                : 'text-gray-400 hover:text-red-500'
                            }`}
                          />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption>
                  Showing {filteredTrials.length} of {trials.length} trials
                </TableCaption>
              </Table>
            </Card>
          ) : (
            <div>
              {renderCardView()}
              <div className="mt-6 text-center text-sm text-gray-600">
                Showing {filteredTrials.length} of {trials.length} trials
              </div>
            </div>
          )}

          {/* Filter Modal */}
          <ClinicalTrialFilterModal
            open={filterModalOpen}
            onOpenChange={setFilterModalOpen}
            onApplyFilters={handleApplyFilters}
            currentFilters={appliedFilters}
          />

          {/* Advanced Search Modal */}
          <ClinicalTrialAdvancedSearchModal
            open={advancedSearchModalOpen}
            onOpenChange={setAdvancedSearchModalOpen}
            onApplySearch={handleApplyAdvancedSearch}
          />

          {/* Save Query Modal */}
          <SaveQueryModal
            open={saveQueryModalOpen}
            onOpenChange={setSaveQueryModalOpen}
            onSaveSuccess={handleSaveQuerySuccess}
            currentFilters={appliedFilters}
            currentSearchCriteria={appliedSearchCriteria}
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

          {/* Favorite Trials Modal */}
          <FavoriteTrialsModal
            open={favoriteTrialsModalOpen}
            onOpenChange={setFavoriteTrialsModalOpen}
            favoriteTrials={getFavoriteTrialsData()}
          />
        </div>
      </div>
    </div>
  );
}
