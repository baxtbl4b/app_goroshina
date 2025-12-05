import { Skeleton } from "@/components/ui/skeleton"

export default function NewsLoading() {
  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 mr-2" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <Skeleton className="h-10 w-full" />
      </header>

      <div className="flex-1 pb-20">
        {/* Category Filters Skeleton */}
        <div className="p-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-16 flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* News Articles Skeleton */}
        <div className="px-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm">
              <div className="flex gap-4">
                <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex justify-between">
                    <div className="flex gap-3">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
