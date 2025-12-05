import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#D9D9DD] dark:bg-[#121212] pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-[#2A2A2A] p-4 sticky top-0 z-10 shadow-sm">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full mr-2" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-[#2A2A2A] px-4 py-2">
        <Skeleton className="w-full h-2.5 rounded-full" />
        <div className="flex justify-end mt-1">
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Survey Content */}
      <div className="p-4">
        <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 mb-4">
          <Skeleton className="h-6 w-3/4 mb-6" />
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-40" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-48" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-36" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-44" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  )
}
