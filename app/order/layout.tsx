import type React from "react"
export default function OrderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="min-h-screen bg-[#121212]">{children}</main>
}
