"use client"

import Image from "next/image"
import { useEffect } from "react"

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  // Call the completion handler AFTER the component mounts,
  // NOT during a state-update callback.
  useEffect(() => {
    const timer = setTimeout(onLoadingComplete, 1500) // 1.5 s
    return () => clearTimeout(timer)
  }, [onLoadingComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1F1F] dark:bg-black">
      {/* Vibrating logo */}
      <Image
        src="/images/minilogo22.svg"
        alt="Loading Logo"
        width={128}
        height={128}
        className="animate-vibrate"
        priority
      />
    </div>
  )
}

export default LoadingScreen
