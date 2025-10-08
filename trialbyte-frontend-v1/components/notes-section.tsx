"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, 
  X, 
  Eye, 
  EyeOff, 
  Calendar, 
  Link as LinkIcon, 
  Paperclip,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { format } from "date-fns";
import CustomDateInput from "@/components/ui/custom-date-input";

export interface NoteItem {
  id: string;
  date: string;
  type: string;
  content: string;
  sourceLink?: string;
  attachments?: string[];
  isVisible: boolean;
  isExpanded?: boolean;
}

export interface NotesSectionProps {
  title?: string;
  notes: NoteItem[];
  onAddNote: () => void;
  onUpdateNote: (index: number, updatedNote: Partial<NoteItem>) => void;
  onRemoveNote: (index: number) => void;
  onToggleVisibility?: (index: number) => void;
  noteTypes?: string[];
  className?: string;
  showAddButton?: boolean;
}

const DEFAULT_NOTE_TYPES = [
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
];

export function NotesSection({
  title = "Notes",
  notes,
  onAddNote,
  onUpdateNote,
  onRemoveNote,
  onToggleVisibility,
  noteTypes = DEFAULT_NOTE_TYPES,
  className = "",
  showAddButton = true
}: NotesSectionProps) {
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());

  const toggleNoteExpansion = (index: number) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleToggleVisibility = (index: number) => {
    if (onToggleVisibility) {
      onToggleVisibility(index);
    } else {
      onUpdateNote(index, { isVisible: !notes[index].isVisible });
    }
  };

  // Sort notes by date (latest first)
  const sortedNotes = [...notes].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {showAddButton && (
            <Button
              onClick={onAddNote}
              size="sm"
              className="bg-[#204B73] hover:bg-[#1a3d5c] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {sortedNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No notes added yet.</p>
            <p className="text-sm">Click "Add Note" to create your first note.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedNotes.map((note, index) => {
              const originalIndex = notes.findIndex(n => n.id === note.id);
              const isExpanded = expandedNotes.has(originalIndex);
              
              return (
                <div
                  key={note.id}
                  className={`border rounded-lg transition-all duration-200 ${
                    note.isVisible 
                      ? "border-gray-200 bg-white shadow-sm" 
                      : "border-gray-300 bg-gray-50 opacity-60"
                  }`}
                >
                  {/* Note Header */}
                  <div className="flex items-center justify-between p-3 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">
                        Note #{originalIndex + 1}
                      </span>
                      
                      {/* Date */}
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {note.date ? format(new Date(note.date), "MMM dd, yyyy") : "No date"}
                        </span>
                      </div>
                      
                      {/* Type */}
                      {note.type && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {note.type}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Visibility Toggle */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleVisibility(originalIndex)}
                        className={`${
                          note.isVisible
                            ? "text-green-600 hover:text-green-700 hover:bg-green-50"
                            : "text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {note.isVisible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {/* Expand/Collapse */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleNoteExpansion(originalIndex)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {/* Remove Button */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveNote(originalIndex)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Note Content */}
                  {isExpanded && (
                    <div className="p-4 space-y-4">
                      {/* Date Input */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Date</Label>
                          <CustomDateInput
                            value={note.date}
                            onChange={(value) => onUpdateNote(originalIndex, { date: value })}
                            placeholder="Month Day Year"
                            className="text-sm"
                          />
                        </div>
                        
                        {/* Type Dropdown */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Type</Label>
                          <Select
                            value={note.type}
                            onValueChange={(value) => onUpdateNote(originalIndex, { type: value })}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select note type" />
                            </SelectTrigger>
                            <SelectContent>
                              {noteTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* Content Text Box */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Content</Label>
                        <Textarea
                          rows={4}
                          value={note.content}
                          onChange={(e) => onUpdateNote(originalIndex, { content: e.target.value })}
                          placeholder="Enter note content..."
                          className="text-sm resize-none"
                        />
                      </div>
                      
                      {/* View Source Link */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Source Link</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={note.sourceLink || ""}
                            onChange={(e) => onUpdateNote(originalIndex, { sourceLink: e.target.value })}
                            placeholder="https://..."
                            className="text-sm flex-1"
                          />
                          {note.sourceLink && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <a
                                href={note.sourceLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-1"
                              >
                                <LinkIcon className="h-4 w-4" />
                                <span>View</span>
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {/* Attachments */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Attachments</Label>
                        <div className="space-y-2">
                          {note.attachments?.map((attachment, attachmentIndex) => (
                            <div key={attachmentIndex} className="flex items-center space-x-2">
                              <Paperclip className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700 flex-1">{attachment}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updatedAttachments = note.attachments?.filter((_, i) => i !== attachmentIndex);
                                  onUpdateNote(originalIndex, { attachments: updatedAttachments });
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )) || []}
                          
                          <div className="flex items-center space-x-2">
                            <Input
                              placeholder="Add attachment URL or description..."
                              className="text-sm flex-1"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  const input = e.target as HTMLInputElement;
                                  const newAttachment = input.value.trim();
                                  if (newAttachment) {
                                    const updatedAttachments = [...(note.attachments || []), newAttachment];
                                    onUpdateNote(originalIndex, { attachments: updatedAttachments });
                                    input.value = '';
                                  }
                                }
                              }}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                const newAttachment = input.value.trim();
                                if (newAttachment) {
                                  const updatedAttachments = [...(note.attachments || []), newAttachment];
                                  onUpdateNote(originalIndex, { attachments: updatedAttachments });
                                  input.value = '';
                                }
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default NotesSection;
