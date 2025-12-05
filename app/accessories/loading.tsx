import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Filter, ShoppingCart } from "lucide-react"

export default function Loading() {
  return (
    <main className="flex flex-col min-h-screen bg-[#F5F5F5] dark:bg-[#121212]">
      <header className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] shadow-sm">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2" aria-label="Назад">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold">Аксессуары</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" aria-label="Фильтры">
              <Filter className="h-5 w-5" />
            </Button>
            <div className="relative">
              <ShoppingCart className="h-6 w-6" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 p-4 pb-20">
        {/* Results count skeleton */}
        <div className="mb-4">
          <Skeleton className="h-5 w-32" />
        </div>

        {/* Accessories grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="bg-white dark:bg-[#1F1F1F] rounded-xl overflow-hidden shadow-sm p-4">
                <Skeleton className="h-48 w-full rounded-lg mb-4" />
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <Skeleton className="h-6 w-40 mb-2" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex items-center justify-between pt-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Bottom navigation skeleton */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#1F1F1F] border-t border-gray-200 dark:border-gray-800 flex items-center justify-around px-4">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className="h-10 w-10 rounded-full" />
          ))}
      </div>
    </main>
  )
}
