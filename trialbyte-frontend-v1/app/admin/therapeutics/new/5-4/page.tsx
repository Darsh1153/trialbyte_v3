"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";

export default function TherapeuticsStep5_4() {
  const { formData, updateField } = useTherapeuticForm();
  const form = formData.step5_4;

  return (
    <div className="space-y-4">
      <FormProgress currentStep={4} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">5.4 — Patient Population</h1>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link href="/admin/therapeutics/new/5-3">Previous</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/therapeutics/new/5-5">Next</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Patient Population</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enrollment Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Estimated Enrollment</Label>
              <Input
                type="number"
                placeholder="e.g., 100"
                value={form.estimated_enrollment}
                onChange={(e) =>
                  updateField("step5_4", "estimated_enrollment", e.target.value)
                }
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label>Actual Enrollment</Label>
              <Input
                type="number"
                placeholder="e.g., 85"
                value={form.actual_enrollment}
                onChange={(e) =>
                  updateField("step5_4", "actual_enrollment", e.target.value)
                }
                min="0"
              />
            </div>
          </div>

          {/* Enrollment Status */}
          <div className="space-y-2">
            <Label>Enrollment Status</Label>
            <Input
              placeholder="e.g., Active, Completed, Suspended"
              value={form.enrollment_status}
              onChange={(e) =>
                updateField("step5_4", "enrollment_status", e.target.value)
              }
            />
          </div>

          {/* Recruitment Period */}
          <div className="space-y-2">
            <Label>Recruitment Period</Label>
            <Input
              type="date"
              value={form.recruitment_period}
              onChange={(e) =>
                updateField("step5_4", "recruitment_period", e.target.value)
              }
            />
          </div>

          {/* Study Dates */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Study Completion Date</Label>
              <Input
                type="date"
                value={form.study_completion_date}
                onChange={(e) =>
                  updateField(
                    "step5_4",
                    "study_completion_date",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Primary Completion Date</Label>
              <Input
                type="date"
                value={form.primary_completion_date}
                onChange={(e) =>
                  updateField(
                    "step5_4",
                    "primary_completion_date",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* Population Description */}
          <div className="space-y-2">
            <Label>Population Description</Label>
            <Textarea
              rows={4}
              placeholder="Describe the patient population characteristics, demographics, and any specific requirements..."
              value={form.population_description}
              onChange={(e) =>
                updateField("step5_4", "population_description", e.target.value)
              }
            />
          </div>

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
