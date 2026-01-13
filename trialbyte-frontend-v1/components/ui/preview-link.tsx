"use client"

import * as React from "react"
import { useLinkPreview } from "@/components/ui/link-preview-panel"
import { cn } from "@/lib/utils"

interface PreviewLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  title?: string
  children: React.ReactNode
  openInPanel?: boolean
}

export function PreviewLink({ 
  href, 
  title, 
  children, 
  openInPanel = true,
  className,
  ...props 
}: PreviewLinkProps) {
  const { openLinkPreview } = useLinkPreview()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (openInPanel && href) {
      e.preventDefault()
      openLinkPreview(href, title)
    }
  }

  return (
    <a
      href={href}
      onClick={handleClick}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </a>
  )
}





