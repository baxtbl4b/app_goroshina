"use client"

import type { ReactNode } from "react"

interface PageContentProps {
  children: ReactNode
  className?: string
}

export function PageContent({ children, className = "" }: PageContentProps) {
  return <div className={`pt-[calc(60px+env(safe-area-inset-top))] ${className}`}>{children}</div>
}

export default PageContent
