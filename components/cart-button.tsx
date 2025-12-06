"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface CartButtonProps {
  className?: string
}

export default function CartButton({ className = "" }: CartButtonProps) {
  const router = useRouter()
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Получаем количество товаров в корзине
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        const newCount = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0)

        // If cart count increased, trigger animation
        if (newCount > cartItemCount) {
          setIsAnimating(true)
          setTimeout(() => setIsAnimating(false), 600)
        }

        setCartItemCount(newCount)
      } catch (error) {
        console.error("Ошибка при получении данных корзины:", error)
        setCartItemCount(0)
      }
    }

    updateCartCount()
    window.addEventListener("cartUpdated", updateCartCount)
    window.addEventListener("cartItemAdded", updateCartCount)

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount)
      window.removeEventListener("cartItemAdded", updateCartCount)
    }
  }, [cartItemCount])

  const handleClick = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
      router.push("/order/checkout")
    }, 300)
  }

  return (
    <>
      <style jsx global>{`
        /* Cart pulsation when has items */
        @keyframes cartPulseGlow {
          0%, 100% {
            filter: brightness(0) saturate(100%) invert(83%) sepia(44%) saturate(484%) hue-rotate(22deg) brightness(97%) contrast(91%) drop-shadow(0 0 2px rgba(211, 223, 61, 0.5));
          }
          50% {
            filter: brightness(0) saturate(100%) invert(83%) sepia(44%) saturate(484%) hue-rotate(22deg) brightness(97%) contrast(91%) drop-shadow(0 0 8px rgba(211, 223, 61, 0.9));
          }
        }

        /* Rare wobble animation */
        @keyframes cartWobble {
          0%, 90%, 100% {
            transform: rotate(0deg) scaleX(-1);
          }
          92% {
            transform: rotate(-8deg) scaleX(-1);
          }
          94% {
            transform: rotate(6deg) scaleX(-1);
          }
          96% {
            transform: rotate(-4deg) scaleX(-1);
          }
          98% {
            transform: rotate(2deg) scaleX(-1);
          }
        }

        .cart-has-items {
          animation: cartPulseGlow 2s ease-in-out infinite, cartWobble 6s ease-in-out infinite;
        }

        /* White cart when empty */
        .cart-empty-white {
          filter: brightness(0) invert(1);
          transform: scaleX(-1);
        }

        /* Yellow cart when has items */
        .cart-has-items-yellow {
          filter: brightness(0) saturate(100%) invert(83%) sepia(44%) saturate(484%) hue-rotate(22deg) brightness(97%) contrast(91%);
          transform: scaleX(-1);
        }

        /* Cart icon bounce on add */
        @keyframes cartIconBounce {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-4px);
          }
          50% {
            transform: translateY(0);
          }
          75% {
            transform: translateY(-2px);
          }
        }

        .cart-icon-bounce {
          animation: cartIconBounce 0.5s ease-in-out;
        }
      `}</style>

      <button
        onClick={handleClick}
        className={`p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center relative ${className}`}
        aria-label="Корзина"
      >
        <div className={`relative ${isAnimating ? "cart-icon-bounce" : ""}`}>
          <Image
            src="/images/korzina2.png"
            alt="Корзина"
            width={26}
            height={26}
            className={`opacity-90 hover:opacity-100 transition-all ${cartItemCount > 0 ? "cart-has-items-yellow" : "cart-empty-white"}`}
          />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#D3DF3D] text-[#1F1F1F] text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {cartItemCount}
            </span>
          )}
        </div>
      </button>
    </>
  )
}
