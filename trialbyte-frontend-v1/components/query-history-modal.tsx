"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Loader2, 
  AlertCircle, 
  Search, 
  Trash2, 
  Eye,
  Calendar,
  X
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SavedQuery {
  id: string
  title: string
  description: string | null
  query_type: string
  query_data: {
    searchTerm: string
    filters: any
    searchCriteria: any[]
    savedAt: string
  }
  created_at: string
  updated_at: string
}

interface QueryHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onLoadQuery?: (queryData: any) => void
}

export function QueryHistoryModal({ 
  open, 
  onOpenChange,
  onLoadQuery 
}: QueryHistoryModalProps) {
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")

  const fetchSavedQueries = async () => {
    setLoading(true)
    setError("")
    
    try {
      // Try to fetch from API first
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/queries/saved/user/dashboard-queries`
      
      if (searchTerm.trim()) {
        url += `?search=${encodeURIComponent(searchTerm.trim())}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()
        console.log("API response:", data);
        console.log("API data.data:", data.data);
        console.log("API queries count:", data.data?.length || 0);
        
        // If API returns empty data, fallback to localStorage
        if (!data.data || data.data.length === 0) {
          console.log("API returned empty data, using localStorage fallback")
          const localQueries = JSON.parse(localStorage.getItem('unifiedSavedQueries') || '[]')
          console.log("Loaded from localStorage:", localQueries);
          console.log("Total queries loaded:", localQueries.length);
          setSavedQueries(localQueries)
        } else {
          setSavedQueries(data.data || [])
        }
        return
      }
      
      // If API fails, fallback to localStorage
      console.log("API failed, using localStorage fallback")
      const localQueries = JSON.parse(localStorage.getItem('unifiedSavedQueries') || '[]')
      console.log("Loaded from localStorage:", localQueries);
      console.log("Total queries loaded:", localQueries.length);
      setSavedQueries(localQueries)
      
    } catch (error) {
      console.error("Error fetching saved queries:", error)
      
      // Fallback to localStorage
      try {
        const localQueries = JSON.parse(localStorage.getItem('unifiedSavedQueries') || '[]')
        console.log("Fallback - Loaded from localStorage:", localQueries);
        console.log("Fallback - Total queries loaded:", localQueries.length);
        setSavedQueries(localQueries)
        setError("") // Clear error since we have fallback data
      } catch (localError) {
        setError("Failed to load saved queries")
      }
    } finally {
      setLoading(false)
    }
  }

  const deleteSavedQuery = async (queryId: string) => {
    try {
      // Try API first
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/queries/saved/${queryId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )

      if (response.ok) {
        toast({
          title: "Success",
          description: "Query deleted successfully",
        })
        // Refresh the list
        await fetchSavedQueries()
        return
      }
      
      // If API fails, use localStorage fallback
      const localQueries = JSON.parse(localStorage.getItem('unifiedSavedQueries') || '[]')
      const updatedQueries = localQueries.filter((query: any) => query.id !== queryId)
      localStorage.setItem('unifiedSavedQueries', JSON.stringify(updatedQueries))
      
      toast({
        title: "Success",
        description: "Query deleted successfully",
      })
      
      // Refresh the list
      await fetchSavedQueries()
      
    } catch (error) {
      console.error("Error deleting query:", error)
      
      // Still try localStorage fallback
      try {
        const localQueries = JSON.parse(localStorage.getItem('unifiedSavedQueries') || '[]')
        const updatedQueries = localQueries.filter((query: any) => query.id !== queryId)
        localStorage.setItem('unifiedSavedQueries', JSON.stringify(updatedQueries))
        
        toast({
          title: "Success",
          description: "Query deleted successfully",
        })
        
        // Refresh the list
        await fetchSavedQueries()
      } catch (localError) {
        console.error("Failed to delete from localStorage:", localError)
        toast({
          title: "Error",
          description: "Failed to delete query",
          variant: "destructive",
        })
      }
    }
  }

  const loadQuery = (query: SavedQuery) => {
    if (onLoadQuery && query.query_data) {
      onLoadQuery(query.query_data)
      toast({
        title: "Query Loaded",
        description: `"${query.title}" has been applied to your current view`,
      })
      onOpenChange(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFilterSummary = (queryData: any) => {
    if (!queryData) return "No filters"
    
    const filterCount = Object.values(queryData.filters || {})
      .reduce((count: number, filter: any) => count + (filter?.length || 0), 0)
    const criteriaCount = queryData.searchCriteria?.length || 0
    const hasSearch = queryData.searchTerm?.trim() ? 1 : 0
    
    const total = filterCount + criteriaCount + hasSearch
    if (total === 0) return "No filters"
    
    const parts = []
    if (filterCount > 0) parts.push(`${filterCount} filters`)
    if (criteriaCount > 0) parts.push(`${criteriaCount} criteria`)
    if (hasSearch) parts.push("search term")
    
    return parts.join(", ")
  }

  useEffect(() => {
    if (open) {
      fetchSavedQueries()
    }
  }, [open])

  useEffect(() => {
    if (open) {
      const timeoutId = setTimeout(() => {
        fetchSavedQueries()
      }, 300) // Debounce search

      return () => clearTimeout(timeoutId)
    }
  }, [searchTerm, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Query History</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {/* Search */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search saved queries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading saved queries...</span>
            </div>
          )}

          {/* Results */}
          {!loading && (
            <div className="flex-1 overflow-auto">
              {savedQueries.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? "No queries found matching your search" : "No saved queries yet"}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Filters</TableHead>
                      <TableHead>Saved</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedQueries.map((query) => (
                      <TableRow key={query.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <span>{query.title}</span>
                            <Badge variant="outline" className="text-xs">
                              {query.query_type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate text-sm text-gray-600">
                            {query.description || "No description"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {getFilterSummary(query.query_data)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(query.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => loadQuery(query)}
                              title="Load this query"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteSavedQuery(query.id)}
                              title="Delete this query"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
