"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function PWASplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Скрываем splash screen после загрузки страницы
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999]"
      style={{
        transition: "opacity 0.3s ease-out",
        opacity: isVisible ? 1 : 0
      }}
    >
      <Image
        src="/icons/logo full.svg"
        alt="Горошина"
        width={199}
        height={40}
        priority
      />
    </div>
  )
}
