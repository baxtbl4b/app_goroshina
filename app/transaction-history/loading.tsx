import { ChevronLeft, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import BottomNavigation from "@/components/bottom-navigation"

export default function TransactionHistoryLoading() {
  return (
    <div className="min-h-screen bg-[#F0F0F5] dark:bg-[#121212] flex flex-col">
      <header className="bg-white dark:bg-[#1E1E1E] p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2">
              <ChevronLeft className="h-6 w-6 text-gray-900 dark:text-white" />
            </Button>
            <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-700" />
          </div>
          <Button variant="ghost" size="icon">
            <Filter className="h-5 w-5 text-gray-900 dark:text-white" />
          </Button>
        </div>
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Skeleton className="h-10 w-full pl-10 bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </header>

      <main className="flex-grow p-4 pb-20">
        <div className="grid w-full grid-cols-3 bg-gray-200 dark:bg-gray-700 rounded-lg p-1 mb-4">
          <Skeleton className="h-9 bg-gray-300 dark:bg-gray-600 rounded-md" />
          <Skeleton className="h-9 bg-gray-300 dark:bg-gray-600 rounded-md mx-1" />
          <Skeleton className="h-9 bg-gray-300 dark:bg-gray-600 rounded-md" />
        </div>

        {[...Array(3)].map((_, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700 my-2 px-1" />
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm divide-y divide-gray-200 dark:divide-gray-700 px-4">
              {[...Array(2)].map((_, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 mr-3" />
                    <div>
                      <Skeleton className="h-4 w-48 bg-gray-200 dark:bg-gray-700 mb-1" />
                      <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-24 bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
      <BottomNavigation />
    </div>
  )
}
