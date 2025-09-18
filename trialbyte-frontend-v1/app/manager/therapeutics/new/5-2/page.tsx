"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";

export default function TherapeuticsStep5_2() {
  const {
    formData,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
  } = useTherapeuticForm();
  const form = formData.step5_2;

  const addPrimaryOutcome = () =>
    addArrayItem("step5_2", "primaryOutcomeMeasures");
  const updatePrimaryOutcome = (index: number, value: string) =>
    updateArrayItem("step5_2", "primaryOutcomeMeasures", index, value);
  const removePrimaryOutcome = (index: number) =>
    removeArrayItem("step5_2", "primaryOutcomeMeasures", index);

  const addOtherOutcome = () => addArrayItem("step5_2", "otherOutcomeMeasures");
  const updateOtherOutcome = (index: number, value: string) =>
    updateArrayItem("step5_2", "otherOutcomeMeasures", index, value);
  const removeOtherOutcome = (index: number) =>
    removeArrayItem("step5_2", "otherOutcomeMeasures", index);

  return (
    <div className="space-y-4">
      <FormProgress currentStep={2} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">5.2 — Trial Purpose & Design</h1>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link href="/admin/therapeutics/new/5-1">Previous</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/therapeutics/new/5-3">Next</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Trial Purpose & Design</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Purpose of Trial */}
          <div className="space-y-2">
            <Label>Purpose of Trial</Label>
            <Textarea
              value={form.purpose_of_trial}
              onChange={(e) =>
                updateField("step5_2", "purpose_of_trial", e.target.value)
              }
              placeholder="Describe the primary purpose of this clinical trial..."
              rows={3}
            />
          </div>

          {/* Summary */}
          <div className="space-y-2">
            <Label>Summary</Label>
            <Textarea
              value={form.summary}
              onChange={(e) =>
                updateField("step5_2", "summary", e.target.value)
              }
              placeholder="Provide a brief summary of the trial..."
              rows={4}
            />
          </div>

          {/* Primary Outcome Measures */}
          <div className="space-y-2">
            <Label>Primary Outcome Measures</Label>
            <div className="space-y-2">
              {form.primaryOutcomeMeasures.map((measure, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={measure}
                    onChange={(e) => updatePrimaryOutcome(idx, e.target.value)}
                    placeholder="e.g., Overall Survival, Progression-Free Survival"
                  />
                  {idx === 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addPrimaryOutcome}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removePrimaryOutcome(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Other Outcome Measures */}
          <div className="space-y-2">
            <Label>Other Outcome Measures</Label>
            <div className="space-y-2">
              {form.otherOutcomeMeasures.map((measure, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={measure}
                    onChange={(e) => updateOtherOutcome(idx, e.target.value)}
                    placeholder="e.g., Quality of Life, Safety Measures"
                  />
                  {idx === 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addOtherOutcome}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeOtherOutcome(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Study Design Keywords */}
          <div className="space-y-2">
            <Label>Study Design Keywords</Label>
            <Input
              value={form.study_design_keywords}
              onChange={(e) =>
                updateField("step5_2", "study_design_keywords", e.target.value)
              }
              placeholder="e.g., Randomized, Double-blind, Placebo-controlled"
            />
          </div>

          {/* Study Design */}
          <div className="space-y-2">
            <Label>Study Design</Label>
            <Textarea
              value={form.study_design}
              onChange={(e) =>
                updateField("step5_2", "study_design", e.target.value)
              }
              placeholder="Describe the study design in detail..."
              rows={3}
            />
          </div>

          {/* Treatment Regimen */}
          <div className="space-y-2">
            <Label>Treatment Regimen</Label>
            <Textarea
              value={form.treatment_regimen}
              onChange={(e) =>
                updateField("step5_2", "treatment_regimen", e.target.value)
              }
              placeholder="Describe the treatment regimen..."
              rows={3}
            />
          </div>

          {/* Number of Arms */}
          <div className="space-y-2">
            <Label>Number of Arms</Label>
            <Input
              type="number"
              value={form.number_of_arms}
              onChange={(e) =>
                updateField("step5_2", "number_of_arms", e.target.value)
              }
              placeholder="e.g., 2"
              min="1"
              className="w-32"
            />
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href="/admin/therapeutics/new/5-1">Previous</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/therapeutics/new/5-3">Next</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


