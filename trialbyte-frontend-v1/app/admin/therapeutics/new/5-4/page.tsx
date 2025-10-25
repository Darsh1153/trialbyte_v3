"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Eye, EyeOff, Upload, FileText, Image, Calculator, Calendar, ArrowLeft, ArrowRight } from "lucide-react";
import CustomDateInput from "@/components/ui/custom-date-input";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function TherapeuticsStep5_4() {
  const { formData, updateField, addReference, removeReference, updateReference, saveTrial } = useTherapeuticForm();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorData, setCalculatorData] = useState({
    date: "",
    duration: "",
    frequency: "days",
    outputDate: ""
  });

  // State for Duration to Months Converter
  const [durationConverterData, setDurationConverterData] = useState({
    duration: "",
    frequency: "days",
    outputMonths: ""
  });

  // State for Enhanced Date Calculator
  const [enhancedCalculatorData, setEnhancedCalculatorData] = useState({
    date: "",
    duration: "",
    frequency: "months",
    outputDate: ""
  });
  const form = formData.step5_4;

  // Auto-calculation utility functions
  const calculateDateDifference = (date1: string, date2: string): number => {
    if (!date1 || !date2) return 0;
    
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
    
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44); // Average days per month - keep as decimal
    return diffMonths;
  };


  // Auto-calculation logic based on confidence levels
  const performAutoCalculations = (row: string, column: string, value: string) => {
    const confidenceLevels = { "actual": 3, "benchmark": 2, "estimated": 1 };
    const currentLevel = confidenceLevels[row.toLowerCase() as keyof typeof confidenceLevels];
    
    // Get all current values for calculations
    const getValue = (r: string, c: string) => {
      const key = `${r.toLowerCase()}_${c.replace(/\s+/g, "_").toLowerCase()}`;
      return (form as any)[key] || "";
    };

    // Auto-calculate Inclusion Period
    if (column === "Start Date" || column === "Enrollment Closed Date") {
      const startDate = column === "Start Date" ? value : getValue(row, "Start Date");
      const enrollmentClosedDate = column === "Enrollment Closed Date" ? value : getValue(row, "Enrollment Closed Date");
      
      if (startDate && enrollmentClosedDate) {
        // Validate that start date is not greater than enrollment closed date
        const start = new Date(startDate);
        const enrollment = new Date(enrollmentClosedDate);
        
        if (start > enrollment) {
          toast({
            title: "Date Validation Error",
            description: `Start date (${startDate}) cannot be greater than enrollment closure date (${enrollmentClosedDate})`,
            variant: "destructive",
          });
          return;
        }
        
        const inclusionPeriod = calculateDateDifference(startDate, enrollmentClosedDate);
        updateTableValue(row, "Inclusion Period", inclusionPeriod.toFixed(2));
      }
    }

    // Auto-calculate Result Duration
    if (column === "Trial End Date" || column === "Result Published Date") {
      const trialEndDate = column === "Trial End Date" ? value : getValue(row, "Trial End Date");
      const resultPublishedDate = column === "Result Published Date" ? value : getValue(row, "Result Published Date");
      
      if (trialEndDate && resultPublishedDate) {
        // Validate that trial end date is not greater than result published date
        const trialEnd = new Date(trialEndDate);
        const resultPublished = new Date(resultPublishedDate);
        
        if (trialEnd > resultPublished) {
          toast({
            title: "Date Validation Error",
            description: `Trial end date (${trialEndDate}) cannot be greater than result published date (${resultPublishedDate})`,
            variant: "destructive",
          });
          return;
        }
        
        const resultDuration = calculateDateDifference(trialEndDate, resultPublishedDate);
        updateTableValue(row, "Result Duration", resultDuration.toFixed(2));
      }
    }

    // Auto-calculate Overall Duration to Complete
    if (column === "Start Date" || column === "Trial End Date") {
      const startDate = column === "Start Date" ? value : getValue(row, "Start Date");
      const trialEndDate = column === "Trial End Date" ? value : getValue(row, "Trial End Date");
      
      if (startDate && trialEndDate) {
        const overallDurationComplete = calculateDateDifference(startDate, trialEndDate);
        updateField("step5_4", "estimated_enrollment", overallDurationComplete.toFixed(2));
      }
    }

    // Auto-calculate Overall Duration to Publish Results
    if (column === "Start Date" || column === "Result Published Date") {
      const startDate = column === "Start Date" ? value : getValue(row, "Start Date");
      const resultPublishedDate = column === "Result Published Date" ? value : getValue(row, "Result Published Date");
      
      if (startDate && resultPublishedDate) {
        const overallDurationPublish = calculateDateDifference(startDate, resultPublishedDate);
        updateField("step5_4", "actual_enrollment", overallDurationPublish.toFixed(2));
      }
    }

    // Back-calculation logic (as per the scenario in the image)
    if (column === "Trial End Date" && row.toLowerCase() === "estimated") {
      const trialEndDate = value;
      const primaryOutcomeDuration = getValue("actual", "Primary Outcome Duration");
      
      if (trialEndDate && primaryOutcomeDuration) {
        // Calculate enrollment closed date by subtracting duration from trial end date
        const end = new Date(trialEndDate);
        if (!isNaN(end.getTime())) {
          const start = new Date(end);
          start.setMonth(start.getMonth() - parseInt(primaryOutcomeDuration));
          const enrollmentClosedDate = start.toISOString().split('T')[0];
          updateTableValue("estimated", "Enrollment Closed Date", enrollmentClosedDate);
          
          // Calculate inclusion period for estimated row
          const startDate = getValue("estimated", "Start Date");
          if (startDate) {
            const inclusionPeriod = calculateDateDifference(startDate, enrollmentClosedDate);
            updateTableValue("estimated", "Inclusion Period", inclusionPeriod.toString());
          }
        }
      }
    }
  };

  // New calculator functions for forward/backward date calculation
  const calculateForwardDate = () => {
    if (!calculatorData.date || !calculatorData.duration) return;
    
    const startDate = new Date(calculatorData.date);
    if (isNaN(startDate.getTime())) return;
    
    const duration = parseFloat(calculatorData.duration);
    if (isNaN(duration)) return;
    
    const resultDate = new Date(startDate);
    
    // Add duration based on frequency
    if (calculatorData.frequency === "days") {
      resultDate.setDate(resultDate.getDate() + duration);
    } else if (calculatorData.frequency === "weeks") {
      resultDate.setDate(resultDate.getDate() + (duration * 7));
    } else if (calculatorData.frequency === "months") {
      resultDate.setMonth(resultDate.getMonth() + duration);
    }
    
    // Format as MM-DD-YYYY
    const month = String(resultDate.getMonth() + 1).padStart(2, '0');
    const day = String(resultDate.getDate()).padStart(2, '0');
    const year = resultDate.getFullYear();
    const formattedDate = `${month}-${day}-${year}`;
    
    setCalculatorData(prev => ({ 
      ...prev, 
      outputDate: formattedDate 
    }));
  };

  const calculateBackwardDate = () => {
    if (!calculatorData.date || !calculatorData.duration) return;
    
    const startDate = new Date(calculatorData.date);
    if (isNaN(startDate.getTime())) return;
    
    const duration = parseFloat(calculatorData.duration);
    if (isNaN(duration)) return;
    
    const resultDate = new Date(startDate);
    
    // Subtract duration based on frequency
    if (calculatorData.frequency === "days") {
      resultDate.setDate(resultDate.getDate() - duration);
    } else if (calculatorData.frequency === "weeks") {
      resultDate.setDate(resultDate.getDate() - (duration * 7));
    } else if (calculatorData.frequency === "months") {
      resultDate.setMonth(resultDate.getMonth() - duration);
    }
    
    // Format as MM-DD-YYYY
    const month = String(resultDate.getMonth() + 1).padStart(2, '0');
    const day = String(resultDate.getDate()).padStart(2, '0');
    const year = resultDate.getFullYear();
    const formattedDate = `${month}-${day}-${year}`;
    
    setCalculatorData(prev => ({ 
      ...prev, 
      outputDate: formattedDate 
    }));
  };

  const clearCalculator = () => {
    setCalculatorData({
      date: "",
      duration: "",
      frequency: "days",
      outputDate: ""
    });
  };

  // Duration to Months Converter functions
  const calculateDurationToMonths = () => {
    if (!durationConverterData.duration) return;
    
    const duration = parseFloat(durationConverterData.duration);
    if (isNaN(duration)) return;
    
    let months = 0;
    
    if (durationConverterData.frequency === "days") {
      months = duration / 30;
    } else if (durationConverterData.frequency === "weeks") {
      months = duration / 4;
    }
    
    setDurationConverterData(prev => ({
      ...prev,
      outputMonths: months.toFixed(2)
    }));
  };

  const clearDurationConverter = () => {
    setDurationConverterData({
      duration: "",
      frequency: "days",
      outputMonths: ""
    });
  };

  // Enhanced Date Calculator functions
  const calculateEnhancedForwardDate = () => {
    if (!enhancedCalculatorData.date || !enhancedCalculatorData.duration) return;
    
    const startDate = new Date(enhancedCalculatorData.date);
    if (isNaN(startDate.getTime())) return;
    
    const duration = parseFloat(enhancedCalculatorData.duration);
    if (isNaN(duration)) return;
    
    const resultDate = new Date(startDate);
    
    // Add duration based on frequency
    if (enhancedCalculatorData.frequency === "days") {
      resultDate.setDate(resultDate.getDate() + duration);
    } else if (enhancedCalculatorData.frequency === "weeks") {
      resultDate.setDate(resultDate.getDate() + (duration * 7));
    } else if (enhancedCalculatorData.frequency === "months") {
      resultDate.setMonth(resultDate.getMonth() + duration);
    }
    
    // Format as MM-DD-YYYY
    const month = String(resultDate.getMonth() + 1).padStart(2, '0');
    const day = String(resultDate.getDate()).padStart(2, '0');
    const year = resultDate.getFullYear();
    const formattedDate = `${month}-${day}-${year}`;
    
    setEnhancedCalculatorData(prev => ({ 
      ...prev, 
      outputDate: formattedDate 
    }));
  };

  const calculateEnhancedBackwardDate = () => {
    if (!enhancedCalculatorData.date || !enhancedCalculatorData.duration) return;
    
    const startDate = new Date(enhancedCalculatorData.date);
    if (isNaN(startDate.getTime())) return;
    
    const duration = parseFloat(enhancedCalculatorData.duration);
    if (isNaN(duration)) return;
    
    const resultDate = new Date(startDate);
    
    // Subtract duration based on frequency
    if (enhancedCalculatorData.frequency === "days") {
      resultDate.setDate(resultDate.getDate() - duration);
    } else if (enhancedCalculatorData.frequency === "weeks") {
      resultDate.setDate(resultDate.getDate() - (duration * 7));
    } else if (enhancedCalculatorData.frequency === "months") {
      resultDate.setMonth(resultDate.getMonth() - duration);
    }
    
    // Format as MM-DD-YYYY
    const month = String(resultDate.getMonth() + 1).padStart(2, '0');
    const day = String(resultDate.getDate()).padStart(2, '0');
    const year = resultDate.getFullYear();
    const formattedDate = `${month}-${day}-${year}`;
    
    setEnhancedCalculatorData(prev => ({ 
      ...prev, 
      outputDate: formattedDate 
    }));
  };

  const clearEnhancedCalculator = () => {
    setEnhancedCalculatorData({
      date: "",
      duration: "",
      frequency: "months",
      outputDate: ""
    });
  };

  // Create a state structure for the table data
  const getTableValue = (row: string, col: string) => {
    const key = `${row.toLowerCase()}_${col.replace(/\s+/g, "_").toLowerCase()}`;
    return (form as any)[key] || "";
  };

  const updateTableValue = (row: string, col: string, value: string) => {
    const key = `${row.toLowerCase()}_${col.replace(/\s+/g, "_").toLowerCase()}`;
    updateField("step5_4", key as any, value);
    
    // Trigger auto-calculations after updating the value
    performAutoCalculations(row, col, value);
  };

  // Columns for the top table
  const columns = [
    "Start Date",
    "Inclusion Period",
    "Enrollment Closed Date",
    "Primary Outcome Duration",
    "Trial End Date",
    "Result Duration",
    "Result Published Date",
  ];

  // Rows (labels at the start)
  const rows = ["Actual", "Benchmark", "Estimated"];

  // Registry type options
  const registryTypes = [
    "ClinicalTrials.gov",
    "EU Clinical Trials Database",
    "WHO ICTRP",
    "ISRCTN",
    "JPRN",
    "ANZCTR",
    "CTRI",
    "DRKS",
    "Other"
  ];

  // Helper functions for references
  const handleAddReference = () => addReference("step5_4", "references");
  const handleRemoveReference = (index: number) => removeReference("step5_4", "references", index);
  const handleUpdateReference = (index: number, field: string, value: any) => {
    updateReference("step5_4", "references", index, { [field]: value });
  };

  // Handle file upload for attachments
  const handleFileUpload = (index: number, files: FileList | null) => {
    if (files) {
      const fileData = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file), // Create a local URL for preview
        lastModified: file.lastModified
      }));
      
      const currentAttachments = form.references[index]?.attachments || [];
      handleUpdateReference(index, "attachments", [...currentAttachments, ...fileData]);
      
      toast({
        title: "Files uploaded",
        description: `${files.length} file(s) uploaded successfully`,
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const result = await saveTrial();
      
      if (result.success) {
        // Get the first trial identifier for the success message
        // Use the generated trial identifier from the response
        const trialId = result.trialIdentifier || "Trial";
        
        toast({
          title: "Success",
          description: `A trial with ID of ${trialId} is created`,
          duration: 5000,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save trial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <FormProgress currentStep={4} />

      {/* Header Buttons */}
      <div className="flex justify-end w-full gap-3">
        <Button variant="outline" asChild>
          <Link href="/admin/therapeutics">Cancel</Link>
        </Button>
        <Button 
          className="text-white font-medium px-6 py-2"
          style={{ backgroundColor: "#204B73" }}
          onClick={handleSaveChanges}
          disabled={isSaving}
        >
          {isSaving ? "Creating..." : "Create a Record"}
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-8">
          {/* Top Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Timing</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCalculator(!showCalculator)}
                className="flex items-center gap-2"
              >
                <Calculator className="h-4 w-4" />
                {showCalculator ? "Hide Calculator" : "Show Calculator"}
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2"></th>
                    {columns.map((col) => (
                      <th key={col} className="text-left p-2 text-sm font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row}>
                      <td className="p-2 font-medium">{row}</td>
                      {columns.map((col, i) => (
                        <td key={i} className="p-2">
                          {col.includes("Date") ? (
                            <CustomDateInput
                              value={getTableValue(row, col)}
                              onChange={(value) => updateTableValue(row, col, value)}
                              placeholder="Month Day Year"
                              className="w-full border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                            />
                          ) : (
                            <Input
                              type="text"
                              className="w-full border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                              value={getTableValue(row, col)}
                              onChange={(e) => updateTableValue(row, col, e.target.value)}
                            />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

          {/* Overall Duration Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap">
                Overall duration to Complete
              </Label>
              <Input
                type="number"
                className="w-24 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                placeholder="Months"
                value={form.estimated_enrollment || ""}
                onChange={(e) =>
                  updateField("step5_4", "estimated_enrollment", e.target.value)
                }
              />
              <span className="text-sm text-gray-500">(months)</span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="whitespace-nowrap">
                Overall duration to publish result
              </Label>
              <Input
                type="number"
                className="w-24 border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                placeholder="Months"
                value={form.actual_enrollment || ""}
                onChange={(e) =>
                  updateField("step5_4", "actual_enrollment", e.target.value)
                }
              />
              <span className="text-sm text-gray-500">(months)</span>
            </div>
          </div>

          {/* Date Calculator */}
          {showCalculator && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-blue-800">Date Calculator</h4>
                </div>
                
                <div className="space-y-6">
                  {/* Calculator Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    {/* Date Input */}
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <CustomDateInput
                        value={calculatorData.date}
                        onChange={(value) => setCalculatorData(prev => ({ ...prev, date: value }))}
                        placeholder="Select date"
                        className="w-full"
                      />
                    </div>

                    {/* Duration Input */}
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input
                        type="number"
                        value={calculatorData.duration}
                        onChange={(e) => setCalculatorData(prev => ({ ...prev, duration: e.target.value }))}
                        placeholder="Enter duration"
                        className="w-full"
                      />
                    </div>

                    {/* Frequency Select */}
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select
                        value={calculatorData.frequency}
                        onValueChange={(value) => setCalculatorData(prev => ({ ...prev, frequency: value }))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Output Date */}
                    <div className="space-y-2">
                      <Label>Output Date</Label>
                      <Input
                        value={calculatorData.outputDate}
                        readOnly
                        className="w-full bg-gray-100"
                        placeholder="Calculated date"
                      />
                    </div>
                  </div>

                  {/* Calculation Buttons */}
                  <div className="flex gap-4 justify-center">
                    <Button
                      type="button"
                      onClick={calculateBackwardDate}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700"
                      disabled={!calculatorData.date || !calculatorData.duration}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      BW Calculate
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={calculateForwardDate}
                      className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700"
                      disabled={!calculatorData.date || !calculatorData.duration}
                    >
                      <ArrowRight className="h-4 w-4" />
                      FW Calculate
                    </Button>
                  </div>

                  {/* Clear Button */}
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearCalculator}
                      className="flex items-center gap-2"
                    >
                      <X className="h-4 w-4" />
                      Clear All
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Duration to Months Converter */}
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-5 w-5 text-green-600" />
                <h4 className="text-lg font-semibold text-green-800">Duration to Months Converter</h4>
              </div>
              
              <div className="space-y-4">
                {/* Converter Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  {/* Duration Input */}
                  <div className="space-y-2">
                    <Label>Enter Duration</Label>
                    <Input
                      type="number"
                      value={durationConverterData.duration}
                      onChange={(e) => setDurationConverterData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="Enter duration"
                      className="w-full"
                    />
                  </div>

                  {/* Frequency Select */}
                  <div className="space-y-2">
                    <Label>Select Frequency</Label>
                    <Select
                      value={durationConverterData.frequency}
                      onValueChange={(value) => setDurationConverterData(prev => ({ ...prev, frequency: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Output Months */}
                  <div className="space-y-2">
                    <Label>Output (in Months)</Label>
                    <Input
                      value={durationConverterData.outputMonths}
                      readOnly
                      className="w-full bg-gray-100"
                      placeholder="Calculated months"
                    />
                  </div>
                </div>

                {/* Calculate Button */}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    onClick={calculateDurationToMonths}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                    disabled={!durationConverterData.duration}
                  >
                    <ArrowRight className="h-4 w-4" />
                    Calculate
                  </Button>
                </div>

                {/* Clear Button */}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearDurationConverter}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Forward/Backward Date Calculator */}
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-5 w-5 text-purple-600" />
                <h4 className="text-lg font-semibold text-purple-800">Enhanced Forward/Backward Date Calculator</h4>
              </div>
              
              <div className="space-y-4">
                {/* Enhanced Calculator Input Fields */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  {/* Date Input */}
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <CustomDateInput
                      value={enhancedCalculatorData.date}
                      onChange={(value) => setEnhancedCalculatorData(prev => ({ ...prev, date: value }))}
                      placeholder="Select date"
                      className="w-full"
                    />
                  </div>

                  {/* Duration Input */}
                  <div className="space-y-2">
                    <Label>Duration (in months)</Label>
                    <Input
                      type="number"
                      value={enhancedCalculatorData.duration}
                      onChange={(e) => setEnhancedCalculatorData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="Enter duration"
                      className="w-full"
                    />
                  </div>

                  {/* Frequency Select */}
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select
                      value={enhancedCalculatorData.frequency}
                      onValueChange={(value) => setEnhancedCalculatorData(prev => ({ ...prev, frequency: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Days</SelectItem>
                        <SelectItem value="weeks">Weeks</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Output Date */}
                  <div className="space-y-2">
                    <Label>Output Date</Label>
                    <Input
                      value={enhancedCalculatorData.outputDate}
                      readOnly
                      className="w-full bg-gray-100"
                      placeholder="Calculated date"
                    />
                  </div>
                </div>

                {/* Calculation Buttons */}
                <div className="flex gap-4 justify-center">
                  <Button
                    type="button"
                    onClick={calculateEnhancedBackwardDate}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                    disabled={!enhancedCalculatorData.date || !enhancedCalculatorData.duration}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    BW Calculate
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={calculateEnhancedForwardDate}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2"
                    disabled={!enhancedCalculatorData.date || !enhancedCalculatorData.duration}
                  >
                    <ArrowRight className="h-4 w-4" />
                    FW Calculate
                  </Button>
                </div>

                {/* Clear Button */}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearEnhancedCalculator}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* References */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">References</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddReference}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Reference
              </Button>
            </div>
            
            <div className="space-y-6">
              {form.references.map((reference, index) => (
                <Card key={reference.id} className="border border-gray-200">
                  <CardContent className="p-6 space-y-4">
                    {/* Reference Header */}
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">Reference {index + 1}</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateReference(index, "isVisible", !reference.isVisible)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {reference.isVisible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        {form.references.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveReference(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Reference Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Date */}
                      <div className="space-y-2">
                        <Label htmlFor={`ref-date-${index}`}>Date</Label>
                        <CustomDateInput
                          value={reference.date}
                          onChange={(value) => handleUpdateReference(index, "date", value)}
                          placeholder="Select date"
                          className="w-full"
                        />
                      </div>

                      {/* Registry Type */}
                      <div className="space-y-2">
                        <Label htmlFor={`ref-registry-${index}`}>Registry Type</Label>
                        <Select
                          value={reference.registryType}
                          onValueChange={(value) => handleUpdateReference(index, "registryType", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select registry type" />
                          </SelectTrigger>
                          <SelectContent>
                            {registryTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <Label htmlFor={`ref-content-${index}`}>Content</Label>
                      <Textarea
                        id={`ref-content-${index}`}
                        rows={4}
                        placeholder="Enter reference content here..."
                        value={reference.content}
                        onChange={(e) => handleUpdateReference(index, "content", e.target.value)}
                        className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                      />
                    </div>

                    {/* View Source URL */}
                    <div className="space-y-2">
                      <Label htmlFor={`ref-source-${index}`}>View Source (URL)</Label>
                      <Input
                        id={`ref-source-${index}`}
                        type="url"
                        placeholder="https://example.com"
                        value={reference.viewSource}
                        onChange={(e) => handleUpdateReference(index, "viewSource", e.target.value)}
                        className="w-full border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                      />
                    </div>

                    {/* Attachments */}
                    <div className="space-y-2">
                      <Label htmlFor={`ref-attachments-${index}`}>Attachments</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id={`ref-attachments-${index}`}
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx,.txt"
                          onChange={(e) => handleFileUpload(index, e.target.files)}
                          className="flex-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload
                        </Button>
                      </div>
                      
                      {/* Display uploaded files */}
                      {reference.attachments && reference.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {reference.attachments.map((attachment, attIndex) => {
                            // Handle both old format (string) and new format (object)
                            const fileName = typeof attachment === 'string' ? attachment : (attachment as any).name;
                            const fileUrl = typeof attachment === 'object' ? (attachment as any).url : null;
                            const isImage = fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i);
                            
                            return (
                              <div key={attIndex} className="flex items-center gap-2 text-sm text-gray-600 p-2 bg-gray-50 rounded border">
                                {isImage ? (
                                  <Image className="h-4 w-4 text-blue-600" />
                                ) : (
                                  <FileText className="h-4 w-4 text-gray-600" />
                                )}
                                <span className="flex-1">{fileName}</span>
                                {fileUrl && isImage && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      // Open image in new tab for preview
                                      window.open(fileUrl, '_blank');
                                    }}
                                    className="text-blue-600 hover:text-blue-800 p-0 h-auto"
                                  >
                                    Preview
                                  </Button>
                                )}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const updatedAttachments = reference.attachments.filter((_, i) => i !== attIndex);
                                    handleUpdateReference(index, "attachments", updatedAttachments);
                                  }}
                                  className="text-red-500 hover:text-red-700 p-0 h-auto"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Preview Section */}
                    {(reference.content || (reference.attachments && reference.attachments.length > 0)) && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Preview</Label>
                        <div className="prose prose-sm max-w-none">
                          {/* Content Preview */}
                          {reference.content && (
                            <p className="text-gray-800 whitespace-pre-wrap">{reference.content}</p>
                          )}
                          
                          {/* Attachments Preview */}
                          {reference.attachments && reference.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {reference.attachments.map((attachment, attIndex) => {
                                // Handle both old format (string) and new format (object)
                                const fileName = typeof attachment === 'string' ? attachment : (attachment as any).name;
                                const fileUrl = typeof attachment === 'object' ? (attachment as any).url : null;
                                const isImage = fileName.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i);
                                
                                if (isImage && fileUrl) {
                                  // For images with URL, show actual preview
                                  return (
                                    <div key={attIndex} className="border border-gray-200 rounded-lg p-2 bg-white">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Image className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-gray-700">{fileName}</span>
                                      </div>
                                      <div className="relative">
                                        <img
                                          src={fileUrl}
                                          alt={fileName}
                                          className="w-full max-w-md h-auto rounded border border-gray-200"
                                          onError={(e) => {
                                            // Fallback if image fails to load
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const fallback = target.nextElementSibling as HTMLElement;
                                            if (fallback) fallback.style.display = 'block';
                                          }}
                                        />
                                        <div className="hidden text-center py-4 bg-gray-100 rounded border-2 border-dashed border-gray-300">
                                          <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                          <p className="text-sm text-gray-500">
                                            Image preview failed to load
                                          </p>
                                          <p className="text-xs text-gray-400 mt-1">
                                            {fileName}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                } else if (isImage) {
                                  // For images without URL (old format), show placeholder
                                  return (
                                    <div key={attIndex} className="border border-gray-200 rounded-lg p-2 bg-white">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Image className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm font-medium text-gray-700">{fileName}</span>
                                      </div>
                                      <div className="text-center py-4 bg-gray-100 rounded border-2 border-dashed border-gray-300">
                                        <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                                        <p className="text-sm text-gray-500">
                                          Image preview not available
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                          {fileName}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                } else {
                                  // For non-image files, show file info
                                  return (
                                    <div key={attIndex} className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded">
                                      <FileText className="h-4 w-4 text-gray-600" />
                                      <span className="text-sm text-gray-700">{fileName}</span>
                                      {fileUrl && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="text-blue-600 hover:text-blue-800 p-0 h-auto ml-auto"
                                          onClick={() => {
                                            window.open(fileUrl, '_blank');
                                          }}
                                        >
                                          Open
                                        </Button>
                                      )}
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          )}
                          
                          {/* View Source Link */}
                          {reference.viewSource && (
                            <div className="mt-3">
                              <a
                                href={reference.viewSource}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline text-sm"
                              >
                                View Source →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href="/admin/therapeutics/new/5-3">Previous</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/therapeutics/new/5-5">Next</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
