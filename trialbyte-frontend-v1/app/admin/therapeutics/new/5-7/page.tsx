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

export default function TherapeuticsStep5_7() {
  const {
    formData,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
  } = useTherapeuticForm();
  const form = formData.step5_7;

  const addSecondaryEndpointResult = () =>
    addArrayItem("step5_7", "secondary_endpoint_results");
  const removeSecondaryEndpointResult = (index: number) =>
    removeArrayItem("step5_7", "secondary_endpoint_results", index);
  const updateSecondaryEndpointResult = (index: number, value: string) =>
    updateArrayItem("step5_7", "secondary_endpoint_results", index, value);

  const addAdverseEvent = () => addArrayItem("step5_7", "adverse_events");
  const removeAdverseEvent = (index: number) =>
    removeArrayItem("step5_7", "adverse_events", index);
  const updateAdverseEvent = (index: number, value: string) =>
    updateArrayItem("step5_7", "adverse_events", index, value);

  return (
    <div className="space-y-4">
      <FormProgress currentStep={7} />

      <div className="flex justify-end w-full gap-3">
        <Button
          variant="outline"
          asChild
        >
          <Link href="/admin/therapeutics">Cancel</Link>
        </Button>
        <Button
          className="text-white font-medium px-6 py-2"
          style={{ backgroundColor: '#204B73' }}
        >
          Save Changes
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-6">
          {/* Primary Endpoint Results */}
          <div className="space-y-2">
            <Label>Primary Endpoint Results</Label>
            <Textarea
              rows={4}
              placeholder="Describe the primary endpoint results..."
              value={form.primary_endpoint_results}
              onChange={(e) =>
                updateField(
                  "step5_7",
                  "primary_endpoint_results",
                  e.target.value
                )
              }
            />
          </div>

          {/* Secondary Endpoint Results */}
          <div className="space-y-2">
            <Label>Secondary Endpoint Results</Label>
            <div className="space-y-2">
              {form.secondary_endpoint_results.map((result, idx) => (
                <div key={idx} className="flex gap-2">
                  <Textarea
                    rows={3}
                    placeholder="Describe secondary endpoint result..."
                    value={result}
                    onChange={(e) =>
                      updateSecondaryEndpointResult(idx, e.target.value)
                    }
                  />
                  {idx === 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSecondaryEndpointResult}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeSecondaryEndpointResult(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Safety Results */}
          <div className="space-y-2">
            <Label>Safety Results</Label>
            <Textarea
              rows={4}
              placeholder="Describe safety results and any safety concerns..."
              value={form.safety_results}
              onChange={(e) =>
                updateField("step5_7", "safety_results", e.target.value)
              }
            />
          </div>

          {/* Efficacy Results */}
          <div className="space-y-2">
            <Label>Efficacy Results</Label>
            <Textarea
              rows={4}
              placeholder="Describe efficacy results and treatment effectiveness..."
              value={form.efficacy_results}
              onChange={(e) =>
                updateField("step5_7", "efficacy_results", e.target.value)
              }
            />
          </div>

          {/* Statistical Significance */}
          <div className="space-y-2">
            <Label>Statistical Significance</Label>
            <Input
              placeholder="e.g., p < 0.05, 95% CI, etc."
              value={form.statistical_significance}
              onChange={(e) =>
                updateField(
                  "step5_7",
                  "statistical_significance",
                  e.target.value
                )
              }
            />
          </div>

          {/* Adverse Events */}
          <div className="space-y-2">
            <Label>Adverse Events</Label>
            <div className="space-y-2">
              {form.adverse_events.map((event, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    placeholder="e.g., Nausea, Fatigue, Headache"
                    value={event}
                    onChange={(e) => updateAdverseEvent(idx, e.target.value)}
                  />
                  {idx === 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addAdverseEvent}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeAdverseEvent(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Conclusion */}
          <div className="space-y-2">
            <Label>Conclusion</Label>
            <Textarea
              rows={4}
              placeholder="Provide a summary conclusion of the trial results..."
              value={form.conclusion}
              onChange={(e) =>
                updateField("step5_7", "conclusion", e.target.value)
              }
            />
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href="/admin/therapeutics/new/5-6">Previous</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/therapeutics/new/5-8">Next</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
