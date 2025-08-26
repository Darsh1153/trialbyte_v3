"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X, Download } from "lucide-react";

// Types for favorite trials
interface FavoriteTrial {
  id: string;
  trialId: string;
  therapeuticArea: string;
  diseaseType: string;
  primaryDrug: string;
  status: string;
  sponsor: string;
  phase: string;
}

interface FavoriteTrialsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favoriteTrials?: FavoriteTrial[];
}

export function FavoriteTrialsModal({
  open,
  onOpenChange,
  favoriteTrials = []
}: FavoriteTrialsModalProps) {
  const [selectedTrials, setSelectedTrials] = useState<string[]>([]);

  // Mock data matching the image for demonstration
  const mockFavoriteTrials: FavoriteTrial[] = [
    {
      id: "1",
      trialId: "#230900",
      therapeuticArea: "Oncology",
      diseaseType: "Lung Cancer",
      primaryDrug: "Paclitaxel",
      status: "Closed",
      sponsor: "Astellas",
      phase: "2"
    },
    {
      id: "2",
      trialId: "#445690",
      therapeuticArea: "Oncology",
      diseaseType: "Lung Cancer",
      primaryDrug: "Paclitaxel",
      status: "Completed",
      sponsor: "Astellas",
      phase: "1"
    },
    {
      id: "3",
      trialId: "#985776",
      therapeuticArea: "Oncology",
      diseaseType: "Lung Cancer",
      primaryDrug: "Paclitaxel",
      status: "Open",
      sponsor: "Astellas",
      phase: "3"
    },
    {
      id: "4",
      trialId: "#230900",
      therapeuticArea: "Oncology",
      diseaseType: "Lung Cancer",
      primaryDrug: "Paclitaxel",
      status: "Terminated",
      sponsor: "Astellas",
      phase: "2"
    },
    {
      id: "5",
      trialId: "#445690",
      therapeuticArea: "Oncology",
      diseaseType: "Lung Cancer",
      primaryDrug: "Paclitaxel",
      status: "Planned",
      sponsor: "Astellas",
      phase: "3"
    }
  ];

  const displayTrials = favoriteTrials.length > 0 ? favoriteTrials : mockFavoriteTrials;

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      Closed: "bg-purple-100 text-purple-700",
      Terminated: "bg-red-100 text-red-700",
      Open: "bg-green-100 text-green-700",
      Completed: "bg-teal-100 text-teal-700",
      Planned: "bg-orange-100 text-orange-700",
    };
    return statusColors[status] || "bg-gray-100 text-gray-700";
  };

  const handleSelectTrial = (trialId: string) => {
    setSelectedTrials(prev => 
      prev.includes(trialId) 
        ? prev.filter(id => id !== trialId)
        : [...prev, trialId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTrials.length === displayTrials.length) {
      setSelectedTrials([]);
    } else {
      setSelectedTrials(displayTrials.map(trial => trial.id));
    }
  };

  const handleRemoveSelected = () => {
    // Implementation for removing selected trials from favorites
    console.log("Removing trials:", selectedTrials);
    setSelectedTrials([]);
  };

  const handleOpenSelected = () => {
    // Implementation for opening selected trials
    console.log("Opening trials:", selectedTrials);
  };

  const handleExportSelected = () => {
    // Implementation for exporting selected trials
    console.log("Exporting trials:", selectedTrials);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-xl font-semibold">Favorite Trials</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedTrials.length === displayTrials.length && displayTrials.length > 0}
                    onChange={handleSelectAll}
                    className="rounded"
                  />
                </TableHead>
                <TableHead className="font-semibold">Trial ID</TableHead>
                <TableHead className="font-semibold">Therapeutic Area</TableHead>
                <TableHead className="font-semibold">Disease Type</TableHead>
                <TableHead className="font-semibold">Primary Drug</TableHead>
                <TableHead className="font-semibold">Trial Status</TableHead>
                <TableHead className="font-semibold">Sponsor</TableHead>
                <TableHead className="font-semibold">Phase</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayTrials.map((trial) => (
                <TableRow key={trial.id} className="hover:bg-gray-50">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedTrials.includes(trial.id)}
                      onChange={() => handleSelectTrial(trial.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="text-blue-600 font-medium">
                      {trial.trialId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      {trial.therapeuticArea}
                    </div>
                  </TableCell>
                  <TableCell>{trial.diseaseType}</TableCell>
                  <TableCell>{trial.primaryDrug}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(trial.status)}>
                      {trial.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{trial.sponsor}</TableCell>
                  <TableCell>{trial.phase}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleRemoveSelected}
            disabled={selectedTrials.length === 0}
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Remove
          </Button>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleOpenSelected}
              disabled={selectedTrials.length === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Open
            </Button>
            <Button
              variant="outline"
              onClick={handleExportSelected}
              disabled={selectedTrials.length === 0}
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
