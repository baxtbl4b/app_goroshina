import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212] p-4">
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1F1F1F] shadow-sm -mx-4 px-4 py-3 mb-4 rounded-b-xl">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-6 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>

      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm flex">
            <Skeleton className="flex-shrink-0 w-56 h-56 rounded-md mr-4" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
              <div className="flex-grow">
                <Skeleton className="h-20 w-full rounded-md mt-2" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-3">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-9 w-28 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
