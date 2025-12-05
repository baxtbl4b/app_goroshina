import { Skeleton } from "@/components/ui/skeleton"
import SafeAreaHeader from "@/components/safe-area-header"

export default function TireMountingLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <SafeAreaHeader title="Шиномонтаж" showBackButton backUrl="/" />

      <main className="flex-1">
        {/* Hero Section Skeleton */}
        <div className="bg-blue-500 dark:bg-blue-600 px-4 py-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-1 mb-6 md:mb-0 md:mr-6">
              <Skeleton className="h-8 w-3/4 bg-blue-400 mb-3" />
              <Skeleton className="h-4 w-full bg-blue-400 mb-2" />
              <Skeleton className="h-4 w-full bg-blue-400 mb-2" />
              <Skeleton className="h-4 w-3/4 bg-blue-400" />
            </div>
            <div className="flex space-x-2">
              <Skeleton className="w-24 h-24 rounded-full bg-blue-400" />
              <Skeleton className="w-24 h-24 rounded-full bg-blue-400" />
            </div>
          </div>
        </div>

        {/* Our Advantages Section Skeleton */}
        <div className="px-4 py-6">
          <Skeleton className="h-8 w-2/3 mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>

        {/* Price List Skeleton */}
        <div className="px-4 py-6 bg-white dark:bg-gray-800">
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-3" />
          <Skeleton className="h-8 w-full mb-3" />
          <Skeleton className="h-8 w-full mb-3" />
        </div>

        {/* Additional Services Skeleton */}
        <div className="px-4 py-6">
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
          <Skeleton className="h-6 w-full mb-3" />
        </div>

        {/* Book Now Button Skeleton */}
        <div className="px-4 py-6 flex justify-center">
          <Skeleton className="h-12 w-48 rounded-full" />
        </div>
      </main>
    </div>
  )
}
