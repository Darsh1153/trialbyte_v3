"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { therapeuticsApi } from "@/app/lib/api";
import { toast } from "@/hooks/use-toast";

export default function NewTherapeuticPage() {
  const router = useRouter();
  const [isSubmitting, setSubmitting] = useState(false);

  // Restore persisted draft
  useEffect(() => {
    const saved = localStorage.getItem("therapeutic_draft_overview");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const form =
          document.querySelector<HTMLFormElement>("#therapeutic-form");
        if (form) {
          const setIf = (name: string, value?: string) => {
            if (value == null) return;
            const el = form.elements.namedItem(name) as HTMLInputElement | null;
            if (el) el.value = String(value);
          };
          setIf("trialId", data.trialId);
          setIf("area", data.area);
          setIf("disease", data.disease);
          setIf("drug", data.drug);
          setIf("sponsor", data.sponsor);
        }
      } catch {}
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      // collect all steps from localStorage into one draft payload
      const draft = {
        step_5_1: JSON.parse(localStorage.getItem("therapeutic_5_1") || "{}"),
        step_5_2: JSON.parse(localStorage.getItem("therapeutic_5_2") || "{}"),
        step_5_3: JSON.parse(localStorage.getItem("therapeutic_5_3") || "{}"),
        step_5_4: JSON.parse(localStorage.getItem("therapeutic_5_4") || "{}"),
        step_5_5: JSON.parse(localStorage.getItem("therapeutic_5_5") || "{}"),
        step_5_6: JSON.parse(localStorage.getItem("therapeutic_5_6") || "{}"),
        step_5_7: JSON.parse(localStorage.getItem("therapeutic_5_7") || "{}"),
        step_5_8: JSON.parse(localStorage.getItem("therapeutic_5_8") || "{}"),
      };
      await therapeuticsApi.submitDraft(draft);
      toast({
        title: "Submitted",
        description: "Therapeutic saved successfully",
      });
      // clear draft after successful submit
      [1, 2, 3, 4, 5, 6, 7, 8].forEach((n) =>
        localStorage.removeItem(`therapeutic_${n.toString().replace(".", "_")}`)
      );
      router.push("/admin/therapeutics");
    } catch (err) {
      toast({
        title: "Submit failed",
        description: err instanceof Error ? err.message : "Unexpected error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Therapeutic</h1>
        <Button variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            id="therapeutic-form"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            <div>
              <Label htmlFor="trialId">Trial ID</Label>
              <Input
                id="trialId"
                name="trialId"
                placeholder="#123456"
                required
              />
            </div>
            <div>
              <Label htmlFor="area">Therapeutic Area</Label>
              <Input id="area" name="area" placeholder="Oncology" required />
            </div>
            <div>
              <Label htmlFor="disease">Disease Type</Label>
              <Input
                id="disease"
                name="disease"
                placeholder="Lung Cancer"
                required
              />
            </div>
            <div>
              <Label htmlFor="drug">Primary Drug</Label>
              <Input id="drug" name="drug" placeholder="Paclitaxel" required />
            </div>
            <div>
              <Label>Status</Label>
              <Select name="status" defaultValue="Planned">
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
            <div>
              <Label htmlFor="sponsor">Sponsor</Label>
              <Input
                id="sponsor"
                name="sponsor"
                placeholder="Astellas"
                required
              />
            </div>
            <div>
              <Label>Phase</Label>
              <Select name="phase" defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2 mt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Creating..." : "Create Therapeutic"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
