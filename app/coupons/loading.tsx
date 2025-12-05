import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CouponsLoading() {
  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/settings">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5 text-[#1F1F1F] dark:text-white" />
              </Button>
            </Link>
            <span className="text-xl font-bold text-[#1F1F1F] dark:text-white">Купоны</span>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        {/* Active Coupons Skeleton */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#D9D9DD] dark:border-[#3A3A3A]">
            <Skeleton className="h-6 w-40" />
          </div>

          <div className="divide-y divide-[#D9D9DD] dark:divide-[#3A3A3A]">
            {[1, 2].map((i) => (
              <div key={i} className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Coupons Skeleton */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#D9D9DD] dark:border-[#3A3A3A]">
            <Skeleton className="h-6 w-40" />
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
