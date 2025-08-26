"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDrugForm } from "../context/drug-form-context";
import DrugFormProgress from "../components/drug-form-progress";

export default function DrugsNewDevStatus() {
  const { formData, updateField } = useDrugForm();
  const form = formData.devStatus;

  return (
    <div className="space-y-4">
      <DrugFormProgress currentStep={2} />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Drugs — Development Status</h1>
        <Button asChild>
          <Link href="/admin/drugs/new/drug-activity">Next</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Development Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Disease Type</Label>
              <Select
                value={form.disease_type}
                onValueChange={(value) =>
                  updateField("devStatus", "disease_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select disease type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oncology">Oncology</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="pain-management">
                    Pain Management
                  </SelectItem>
                  <SelectItem value="autoimmune">Autoimmune</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Therapeutic Class</Label>
              <Select
                value={form.therapeutic_class}
                onValueChange={(value) =>
                  updateField("devStatus", "therapeutic_class", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select therapeutic class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nsaid">NSAID</SelectItem>
                  <SelectItem value="antibiotic">Antibiotic</SelectItem>
                  <SelectItem value="antiviral">Antiviral</SelectItem>
                  <SelectItem value="antineoplastic">Antineoplastic</SelectItem>
                  <SelectItem value="immunosuppressant">
                    Immunosuppressant
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                placeholder="Enter company name"
                value={form.company}
                onChange={(e) =>
                  updateField("devStatus", "company", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Company Type</Label>
              <Select
                value={form.company_type}
                onValueChange={(value) =>
                  updateField("devStatus", "company_type", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sponsor">Sponsor</SelectItem>
                  <SelectItem value="manufacturer">Manufacturer</SelectItem>
                  <SelectItem value="distributor">Distributor</SelectItem>
                  <SelectItem value="licensee">Licensee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) =>
                updateField("devStatus", "status", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" asChild>
              <Link href="/admin/drugs/new/overview">Previous</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/drugs/new/drug-activity">Next</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

