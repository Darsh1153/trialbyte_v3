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

export interface ColumnSettings {
  trialId: boolean;
  therapeuticArea: boolean;
  diseaseType: boolean;
  primaryDrug: boolean;
  trialStatus: boolean;
  sponsor: boolean;
  phase: boolean;
  phaseIV: boolean;
}

interface CustomizeColumnModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columnSettings: ColumnSettings;
  onColumnSettingsChange: (settings: ColumnSettings) => void;
}

const DEFAULT_COLUMN_SETTINGS: ColumnSettings = {
  trialId: true,
  therapeuticArea: true,
  diseaseType: true,
  primaryDrug: true,
  trialStatus: true,
  sponsor: true,
  phase: true,
  phaseIV: false,
};

export function CustomizeColumnModal({
  open,
  onOpenChange,
  columnSettings,
  onColumnSettingsChange,
}: CustomizeColumnModalProps) {
  const [localSettings, setLocalSettings] = useState<ColumnSettings>(columnSettings);

  useEffect(() => {
    setLocalSettings(columnSettings);
  }, [columnSettings]);

  const handleColumnToggle = (column: keyof ColumnSettings) => {
    setLocalSettings(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const handleModifyColumns = () => {
    onColumnSettingsChange(localSettings);
    onOpenChange(false);
  };

  const handleClose = () => {
    setLocalSettings(columnSettings); // Reset to original settings
    onOpenChange(false);
  };

  const columnOptions = [
    { key: 'trialId' as keyof ColumnSettings, label: 'Trial ID' },
    { key: 'therapeuticArea' as keyof ColumnSettings, label: 'Therapeutic Area' },
    { key: 'diseaseType' as keyof ColumnSettings, label: 'Disease Type' },
    { key: 'primaryDrug' as keyof ColumnSettings, label: 'Primary Drug' },
    { key: 'trialStatus' as keyof ColumnSettings, label: 'Trial status' },
    { key: 'sponsor' as keyof ColumnSettings, label: 'Sponsor' },
    { key: 'phase' as keyof ColumnSettings, label: 'Phase' },
    { key: 'phaseIV' as keyof ColumnSettings, label: 'Phase IV' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Customize column view
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-3 px-4 py-2 bg-slate-700 text-white rounded">
              Select columns
            </h3>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {columnOptions.map((option) => (
              <div key={option.key} className="flex items-center space-x-3 px-1">
                <Checkbox
                  id={option.key}
                  checked={localSettings[option.key]}
                  onCheckedChange={() => handleColumnToggle(option.key)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <label
                  htmlFor={option.key}
                  className="text-sm text-gray-700 cursor-pointer flex-1"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <Button
            onClick={handleModifyColumns}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white"
          >
            Modify columns
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { DEFAULT_COLUMN_SETTINGS };
