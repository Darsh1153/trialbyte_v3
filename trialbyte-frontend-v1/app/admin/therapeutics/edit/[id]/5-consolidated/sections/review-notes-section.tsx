"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useEditTherapeuticForm } from "../../../context/edit-form-context";
import { formatDateTimeToMMDDYYYY } from "@/lib/date-utils";
import NotesSection from "@/components/notes-section";
import CustomDateInput from "@/components/ui/custom-date-input";
import TrialChangesLog from "@/components/trial-changes-log";

export default function ReviewNotesSection() {
  const {
    formData,
    updateField,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
  } = useEditTherapeuticForm();
  const form = formData.step5_8;

  const calculateNextReviewDate = (): string => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + 90);
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const day = String(futureDate.getDate()).padStart(2, '0');
    const year = futureDate.getFullYear();
    return `${month}-${day}-${year}`;
  };

  const handleFullReviewChange = (checked: boolean) => {
    updateField("step5_8", "fullReview", checked);
    if (checked) {
      updateField("step5_8", "fullReviewUser", "admin");
      updateField("step5_8", "nextReviewDate", calculateNextReviewDate());
    } else {
      updateField("step5_8", "fullReviewUser", "");
      updateField("step5_8", "nextReviewDate", "");
    }
  };

  return (
    <div className="space-y-6">
      {/* Trial Creation & Modification Info */}
      <Card className="border rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700">Trial Creation</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Created Date:</span>
                  <span className="text-gray-600">
                    {form.creationInfo?.createdDate 
                      ? formatDateTimeToMMDDYYYY(form.creationInfo.createdDate)
                      : 'Not available'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Created User:</span>
                  <span className="text-gray-600">{form.creationInfo?.createdUser || 'admin'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-700">Last Modification</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Last Modified Date:</span>
                  <span className="text-gray-600">
                    {form.modificationInfo?.lastModifiedDate 
                      ? formatDateTimeToMMDDYYYY(form.modificationInfo.lastModifiedDate)
                      : 'Not available'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Last Modified User:</span>
                  <span className="text-gray-600">{form.modificationInfo?.lastModifiedUser || 'admin'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Total Modifications:</span>
                  <span className="text-gray-600">{form.modificationInfo?.modificationCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trial Changes Log */}
      <TrialChangesLog changesLog={form.changesLog || []} />

      {/* Internal Note */}
      <Card className="border rounded-xl shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-2">
            <Label className="text-lg font-semibold">Logs</Label>
            <div className="space-y-2">
              <Label htmlFor="internalNote" className="text-sm font-medium text-gray-700">
                Internal Note
              </Label>
              <Textarea
                id="internalNote"
                rows={4}
                placeholder="Enter internal note..."
                value={form.internalNote || ""}
                onChange={(e) => updateField("step5_8", "internalNote", e.target.value)}
                className="border-gray-600 focus:border-gray-800 focus:ring-gray-800"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border rounded-xl shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="fullReview" 
                checked={form.fullReview || false}
                onCheckedChange={handleFullReviewChange}
              />
              <Label htmlFor="fullReview">Full Review</Label>
            </div>
            <div className="space-y-2">
              <Label>Full Review User</Label>
              <Input 
                placeholder="User name" 
                value={form.fullReviewUser || ""}
                onChange={(e) => updateField("step5_8", "fullReviewUser", e.target.value)}
                readOnly={form.fullReview}
                className={`border-gray-600 ${form.fullReview ? 'bg-gray-50' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Next Review Date</Label>
              <CustomDateInput 
                placeholder="Month Day Year"
                value={form.nextReviewDate || ""}
                onChange={(value) => updateField("step5_8", "nextReviewDate", value)}
                readOnly={form.fullReview}
                className={`border-gray-600 ${form.fullReview ? 'bg-gray-50' : ''}`}
              />
            </div>
          </div>

          <NotesSection
            title="Notes & Documentation"
            notes={(form.notes || []).map(note => {
              let content = "";
              if (typeof note.content === 'string') {
                content = note.content;
              } else if (note.content && typeof note.content === 'object') {
                content = note.content.text || note.content.content || JSON.stringify(note.content);
              } else {
                content = String(note.content || "");
              }
              
              return {
                id: note.id,
                date: String(note.date || ""),
                type: String(note.type || "General"),
                content: content,
                sourceLink: String(note.sourceLink || ""),
                sourceType: String(note.sourceType || ""),
                sourceUrl: String(note.sourceUrl || ""),
                attachments: Array.isArray(note.attachments) ? note.attachments : [],
                isVisible: note.isVisible !== false
              };
            })}
            onAddNote={() => {
              const newNote = {
                id: Date.now().toString(),
                date: new Date().toISOString().split("T")[0],
                type: "General",
                content: "",
                sourceLink: "",
                attachments: [],
                isVisible: true
              };
              addArrayItem("step5_8", "notes", newNote);
            }}
            onUpdateNote={(index, updatedNote) => {
              updateArrayItem("step5_8", "notes", index, updatedNote);
            }}
            onRemoveNote={(index) => removeArrayItem("step5_8", "notes", index)}
            onToggleVisibility={(index) => {
              const currentNote = form.notes[index];
              updateArrayItem("step5_8", "notes", index, { ...currentNote, isVisible: !currentNote.isVisible });
            }}
            noteTypes={[
              "General",
              "Clinical",
              "Regulatory", 
              "Safety",
              "Efficacy",
              "Protocol",
              "Site",
              "Patient",
              "Adverse Event",
              "Publication",
              "Press Release",
              "Other"
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
