"use client"

import Link from "next/link"
import { Home, ClipboardList } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export function BottomNavigation() {
  const pathname = usePathname()
  const [cartItemCount, setCartItemCount] = useState(0)

  // При монтировании компонента загружаем количество товаров из localStorage
  useEffect(() => {
    const loadCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const count = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0)
      setCartItemCount(count)
    }

    // Загружаем начальное значение
    loadCartCount()

    // Слушаем событие обновления корзины
    const handleCartUpdate = () => {
      loadCartCount()
    }

    // Слушаем кастомное событие с данными
    const handleCartItemAdded = (e: CustomEvent) => {
      if (e.detail && e.detail.totalItems) {
        setCartItemCount(e.detail.totalItems)
      } else {
        loadCartCount()
      }
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    window.addEventListener("cartItemAdded", handleCartItemAdded as EventListener)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("cartItemAdded", handleCartItemAdded as EventListener)
    }
  }, [])

  // Hide bottom navigation on tire mounting page and booking page
  if (pathname === "/tire-mounting" || pathname === "/tire-mounting/booking") {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1F1F1F] dark:bg-[#1F1F1F] py-3 px-4 z-10 pb-[env(safe-area-inset-bottom)] h-[84px]">
      <div className="grid grid-cols-5 gap-1">
        <Link
          href="/"
          className={`flex flex-col items-center justify-center ${pathname === "/" ? "opacity-100" : "opacity-70"}`}
        >
          <Home className="h-5 w-5 text-white" />
          <span className="text-[10px] mt-1 text-white">Главная</span>
        </Link>
        <Link
          href="/chat"
          className={`flex flex-col items-center justify-center ${pathname === "/chat" ? "opacity-100" : "opacity-70"}`}
        >
          <div className="h-5 w-5 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
                stroke="white"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M8 12H8.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 12H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 12H16.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-[10px] mt-1 text-white">Чат</span>
        </Link>
        <Link
          href="/goroshina-assistant"
          className="flex flex-col items-center justify-center opacity-100"
          title="Умная помощница Горошина"
          aria-label="Открыть умную помощницу Горошина"
        >
          <div className="bg-[#383838] rounded-full shadow-lg transform hover:scale-105 transition-transform flex items-center justify-center w-14 h-14 relative overflow-hidden -mt-9">
            {/* Background gradient */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-gradient-to-br from-[#444444] to-[#222222]"></div>

            {/* Primary logo with better error handling */}
            <svg
              width="28"
              height="21"
              viewBox="0 0 28 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-auto relative z-10"
            >
              <path
                d="M27.1973 14.8367C27.1958 16.362 26.5885 17.8242 25.5088 18.902C24.4291 19.9797 22.9655 20.5847 21.4396 20.584H19.5945C19.463 20.584 19.3369 20.5318 19.2439 20.4388C19.1509 20.3459 19.0986 20.2198 19.0986 20.0884V16.3589C19.0981 16.2452 19.137 16.1348 19.2086 16.0464C19.2802 15.9581 19.3801 15.8972 19.4915 15.8741L26.5957 14.3519C26.6681 14.3367 26.743 14.3377 26.8149 14.3549C26.8869 14.3722 26.9541 14.4052 27.0117 14.4516C27.0692 14.498 27.1158 14.5566 27.1479 14.6232C27.18 14.6899 27.1969 14.7628 27.1973 14.8367Z"
                fill="currentColor"
              />
              <path
                d="M27.1973 6.09937V12.521C27.1974 12.6349 27.1585 12.7455 27.087 12.8342C27.0155 12.9229 26.9157 12.9844 26.8044 13.0086L19.6974 14.528C19.6251 14.5438 19.5502 14.5432 19.4782 14.5262C19.4062 14.5091 19.3389 14.4761 19.2814 14.4295C19.2239 14.383 19.1776 14.3241 19.146 14.2572C19.1143 14.1903 19.0981 14.1171 19.0986 14.0432V7.61879C19.0987 7.50522 19.1377 7.39509 19.2092 7.30684C19.2807 7.21859 19.3804 7.15757 19.4915 7.13399L26.5957 5.61184C26.6683 5.59652 26.7435 5.59761 26.8156 5.615C26.8877 5.63239 26.955 5.66565 27.0127 5.71237C27.0703 5.75908 27.1168 5.81806 27.1488 5.88502C27.1807 5.95197 27.1973 6.0252 27.1973 6.09937"
                fill="currentColor"
              />
              <path
                d="M27.1973 0.874844V3.79181C27.1968 3.90525 27.1575 4.01512 27.0861 4.10327C27.0147 4.19142 26.9153 4.25257 26.8044 4.27661L19.6974 5.79605C19.6251 5.81191 19.5502 5.81129 19.4782 5.79425C19.4062 5.77721 19.3389 5.74417 19.2814 5.69761C19.2239 5.65104 19.1776 5.59214 19.146 5.52526C19.1143 5.45837 19.0981 5.38521 19.0986 5.31123V0.874844C19.0986 0.743141 19.1508 0.616787 19.2437 0.523405C19.3366 0.430024 19.4627 0.377211 19.5945 0.376495H26.7014C26.8332 0.377211 26.9593 0.430024 27.0522 0.523405C27.1451 0.616787 27.1973 0.743141 27.1973 0.874844"
                fill="currentColor"
              />
              <path
                d="M16.7797 0.376495H11.3472C11.2817 0.376495 11.2169 0.389381 11.1564 0.414425C11.0959 0.43947 11.041 0.476179 10.9947 0.522455C10.9484 0.568731 10.9116 0.623664 10.8866 0.684127C10.8615 0.74459 10.8486 0.8094 10.8486 0.874844V20.1046C10.8529 20.2332 10.907 20.3552 10.9995 20.4447C11.092 20.5341 11.2157 20.5841 11.3445 20.584H16.7824C16.8477 20.5844 16.9125 20.5718 16.973 20.5471C17.0334 20.5223 17.0884 20.4859 17.1347 20.4398C17.1811 20.3937 17.2178 20.339 17.2429 20.2787C17.268 20.2184 17.2809 20.1537 17.2809 20.0884V16.5485V0.874844C17.2802 0.742893 17.2275 0.616545 17.1341 0.52324C17.0408 0.429935 16.9144 0.377207 16.7824 0.376495"
                fill="currentColor"
              />
              <path
                d="M0.969727 14.8368C0.971163 16.3615 1.57811 17.8233 2.65721 18.901C3.73631 19.9787 5.19928 20.584 6.72464 20.584H8.5725C8.63761 20.584 8.70209 20.5712 8.76225 20.5463C8.82241 20.5214 8.87706 20.4849 8.92311 20.4388C8.96915 20.3928 9.00566 20.3382 9.03058 20.278C9.0555 20.2179 9.06834 20.1535 9.06834 20.0884V16.3589C9.06833 16.2453 9.0293 16.1352 8.95778 16.0469C8.88627 15.9587 8.7866 15.8977 8.67546 15.8741L1.56851 14.3546C1.49627 14.3393 1.42153 14.3403 1.34972 14.3576C1.27791 14.3748 1.21086 14.4079 1.15347 14.4543C1.09609 14.5008 1.04981 14.5595 1.01802 14.6261C0.986224 14.6927 0.969731 14.7656 0.969727 14.8394"
                fill="currentColor"
              />
              <path
                d="M0.969727 6.09937V12.521C0.971485 12.6352 1.01262 12.7453 1.08618 12.8326C1.15974 12.92 1.2612 12.9792 1.37344 13.0004L8.47766 14.5198C8.55009 14.5356 8.62514 14.535 8.69729 14.518C8.76944 14.5009 8.83685 14.468 8.89456 14.4214C8.95227 14.3749 8.99882 14.3161 9.03076 14.2492C9.06271 14.1823 9.07925 14.1092 9.07917 14.035V7.6188C9.07866 7.50535 9.03946 7.39549 8.96802 7.30734C8.89659 7.21919 8.7972 7.15804 8.68629 7.13399L1.57936 5.61185C1.50689 5.59647 1.4319 5.59752 1.35989 5.61492C1.28789 5.63232 1.2207 5.66562 1.16326 5.71239C1.10582 5.75915 1.0596 5.81818 1.02799 5.88515C0.996371 5.95212 0.980158 6.02533 0.980558 6.09937"
                fill="currentColor"
              />
              <path
                d="M0.969727 0.874844V3.79181C0.969733 3.90538 1.00876 4.01551 1.08028 4.10377C1.15179 4.19202 1.25146 4.25303 1.3626 4.27661L8.46683 5.79605C8.53926 5.81184 8.61432 5.8112 8.68646 5.79416C8.75861 5.77713 8.82603 5.74414 8.88374 5.69762C8.94145 5.65111 8.98797 5.59226 9.01992 5.52539C9.05187 5.45852 9.06843 5.38534 9.06834 5.31123V0.874844C9.06835 0.743141 9.01619 0.616787 8.92328 0.523405C8.83037 0.430024 8.70426 0.377211 8.57251 0.376495H1.46556C1.33381 0.377211 1.2077 0.430024 1.11479 0.523405C1.02188 0.616787 0.969725 0.743141 0.969727 0.874844"
                fill="currentColor"
              />
            </svg>
          </div>
        </Link>
        <Link
          href="/account/orders"
          className={`flex flex-col items-center justify-center ${pathname === "/account/orders" ? "opacity-100" : "opacity-70"}`}
        >
          <div className="h-5 w-5 flex items-center justify-center">
            <ClipboardList className="h-5 w-5 text-white" />
          </div>
          <span className="text-[10px] mt-1 text-white">Заказы</span>
        </Link>
        <Link
          href="/account"
          className={`flex flex-col items-center justify-center ${pathname === "/account" || pathname.startsWith("/account/") ? "opacity-100" : "opacity-70"}`}
        >
          <div className="h-5 w-5 flex items-center justify-center relative">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M20 21C20 18.2386 16.4183 16 12 16C7.58172 16 4 18.2386 4 21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-[10px] mt-1 text-white">Мой кабинет</span>
        </Link>
      </div>
    </div>
  )
}

// Add default export to maintain backward compatibility
export default BottomNavigation
