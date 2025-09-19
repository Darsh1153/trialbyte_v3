"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function TherapeuticsStep5_4() {
  const { formData, updateField, saveTrial } = useTherapeuticForm();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const form = formData.step5_4;

  // Create a state structure for the table data
  const getTableValue = (row: string, col: string) => {
    const key = `${row.toLowerCase()}_${col.replace(/\s+/g, "_").toLowerCase()}`;
    return (form as any)[key] || "";
  };

  const updateTableValue = (row: string, col: string, value: string) => {
    const key = `${row.toLowerCase()}_${col.replace(/\s+/g, "_").toLowerCase()}`;
    updateField("step5_4", key as any, value);
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

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const result = await saveTrial();
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
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
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-8">
          {/* Top Table */}
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
                        <Input
                          type={col.includes("Date") ? "date" : "text"}
                          className="w-full border-gray-600 focus:border-gray-800 focus:ring-gray-800"
                          value={getTableValue(row, col)}
                          onChange={(e) => updateTableValue(row, col, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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

          {/* Reference */}
          <div className="space-y-2">
            <Label>Reference</Label>
            <div className="relative">
              <Textarea
                rows={3}
                placeholder="Enter references here..."
                value={form.population_description || ""}
                onChange={(e) =>
                  updateField("step5_4", "population_description", e.target.value)
                }
                className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
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
