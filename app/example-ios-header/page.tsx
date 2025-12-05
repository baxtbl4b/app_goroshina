"use client"

import SafeAreaHeader from "@/components/safe-area-header"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function ExampleIOSHeaderPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SafeAreaHeader title="TireShop" className="sticky top-0 z-10">
        <div className="flex items-center space-x-2">
          <button className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </SafeAreaHeader>

      <main className="flex-1 p-4">
        <h2 className="text-2xl font-bold mb-4">iOS-Optimized Header Example</h2>
        <p className="mb-4">
          This page demonstrates a header with proper iOS status bar spacing using
          <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded mx-1">env(safe-area-inset-top)</code>
          for a more native feel.
        </p>
        <p className="mb-4">The status bar color is also properly set using theme-color meta tags.</p>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">Key Features:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Proper status bar spacing with safe-area-inset-top</li>
            <li>Theme-color meta tags for status bar color</li>
            <li>Responsive design that works on all iOS devices</li>
            <li>Dark mode support</li>
          </ul>
        </div>
      </main>

      <BottomNavigation />
    </div>
  )
}
