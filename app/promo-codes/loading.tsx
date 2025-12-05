import { Skeleton } from "@/components/ui/skeleton"
import BottomNavigation from "@/components/bottom-navigation"

export default function PromoCodesLoading() {
  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] p-4 shadow-sm">
        <div className="flex items-center">
          <Skeleton className="h-8 w-8 mr-2" />
          <Skeleton className="h-6 w-32" />
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 pb-20">
        {/* Add Promo Code Section Skeleton */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4">
          <Skeleton className="h-6 w-48 mb-3" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-10" />
          </div>
          <Skeleton className="h-4 w-full mt-2" />
        </div>

        {/* Active Promo Codes Skeleton */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#D9D9DD] dark:border-[#3A3A3A]">
            <Skeleton className="h-6 w-40" />
          </div>

          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border-b border-[#D9D9DD] dark:border-[#3A3A3A] last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Skeleton className="h-5 w-5 mr-2" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>

        {/* Used Promo Codes Skeleton */}
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#D9D9DD] dark:border-[#3A3A3A]">
            <Skeleton className="h-6 w-48" />
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Skeleton className="h-5 w-5 mr-2" />
                <Skeleton className="h-5 w-28" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        {/* Info Section Skeleton */}
        <div className="bg-[#009CFF]/10 dark:bg-[#009CFF]/20 rounded-xl p-4">
          <Skeleton className="h-5 w-48 mb-2" />
          <div className="space-y-1">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </main>
  )
}
