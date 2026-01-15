"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useRef, use } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { formatDateToMMDDYYYY } from "@/lib/date-utils";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  Upload,
  Filter,
  Mail,
  User,
  Maximize2,
  Minimize2,
  RotateCcw,
  X,
  Download,
  Plus,
  Minus,
  Loader2,
  ChevronDown,
  LogOut,
  Link as LinkIcon,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { Suspense } from "react";
import { useTherapeuticTrialDetail } from "@/hooks/use-therapeutic-trial-detail";
import { useQueryClient } from "@tanstack/react-query";
import { useLinkPreview } from "@/components/ui/link-preview-panel";
import { PreviewLink } from "@/components/ui/preview-link";

// API Response interface
interface ApiResponse {
  trials: TherapeuticTrial[];
}

// Types based on the JSON structure
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
    start_date_actual: string | null;
    start_date_benchmark: string | null;
    start_date_estimated: string | null;
    inclusion_period_actual: string | null;
    inclusion_period_benchmark: string | null;
    inclusion_period_estimated: string | null;
    enrollment_closed_actual: string | null;
    enrollment_closed_benchmark: string | null;
    enrollment_closed_estimated: string | null;
    primary_outcome_duration_actual: string | null;
    primary_outcome_duration_benchmark: string | null;
    primary_outcome_duration_estimated: string | null;
    trial_end_date_actual: string | null;
    trial_end_date_benchmark: string | null;
    trial_end_date_estimated: string | null;
    result_duration_actual: string | null;
    result_duration_benchmark: string | null;
    result_duration_estimated: string | null;
    result_published_date_actual: string | null;
    result_published_date_benchmark: string | null;
    result_published_date_estimated: string | null;
    overall_duration_complete: string | null;
    overall_duration_publish: string | null;
    timing_references: any[] | string | null;
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
    results_available: string | boolean | null;
    endpoints_met: string | boolean | null;
    adverse_events_reported: string | boolean | null;
    trial_outcome_content: string | null;
    trial_outcome_link: string | null;
    trial_outcome_attachment: string | any | null;
    trial_outcome_reference_date: string | null;
    site_notes: Array<{
      id?: string;
      date: string;
      noteType?: string;
      type?: string;
      content: string;
      sourceType?: string;
      source?: string;
      attachments?: (string | { url: string; name: string; size?: number; type?: string })[];
      isVisible?: boolean;
      adverse_event_reported?: string;
      adverse_event_type?: string;
      treatment_for_adverse_events?: string;
    }> | null;
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

