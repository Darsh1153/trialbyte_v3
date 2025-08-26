"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";

export default function TherapeuticsStep5_6() {
  const {
    formData,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
  } = useTherapeuticForm();
  const form = formData.step5_6;

  const addInterimAnalysisDate = () =>
    addArrayItem("step5_6", "interim_analysis_dates");
  const removeInterimAnalysisDate = (index: number) =>
    removeArrayItem("step5_6", "interim_analysis_dates", index);
  const updateInterimAnalysisDate = (index: number, value: string) =>
    updateArrayItem("step5_6", "interim_analysis_dates", index, value);

  return (
    <div className="space-y-4">
      <FormProgress currentStep={6} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">5.6 — Timeline & Milestones</h1>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link href="/admin/therapeutics/new/5-5">Previous</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/therapeutics/new/5-7">Next</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Timeline & Milestones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Study Start Date */}
          <div className="space-y-2">
            <Label>Study Start Date</Label>
            <Input
              type="date"
              value={form.study_start_date}
              onChange={(e) =>
                updateField("step5_6", "study_start_date", e.target.value)
              }
            />
          </div>

          {/* Patient Enrollment Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>First Patient In</Label>
              <Input
                type="date"
                value={form.first_patient_in}
                onChange={(e) =>
                  updateField("step5_6", "first_patient_in", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Last Patient In</Label>
              <Input
                type="date"
                value={form.last_patient_in}
                onChange={(e) =>
                  updateField("step5_6", "last_patient_in", e.target.value)
                }
              />
            </div>
          </div>

          {/* Study End Date */}
          <div className="space-y-2">
            <Label>Study End Date</Label>
            <Input
              type="date"
              value={form.study_end_date}
              onChange={(e) =>
                updateField("step5_6", "study_end_date", e.target.value)
              }
            />
          </div>

          {/* Interim Analysis Dates */}
          <div className="space-y-2">
            <Label>Interim Analysis Dates</Label>
            <div className="space-y-2">
              {form.interim_analysis_dates.map((date, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) =>
                      updateInterimAnalysisDate(idx, e.target.value)
                    }
                  />
                  {idx === 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addInterimAnalysisDate}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeInterimAnalysisDate(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Final Analysis Date</Label>
              <Input
                type="date"
                value={form.final_analysis_date}
                onChange={(e) =>
                  updateField("step5_6", "final_analysis_date", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Regulatory Submission Date</Label>
              <Input
                type="date"
                value={form.regulatory_submission_date}
                onChange={(e) =>
                  updateField(
                    "step5_6",
                    "regulatory_submission_date",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href="/admin/therapeutics/new/5-5">Previous</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/therapeutics/new/5-7">Next</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
