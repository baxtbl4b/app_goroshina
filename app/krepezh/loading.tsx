import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container pb-20">
      <Skeleton className="h-8 w-64 mt-4 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-full mb-4" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm mb-8">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <Skeleton className="h-32 w-32 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-32 w-32 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-32 w-32 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-32 w-32 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
