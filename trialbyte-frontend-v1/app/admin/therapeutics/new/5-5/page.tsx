"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useTherapeuticForm } from "../context/therapeutic-form-context";
import FormProgress from "../components/form-progress";

export default function TherapeuticsStep5_5() {
  const {
    formData,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
  } = useTherapeuticForm();
  const form = formData.step5_5;

  const addStudySite = () => addArrayItem("step5_5", "study_sites");
  const removeStudySite = (index: number) =>
    removeArrayItem("step5_5", "study_sites", index);
  const updateStudySite = (index: number, value: string) =>
    updateArrayItem("step5_5", "study_sites", index, value);

  const addPrincipalInvestigator = () =>
    addArrayItem("step5_5", "principal_investigators");
  const removePrincipalInvestigator = (index: number) =>
    removeArrayItem("step5_5", "principal_investigators", index);
  const updatePrincipalInvestigator = (index: number, value: string) =>
    updateArrayItem("step5_5", "principal_investigators", index, value);

  const addSiteCountry = () => addArrayItem("step5_5", "site_countries");
  const removeSiteCountry = (index: number) =>
    removeArrayItem("step5_5", "site_countries", index);
  const updateSiteCountry = (index: number, value: string) =>
    updateArrayItem("step5_5", "site_countries", index, value);

  const addSiteRegion = () => addArrayItem("step5_5", "site_regions");
  const removeSiteRegion = (index: number) =>
    removeArrayItem("step5_5", "site_regions", index);
  const updateSiteRegion = (index: number, value: string) =>
    updateArrayItem("step5_5", "site_regions", index, value);

  const addSiteContactInfo = () => addArrayItem("step5_5", "site_contact_info");
  const removeSiteContactInfo = (index: number) =>
    removeArrayItem("step5_5", "site_contact_info", index);
  const updateSiteContactInfo = (index: number, value: string) =>
    updateArrayItem("step5_5", "site_contact_info", index, value);

  return (
    <div className="space-y-4">
      <FormProgress currentStep={5} />

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
          {/* Study Sites */}
          <div className="space-y-2">
            <Label>Study Sites</Label>
            <div className="space-y-2">
              {form.study_sites.map((site, idx) => (
                <div key={idx} className="flex gap-2">
                  <Textarea
                    placeholder="e.g., Memorial Sloan Kettering Cancer Center"
                    value={site}
                    onChange={(e) => updateStudySite(idx, e.target.value)}
                    rows={2}
                  />
                  {idx === 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addStudySite}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeStudySite(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Principal Investigators */}
          <div className="space-y-2">
            <Label>Principal Investigators</Label>
            <div className="space-y-2">
              {form.principal_investigators.map((investigator, idx) => (
                <div key={idx} className="flex gap-2">
                  <Textarea
                    placeholder="e.g., Dr. John Smith, MD"
                    value={investigator}
                    onChange={(e) =>
                      updatePrincipalInvestigator(idx, e.target.value)
                    }
                    rows={2}
                  />
                  {idx === 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addPrincipalInvestigator}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removePrincipalInvestigator(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Site Status */}
          <div className="space-y-2">
            <Label>Site Status</Label>
            <Textarea
              placeholder="e.g., Active, Recruiting, Completed"
              value={form.site_status}
              onChange={(e) =>
                updateField("step5_5", "site_status", e.target.value)
              }
              rows={2}
            />
          </div>

          {/* Site Countries */}
          <div className="space-y-2">
            <Label>Site Countries</Label>
            <div className="space-y-2">
              {form.site_countries.map((country, idx) => (
                <div key={idx} className="flex gap-2">
                  <Textarea
                    placeholder="e.g., United States"
                    value={country}
                    onChange={(e) => updateSiteCountry(idx, e.target.value)}
                    rows={2}
                  />
                  {idx === 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSiteCountry}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeSiteCountry(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Site Regions */}
          <div className="space-y-2">
            <Label>Site Regions</Label>
            <div className="space-y-2">
              {form.site_regions.map((region, idx) => (
                <div key={idx} className="flex gap-2">
                  <Textarea
                    placeholder="e.g., North America, Europe"
                    value={region}
                    onChange={(e) => updateSiteRegion(idx, e.target.value)}
                    rows={2}
                  />
                  {idx === 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSiteRegion}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeSiteRegion(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Site Contact Information */}
          <div className="space-y-2">
            <Label>Site Contact Information</Label>
            <div className="space-y-2">
              {form.site_contact_info.map((contact, idx) => (
                <div key={idx} className="flex gap-2">
                  <Textarea
                    placeholder="e.g., Phone: +1-555-0123, Email: contact@site.com"
                    value={contact}
                    onChange={(e) => updateSiteContactInfo(idx, e.target.value)}
                    rows={2}
                  />
                  {idx === 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addSiteContactInfo}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeSiteContactInfo(idx)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href="/admin/therapeutics/new/5-4">Previous</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/therapeutics/new/5-6">Next</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
