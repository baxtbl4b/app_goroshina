"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Heart, CheckCircle, Clock, Calendar } from "lucide-react"
import { formatPrice } from "@/lib/api"
import CartButton from "@/components/cart-button"
import CartQuantityButtons from "@/components/cart-quantity-buttons"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BackButton } from "@/components/back-button"

interface Dokatka {
  id: number
  title: string
  hash: string
  price: number
  wholesalePrice: number
  quantity: number
  storages?: any
  params: {
    width?: string
    height?: string
    diam?: string
    pn?: string
    dia?: string
    ndm?: string
  }
  category?: {
    id: number
    name: string
  }
}

export default function DokatkiPage() {
  const [dokatki, setDokatki] = useState<Dokatka[]>([])
  const [filteredDokatki, setFilteredDokatki] = useState<Dokatka[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cartCounts, setCartCounts] = useState<Record<number, number>>({})
  const [favorites, setFavorites] = useState<number[]>([])

  // Filter states
  const [selectedPCD, setSelectedPCD] = useState<string>("")
  const [selectedDIA, setSelectedDIA] = useState<string>("")

  // Collapse/swipe states
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [touchEndY, setTouchEndY] = useState<number | null>(null)
  const [handleTouchStartY, setHandleTouchStartY] = useState<number | null>(null)
  const [isHandleHighlighted, setIsHandleHighlighted] = useState(false)
  const handleHighlightTimeout = useRef<NodeJS.Timeout | null>(null)

  // Available filter values
  const [availablePCD, setAvailablePCD] = useState<string[]>([])
  const [availableDIA, setAvailableDIA] = useState<string[]>([])

  // Load dokatki data from API
  useEffect(() => {
    async function loadDokatki() {
      try {
        const response = await fetch("/api/dokatki")
        if (response.ok) {
          const data = await response.json()
          console.log("Loaded dokatki:", data)
          setDokatki(data.items)
          setFilteredDokatki(data.items)

          // Extract unique filter values
          const pcdSet = new Set<string>()
          const diaSet = new Set<string>()

          // Извлекаем параметры только из товаров в наличии
          data.items.forEach((item: Dokatka) => {
            if (item.quantity > 0) {
              if (item.params.pn) pcdSet.add(item.params.pn)
              if (item.params.dia) diaSet.add(item.params.dia)
            }
          })

          setAvailablePCD(Array.from(pcdSet).sort())
          setAvailableDIA(Array.from(diaSet).sort((a, b) => parseFloat(a) - parseFloat(b)))
        }
      } catch (error) {
        console.error("Error loading dokatki:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDokatki()
  }, [])

  // Load cart and favorites
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        const newCartCounts: Record<number, number> = {}
        cart.forEach((item: any) => {
          if (item.type === "dokatka") {
            newCartCounts[item.id] = item.quantity || 0
          }
        })
        setCartCounts(newCartCounts)
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }

    const loadFavorites = () => {
      try {
        const favs = JSON.parse(localStorage.getItem("dokatki_favorites") || "[]")
        setFavorites(favs)
      } catch (error) {
        console.error("Error loading favorites:", error)
      }
    }

    updateCartCount()
    loadFavorites()

    window.addEventListener("cartUpdated", updateCartCount)
    return () => window.removeEventListener("cartUpdated", updateCartCount)
  }, [])

  // Apply filters
  useEffect(() => {
    // Сначала фильтруем только товары в наличии
    let filtered = dokatki.filter(item => item.quantity > 0)

    if (selectedPCD) {
      filtered = filtered.filter(item =>
        item.params.pn && item.params.pn === selectedPCD
      )
    }

    if (selectedDIA) {
      filtered = filtered.filter(item =>
        item.params.dia && item.params.dia === selectedDIA
      )
    }

    setFilteredDokatki(filtered)
  }, [selectedPCD, selectedDIA, dokatki])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (handleHighlightTimeout.current) {
        clearTimeout(handleHighlightTimeout.current)
      }
    }
  }, [])

  const resetFilters = () => {
    setSelectedPCD("")
    setSelectedDIA("")
  }

  // Function to highlight handle
  const highlightHandle = () => {
    setIsHandleHighlighted(true)
    if (handleHighlightTimeout.current) {
      clearTimeout(handleHighlightTimeout.current)
    }
    handleHighlightTimeout.current = setTimeout(() => {
      setIsHandleHighlighted(false)
    }, 1000)
  }

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    setFavorites(newFavorites)
    localStorage.setItem("dokatki_favorites", JSON.stringify(newFavorites))
  }

  const addToCart = (e: React.MouseEvent, item: Dokatka) => {
    e.preventDefault()
    e.stopPropagation()

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingIndex = cart.findIndex((c: any) => c.id === item.id && c.type === "dokatka")

    if (existingIndex >= 0) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1
    } else {
      cart.push({ ...item, quantity: 1, type: "dokatka" })
    }

    localStorage.setItem("cart", JSON.stringify(cart))

    // Update local state
    const newCartCounts = { ...cartCounts, [item.id]: (cartCounts[item.id] || 0) + 1 }
    setCartCounts(newCartCounts)

    // Dispatch events
    window.dispatchEvent(new Event("cartUpdated"))
    window.dispatchEvent(new CustomEvent("cartItemAdded", {
      detail: {
        totalItems: cart.reduce((total: number, i: any) => total + (i.quantity || 1), 0),
      },
    }))
  }

  const removeFromCart = (e: React.MouseEvent, id: number) => {
    e.preventDefault()
    e.stopPropagation()

    if (!cartCounts[id]) return

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingIndex = cart.findIndex((item: any) => item.id === id && item.type === "dokatka")

    if (existingIndex >= 0) {
      cart[existingIndex].quantity = Math.max(0, (cart[existingIndex].quantity || 1) - 1)
      if (cart[existingIndex].quantity === 0) {
        cart.splice(existingIndex, 1)
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart))

    // Update local state
    const newCartCounts = { ...cartCounts, [id]: Math.max(0, (cartCounts[id] || 0) - 1) }
    setCartCounts(newCartCounts)

    // Dispatch event
    window.dispatchEvent(new Event("cartUpdated"))
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212] pt-[60px]">
      <style jsx global>{`
        /* Dynamic Island style header */
        .island-container {
          position: fixed;
          left: 50%;
          top: 30px;
          transform: translateX(-50%) translateY(-50%);
          height: 34px;
          z-index: 51;
          -webkit-tap-highlight-color: transparent;
        }

        .island-highlight {
          background: #c4d402;
          border-radius: 50px;
          z-index: 2;
          height: 34px;
          width: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .island-text {
          color: #1F1F1F;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
        }
      `}</style>

      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1F1F1F] shadow-sm flex flex-col items-center h-[calc(60px+env(safe-area-inset-top))] pt-[env(safe-area-inset-top)] overflow-visible"
        style={{ "--header-height": "60px" } as React.CSSProperties}
      >
        <div className="container max-w-md flex items-center justify-center h-full relative overflow-visible">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 z-50">
            <BackButton />
          </div>

          {/* Dynamic Island style title */}
          <div className="island-container">
            <div className="island-highlight">
              <span className="island-text">Докатки</span>
            </div>
          </div>
        </div>

        {/* Global cart button - outside container */}
        <div style={{ position: "fixed", right: "16px", top: "30px", transform: "translateY(-50%)", zIndex: 100 }}>
          <CartButton />
        </div>
      </header>

      <div className="flex-1 px-4 pt-4 pb-64">
        {/* Dokatki grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009CFF]"></div>
          </div>
        ) : filteredDokatki.length > 0 ? (
          <div className="space-y-4 pb-32">
            {filteredDokatki.map((dokatka) => {
              // Определяем статус доставки на основе количества
              const getStockStatus = () => {
                if (dokatka.quantity > 10) {
                  return {
                    tooltip: "Сегодня",
                    className: "text-green-500",
                    icon: <CheckCircle className="h-[13.2px] w-[13.2px] sm:h-[17.6px] sm:w-[17.6px] md:h-[19.8px] md:w-[19.8px] text-green-500" />
                  }
                } else if (dokatka.quantity > 0) {
                  return {
                    tooltip: "1-2 дня",
                    className: "text-blue-500",
                    icon: <Clock className="h-[13.2px] w-[13.2px] sm:h-[17.6px] sm:w-[17.6px] md:h-[19.8px] md:w-[19.8px] text-blue-500" />
                  }
                } else {
                  return {
                    tooltip: "3+ дня",
                    className: "text-orange-500",
                    icon: <Calendar className="h-[13.2px] w-[13.2px] sm:h-[17.6px] sm:w-[17.6px] md:h-[19.8px] md:w-[19.8px] text-orange-500" />
                  }
                }
              }

              const stockStatus = getStockStatus()

              return (
                <div key={dokatka.id} className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm flex">
                  {/* Image */}
                  <div className="relative p-2 sm:p-3 md:p-4 flex-shrink-0 w-[145px] sm:w-[190px] md:w-[234px] lg:w-[263px] overflow-hidden flex items-center justify-center bg-white rounded-l-xl">
                    <div className="w-full h-full relative">
                      <Image
                        src="/images/dokatka.png"
                        alt={dokatka.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-[11px] sm:p-[15.4px] md:p-[22px] flex-1 flex flex-col justify-between gap-[11px] sm:gap-[15.4px]">
                    <div className="flex flex-col gap-[8.8px]">
                      <div className="flex items-center gap-[4.4px] sm:gap-[8.8px] md:gap-[13.2px] flex-wrap">
                        {/* Срок доставки */}
                        <div className="flex items-center gap-[4.4px] sm:gap-[6.6px] px-[6.6px] sm:px-[8.8px] md:px-[11px] py-[4.4px] bg-gray-100 dark:bg-[#3A3A3A] rounded-full">
                          <span className="flex items-center justify-center">
                            {stockStatus.icon}
                          </span>
                          <span className={`text-[9px] sm:text-[11px] md:text-[13px] font-medium whitespace-nowrap ${stockStatus.className}`}>
                            {stockStatus.tooltip}
                          </span>
                        </div>

                        <span className="flex-grow"></span>

                        {/* Flag - China for all dokatki */}
                        <div className="flex items-center gap-1.5">
                          <div className="relative w-[18px] h-[13px] sm:w-[23px] sm:h-[16px]">
                            <Image
                              src="https://flagcdn.com/cn.svg"
                              alt="Китай"
                              width={23}
                              height={16}
                              className="rounded-sm w-[18px] h-[13px] sm:w-[23px] sm:h-[16px] border border-gray-200"
                            />
                          </div>
                        </div>

                        {/* Favorite button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 p-0"
                          onClick={(e) => toggleFavorite(e, dokatka.id)}
                          aria-label={favorites.includes(dokatka.id) ? "Удалить из избранного" : "Добавить в избранное"}
                        >
                          <Heart
                            className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 transition-colors ${
                              favorites.includes(dokatka.id)
                                ? "text-blue-500 fill-blue-500"
                                : "text-gray-400"
                            }`}
                          />
                        </Button>
                      </div>

                      {/* Title */}
                      <h3 className="font-medium text-[#1F1F1F] dark:text-white line-clamp-2 text-[14.3px] sm:text-[16.5px] md:text-[18.7px] lg:text-[22px] leading-tight">
                        {dokatka.title}
                      </h3>
                    </div>

                    {/* Price and cart section */}
                    <div className="flex flex-col relative pb-8 sm:pb-9 md:pb-11 -mt-[10px]">
                      <div className="flex items-center justify-end w-full mb-3 sm:mb-4">
                        <div className="flex flex-row items-end gap-2">
                          <p className="text-[16.5px] sm:text-[18.7px] md:text-[23.1px] font-bold text-[#1F1F1F] dark:text-white">
                            {formatPrice(dokatka.price)}
                          </p>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center">
                        <div className="flex flex-col items-start">
                          {(() => {
                            const availableStock = dokatka.quantity - (cartCounts[dokatka.id] || 0)
                            if (availableStock > 0) {
                              return (
                                <span
                                  className={`h-[31px] sm:h-[34px] md:h-[40px] flex items-center text-[12px] sm:text-[14px] md:text-[16px] font-medium px-3 rounded-full ${
                                    availableStock > 10 ? "bg-green-500/20 text-green-600 dark:text-green-400" :
                                    availableStock > 5 ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
                                    "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                                  }`}
                                >
                                  {availableStock > 20 ? ">20 шт" : `${availableStock} шт`}
                                </span>
                              )
                            } else {
                              return (
                                <span className="h-[31px] sm:h-[34px] md:h-[40px] flex items-center text-[12px] sm:text-[14px] md:text-[16px] font-medium px-3 rounded-full bg-red-500/20 text-red-600 dark:text-red-400">
                                  Нет в наличии
                                </span>
                              )
                            }
                          })()}
                        </div>
                        <CartQuantityButtons
                          count={cartCounts[dokatka.id] || 0}
                          maxStock={dokatka.quantity}
                          onAdd={(e) => addToCart(e, dokatka)}
                          onRemove={(e) => removeFromCart(e, dokatka.id)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 pb-32 text-gray-600 dark:text-gray-400">
            <p className="text-lg font-medium mb-2">Ничего не найдено</p>
            <p className="text-sm">Попробуйте изменить фильтры</p>
          </div>
        )}
      </div>

      {/* Bottom filters */}
      <div
        className="px-4 pt-2 pb-8 fixed left-0 right-0 z-40 transition-all duration-300 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] bg-white dark:bg-[#2A2A2A] backdrop-blur-md"
        style={{
          bottom: '0',
          transform: isFilterCollapsed ? 'translateY(calc(100% - 56px))' : 'translateY(0)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 1) 100%)',
          maskImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.98) 0%, rgba(0, 0, 0, 1) 100%)',
          touchAction: isFilterCollapsed ? 'none' : 'pan-x pinch-zoom',
          WebkitOverflowScrolling: 'touch',
        }}
        onTouchStart={(e) => {
          if (isFilterCollapsed) {
            e.preventDefault()
            setTouchStartY(e.touches[0].clientY)
            setTouchEndY(null)
          }
        }}
        onTouchMove={(e) => {
          if (isFilterCollapsed && touchStartY !== null) {
            e.preventDefault()
            setTouchEndY(e.touches[0].clientY)
          }
        }}
        onTouchEnd={() => {
          if (isFilterCollapsed && touchStartY !== null && touchEndY !== null) {
            const diff = touchEndY - touchStartY
            if (diff < -20) {
              setIsFilterCollapsed(false)
              highlightHandle()
            }
          }
          setTouchStartY(null)
          setTouchEndY(null)
        }}
      >
        {/* Swipe handle */}
        <div
          className="flex items-center justify-center -mx-4 px-4 py-3"
          style={{ touchAction: 'none' }}
        >
          <button
            className="flex items-center justify-center cursor-pointer w-full group"
            style={{ touchAction: 'none' }}
            onClick={() => {
              setIsFilterCollapsed(!isFilterCollapsed)
              highlightHandle()
            }}
            onTouchStart={(e) => {
              e.preventDefault()
              setHandleTouchStartY(e.touches[0].clientY)
            }}
            onTouchMove={(e) => {
              e.preventDefault()
              if (handleTouchStartY !== null) {
                setTouchEndY(e.touches[0].clientY)
              }
            }}
            onTouchEnd={(e) => {
              e.preventDefault()
              if (handleTouchStartY !== null) {
                const endY = e.changedTouches[0].clientY
                const diff = endY - handleTouchStartY
                if (Math.abs(diff) > 20) {
                  if (diff < 0) {
                    if (isFilterCollapsed) {
                      setIsFilterCollapsed(false)
                      highlightHandle()
                    }
                  } else {
                    if (!isFilterCollapsed) {
                      setIsFilterCollapsed(true)
                      highlightHandle()
                    }
                  }
                }
                setHandleTouchStartY(null)
                setTouchEndY(null)
              }
            }}
            aria-label={isFilterCollapsed ? "Нажмите для раскрытия фильтра" : "Нажмите для скрытия фильтра"}
            aria-expanded={!isFilterCollapsed}
          >
            <div className="flex flex-col items-center gap-1">
              <div className={`w-16 h-1.5 rounded-full transition-colors duration-300 ${isHandleHighlighted ? 'bg-[#c4d402]' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
              {isFilterCollapsed && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-400 dark:text-gray-500 animate-bounce"
                >
                  <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* Filter content */}
        <div className={`transition-all duration-300 ${isFilterCollapsed ? 'hidden' : 'block'}`}>
          <div className="flex flex-col gap-3">
            <div className="flex items-end gap-3">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <div>
                  <Label htmlFor="pcd-filter" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1 block text-center">
                    PCD
                  </Label>
                  <Select value={selectedPCD} onValueChange={setSelectedPCD}>
                    <SelectTrigger id="pcd-filter" className="w-full bg-white dark:bg-[#333333] text-gray-900 dark:text-white border border-gray-300 dark:border-0 rounded-xl text-center">
                      <SelectValue placeholder="~" />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePCD.map((pcd) => (
                        <SelectItem key={pcd} value={pcd} className="pl-0 pr-0 justify-center [&_svg]:hidden [&>span]:flex [&>span]:w-full [&>span]:justify-center">
                          {pcd}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dia-filter" className="text-xs text-[#1F1F1F] dark:text-gray-300 mb-1 block text-center">
                    DIA
                  </Label>
                  <Select value={selectedDIA} onValueChange={setSelectedDIA}>
                    <SelectTrigger id="dia-filter" className="w-full bg-white dark:bg-[#333333] text-gray-900 dark:text-white border border-gray-300 dark:border-0 rounded-xl text-center">
                      <SelectValue placeholder="~" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDIA.map((dia) => (
                        <SelectItem key={dia} value={dia} className="pl-0 pr-0 justify-center [&_svg]:hidden [&>span]:flex [&>span]:w-full [&>span]:justify-center">
                          {dia} мм
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className={`h-10 px-3 text-xs border-0 rounded-xl transition-all duration-300 ${
                  selectedPCD || selectedDIA
                    ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 active:scale-95 shadow-md hover:shadow-red-500/30"
                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
                disabled={!selectedPCD && !selectedDIA}
              >
                Сбросить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
