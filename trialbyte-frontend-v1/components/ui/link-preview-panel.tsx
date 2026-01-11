"use client"

import * as React from "react"
import { X, ExternalLink, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface LinkPreviewPanelProps {
  url: string | null
  onClose: () => void
  title?: string
}

export function LinkPreviewPanel({ url, onClose, title }: LinkPreviewPanelProps) {
  const [isMaximized, setIsMaximized] = React.useState(false)

  return (
    <Dialog open={!!url} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={cn(
          "flex flex-col p-0 gap-0 transition-all duration-300",
          isMaximized 
            ? "max-w-[98vw] w-[98vw] h-[95vh] max-h-[95vh]" 
            : "max-w-4xl w-[90vw] h-[80vh] max-h-[80vh]"
        )}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between px-4 py-3 border-b bg-gray-50 space-y-0">
          <DialogTitle className="font-medium text-sm text-gray-700 truncate flex-1">
            {title || "Preview"}
          </DialogTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMaximized(!isMaximized)}
              className="h-8 w-8 p-0"
              title={isMaximized ? "Minimize" : "Maximize"}
            >
              {isMaximized ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => url && window.open(url, '_blank')}
              className="h-8 w-8 p-0"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
              title="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* URL Bar */}
        <div className="px-4 py-2 border-b bg-gray-100 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded border text-sm text-gray-600 overflow-hidden">
            <span className="truncate">{url}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden min-h-0">
          {url && (
            <iframe
              src={url}
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              title={title || "Link Preview"}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Context for managing the link preview panel globally
interface LinkPreviewContextType {
  openUrl: string | null
  openTitle: string | null
  openLinkPreview: (url: string, title?: string) => void
  closeLinkPreview: () => void
}

const LinkPreviewContext = React.createContext<LinkPreviewContextType | undefined>(undefined)

export function LinkPreviewProvider({ children }: { children: React.ReactNode }) {
  const [openUrl, setOpenUrl] = React.useState<string | null>(null)
  const [openTitle, setOpenTitle] = React.useState<string | null>(null)

  const openLinkPreview = React.useCallback((url: string, title?: string) => {
    setOpenUrl(url)
    setOpenTitle(title || null)
  }, [])

  const closeLinkPreview = React.useCallback(() => {
    setOpenUrl(null)
    setOpenTitle(null)
  }, [])

  return (
    <LinkPreviewContext.Provider value={{ openUrl, openTitle, openLinkPreview, closeLinkPreview }}>
      {children}
      <LinkPreviewPanel url={openUrl} onClose={closeLinkPreview} title={openTitle || undefined} />
    </LinkPreviewContext.Provider>
  )
}

export function useLinkPreview() {
  const context = React.useContext(LinkPreviewContext)
  if (context === undefined) {
    throw new Error('useLinkPreview must be used within a LinkPreviewProvider')
  }
  return context
}

