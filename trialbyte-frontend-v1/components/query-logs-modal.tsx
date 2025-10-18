"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Clock, User, Search, Filter, Calendar, Trash2 } from "lucide-react"
import { formatDateToMMDDYYYY } from "@/lib/date-utils"

interface QueryLog {
  id: string
  queryId: string
  queryTitle: string
  queryDescription?: string
  executedAt: string
  executedBy?: string
  queryType: 'advanced_search' | 'filter' | 'saved_query'
  criteria?: any[]
  filters?: any
  searchTerm?: string
  resultCount?: number
  executionTime?: number // in milliseconds
}

interface QueryLogsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QueryLogsModal({ open, onOpenChange }: QueryLogsModalProps) {
  const [queryLogs, setQueryLogs] = useState<QueryLog[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  // Load query logs from localStorage
  const loadQueryLogs = async () => {
    setLoading(true)
    setError("")
    
    try {
      const logs = JSON.parse(localStorage.getItem('queryExecutionLogs') || '[]')
      console.log("Loaded query logs:", logs)
      setQueryLogs(logs)
    } catch (error) {
      console.error("Error loading query logs:", error)
      setError("Failed to load query logs")
    } finally {
      setLoading(false)
    }
  }

  // Load logs when modal opens
  useEffect(() => {
    if (open) {
      loadQueryLogs()
    }
  }, [open])

  // Filter logs based on search term and type
  const filteredLogs = queryLogs.filter(log => {
    const matchesSearch = !searchTerm.trim() || 
      log.queryTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.queryDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === "all" || log.queryType === filterType
    
    return matchesSearch && matchesType
  })

  // Clear all logs
  const clearAllLogs = () => {
    if (confirm("Are you sure you want to clear all query logs? This action cannot be undone.")) {
      localStorage.removeItem('queryExecutionLogs')
      setQueryLogs([])
    }
  }

  // Delete specific log
  const deleteLog = (logId: string) => {
    if (confirm("Are you sure you want to delete this log entry?")) {
      const updatedLogs = queryLogs.filter(log => log.id !== logId)
      setQueryLogs(updatedLogs)
      localStorage.setItem('queryExecutionLogs', JSON.stringify(updatedLogs))
    }
  }

  // Get query type badge color
  const getQueryTypeBadge = (type: string) => {
    switch (type) {
      case 'advanced_search':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Advanced Search</Badge>
      case 'filter':
        return <Badge variant="default" className="bg-green-100 text-green-800">Filter</Badge>
      case 'saved_query':
        return <Badge variant="default" className="bg-purple-100 text-purple-800">Saved Query</Badge>
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  // Format execution time
  const formatExecutionTime = (timeMs?: number) => {
    if (!timeMs) return "N/A"
    if (timeMs < 1000) return `${timeMs}ms`
    return `${(timeMs / 1000).toFixed(2)}s`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] p-0">
        <DialogHeader className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Query Execution Logs</DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllLogs}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={queryLogs.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {/* Search and Filter Controls */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">Search Logs</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by query title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <Label htmlFor="filter">Filter by Type</Label>
              <select
                id="filter"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="advanced_search">Advanced Search</option>
                <option value="filter">Filter</option>
                <option value="saved_query">Saved Query</option>
              </select>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading query logs...</span>
            </div>
          )}

          {/* No Logs Message */}
          {!loading && queryLogs.length === 0 && (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Query Logs Found</h3>
              <p className="text-gray-500">Query execution logs will appear here when you run saved queries.</p>
            </div>
          )}

          {/* No Filtered Results */}
          {!loading && queryLogs.length > 0 && filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Matching Logs</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {/* Query Logs List */}
          {!loading && filteredLogs.length > 0 && (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <Card key={log.id} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-base font-medium">{log.queryTitle}</CardTitle>
                            {getQueryTypeBadge(log.queryType)}
                          </div>
                          {log.queryDescription && (
                            <p className="text-sm text-gray-600 mb-2">{log.queryDescription}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLog(log.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">
                            {formatDateToMMDDYYYY(log.executedAt)} at {new Date(log.executedAt).toLocaleTimeString()}
                          </span>
                        </div>
                        {log.executionTime && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">Executed in {formatExecutionTime(log.executionTime)}</span>
                          </div>
                        )}
                        {log.resultCount !== undefined && (
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-600">{log.resultCount} results</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Query Details */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          <strong>Query ID:</strong> {log.queryId}
                        </div>
                        {log.searchTerm && (
                          <div className="text-xs text-gray-500 mt-1">
                            <strong>Search Term:</strong> "{log.searchTerm}"
                          </div>
                        )}
                        {log.criteria && log.criteria.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            <strong>Criteria:</strong> {log.criteria.length} condition(s)
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Summary */}
          {!loading && queryLogs.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Showing {filteredLogs.length} of {queryLogs.length} logs</span>
                <span>Total executions: {queryLogs.length}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-gray-600 text-white hover:bg-gray-700"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
