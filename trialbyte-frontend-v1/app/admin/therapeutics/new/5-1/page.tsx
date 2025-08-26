"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";

export default function TherapeuticsStep5_1() {
  const {
    formData,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
  } = useTherapeuticForm();
  const form = formData.step5_1;

  // Helpers for multi-input fields
  const addTrialIdentifierField = () =>
    addArrayItem("step5_1", "trial_identifier");
  const removeTrialIdentifier = (index: number) =>
    removeArrayItem("step5_1", "trial_identifier", index);
  const updateTrialIdentifier = (index: number, value: string) =>
    updateArrayItem("step5_1", "trial_identifier", index, value);

  const addReferenceLinkField = () =>
    addArrayItem("step5_1", "reference_links");
  const removeReferenceLink = (index: number) =>
    removeArrayItem("step5_1", "reference_links", index);
  const updateReferenceLink = (index: number, value: string) =>
    updateArrayItem("step5_1", "reference_links", index, value);

  return (
    <div className="space-y-4">
      <FormProgress currentStep={1} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">5.1 — Trial Overview</h1>
        <div className="flex gap-2">
          <Button variant="ghost" asChild>
            <Link href="/admin/therapeutics">Cancel</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/therapeutics/new/5-2">Next</Link>
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Trial overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Row 1: therapeutic area / trial identifier / phase */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Therapeutic Area</Label>
              <Select
                value={form.therapeutic_area}
                onValueChange={(v) =>
                  updateField("step5_1", "therapeutic_area", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select therapeutic area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oncology">Oncology</SelectItem>
                  <SelectItem value="Cardiology">Cardiology</SelectItem>
                  <SelectItem value="Neurology">Neurology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trial Identifier</Label>
              <div className="space-y-2">
                {form.trial_identifier.map((val, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={val}
                      onChange={(e) =>
                        updateTrialIdentifier(idx, e.target.value)
                      }
                      placeholder="#807996"
                    />
                    {idx === 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addTrialIdentifierField}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeTrialIdentifier(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Trial Phase</Label>
              <Select
                value={form.trial_phase}
                onValueChange={(v) => updateField("step5_1", "trial_phase", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="I">Phase I</SelectItem>
                  <SelectItem value="II">Phase II</SelectItem>
                  <SelectItem value="III">Phase III</SelectItem>
                  <SelectItem value="IV">Phase IV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: status / primary drugs / other drugs */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => updateField("step5_1", "status", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planned">Planned</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Primary Drugs</Label>
              <Select
                value={form.primary_drugs}
                onValueChange={(v) =>
                  updateField("step5_1", "primary_drugs", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select primary drug" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Drug A">Drug A</SelectItem>
                  <SelectItem value="Drug B">Drug B</SelectItem>
                  <SelectItem value="Drug C">Drug C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Other Drugs</Label>
              <Select
                value={form.other_drugs}
                onValueChange={(v) => updateField("step5_1", "other_drugs", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select other drug" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Drug X">Drug X</SelectItem>
                  <SelectItem value="Drug Y">Drug Y</SelectItem>
                  <SelectItem value="Drug Z">Drug Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={form.title}
              onChange={(e) => updateField("step5_1", "title", e.target.value)}
            />
          </div>

          {/* Row 3: disease type / patient segment / line of therapy */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Disease Type</Label>
              <Select
                value={form.disease_type}
                onValueChange={(v) => updateField("step5_1", "disease_type", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select disease type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lung Cancer">Lung Cancer</SelectItem>
                  <SelectItem value="Breast Cancer">Breast Cancer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Patient Segment</Label>
              <Select
                value={form.patient_segment}
                onValueChange={(v) =>
                  updateField("step5_1", "patient_segment", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Adult">Adult</SelectItem>
                  <SelectItem value="Pediatric">Pediatric</SelectItem>
                  <SelectItem value="Elderly">Elderly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Line Of Therapy</Label>
              <Select
                value={form.line_of_therapy}
                onValueChange={(v) =>
                  updateField("step5_1", "line_of_therapy", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select line of therapy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="First Line">First Line</SelectItem>
                  <SelectItem value="Second Line">Second Line</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: reference links / trial tags */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label>Reference Links</Label>
              <div className="space-y-2">
                {form.reference_links.map((val, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Input
                      value={val}
                      onChange={(e) => updateReferenceLink(idx, e.target.value)}
                      placeholder="https://..."
                    />
                    {idx === 0 ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addReferenceLinkField}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeReferenceLink(idx)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Trial Tags</Label>
              <Select
                value={form.trial_tags}
                onValueChange={(v) => updateField("step5_1", "trial_tags", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trial tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Immunotherapy">Immunotherapy</SelectItem>
                  <SelectItem value="Targeted">Targeted</SelectItem>
                  <SelectItem value="Chemotherapy">Chemotherapy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 5: sponsor fields */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Sponsor & Collaborators</Label>
              <Select
                value={form.sponsor_collaborators}
                onValueChange={(v) =>
                  updateField("step5_1", "sponsor_collaborators", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sponsor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pfizer">Pfizer</SelectItem>
                  <SelectItem value="Novartis">Novartis</SelectItem>
                  <SelectItem value="AstraZeneca">AstraZeneca</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sponsor Field of Activity</Label>
              <Select
                value={form.sponsor_field_activity}
                onValueChange={(v) =>
                  updateField("step5_1", "sponsor_field_activity", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pharma">Pharma</SelectItem>
                  <SelectItem value="Biotech">Biotech</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Associated CRO</Label>
              <Select
                value={form.associated_cro}
                onValueChange={(v) =>
                  updateField("step5_1", "associated_cro", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select CRO" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IQVIA">IQVIA</SelectItem>
                  <SelectItem value="Syneos">Syneos</SelectItem>
                  <SelectItem value="PPD">PPD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 6: countries / region / record status */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Countries</Label>
              <Select
                value={form.countries}
                onValueChange={(v) => updateField("step5_1", "countries", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Select
                value={form.region}
                onValueChange={(v) => updateField("step5_1", "region", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="West Coast">West Coast</SelectItem>
                  <SelectItem value="East Coast">East Coast</SelectItem>
                  <SelectItem value="EMEA">EMEA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trial Record Status</Label>
              <Select
                value={form.trial_record_status}
                onValueChange={(v) =>
                  updateField("step5_1", "trial_record_status", v)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button asChild>
              <Link href="/admin/therapeutics/new/5-2">Next</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
