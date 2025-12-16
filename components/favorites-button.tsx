"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"

interface FavoritesButtonProps {
  className?: string
}

export default function FavoritesButton({ className = "" }: FavoritesButtonProps) {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
      router.push("/favorites")
    }, 300)
  }

  return (
    <>
      <style jsx global>{`
        @keyframes favoriteWiggle {
          0%, 100% { transform: rotate(0deg); }
          20% { transform: rotate(-12deg); }
          40% { transform: rotate(10deg); }
          60% { transform: rotate(-8deg); }
          80% { transform: rotate(5deg); }
        }
        .favorite-wiggle {
          animation: favoriteWiggle 0.3s ease-in-out;
        }
      `}</style>
      <button
        onClick={handleClick}
        className={`flex items-center justify-center p-2 transition-colors ${isAnimating ? 'text-blue-500' : 'text-[#1F1F1F] dark:text-white'} active:text-blue-500 ${className}`}
        aria-label="Избранное"
      >
        <Heart className={`h-6 w-6 ${isAnimating ? 'favorite-wiggle' : ''}`} />
      </button>
    </>
  )
}
