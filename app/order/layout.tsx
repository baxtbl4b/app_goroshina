import type React from "react"
export default function OrderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-[var(--header-height,60px)]">{children}</main>
}
