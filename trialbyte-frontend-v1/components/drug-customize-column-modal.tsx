"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

export interface DrugColumnSettings {
  drugId: boolean;
  drugName: boolean;
  genericName: boolean;
  therapeuticArea: boolean;
  diseaseType: boolean;
  globalStatus: boolean;
  developmentStatus: boolean;
  originator: boolean;
  createdDate: boolean;
}

interface DrugCustomizeColumnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columnSettings: DrugColumnSettings;
  onColumnSettingsChange: (settings: DrugColumnSettings) => void;
}

const DEFAULT_DRUG_COLUMN_SETTINGS: DrugColumnSettings = {
  drugId: true,
  drugName: true,
  genericName: true,
  therapeuticArea: true,
  diseaseType: true,
  globalStatus: true,
  developmentStatus: false,
  originator: false,
  createdDate: true,
};

export function DrugCustomizeColumnModal({
  open,
  onOpenChange,
  columnSettings,
  onColumnSettingsChange,
}: DrugCustomizeColumnModalProps) {
  const [localSettings, setLocalSettings] = useState<DrugColumnSettings>(columnSettings);

  useEffect(() => {
    setLocalSettings(columnSettings);
  }, [columnSettings]);

  const handleSave = () => {
    onColumnSettingsChange(localSettings);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setLocalSettings(columnSettings);
    onOpenChange(false);
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_DRUG_COLUMN_SETTINGS);
  };

  const columnOptions = [
    { key: 'drugId', label: 'Drug ID' },
    { key: 'drugName', label: 'Drug Name' },
    { key: 'genericName', label: 'Generic Name' },
    { key: 'therapeuticArea', label: 'Therapeutic Area' },
    { key: 'diseaseType', label: 'Disease Type' },
    { key: 'globalStatus', label: 'Global Status' },
    { key: 'developmentStatus', label: 'Development Status' },
    { key: 'originator', label: 'Originator' },
    { key: 'createdDate', label: 'Created Date' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Customize Columns
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-3">
            {columnOptions.map((option) => (
              <div key={option.key} className="flex items-center space-x-2">
                <Checkbox
                  id={option.key}
                  checked={localSettings[option.key as keyof DrugColumnSettings]}
                  onCheckedChange={(checked) =>
                    setLocalSettings(prev => ({
                      ...prev,
                      [option.key]: checked as boolean
                    }))
                  }
                />
                <label
                  htmlFor={option.key}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="text-sm"
            >
              Reset to Default
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="text-sm"
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { DEFAULT_DRUG_COLUMN_SETTINGS };