export default function TherapeuticDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [trial, setTrial] = useState<TherapeuticTrial | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedReferences, setExpandedReferences] = useState<Record<number, boolean>>({});
  const [selectedRefForAttachments, setSelectedRefForAttachments] = useState<any>(null);

  const toggleReference = (index: number) => {
    setExpandedReferences(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const { openLinkPreview } = useLinkPreview();


  // Helper function to check if a value is valid (not null, undefined, or empty string)
  const isValidValue = (value: any): boolean => {
    return value !== null && value !== undefined && value !== "" && String(value).trim() !== "";
  };

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Use React Query to fetch trial data (must be declared before useEffects that use it)
  const { data: apiData, isLoading: queryLoading, error: queryError, refetch } = useTherapeuticTrialDetail(resolvedParams.id);

  // Helper function to transform API data to our interface
  const transformTrialData = (data: any): TherapeuticTrial | null => {
    if (!data?.data) return null;

    return {
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
        actual_enrolled_volunteers: criterion.actual_enrolled_volunteers || 0,
      })),
      timing: data.data.timing.map((timing: any) => ({
        id: timing.id,
        trial_id: timing.trial_id,
        start_date_actual: timing.start_date_actual || null,
        start_date_benchmark: timing.start_date_benchmark || null,
        start_date_estimated: timing.start_date_estimated || null,
        inclusion_period_actual: timing.inclusion_period_actual || null,
        inclusion_period_benchmark: timing.inclusion_period_benchmark || null,
        inclusion_period_estimated: timing.inclusion_period_estimated || null,
        enrollment_closed_actual: timing.enrollment_closed_actual || null,
        enrollment_closed_benchmark: timing.enrollment_closed_benchmark || null,
        enrollment_closed_estimated: timing.enrollment_closed_estimated || null,
        primary_outcome_duration_actual: timing.primary_outcome_duration_actual || null,
        primary_outcome_duration_benchmark: timing.primary_outcome_duration_benchmark || null,
        primary_outcome_duration_estimated: timing.primary_outcome_duration_estimated || null,
        trial_end_date_actual: timing.trial_end_date_actual || null,
        trial_end_date_benchmark: timing.trial_end_date_benchmark || null,
        trial_end_date_estimated: timing.trial_end_date_estimated || null,
        result_duration_actual: timing.result_duration_actual || null,
        result_duration_benchmark: timing.result_duration_benchmark || null,
        result_duration_estimated: timing.result_duration_estimated || null,
        result_published_date_actual: timing.result_published_date_actual || null,
        result_published_date_benchmark: timing.result_published_date_benchmark || null,
        result_published_date_estimated: timing.result_published_date_estimated || null,
        overall_duration_complete: timing.overall_duration_complete || null,
        overall_duration_publish: timing.overall_duration_publish || null,
        timing_references: timing.timing_references || null,
      })),
      results: data.data.results.map((result: any) => {
        // Parse site_notes if it's a string
        let siteNotes = result.site_notes;
        if (typeof siteNotes === 'string' && siteNotes.trim()) {
          try {
            siteNotes = JSON.parse(siteNotes);
          } catch (e) {
            console.warn('Failed to parse site_notes:', e);
            siteNotes = null;
          }
        }
        if (!Array.isArray(siteNotes)) {
          siteNotes = null;
        }

        // Parse trial_outcome_attachment if it's a string
        let attachment = result.trial_outcome_attachment;
        if (typeof attachment === 'string' && attachment.trim()) {
          try {
            attachment = JSON.parse(attachment);
          } catch (e) {
            // If parsing fails, keep as string or null
            attachment = attachment || null;
          }
        }

        return {
          id: result.id,
          trial_id: result.trial_id,
          trial_outcome: result.trial_outcome || "N/A",
          reference: result.reference || "N/A",
          trial_results: result.trial_results || [],
          adverse_event_reported: result.adverse_event_reported || "N/A",
          adverse_event_type: result.adverse_event_type || null,
          treatment_for_adverse_events: result.treatment_for_adverse_events || null,
          results_available: result.results_available !== null && result.results_available !== undefined
            ? (result.results_available === true || result.results_available === "true" || result.results_available === "Yes")
            : null,
          endpoints_met: result.endpoints_met !== null && result.endpoints_met !== undefined
            ? (result.endpoints_met === true || result.endpoints_met === "true" || result.endpoints_met === "Yes")
            : null,
          adverse_events_reported: result.adverse_events_reported !== null && result.adverse_events_reported !== undefined
            ? (result.adverse_events_reported === true || result.adverse_events_reported === "true" || result.adverse_events_reported === "Yes")
            : null,
          trial_outcome_content: result.trial_outcome_content || null,
          trial_outcome_link: result.trial_outcome_link || null,
          trial_outcome_attachment: attachment,
          trial_outcome_reference_date: result.trial_outcome_reference_date || result.reference || null,
          site_notes: siteNotes,
        };
      }),
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
        url: other.url || "N/A",
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
        attachment: log.attachment || null,
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
  };

  // Transform and set trial data when API data changes
  useEffect(() => {
    if (apiData) {
      const transformedTrial = transformTrialData(apiData);
      if (transformedTrial) {
        console.log("Transformed trial data:", transformedTrial);
        console.log("Timing data from API:", apiData.data.timing);
        console.log("Transformed timing data:", transformedTrial.timing);
        setTrial(transformedTrial);
      } else {
        toast({
          title: "No Data Available",
          description: "Unable to load trial data.",
          variant: "destructive",
        });
        router.push("/admin/therapeutics");
      }
    }
  }, [apiData, router, toast]);

  // Handle query errors
  useEffect(() => {
    if (queryError) {
      if (queryError instanceof Error && queryError.message.includes("not found")) {
        toast({
          title: "Trial Not Found",
          description: "The requested therapeutic trial could not be found.",
          variant: "destructive",
        });
        router.push("/admin/therapeutics");
      } else {
        toast({
          title: "Error",
          description: "Failed to load trial data.",
          variant: "destructive",
        });
      }
    }
  }, [queryError, router, toast]);

  // Set loading state based on query
  useEffect(() => {
    setLoading(queryLoading);
  }, [queryLoading]);

  // Function to manually refresh data
  const handleRefresh = async () => {
    try {
      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ["therapeutic-trial-detail", resolvedParams.id] });
      await refetch();
      toast({
        title: "Data Refreshed",
        description: "Trial data has been refreshed.",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh trial data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Listen for storage events to refresh when data is updated from edit page
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // If timing data was saved, refresh
      if (e.key?.includes('trial_timing_') || e.key?.includes('trial_db_saved_')) {
        console.log("Detected timing data update, refreshing...");
        queryClient.invalidateQueries({ queryKey: ["therapeutic-trial-detail", resolvedParams.id] });
        refetch();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (for same-tab updates)
    const handleCustomRefresh = () => {
      console.log("Custom refresh event received, refreshing...");
      queryClient.invalidateQueries({ queryKey: ["therapeutic-trial-detail", resolvedParams.id] });
      refetch();
    };

    window.addEventListener('trial-data-updated', handleCustomRefresh);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('trial-data-updated', handleCustomRefresh);
    };
  }, [resolvedParams.id, queryClient, refetch]);
  const [endpointsMet, setEndpointsMet] = useState(true);
  const [resultPosted, setResultPosted] = useState({ yes: true, no: false });
  const [activeSection, setActiveSection] = useState("overview");
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filteredSections, setFilteredSections] = useState<string[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showBackendView, setShowBackendView] = useState(false);

  // Refs for each section
  const overviewRef = useRef<HTMLDivElement>(null);
  const objectivesRef = useRef<HTMLDivElement>(null);
  const treatmentPlanRef = useRef<HTMLDivElement>(null);
  const patientDescriptionRef = useRef<HTMLDivElement>(null);
  const timingRef = useRef<HTMLDivElement>(null);
  const outcomeRef = useRef<HTMLDivElement>(null);
  const publishedResultsRef = useRef<HTMLDivElement>(null);
  const sitesRef = useRef<HTMLDivElement>(null);
  const otherSourcesRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Logout functionality
  const handleLogout = () => {
    // Clear any stored authentication data (tokens, user data, etc.)
    // This is a placeholder - implement based on your auth system
    localStorage.removeItem("authToken");
    sessionStorage.clear();

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });

    // Navigate to admin login page
    router.push("/admin/login");
  };

  // Handle maximize/fullscreen functionality
  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setIsMinimized(false); // Reset minimize when maximizing
      toast({
        title: "Maximized",
        description: "Trial view has been maximized for better visibility",
      });
    } else {
      toast({
        title: "Restored",
        description: "Trial view has been restored to normal size",
      });
    }
  };

  // Handle minimize/compact view functionality
  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setIsMaximized(false); // Reset maximize when minimizing
      toast({
        title: "Minimized",
        description: "Trial view has been minimized to compact mode",
      });
    } else {
      toast({
        title: "Expanded",
        description: "Trial view has been expanded to normal mode",
      });
    }
  };


  // Handle filter dialog
  const handleFilter = () => {
    setShowFilterDialog(true);
  };

  // Apply section filters
  const applySectionFilter = (sections: string[]) => {
    setFilteredSections(sections);
    setShowFilterDialog(false);

    if (sections.length > 0) {
      toast({
        title: "Filter Applied",
        description: `Showing ${sections.length} selected section(s)`,
      });
    } else {
      toast({
        title: "Filter Cleared",
        description: "All sections are now visible",
      });
    }
  };

  // Check if a section should be visible based on filters
  const isSectionVisible = (sectionName: string) => {
    if (filteredSections.length === 0) return true; // Show all if no filter applied
    return filteredSections.includes(sectionName);
  };

  // Export page as PDF
  const exportAsPDF = async () => {
    try {
      setIsExporting(true);

      // Get the main content div (excluding sidebar and navigation)
      const element = document.querySelector(
        "[data-export-content]"
      ) as HTMLElement;
      if (!element) {
        throw new Error("Content not found for export");
      }

      // Temporarily remove filters for complete export
      const originalFilters = filteredSections;
      setFilteredSections([]);

      // Wait for state update to render all sections
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        height: element.scrollHeight,
        width: element.scrollWidth,
      });

      // Restore original filters
      setFilteredSections(originalFilters);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `trial_${trial?.trial_id || "export"}_${new Date().toISOString().split("T")[0]
        }.pdf`;

      pdf.save(fileName);

      toast({
        title: "PDF Export Complete",
        description: `Trial has been exported as ${fileName}`,
      });
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({
        title: "PDF Export Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  // Export as JSON (existing functionality)
  const exportAsJSON = () => {
    if (trial) {
      const exportData = {
        trial_id: trial.trial_id,
        overview: trial.overview,
        outcomes: trial.outcomes,
        criteria: trial.criteria,
        timing: trial.timing,
        results: trial.results,
        sites: trial.sites,
        other: trial.other,
        exported_at: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `trial_${trial.trial_id}_export.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "JSON Export Complete",
        description: `Trial data has been exported to trial_${trial.trial_id}_export.json`,
      });
    } else {
      toast({
        title: "Export Failed",
        description: "No trial data available to export",
        variant: "destructive",
      });
    }
    setShowExportModal(false);
  };


  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const refs = {
      overview: overviewRef,
      objectives: objectivesRef,
      treatmentPlan: treatmentPlanRef,
      patientDescription: patientDescriptionRef,
      timing: timingRef,
      outcome: outcomeRef,
      publishedResults: publishedResultsRef,
      sites: sitesRef,
      otherSources: otherSourcesRef,
    };

    const targetRef = refs[sectionId as keyof typeof refs];
    if (targetRef?.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveSection(sectionId);
    }
  };

  // Intersection Observer to update active section on scroll
  useEffect(() => {
    const sections = [
      { id: "overview", ref: overviewRef },
      { id: "objectives", ref: objectivesRef },
      { id: "treatmentPlan", ref: treatmentPlanRef },
      { id: "patientDescription", ref: patientDescriptionRef },
      { id: "timing", ref: timingRef },
      { id: "outcome", ref: outcomeRef },
      { id: "publishedResults", ref: publishedResultsRef },
      { id: "sites", ref: sitesRef },
      { id: "otherSources", ref: otherSourcesRef },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = sections.find(
              (s) => s.ref.current === entry.target
            );
            if (section) {
              setActiveSection(section.id);
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-80px 0px -50% 0px",
      }
    );

    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section.ref.current) {
          observer.unobserve(section.ref.current);
        }
      });
    };
  }, [trial]); // Re-run when trial loads

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowLogoutDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Completed: "bg-blue-600 text-white",
      Active: "bg-green-600 text-white",
      Planned: "bg-yellow-600 text-white",
      Suspended: "bg-red-600 text-white",
    };
    return colors[status] || "bg-gray-600 text-white";
  };

  const countries = trial?.overview.countries?.split(", ") || [];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading trial details...</p>
        </div>
      </div>
    );
  }

  // No trial state
  if (!trial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Trial not found</p>
          <Button onClick={() => router.push("/admin/therapeutics")} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 overflow-x-hidden ${isMaximized ? "fixed inset-0 z-50 overflow-auto" : ""
        }`}
    >
      {/* Top Navigation */}
      <div className="bg-white border-b">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Image
                src="/logo.jpeg"
                alt="Logo"
                width={160}
                height={40}
                className="h-10 w-auto rounded"
              />
            </div>
            <Button
              onClick={() => {
                router.push("/admin/therapeutics");
              }}
              variant="ghost"
              className="text-gray-600"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Clinical Trials
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <FileText className="h-4 w-4 mr-2" />
              Trial Details
            </Button>

            <Button
              onClick={handleRefresh}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
              disabled={queryLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${queryLoading ? 'animate-spin' : ''}`} />
              Refresh
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
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${showLogoutDropdown ? "rotate-180" : ""
                      }`}
                  />
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

      {/* Secondary Navigation */}
      <div className="bg-blue-100 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="flex items-center text-gray-600 hover:text-gray-800"
              onClick={() => router.back()}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => router.forward()}
            >
              Forward
            </Button>
          </div>
          <div className="flex items-center space-x-2">

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar */}
        <div className="w-full lg:w-64 bg-white border-r min-h-screen">
          <div className="p-4 space-y-2">
            {isSectionVisible("overview") && (
              <Button
                variant="ghost"
                onClick={() => scrollToSection("overview")}
                className={`w-full justify-start ${activeSection === "overview"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Overview
              </Button>
            )}
            {isSectionVisible("objectives") && (
              <Button
                variant="ghost"
                onClick={() => scrollToSection("objectives")}
                className={`w-full justify-start ${activeSection === "objectives"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <div
                  className={`w-4 h-4 mr-2 rounded-full border-2 ${activeSection === "objectives"
                    ? "border-blue-600"
                    : "border-gray-400"
                    }`}
                ></div>
                Objectives
              </Button>
            )}
            {isSectionVisible("treatmentPlan") && (
              <Button
                variant="ghost"
                onClick={() => scrollToSection("treatmentPlan")}
                className={`w-full justify-start ${activeSection === "treatmentPlan"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Treatment Plan
              </Button>
            )}
            {isSectionVisible("patientDescription") && (
              <Button
                variant="ghost"
                onClick={() => scrollToSection("patientDescription")}
                className={`w-full justify-start ${activeSection === "patientDescription"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Patient Description
              </Button>
            )}
            {isSectionVisible("timing") && (
              <Button
                variant="ghost"
                onClick={() => scrollToSection("timing")}
                className={`w-full justify-start ${activeSection === "timing"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <div
                  className={`w-4 h-4 mr-2 rounded border ${activeSection === "timing"
                    ? "border-blue-600"
                    : "border-gray-400"
                    }`}
                ></div>
                Timing
              </Button>
            )}
            {isSectionVisible("outcome") && (
              <Button
                variant="ghost"
                onClick={() => scrollToSection("outcome")}
                className={`w-full justify-start ${activeSection === "outcome"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Outcome
              </Button>
            )}
            {isSectionVisible("publishedResults") && (
              <Button
                variant="ghost"
                onClick={() => scrollToSection("publishedResults")}
                className={`w-full justify-start ${activeSection === "publishedResults"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <FileText className="h-4 w-4 mr-2" />
                Published Results
              </Button>
            )}
            {isSectionVisible("sites") && (
              <Button
                variant="ghost"
                onClick={() => scrollToSection("sites")}
                className={`w-full justify-start ${activeSection === "sites"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <div
                  className={`w-4 h-4 mr-2 rounded border ${activeSection === "sites"
                    ? "border-blue-600"
                    : "border-gray-400"
                    }`}
                ></div>
                Sites
              </Button>
            )}
            {isSectionVisible("otherSources") && (
              <Button
                variant="ghost"
                onClick={() => scrollToSection("otherSources")}
                className={`w-full justify-start ${activeSection === "otherSources"
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
              >
                <div
                  className={`w-4 h-4 mr-2 rounded ${activeSection === "otherSources"
                    ? "bg-blue-600"
                    : "bg-gray-400"
                    }`}
                ></div>
                Other Sources
              </Button>
            )}
          </div>

          <div className="px-4 py-6 border-t">
            <div className="space-y-4">
              <div className="text-sm text-gray-600">Pipeline Data</div>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  toast({
                    title: "Feature Coming Soon",
                    description:
                      "Associated Studies functionality will be available in the next update.",
                  });
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Associated Studies
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => {
                  if (trial.logs && trial.logs.length > 0) {
                    const logMessages = trial.logs
                      .map((log) => log.trial_changes_log)
                      .join("\n");
                    toast({
                      title: "Trial Logs",
                      description: logMessages,
                    });
                  } else {
                    toast({
                      title: "No Logs Available",
                      description: "No log entries found for this trial.",
                    });
                  }
                }}
              >
                <FileText className="h-4 w-4 mr-2" />
                Logs
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Trial Header */}
          <div
            className={`bg-white border-b ${isMinimized ? "px-2 py-1" : "px-6 py-2"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {trial.overview.trial_identifier?.[0] || trial.trial_id}
                </h2>
                <Badge className={getStatusColor(trial.overview.status)}>
                  {trial.overview.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMaximize}
                  className={`${isMaximized ? "bg-blue-100 text-blue-600" : ""}`}
                  title={isMaximized ? "Restore view" : "Maximize view"}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMinimize}
                  className={`${isMinimized ? "bg-blue-100 text-blue-600" : ""}`}
                  title={isMinimized ? "Expand view" : "Minimize view"}
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  title="Refresh trial data"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFilter}
                  className={`${filteredSections.length > 0 ? "bg-blue-100 text-blue-600" : ""
                    }`}
                  title="Filter sections"
                >
                  <Filter className="h-4 w-4" />
                  {filteredSections.length > 0 && (
                    <span className="ml-1 text-xs bg-blue-600 text-white rounded-full px-1">
                      {filteredSections.length}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Trial Content */}
          <div className={`${isMinimized ? "p-2" : "p-6"} overflow-x-auto`} data-export-content>
            {/* Trial Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="text-red-400 text-3xl">🎯</div>
                <div className="flex-1">
                  <h1 className="text-xl font-semibold mb-2">
                    {trial.overview.title}
                  </h1>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            {isSectionVisible("overview") && (
              <Card className="rounded-t-none" ref={overviewRef}>
                <CardContent className="p-6">
                  {/* Status and Controls */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Status:</span>
                        <Badge
                          className={getStatusColor(
                            trial.overview.status
                          )}
                        >
                          {trial.overview.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Endpoints met</span>
                        <Switch
                          checked={endpointsMet}
                          onCheckedChange={setEndpointsMet}
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm">Resulted Posted</span>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              resultPosted.yes
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-600"
                            }
                          >
                            Yes
                          </Badge>
                          <Badge
                            className={
                              resultPosted.no
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-600"
                            }
                          >
                            No
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Therapeutic Area and Trial Identifiers */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">
                          Therapeutic Area
                        </span>
                        <Badge className="bg-blue-600 text-white">
                          {trial.overview.therapeutic_area}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium mb-2 block">
                        Trial Identifier :
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(trial.overview.trial_identifier || []).map(
                          (identifier, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-white"
                            >
                              {identifier}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Scientific Title */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Scientific Title
                    </h3>
                    <p className="text-black text-sm leading-relaxed whitespace-pre-wrap">
                      {trial.outcomes[0]?.purpose_of_trial ||
                        "No scientific title available"}
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Summary
                    </h3>
                    <p className="text-black text-sm leading-relaxed whitespace-pre-wrap">
                      {trial.outcomes[0]?.summary ||
                        "No summary available"}
                    </p>
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Left Column - Key Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Key Information
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 min-w-[140px] flex-shrink-0">
                            Disease Type :
                          </span>
                          <span className="text-sm text-gray-700">
                            {trial.overview.disease_type || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 min-w-[140px] flex-shrink-0">
                            Patient Segment :
                          </span>
                          <span className="text-sm text-gray-700">
                            {trial.overview.patient_segment || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 min-w-[140px] flex-shrink-0">
                            Primary Drug :
                          </span>
                          <span className="text-sm text-gray-700">
                            {trial.overview.primary_drugs || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 min-w-[140px] flex-shrink-0">
                            Secondary Drug :
                          </span>
                          <span className="text-sm text-gray-700">
                            {trial.overview.other_drugs || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 min-w-[140px] flex-shrink-0">
                            Trial Phase :
                          </span>
                          <Badge className="bg-green-600 text-white">
                            Phase {trial.overview.trial_phase || "N/A"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Line of Therapy */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Line of Therapy
                      </h3>
                      <div className="space-y-2">
                        {trial.overview.line_of_therapy ? (
                          trial.overview.line_of_therapy.split(/,\s*|\n/).map((line, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <span className="text-blue-600">•</span>
                              <span className="text-sm font-medium text-gray-900">
                                {line.trim()}
                              </span>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-gray-600">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Countries Section */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Countries
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {countries.length > 0 ? (
                          countries.map((country, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-center bg-white text-gray-700 py-2.5 px-4 rounded-md border-gray-300 shadow-sm font-medium h-auto flex items-center justify-center"
                            >
                              {country.trim()}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-gray-600">
                            No countries specified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Additional Information Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Details */}
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Region :
                        </span>
                        <span className="text-sm text-gray-700 ml-2">
                          {trial.overview.region || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Sponsors & Collaborators :
                        </span>
                        <span className="text-sm text-gray-700 ml-2">
                          {trial.overview.sponsor_collaborators || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Sponsor Field of Activity :
                        </span>
                        <span className="text-sm text-gray-700 ml-2">
                          {trial.overview.sponsor_field_activity ||
                            "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Associated CRO :
                        </span>
                        <span className="text-sm text-gray-700 ml-2">
                          {trial.overview.associated_cro || "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Trial Tags :
                        </span>
                        <span className="text-sm text-gray-700 ml-2">
                          {trial.overview.trial_tags || "N/A"}
                        </span>
                      </div>

                      {/* Source Links */}
                      <div className="pt-4">
                        <span className="text-sm font-medium text-gray-600 block mb-2">
                          Source Links :
                        </span>
                        <div className="space-y-1">
                          {trial.overview.reference_links &&
                            trial.overview.reference_links.length > 0 ? (
                            trial.overview.reference_links.map(
                              (link, index) => (
                                <div key={index}>
                                  <span className="text-blue-600 text-xs">
                                    •
                                  </span>
                                  <PreviewLink
                                    href={link}
                                    title="Source Link"
                                    className="text-blue-600 text-xs ml-1 hover:underline"
                                  >
                                    {link}
                                  </PreviewLink>
                                </div>
                              )
                            )
                          ) : (
                            <span className="text-sm text-gray-600">
                              No source links available
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2">
                        <span className="text-sm font-medium text-gray-600">
                          Trial Record Status :
                        </span>
                        <span className="text-sm text-gray-700">
                          {trial.overview.trial_record_status || "N/A"}
                        </span>
                        <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      </div>
                    </div>

                    {/* Right Column - Europe Map - Temporarily Commented */}
                    {/* <div className="flex justify-center items-center">
                      <div className="relative w-full max-w-xs">
                        <Image
                          src="/europe.png"
                          alt="Europe Map"
                          width={300}
                          height={300}
                          className="object-contain"
                        />
                  </div>
                    </div> */}
                  </div>

                </CardContent>
              </Card>
            )}

            {/* Objectives Section */}
            {isSectionVisible("objectives") && (
              <Card className="mt-6" ref={objectivesRef}>
                <div className="bg-sky-200 p-4 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Objectives
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {/* Purpose of the trial */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-base font-semibold text-gray-700 mb-4">
                        Purpose of the trial
                      </h3>
                      <p className="text-sm text-black leading-relaxed whitespace-pre-wrap">
                        {trial.outcomes[0]?.purpose_of_trial ||
                          "No purpose description available"}
                      </p>
                    </div>

                    {/* Primary Outcome */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base font-semibold text-blue-700 mb-4">
                          Primary Outcome
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Outcome Measure :
                            </span>
                            <p className="text-sm text-black mt-1 whitespace-pre-wrap">
                              {trial.outcomes[0]
                                ?.primary_outcome_measure ||
                                "No primary outcome measure available"}
                            </p>
                          </div>

                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Measure Description :
                            </span>
                            <p className="text-sm text-black mt-1 leading-relaxed whitespace-pre-wrap">
                              {trial.outcomes[0]?.summary ||
                                "No measure description available"}
                            </p>
                          </div>

                          <div>
                            <span className="text-sm font-medium text-gray-600">
                              Other Outcome Measures :
                            </span>
                            <p className="text-sm text-black mt-1 whitespace-pre-wrap">
                              {trial.outcomes[0]
                                ?.other_outcome_measure ||
                                "No other outcome measures available"}
                            </p>
                          </div>
                        </div>
                      </div>


                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Treatment Plan Section */}
            {isSectionVisible("treatmentPlan") && (
              <Card className="mt-6" ref={treatmentPlanRef}>
                <div className="bg-sky-200 p-4 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Treatment Plan
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {/* Study Design Keywords */}
                    <div>
                      <h3 className="text-base font-semibold text-blue-700 mb-4">
                        Study Design Keywords
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {trial.outcomes[0]?.study_design_keywords ? (
                          trial.outcomes[0].study_design_keywords
                            .split(",")
                            .map((keyword, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-gray-100 text-gray-800 py-3 px-8 rounded-md border-none font-bold text-sm h-auto flex items-center justify-center min-w-[120px]"
                              >
                                {keyword.trim()}
                              </Badge>
                            ))
                        ) : (
                          <span className="text-sm text-gray-600">
                            No study design keywords available
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Study Design */}
                    <div>
                      <h3 className="text-base font-semibold text-blue-700 mb-4">
                        Study Design
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 min-w-[120px] flex-shrink-0">
                            Study Design :
                          </span>
                          <span className="text-sm text-black">
                            {trial.outcomes[0]?.study_design || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 min-w-[120px] flex-shrink-0">
                            Keywords :
                          </span>
                          <span className="text-sm text-black">
                            {trial.outcomes[0]?.study_design_keywords ||
                              "N/A"}
                          </span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-sm font-medium text-gray-600 min-w-[120px] flex-shrink-0">
                            Number of Arms :
                          </span>
                          <span className="text-sm text-black">
                            {trial.outcomes[0]?.number_of_arms || "N/A"}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-black mt-4 leading-relaxed whitespace-pre-wrap">
                        {trial.outcomes[0]?.summary ||
                          "No detailed study design description available"}
                      </p>
                    </div>

                    {/* Treatment Regimen */}
                    <div>
                      <h3 className="text-base font-semibold text-blue-700 mb-4">
                        Treatment Regimen
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            Treatment Description :
                          </span>
                          <p className="text-sm text-black mt-1 whitespace-pre-wrap">
                            {trial.outcomes[0]?.treatment_regimen ||
                              "No treatment regimen description available"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-700">
                          Number of arms:{" "}
                          {trial.outcomes[0]?.number_of_arms || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Patient Description Section */}
            {isSectionVisible("patientDescription") && (
              <Card className="mt-6" ref={patientDescriptionRef}>
                <div className="bg-sky-200 p-4 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Patient Description
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Criteria (takes 2/3 width) */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* Inclusion Criteria */}
                      <div>
                        <h3 className="text-base font-semibold text-blue-700 mb-4">
                          Inclusion Criteria
                        </h3>
                        {trial.criteria[0]?.inclusion_criteria ? (
                          <div className="text-sm text-black">
                            <span className="text-blue-600 mr-2">•</span>
                            <span className="whitespace-pre-wrap">
                              {trial.criteria[0].inclusion_criteria}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-600">
                            No inclusion criteria available
                          </span>
                        )}
                      </div>

                      {/* Exclusion Criteria */}
                      <div>
                        <h3 className="text-base font-semibold text-blue-700 mb-4">
                          Exclusion Criteria
                        </h3>
                        {trial.criteria[0]?.exclusion_criteria ? (
                          <div className="text-sm text-black">
                            <span className="text-blue-600 mr-2">•</span>
                            <span className="whitespace-pre-wrap">
                              {trial.criteria[0].exclusion_criteria}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-600">
                            No exclusion criteria available
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Column - Patient Details (takes 1/3 width) */}
                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Ages Eligible for Study
                        </h4>
                        <p className="text-sm text-gray-600">
                          {trial.criteria[0]?.age_from || "N/A"} -{" "}
                          {trial.criteria[0]?.age_to || "N/A"} Years
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Sexes Eligible for Study
                        </h4>
                        <p className="text-sm text-gray-600">
                          {trial.criteria[0]?.sex || "N/A"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Subject Type
                        </h4>
                        <p className="text-sm text-gray-600">
                          {trial.criteria[0]?.subject_type || "N/A"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Healthy Volunteers
                        </h4>
                        <p className="text-sm text-gray-600">
                          {trial.criteria[0]?.healthy_volunteers ===
                            "false"
                            ? "No"
                            : trial.criteria[0]?.healthy_volunteers ===
                              "true"
                              ? "Yes"
                              : "N/A"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Target No of Volunteers
                        </h4>
                        <p className="text-sm text-gray-600">
                          {trial.criteria[0]?.target_no_volunteers ||
                            "N/A"}
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Actual enrolled Volunteers
                        </h4>
                        <p className="text-sm text-gray-600">
                          {trial.criteria[0]
                            ?.actual_enrolled_volunteers || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Timing Section */}
            {isSectionVisible("timing") && (
              <Card className="mt-6" ref={timingRef}>
                <div className="p-4 rounded-t-lg" style={{ backgroundColor: '#2B4863' }}>
                  <h2 className="text-lg font-semibold text-white">
                    Timing
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-8">
                    {/* Timing Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse table-auto min-w-[800px]">
                        <thead>
                          <tr className="text-white" style={{ backgroundColor: '#2B4863' }}>
                            <th className="border border-slate-400 px-4 py-3 text-left text-sm font-medium">
                              Category
                            </th>
                            <th className="border border-slate-400 px-4 py-3 text-left text-sm font-medium">
                              Start Date
                            </th>
                            <th className="border border-slate-400 px-4 py-3 text-left text-sm font-medium">
                              Inclusion Period(months)
                            </th>
                            <th className="border border-slate-400 px-4 py-3 text-left text-sm font-medium">
                              Enrolment closed date
                            </th>
                            <th className="border border-slate-400 px-4 py-3 text-left text-sm font-medium">
                              Treatment & Primary Outcome Measurement Duration
                              (months)
                            </th>
                            <th className="border border-slate-400 px-4 py-3 text-left text-sm font-medium">
                              Trial Completion date
                            </th>
                            <th className="border border-slate-400 px-4 py-3 text-left text-sm font-medium">
                              Duration to Publish Result (months)
                            </th>
                            <th className="border border-slate-400 px-4 py-3 text-left text-sm font-medium">
                              Result Published date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Actual Row */}
                          <tr className="bg-white">
                            <td className="border border-slate-300 px-4 py-3 text-sm font-medium">
                              Actual
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.start_date_actual)
                                ? formatDateToMMDDYYYY(trial.timing[0].start_date_actual)
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.inclusion_period_actual)
                                ? trial.timing[0].inclusion_period_actual
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.enrollment_closed_actual)
                                ? formatDateToMMDDYYYY(trial.timing[0].enrollment_closed_actual)
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.primary_outcome_duration_actual)
                                ? trial.timing[0].primary_outcome_duration_actual
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.trial_end_date_actual)
                                ? formatDateToMMDDYYYY(trial.timing[0].trial_end_date_actual)
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.result_duration_actual)
                                ? trial.timing[0].result_duration_actual
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.result_published_date_actual)
                                ? formatDateToMMDDYYYY(trial.timing[0].result_published_date_actual)
                                : "N/A"}
                            </td>
                          </tr>
                          {/* Benchmark Row */}
                          <tr className="bg-gray-50">
                            <td className="border border-slate-300 px-4 py-3 text-sm font-medium">
                              Benchmark
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.start_date_benchmark)
                                ? formatDateToMMDDYYYY(trial.timing[0].start_date_benchmark)
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.inclusion_period_benchmark)
                                ? trial.timing[0].inclusion_period_benchmark
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.enrollment_closed_benchmark)
                                ? formatDateToMMDDYYYY(trial.timing[0].enrollment_closed_benchmark)
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.primary_outcome_duration_benchmark)
                                ? trial.timing[0].primary_outcome_duration_benchmark
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.trial_end_date_benchmark)
                                ? formatDateToMMDDYYYY(trial.timing[0].trial_end_date_benchmark)
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.result_duration_benchmark)
                                ? trial.timing[0].result_duration_benchmark
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.result_published_date_benchmark)
                                ? formatDateToMMDDYYYY(trial.timing[0].result_published_date_benchmark)
                                : "N/A"}
                            </td>
                          </tr>
                          {/* Estimated Row */}
                          <tr className="bg-white">
                            <td className="border border-slate-300 px-4 py-3 text-sm font-medium">
                              Estimated
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.start_date_estimated)
                                ? formatDateToMMDDYYYY(trial.timing[0].start_date_estimated)
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.inclusion_period_estimated)
                                ? trial.timing[0].inclusion_period_estimated
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.enrollment_closed_estimated)
                                ? formatDateToMMDDYYYY(trial.timing[0].enrollment_closed_estimated)
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.primary_outcome_duration_estimated)
                                ? trial.timing[0].primary_outcome_duration_estimated
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.trial_end_date_estimated)
                                ? formatDateToMMDDYYYY(trial.timing[0].trial_end_date_estimated)
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.result_duration_estimated)
                                ? trial.timing[0].result_duration_estimated
                                : "N/A"}
                            </td>
                            <td className="border border-slate-300 px-4 py-3 text-sm">
                              {isValidValue(trial.timing[0]?.result_published_date_estimated)
                                ? formatDateToMMDDYYYY(trial.timing[0].result_published_date_estimated)
                                : "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Summary Statistics */}
                    <div className="flex items-center justify-center space-x-8">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          Overall duration to complete :
                        </span>
                        <Badge className="bg-green-600 text-white">
                          {isValidValue(trial.timing[0]?.overall_duration_complete)
                            ? trial.timing[0].overall_duration_complete
                            : "N/A"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          Overall duration to publish :
                        </span>
                        <Badge className="bg-green-600 text-white">
                          {isValidValue(trial.timing[0]?.overall_duration_publish)
                            ? trial.timing[0].overall_duration_publish
                            : "N/A"}
                        </Badge>
                      </div>
                    </div>

                    {/* Reference Section */}
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 mb-4">
                        Reference
                      </h3>

                      {/* Reference Grid */}
                      {(() => {
                        // Parse timing_references if it's a string
                        let timingReferences = trial.timing[0]?.timing_references;
                        if (typeof timingReferences === 'string') {
                          try {
                            timingReferences = JSON.parse(timingReferences);
                          } catch (e) {
                            console.warn('Failed to parse timing_references:', e);
                            timingReferences = null;
                          }
                        }

                        // Ensure it's an array and filter visible references
                        const visibleReferences = Array.isArray(timingReferences)
                          ? timingReferences.filter((ref: any) => ref.isVisible !== false && (ref.date || ref.content))
                          : [];

                        if (visibleReferences.length === 0) {
                          return (
                            <div className="text-sm text-gray-500 mb-6">
                              No references available
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {visibleReferences.map((ref: any, index: number) => {
                              const isExpanded = expandedReferences[index];
                              return (
                                <div
                                  key={ref.id || index}
                                  className={`border rounded-xl transition-all duration-300 overflow-hidden ${isExpanded ? 'bg-white shadow-md' : 'bg-white'}`}
                                  style={{ borderColor: isExpanded ? '#2B4863' : '#E2E8F0' }}
                                >
                                  {/* Header Info */}
                                  <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100 font-medium px-3 py-1 text-xs">
                                        {ref.date ? formatDateToMMDDYYYY(ref.date) : "No date"}
                                      </Badge>
                                      <Badge variant="secondary" className="bg-gray-100 text-gray-800 hover:bg-gray-100 font-medium px-3 py-1 text-xs">
                                        {ref.registryType || "No registry type"}
                                      </Badge>
                                    </div>
                                    <button
                                      onClick={() => toggleReference(index)}
                                      className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                                      style={{ backgroundColor: '#2B4863', color: 'white' }}
                                    >
                                      {isExpanded ? <X size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
                                    </button>
                                  </div>

                                  {/* Expandable Content */}
                                  {isExpanded && (
                                    <div className="px-4 pb-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                      <div className="space-y-2 border-t pt-3">
                                        <div className="flex text-xs">
                                          <span className="font-bold text-[#2B4863] min-w-[150px]">Study Start (Actual) :</span>
                                          <span className="text-gray-700">
                                            {isValidValue(trial.timing[0]?.start_date_actual)
                                              ? formatDateToMMDDYYYY(trial.timing[0].start_date_actual)
                                              : "N/A"}
                                          </span>
                                        </div>
                                        <div className="flex text-xs">
                                          <span className="font-bold text-[#2B4863] min-w-[150px]">Primary Completion (Actual) :</span>
                                          <span className="text-gray-700">
                                            {isValidValue(trial.timing[0]?.enrollment_closed_actual)
                                              ? formatDateToMMDDYYYY(trial.timing[0].enrollment_closed_actual)
                                              : "N/A"}
                                          </span>
                                        </div>
                                        <div className="flex text-xs">
                                          <span className="font-bold text-[#2B4863] min-w-[150px]">Study Completion (Actual) :</span>
                                          <span className="text-gray-700">
                                            {isValidValue(trial.timing[0]?.trial_end_date_actual)
                                              ? formatDateToMMDDYYYY(trial.timing[0].trial_end_date_actual)
                                              : "N/A"}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 pt-2">
                                        <Button
                                          size="sm"
                                          className="h-8 px-4 text-xs font-medium text-white shadow-sm"
                                          style={{ backgroundColor: '#2B4863' }}
                                          onClick={() => ref.viewSource && openLinkPreview(ref.viewSource, "View Source")}
                                        >
                                          View source
                                        </Button>

                                        <div className="flex items-center h-8 rounded-md shadow-sm overflow-hidden">
                                          <Button
                                            size="sm"
                                            className="h-full px-3 text-xs font-medium text-white border-r border-[#ffffff33] rounded-none"
                                            style={{ backgroundColor: '#2B4863' }}
                                            onClick={() => {
                                              if (ref.attachments && ref.attachments.length > 0) {
                                                setSelectedRefForAttachments(ref);
                                              } else {
                                                toast({
                                                  title: "No attachments",
                                                  description: "No attachments available for this reference.",
                                                });
                                              }
                                            }}
                                          >
                                            Attachments
                                            <FileText className="ml-2 h-3.5 w-3.5" />
                                          </Button>
                                          <Button
                                            size="sm"
                                            className="h-full px-2 text-white rounded-none"
                                            style={{ backgroundColor: '#2B4863' }}
                                            onClick={() => {
                                              if (ref.attachments && ref.attachments.length > 0) {
                                                ref.attachments.forEach((attach: any) => {
                                                  if (attach.url) window.open(attach.url, '_blank');
                                                });
                                              } else if (ref.viewSource) {
                                                openLinkPreview(ref.viewSource, "View Source");
                                              } else {
                                                toast({
                                                  title: "Nothing to download",
                                                  description: "No files or source links available to download.",
                                                });
                                              }
                                            }}
                                          >
                                            <Download className="h-3.5 w-3.5" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Outcome Section */}
            {isSectionVisible("outcome") && (
              <Card className="mt-6" ref={outcomeRef}>
                <div className="bg-sky-200 p-4 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Outcome
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Toggle Switches */}
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          Results available
                        </span>
                        <Switch
                          checked={trial.results[0]?.results_available === true || trial.results[0]?.results_available === "true" || trial.results[0]?.results_available === "Yes"}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          Endpoints met
                        </span>
                        <Switch
                          checked={trial.results[0]?.endpoints_met === true || trial.results[0]?.endpoints_met === "true" || trial.results[0]?.endpoints_met === "Yes"}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">
                          Adverse Events Reported
                        </span>
                        <Switch
                          checked={trial.results[0]?.adverse_events_reported === true || trial.results[0]?.adverse_events_reported === "true" || trial.results[0]?.adverse_events_reported === "Yes" || trial.results[0]?.adverse_event_reported === "Yes"}
                        />
                      </div>
                    </div>

                    {/* Trial Outcome */}
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">
                        Trial Outcome :
                      </span>
                      <Badge className="bg-green-600 text-white px-3 py-1">
                        {trial.results[0]?.trial_outcome ||
                          "No outcome available"}
                      </Badge>
                    </div>

                    {/* Trial Outcome Reference */}
                    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-800">
                          Trial Outcome Reference
                        </h3>
                        {trial.results[0]?.trial_outcome_reference_date && (
                          <span className="text-sm text-gray-600">
                            {formatDateToMMDDYYYY(trial.results[0].trial_outcome_reference_date)}
                          </span>
                        )}
                      </div>

                      {/* Trial Outcome Results Content */}
                      {trial.results[0]?.trial_outcome_content && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">
                            Trial Outcome Results Content:
                          </h4>
                          <p className="text-sm text-black leading-relaxed whitespace-pre-wrap">
                            {trial.results[0].trial_outcome_content}
                          </p>
                        </div>
                      )}

                      {/* Link */}
                      {trial.results[0]?.trial_outcome_link && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">
                            Link:
                          </h4>
                          <PreviewLink
                            href={trial.results[0].trial_outcome_link}
                            title="Outcome Link"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                          >
                            <LinkIcon className="h-4 w-4" />
                            {trial.results[0].trial_outcome_link}
                          </PreviewLink>
                        </div>
                      )}

                      {/* Attachments */}
                      {trial.results[0]?.trial_outcome_attachment && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">
                            Attachments:
                          </h4>
                          <div className="flex items-center gap-2">
                            {typeof trial.results[0].trial_outcome_attachment === 'object' && trial.results[0].trial_outcome_attachment?.url ? (
                              <>
                                <span className="text-sm text-gray-700">
                                  {trial.results[0].trial_outcome_attachment.name || "Attachment"}
                                </span>
                                <a
                                  href={trial.results[0].trial_outcome_attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                >
                                  View
                                </a>
                              </>
                            ) : (
                              <span className="text-sm text-gray-700">
                                {typeof trial.results[0].trial_outcome_attachment === 'string'
                                  ? trial.results[0].trial_outcome_attachment
                                  : "Attachment available"}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Reference Text */}
                      {trial.results[0]?.reference && trial.results[0].reference !== "N/A" && (
                        <p className="text-sm text-black leading-relaxed">
                          {trial.results[0].reference}
                        </p>
                      )}

                      {trial.results[0]?.trial_results &&
                        trial.results[0].trial_results.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">
                              Trial Results:
                            </h4>
                            <ul className="space-y-1">
                              {trial.results[0].trial_results.map(
                                (result, index) => (
                                  <li
                                    key={index}
                                    className="text-sm text-gray-700"
                                  >
                                    <span className="text-blue-600 mr-2">
                                      •
                                    </span>
                                    {result}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {/* Adverse Events */}
                      {(trial.results[0]?.adverse_event_reported === "Yes" ||
                        trial.results[0]?.adverse_events_reported === true ||
                        trial.results[0]?.adverse_events_reported === "true" ||
                        trial.results[0]?.adverse_events_reported === "Yes") && (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800 mb-2">
                              Adverse Events:
                            </h4>
                            {trial.results[0]?.adverse_event_type && (
                              <p className="text-sm text-black mb-1">
                                Type: {trial.results[0].adverse_event_type}
                              </p>
                            )}
                            {trial.results[0]?.treatment_for_adverse_events && (
                              <p className="text-sm text-black">
                                Treatment: {trial.results[0].treatment_for_adverse_events}
                              </p>
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results Notes Section */}
            {isSectionVisible("outcome") && trial.results[0]?.site_notes && trial.results[0].site_notes.length > 0 && (
              <Card className="mt-6">
                <div className="bg-sky-200 p-4 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Results Notes
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {trial.results[0].site_notes
                      .filter((note: any) => note.isVisible !== false)
                      .map((note: any, index: number) => {
                        const noteDate = note.date ? formatDateToMMDDYYYY(note.date) : null;
                        const resultType = note.noteType || note.type || "N/A";
                        const source = note.sourceType || note.source || "N/A";
                        const content = note.content || "";

                        return (
                          <Card key={index} className="border border-gray-200">
                            <CardContent className="p-6 space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">Note #{index + 1}</h4>
                                {note.isVisible === false && (
                                  <Badge variant="outline" className="text-gray-500">
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    Hidden
                                  </Badge>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Date */}
                                {noteDate && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Date</Label>
                                    <p className="text-sm text-gray-700 mt-1">{noteDate}</p>
                                  </div>
                                )}

                                {/* Result Type */}
                                {resultType && resultType !== "N/A" && (
                                  <div>
                                    <Label className="text-sm font-medium text-gray-600">Result type</Label>
                                    <p className="text-sm text-gray-700 mt-1">{resultType}</p>
                                  </div>
                                )}
                              </div>

                              {/* Content */}
                              {content && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Content</Label>
                                  <p className="text-sm text-black mt-1 whitespace-pre-wrap">{content}</p>
                                </div>
                              )}

                              {/* Source */}
                              {source && source !== "N/A" && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Source</Label>
                                  <p className="text-sm text-gray-700 mt-1">{source}</p>
                                </div>
                              )}

                              {/* Attachments */}
                              {note.attachments && note.attachments.length > 0 && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Attachments</Label>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {note.attachments.map((attachment: any, attachIndex: number) => {
                                      const fileUrl = typeof attachment === 'object' && attachment?.url ? attachment.url : (typeof attachment === 'string' ? attachment : null);
                                      const fileName = typeof attachment === 'object' && attachment?.name ? attachment.name : (typeof attachment === 'string' ? attachment : `Attachment ${attachIndex + 1}`);

                                      return (
                                        <div key={attachIndex} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
                                          <span className="text-sm text-gray-700">{fileName}</span>
                                          {fileUrl && (
                                            <a
                                              href={fileUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                              View
                                            </a>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Adverse Event Reported */}
                              {note.adverse_event_reported && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Adverse Event Reported</Label>
                                  <p className="text-sm text-gray-700 mt-1">{note.adverse_event_reported}</p>
                                </div>
                              )}

                              {/* Adverse Event Type */}
                              {note.adverse_event_type && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Adverse Event Type</Label>
                                  <p className="text-sm text-gray-700 mt-1">{note.adverse_event_type}</p>
                                </div>
                              )}

                              {/* Treatment For Adverse Events */}
                              {note.treatment_for_adverse_events && (
                                <div>
                                  <Label className="text-sm font-medium text-gray-600">Treatment For Adverse Events</Label>
                                  <p className="text-sm text-black mt-1 whitespace-pre-wrap">{note.treatment_for_adverse_events}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Published Results Section - Results Notes */}
            {isSectionVisible("publishedResults") && trial.results[0]?.site_notes && trial.results[0].site_notes.length > 0 && (
              <Card className="mt-6" ref={publishedResultsRef}>
                <div className="bg-sky-200 p-4 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Published Results
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {trial.results[0].site_notes
                      .filter((note: any) => note.isVisible !== false)
                      .map((note: any, index: number) => {
                        const noteDate = note.date ? formatDateToMMDDYYYY(note.date) : null;
                        const resultType = note.noteType || note.type || "N/A";
                        const source = note.sourceType || note.source || "N/A";
                        const content = note.content || "";

                        return (
                          <div key={index} className="bg-slate-700 rounded-lg overflow-hidden">
                            {/* Header */}
                            <div className="p-4 flex items-center justify-between">
                              <div className="flex items-center space-x-4 flex-wrap gap-2">
                                {noteDate && (
                                  <Badge className="bg-white text-slate-700 hover:bg-gray-100">
                                    Date : {noteDate}
                                  </Badge>
                                )}
                                {resultType && resultType !== "N/A" && (
                                  <Badge className="bg-white text-slate-700 hover:bg-gray-100">
                                    Result Type : {resultType}
                                  </Badge>
                                )}
                                {source && source !== "N/A" && (
                                  <Badge className="bg-white text-slate-700 hover:bg-gray-100">
                                    Source : {source}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Content */}
                            {content && (
                              <div className="bg-white p-6 space-y-4">
                                {/* Content Text */}
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                    Content:
                                  </h4>
                                  <p className="text-sm text-black leading-relaxed whitespace-pre-wrap">
                                    {content}
                                  </p>
                                </div>

                                {/* Adverse Event Information */}
                                {(note.adverse_event_reported || note.adverse_event_type || note.treatment_for_adverse_events) && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                      Adverse Event Information:
                                    </h4>
                                    {note.adverse_event_reported && (
                                      <p className="text-sm text-black mb-1">
                                        Reported: {note.adverse_event_reported}
                                      </p>
                                    )}
                                    {note.adverse_event_type && (
                                      <p className="text-sm text-black mb-1">
                                        Type: {note.adverse_event_type}
                                      </p>
                                    )}
                                    {note.treatment_for_adverse_events && (
                                      <p className="text-sm text-black">
                                        Treatment: {note.treatment_for_adverse_events}
                                      </p>
                                    )}
                                  </div>
                                )}

                                {/* Attachments */}
                                {note.attachments && note.attachments.length > 0 && (
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-800 mb-2">
                                      Attachments:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {note.attachments.map((attachment: any, attachIndex: number) => {
                                        const fileUrl = typeof attachment === 'object' && attachment?.url ? attachment.url : (typeof attachment === 'string' ? attachment : null);
                                        const fileName = typeof attachment === 'object' && attachment?.name ? attachment.name : (typeof attachment === 'string' ? attachment : `Attachment ${attachIndex + 1}`);

                                        return (
                                          <div key={attachIndex} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
                                            <span className="text-sm text-gray-700">{fileName}</span>
                                            {fileUrl && (
                                              <a
                                                href={fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                              >
                                                View
                                              </a>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex items-center space-x-3 pt-4">
                                  {source && source !== "N/A" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-slate-600 text-white hover:bg-slate-700"
                                      onClick={() => {
                                        // You can add logic to open source link here
                                        if (note.sourceType || note.source) {
                                          // Handle source view
                                        }
                                      }}
                                    >
                                      View source
                                    </Button>
                                  )}
                                  {note.attachments && note.attachments.length > 0 && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-slate-600 text-white hover:bg-slate-700"
                                    >
                                      <FileText className="h-4 w-4 mr-2" />
                                      Attachments
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}

                    {(!trial.results[0].site_notes || trial.results[0].site_notes.filter((note: any) => note.isVisible !== false).length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        No published results available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Sites Section */}
            {isSectionVisible("sites") && (
              <Card className="mt-6" ref={sitesRef}>
                <div className="bg-sky-200 p-4 rounded-t-lg flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-800">Sites</h2>
                  <span className="text-sm font-medium text-gray-700">
                    Total No of Sites : {trial.sites[0]?.total || "N/A"}
                  </span>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Site Information */}
                    <div>
                      <h3 className="text-base font-semibold text-gray-800 mb-4">
                        Site Information
                      </h3>

                      {trial.sites[0]?.notes ? (() => {
                        // Parse the notes JSON string
                        let siteNotes: any[] = [];
                        try {
                          const notesData = typeof trial.sites[0].notes === 'string'
                            ? JSON.parse(trial.sites[0].notes)
                            : trial.sites[0].notes;
                          siteNotes = Array.isArray(notesData) ? notesData : [];
                        } catch (e) {
                          console.error('Failed to parse site notes:', e);
                          siteNotes = [];
                        }

                        // Filter to show only visible notes
                        const visibleNotes = siteNotes.filter((note: any) => note.isVisible !== false);

                        if (visibleNotes.length === 0) {
                          return (
                            <div className="text-center py-8">
                              <p className="text-sm text-gray-600">
                                No site notes available
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-4">
                            {visibleNotes.map((note: any, index: number) => (
                              <Card key={note.id || index} className="border border-gray-200">
                                <CardContent className="p-6 space-y-4">
                                  {/* Note Header */}
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-900">Note #{index + 1}</h4>
                                    {note.isVisible === false && (
                                      <Badge variant="outline" className="text-gray-500">
                                        <EyeOff className="h-3 w-3 mr-1" />
                                        Hidden
                                      </Badge>
                                    )}
                                  </div>

                                  {/* Note Fields */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Date */}
                                    {note.date && (
                                      <div>
                                        <Label className="text-sm font-medium text-gray-600">Date</Label>
                                        <p className="text-sm text-gray-700 mt-1">
                                          {formatDateToMMDDYYYY(note.date)}
                                        </p>
                                      </div>
                                    )}

                                    {/* Registry Type */}
                                    {note.registryType && (
                                      <div>
                                        <Label className="text-sm font-medium text-gray-600">Registry Type</Label>
                                        <p className="text-sm text-gray-700 mt-1">{note.registryType}</p>
                                      </div>
                                    )}
                                  </div>

                                  {/* Content */}
                                  {note.content && (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Content</Label>
                                      <p className="text-sm text-black mt-1 whitespace-pre-wrap">
                                        {note.content}
                                      </p>
                                    </div>
                                  )}

                                  {/* View Source */}
                                  {note.viewSource && (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">View Source (URL)</Label>
                                      <PreviewLink
                                        href={note.viewSource}
                                        title="View Source"
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                                      >
                                        <LinkIcon className="h-4 w-4" />
                                        {note.viewSource}
                                      </PreviewLink>
                                    </div>
                                  )}

                                  {/* Attachments */}
                                  {note.attachments && Array.isArray(note.attachments) && note.attachments.length > 0 && (
                                    <div>
                                      <Label className="text-sm font-medium text-gray-600">Attachments</Label>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {note.attachments.map((attachment: any, attachIndex: number) => {
                                          const fileUrl = typeof attachment === 'object' && attachment?.url
                                            ? attachment.url
                                            : (typeof attachment === 'string' ? attachment : null);
                                          const fileName = typeof attachment === 'object' && attachment?.name
                                            ? attachment.name
                                            : (typeof attachment === 'string' ? attachment : `Attachment ${attachIndex + 1}`);

                                          return (
                                            <div key={attachIndex} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
                                              <span className="text-sm text-gray-700">{fileName}</span>
                                              {fileUrl && (
                                                <a
                                                  href={fileUrl}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                                >
                                                  View
                                                </a>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        );
                      })() : (
                        <div className="text-center py-8">
                          <p className="text-sm text-gray-600">
                            No site information available
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Other Sources Section */}
            {isSectionVisible("otherSources") && (
              <Card className="mt-6" ref={otherSourcesRef}>
                <div className="bg-sky-200 p-4 rounded-t-lg">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Other Sources
                  </h2>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {(() => { console.log("Rendering Other Sources - trial.other:", trial.other); return null; })()}

                    {/* Display Other Sources from step 5-7 */}
                    {trial.other && trial.other.length > 0 ? (
                      trial.other.map((source, index) => {
                        // Parse the JSON data
                        let parsedData;
                        try {
                          parsedData = typeof source.data === 'string' ? JSON.parse(source.data) : source.data;
                          console.log(`Other Source ${index}:`, parsedData);
                        } catch (error) {
                          console.error(`Failed to parse source data:`, source.data);
                          // If not JSON, treat as plain text
                          parsedData = { type: 'legacy', data: source.data };
                        }

                        // Helper function to check if URL is an image
                        const isImageUrl = (url: string) => {
                          if (!url || typeof url !== 'string') return false;
                          const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff?)(\?.*)?$/i;
                          if (imageExtensions.test(url)) return true;
                          if (url.includes('utfs.io')) return true;
                          if (url.startsWith('data:image/')) return true;
                          if (url.startsWith('blob:')) return true;
                          return false;
                        };

                        // Determine the source type label
                        const getTypeLabel = (type: string) => {
                          const labels: Record<string, string> = {
                            'pipeline_data': 'Pipeline Data',
                            'press_releases': 'Press Release',
                            'publications': 'Publication',
                            'trial_registries': 'Trial Registry',
                            'associated_studies': 'Associated Study',
                            'legacy': 'Other Source'
                          };
                          return labels[type] || 'Other Source';
                        };

                        return (
                          <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-800">
                                    {getTypeLabel(parsedData.type)} #{index + 1}
                                  </p>
                                  {parsedData.date && (
                                    <p className="text-xs text-gray-500">
                                      Date: {formatDateToMMDDYYYY(parsedData.date)}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Display type-specific information */}
                              {parsedData.type === 'pipeline_data' && parsedData.information && (
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  <p className="text-xs font-medium text-gray-600 mb-1">Information:</p>
                                  <p className="text-sm text-gray-700">{parsedData.information}</p>
                                </div>
                              )}

                              {parsedData.type === 'press_releases' && parsedData.title && (
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  <p className="text-xs font-medium text-gray-600 mb-1">Title:</p>
                                  <p className="text-sm text-gray-700">{parsedData.title}</p>
                                </div>
                              )}

                              {parsedData.type === 'publications' && (
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  {parsedData.publicationType && (
                                    <p className="text-xs text-gray-500 mb-1">
                                      Type: {parsedData.publicationType}
                                    </p>
                                  )}
                                  {parsedData.title && (
                                    <>
                                      <p className="text-xs font-medium text-gray-600 mb-1">Title:</p>
                                      <p className="text-sm text-gray-700">{parsedData.title}</p>
                                    </>
                                  )}
                                </div>
                              )}

                              {parsedData.type === 'trial_registries' && (
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  {parsedData.registry && (
                                    <p className="text-xs text-gray-500 mb-1">
                                      Registry: {parsedData.registry}
                                    </p>
                                  )}
                                  {parsedData.identifier && (
                                    <>
                                      <p className="text-xs font-medium text-gray-600 mb-1">Identifier:</p>
                                      <p className="text-sm text-gray-700">{parsedData.identifier}</p>
                                    </>
                                  )}
                                </div>
                              )}

                              {parsedData.type === 'associated_studies' && (
                                <div className="bg-white p-3 rounded border border-gray-200">
                                  {parsedData.studyType && (
                                    <p className="text-xs text-gray-500 mb-1">
                                      Study Type: {parsedData.studyType}
                                    </p>
                                  )}
                                  {parsedData.title && (
                                    <>
                                      <p className="text-xs font-medium text-gray-600 mb-1">Title:</p>
                                      <p className="text-sm text-gray-700">{parsedData.title}</p>
                                    </>
                                  )}
                                </div>
                              )}

                              {/* Legacy format */}
                              {parsedData.type === 'legacy' && parsedData.data && parsedData.data !== "N/A" && (
                                <p className="text-sm text-gray-700">{parsedData.data}</p>
                              )}

                              {/* Display URL as link if not an image */}
                              {parsedData.url && parsedData.url !== "N/A" && !isImageUrl(parsedData.url) && (
                                <div className="mt-2">
                                  <PreviewLink
                                    href={parsedData.url}
                                    title="Source Link"
                                    className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                                  >
                                    <LinkIcon className="h-3 w-3" />
                                    View Source Link
                                  </PreviewLink>
                                </div>
                              )}

                              {/* Display uploaded images */}
                              {parsedData.url && isImageUrl(parsedData.url) && (
                                <div className="mt-3">
                                  <p className="text-xs font-medium text-gray-600 mb-2">
                                    Uploaded File:
                                  </p>
                                  <div className="flex flex-wrap gap-4">
                                    <div className="relative group w-full max-w-4xl">
                                      <div className="aspect-[2/1] bg-white rounded-lg border border-gray-200 overflow-hidden relative">
                                        <img
                                          src={parsedData.url}
                                          alt={`${getTypeLabel(parsedData.type)} Image`}
                                          className="w-full h-full object-cover hover:border-blue-400 transition-all cursor-pointer"
                                          onClick={() => openLinkPreview(parsedData.url, "Source Image")}
                                          onLoad={() => console.log(`Image loaded successfully: ${parsedData.url}`)}
                                          onError={(e) => {
                                            console.error(`Image failed to load: ${parsedData.url}`);
                                            e.currentTarget.style.display = 'none';
                                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                            if (fallback) fallback.style.display = 'flex';
                                          }}
                                        />
                                        <div className="hidden absolute inset-0 bg-gray-100 items-center justify-center flex-col gap-2">
                                          <Upload className="h-8 w-8 text-gray-400" />
                                          <span className="text-xs text-gray-500">Failed to load image</span>
                                          <a
                                            href={parsedData.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-blue-600 hover:underline"
                                          >
                                            Open in new tab
                                          </a>
                                        </div>
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                          <Maximize2 className="h-6 w-6 text-white drop-shadow-lg" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {parsedData.file && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      File: {parsedData.file}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-600">
                          No other sources available
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Toaster />

      {/* Backend View Modal */}
      <Dialog open={showBackendView} onOpenChange={setShowBackendView}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Backend View - Trial {trial?.trial_id}</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Raw Data
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (trial) {
                      navigator.clipboard.writeText(JSON.stringify(trial, null, 2));
                      toast({
                        title: "Copied to Clipboard",
                        description: "Trial data has been copied to clipboard.",
                      });
                    }
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Copy JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (trial) {
                      const dataStr = JSON.stringify(trial, null, 2);
                      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
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
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Download
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-auto max-h-[70vh]">
            {trial ? (
              <div className="space-y-4">
                {/* Trial Overview */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-3">Trial Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Trial ID:</span> {trial.trial_id}
                    </div>
                    <div>
                      <span className="font-medium">Title:</span> {trial.overview.title}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> {trial.overview.status}
                    </div>
                    <div>
                      <span className="font-medium">Phase:</span> {trial.overview.trial_phase}
                    </div>
                    <div>
                      <span className="font-medium">Therapeutic Area:</span> {trial.overview.therapeutic_area}
                    </div>
                    <div>
                      <span className="font-medium">Disease Type:</span> {trial.overview.disease_type}
                    </div>
                  </div>
                </div>

                {/* Raw JSON Data */}
                <div className="bg-gray-900 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">Raw Trial Data (JSON)</h3>
                  <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap overflow-auto max-h-96">
                    {JSON.stringify(trial, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No trial data available</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Trial Sections</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Select which sections to display:
            </p>
            <div className="space-y-3">
              {[
                { id: "overview", label: "Overview" },
                { id: "objectives", label: "Objectives" },
                { id: "treatmentPlan", label: "Treatment Plan" },
                { id: "patientDescription", label: "Patient Description" },
                { id: "timing", label: "Timing" },
                { id: "outcome", label: "Outcome" },
                { id: "publishedResults", label: "Published Results" },
                { id: "sites", label: "Sites" },
                { id: "otherSources", label: "Other Sources" },
              ].map((section) => (
                <div key={section.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={section.id}
                    checked={
                      filteredSections.length === 0 ||
                      filteredSections.includes(section.id)
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilteredSections((prev) =>
                          prev.includes(section.id)
                            ? prev
                            : [...prev, section.id]
                        );
                      } else {
                        setFilteredSections((prev) =>
                          prev.filter((id) => id !== section.id)
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={section.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {section.label}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setFilteredSections([]);
                  setShowFilterDialog(false);
                }}
              >
                Clear All
              </Button>
              <Button
                onClick={() => {
                  applySectionFilter(filteredSections);
                }}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Record History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Record History - Trial {trial?.trial_id}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Trial Change Log */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Trial Change Log</h3>
              <div className="space-y-3">
                {trial?.logs &&
                  trial.logs.length > 0 ? (
                  trial.logs.map((log, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-800">
                          Change #{index + 1}
                        </span>
                        <span className="text-xs text-gray-500">
                          {log.trial_added_date
                            ? formatDateToMMDDYYYY(log.trial_added_date)
                            : "N/A"}
                        </span>
                      </div>
                      <p className="text-sm text-black mb-2">
                        {log.trial_changes_log}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>
                          <span className="font-medium">Last Modified:</span>{" "}
                          {log.last_modified_date
                            ? new Date(
                              log.last_modified_date
                            ).toLocaleDateString()
                            : "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Modified By:</span>{" "}
                          {log.last_modified_user || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Reviewed By:</span>{" "}
                          {log.full_review_user || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium">Next Review:</span>{" "}
                          {log.next_review_date
                            ? new Date(
                              log.next_review_date
                            ).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No change history available for this trial
                  </div>
                )}
              </div>
            </div>

            {/* Trial Notes */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Trial Notes</h3>
              <div className="space-y-3">
                {trial?.notes &&
                  trial.notes.length > 0 ? (
                  trial.notes.map((note: any, index: number) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 bg-blue-50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-800">
                          Note #{index + 1} - {note.date_type}
                        </span>
                      </div>
                      <p className="text-sm text-black mb-2 whitespace-pre-wrap">{note.notes}</p>
                      {note.link && (
                        <a
                          href={note.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View Link
                        </a>
                      )}
                      {note.attachments && Array.isArray(note.attachments) && note.attachments.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs font-medium text-gray-600">
                            Attachments:
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {note.attachments.map((attachment: any, attachIndex: number) => (
                              <Badge
                                key={attachIndex}
                                variant="outline"
                                className="text-xs"
                              >
                                {attachment}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No notes available for this trial
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  // Export history data
                  const historyData = {
                    trial_id: trial?.trial_id,
                    logs: trial?.logs || [],
                    notes: trial?.notes || [],
                    exported_at: new Date().toISOString(),
                  };

                  const dataStr = JSON.stringify(historyData, null, 2);
                  const dataBlob = new Blob([dataStr], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `trial_${trial?.trial_id}_history.json`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);

                  toast({
                    title: "History Exported",
                    description: "Trial history has been exported successfully",
                  });
                }}
              >
                Export History
              </Button>
              <Button onClick={() => setShowHistoryModal(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Trial Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Choose your preferred export format:
            </p>

            <div className="space-y-3">
              <Button
                onClick={exportAsPDF}
                disabled={isExporting}
                className="w-full justify-start h-16 text-left"
                variant="outline"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Export as PDF</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      {isExporting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-3 w-3 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Generating PDF...
                        </>
                      ) : (
                        "Complete trial document with all sections"
                      )}
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                onClick={exportAsJSON}
                disabled={isExporting}
                className="w-full justify-start h-16 text-left"
                variant="outline"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm6 2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium">Export as JSON</div>
                    <div className="text-sm text-gray-500">
                      Raw trial data for integration or analysis
                    </div>
                  </div>
                </div>
              </Button>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowExportModal(false)}
                disabled={isExporting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Attachments View Modal */}
      <Dialog open={!!selectedRefForAttachments} onOpenChange={(open) => !open && setSelectedRefForAttachments(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reference Attachments</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedRefForAttachments?.attachments && selectedRefForAttachments.attachments.length > 0 ? (
              <div className="space-y-2">
                {selectedRefForAttachments.attachments.map((attach: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-[#2B4863]" />
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                        {attach.name || `Attachment ${idx + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 h-8"
                        onClick={() => attach.url && window.open(attach.url, '_blank')}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 h-8"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = attach.url;
                          link.download = attach.name || 'attachment';
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No attachments found
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button
              style={{ backgroundColor: '#2B4863' }}
              onClick={() => setSelectedRefForAttachments(null)}
              className="text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

