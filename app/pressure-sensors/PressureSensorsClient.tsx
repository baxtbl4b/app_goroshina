"use client"

import React, { useRef } from "react"

import { useState, useEffect } from "react"
import { ChevronLeft, CheckCircle, Clock, Calendar, Heart, Check, X, Search } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Interface for user's saved vehicles
interface UserVehicle {
  id: string
  brand: string
  model: string
  year?: number
}
import { useRouter } from "next/navigation"
import CartButton from "@/components/cart-button"
import { BackButton } from "@/components/back-button"
import CartQuantityButtons from "@/components/cart-quantity-buttons"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/loading-spinner"

// Define the pressure sensor type
interface PressureSensor {
  id: string
  name: string
  brand: string
  price: number
  rrc?: number // Recommended retail price
  image: string
  compatibility: string[]
  description: string
  stock: number
}

export default function PressureSensorsClient() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCompatibility, setSelectedCompatibility] = useState<string>("")
  const [cartCounts, setCartCounts] = useState<Record<string, number>>({})
  const [selectedBrand, setSelectedBrand] = useState<string>("")
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isCartButtonAnimating, setIsCartButtonAnimating] = useState(false)
  const [pressureSensors, setPressureSensors] = useState<PressureSensor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({})
  const [animatingFavorite, setAnimatingFavorite] = useState<string | null>(null)
  const [selectedCar, setSelectedCar] = useState<string>("")
  const [carSearchInput, setCarSearchInput] = useState("")
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [selectedSensorImage, setSelectedSensorImage] = useState<string>("")
  const [selectedSensorName, setSelectedSensorName] = useState<string>("")
  const [showCarSelector, setShowCarSelector] = useState(false)
  const [searchResults, setSearchResults] = useState<{ brands: any[]; models: any[] }>({ brands: [], models: [] })
  const [isSearching, setIsSearching] = useState(false)
  const [carSelectorStep, setCarSelectorStep] = useState<"brand" | "model" | "year">("brand")
  const [selectedCarBrand, setSelectedCarBrand] = useState<any | null>(null)
  const [selectedCarModel, setSelectedCarModel] = useState<any | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [carModels, setCarModels] = useState<any[]>([])
  const [carYears, setCarYears] = useState<number[]>([])
  const [loadingYears, setLoadingYears] = useState(false)
  const [loadingModels, setLoadingModels] = useState(false)
  const router = useRouter()

  // My Garage states
  const [userVehicles, setUserVehicles] = useState<UserVehicle[]>([])
  const [selectedGarageVehicle, setSelectedGarageVehicle] = useState<string | null>(null)
  const [showLeftGradient, setShowLeftGradient] = useState(false)
  const [showRightGradient, setShowRightGradient] = useState(true)
  const garageScrollRef = useRef<HTMLDivElement>(null)

  // Search for cars with debounce
  useEffect(() => {
    if (carSelectorStep !== "brand") return
    if (!carSearchInput || carSearchInput.length < 2) {
      setSearchResults({ brands: [], models: [] })
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/fitment/search?q=${encodeURIComponent(carSearchInput)}`)
        if (response.ok) {
          const data = await response.json()
          setSearchResults(data)
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [carSearchInput, carSelectorStep])

  // Handle brand selection
  const handleCarBrandSelect = async (brand: any) => {
    setSelectedCarBrand(brand)
    setCarSearchInput(brand.name)
    setCarSelectorStep("model")
    setLoadingModels(true)

    try {
      const response = await fetch(`/api/fitment/models?brand_slug=${brand.slug}`)
      if (response.ok) {
        const data = await response.json()
        setCarModels(data.models || [])
      }
    } catch (error) {
      console.error("Failed to load car models:", error)
    } finally {
      setLoadingModels(false)
    }
  }

  // Handle model selection from search results (direct model click)
  const handleModelSelect = async (model: any) => {
    // First set the brand
    setSelectedCarBrand({ name: model.brand || model.brandName, slug: model.brandSlug })
    setSelectedCarModel(model)
    setCarSearchInput(`${model.brand || model.brandName} ${model.name}`)
    setCarSelectorStep("year")

    // Load years
    await loadYearsForModel(model.brandSlug, model.slug)
  }

  // Load years for selected model
  const loadYearsForModel = async (brandSlug: string, modelSlug: string) => {
    setLoadingYears(true)
    setCarYears([])
    try {
      const response = await fetch(`https://api.tirebase.ru/api/fitment?access_token=xN6JxoibNEbSFt952_O5kf-VxL61lOX4k5KAS-iGlBU&brand_slug=${brandSlug}&model_slug=${modelSlug}`)
      if (response.ok) {
        const data = await response.json()
        // API returns array of fitments, each with a year field
        if (Array.isArray(data)) {
          const yearsSet = new Set<number>()
          data.forEach((item: any) => {
            if (item.year) {
              yearsSet.add(item.year)
            }
          })
          const sortedYears = Array.from(yearsSet).sort((a, b) => b - a)
          setCarYears(sortedYears)
        }
      }
    } catch (error) {
      console.error("Failed to load years:", error)
    } finally {
      setLoadingYears(false)
    }
  }

  // Handle model selection from list
  const handleCarModelSelect = async (model: any) => {
    setSelectedCarModel(model)
    setCarSearchInput(`${selectedCarBrand?.name} ${model.name}`)
    setCarSelectorStep("year")

    if (selectedCarBrand?.slug) {
      await loadYearsForModel(selectedCarBrand.slug, model.model_slug || model.slug)
    }
  }

  // Handle year selection
  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    setSelectedCar(`${selectedCarBrand?.name} ${selectedCarModel?.name} ${year}`)
    setCarSearchInput(`${selectedCarBrand?.name} ${selectedCarModel?.name} ${year}`)
    setShowCarSelector(false)
  }

  // Clear car selection
  const clearCarSelection = () => {
    setSelectedCar("")
    setCarSearchInput("")
    setSearchResults({ brands: [], models: [] })
    setSelectedCarBrand(null)
    setSelectedCarModel(null)
    setSelectedYear(null)
    setCarModels([])
    setCarYears([])
    setCarSelectorStep("brand")
  }

  // Fetch pressure sensors from API
  useEffect(() => {
    const fetchSensors = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch("/api/pressure-sensors")
        const result = await response.json()

        if (result.error) {
          setError(result.error)
          setPressureSensors([])
        } else {
          setPressureSensors(result.data || [])
        }
      } catch (err) {
        console.error("Error fetching sensors:", err)
        setError("Ошибка загрузки датчиков")
        setPressureSensors([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSensors()
  }, [])

  // Initialize cart counts from localStorage on component mount
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const counts: Record<string, number> = {}

    cart.forEach((item: any) => {
      if (item.id.startsWith("sensor-")) {
        counts[item.id] = item.quantity || 0
      }
    })

    setCartCounts(counts)
  }, [])

  // Get cart item count
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        const newCount = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0)
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
  }, [])

  // Initialize favorites from localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    const favoritesMap: Record<string, boolean> = {}
    storedFavorites.forEach((item: any) => {
      if (item.id?.startsWith("sensor-")) {
        favoritesMap[item.id] = true
      }
    })
    setFavorites(favoritesMap)
  }, [])

  // Load user vehicles from localStorage for garage
  useEffect(() => {
    const loadUserCars = () => {
      try {
        const storedCars = JSON.parse(localStorage.getItem("userCars") || "[]")
        const vehicles: UserVehicle[] = storedCars.map((car: any) => ({
          id: car.id,
          brand: car.brand,
          model: car.model,
          year: car.year,
        }))
        setUserVehicles(vehicles)
      } catch (error) {
        console.error("Error loading user cars:", error)
        setUserVehicles([])
      }
    }

    loadUserCars()

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userCars") {
        loadUserCars()
      }
    }

    // Reload when user navigates back
    const handleFocus = () => {
      loadUserCars()
    }

    // Listen for custom event when cars are updated in the same tab
    const handleCarsUpdated = () => {
      loadUserCars()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("focus", handleFocus)
    window.addEventListener("userCarsUpdated", handleCarsUpdated)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", handleFocus)
      window.removeEventListener("userCarsUpdated", handleCarsUpdated)
    }
  }, [])

  // Handle garage scroll for gradient effects
  const handleGarageScroll = () => {
    if (garageScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = garageScrollRef.current
      setShowLeftGradient(scrollLeft > 5)
      setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  // Select vehicle from garage
  const selectGarageVehicle = (vehicle: UserVehicle) => {
    setSelectedGarageVehicle(vehicle.id)
    // Set the car selection based on garage vehicle
    setSelectedCarBrand({ name: vehicle.brand, slug: vehicle.brand.toLowerCase() })
    setSelectedCarModel({ name: vehicle.model, slug: vehicle.model.toLowerCase() })
    setSelectedYear(vehicle.year || null)
    setSelectedCar(`${vehicle.brand} ${vehicle.model}${vehicle.year ? ` ${vehicle.year}` : ""}`)
    setCarSearchInput(`${vehicle.brand} ${vehicle.model}${vehicle.year ? ` ${vehicle.year}` : ""}`)
    setShowCarSelector(false)
  }

  // Function to toggle favorite
  const toggleFavorite = (sensor: PressureSensor, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Animate
    setAnimatingFavorite(sensor.id)
    setTimeout(() => setAnimatingFavorite(null), 300)

    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    const isFavorite = favorites[sensor.id]

    if (isFavorite) {
      // Remove from favorites
      const updatedFavorites = storedFavorites.filter((item: any) => item.id !== sensor.id)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      setFavorites(prev => ({ ...prev, [sensor.id]: false }))
    } else {
      // Add to favorites
      storedFavorites.push({
        ...sensor,
        type: "sensor"
      })
      localStorage.setItem("favorites", JSON.stringify(storedFavorites))
      setFavorites(prev => ({ ...prev, [sensor.id]: true }))
    }

    window.dispatchEvent(new Event("favoritesUpdated"))
  }

  // Function to handle cart button click
  const handleCartClick = () => {
    setIsCartButtonAnimating(true)
    setTimeout(() => {
      setIsCartButtonAnimating(false)
      router.push("/order")
    }, 300)
  }

  // Function to add a sensor to the cart
  const addToCart = (sensor: PressureSensor, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Update local state
    setCartCounts((prev) => ({
      ...prev,
      [sensor.id]: (prev[sensor.id] || 0) + 1,
    }))

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Prepare vehicle info if selected
    const vehicleInfo = selectedCarBrand && selectedCarModel && selectedYear ? {
      carBrand: selectedCarBrand.name,
      carModel: selectedCarModel.name,
      carYear: selectedYear
    } : null

    console.log("🚗 Adding to cart with vehicle info:", vehicleInfo)

    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === sensor.id)

    if (existingItemIndex >= 0) {
      // If item exists, increase quantity and update vehicle info if provided
      cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1
      if (vehicleInfo) {
        cart[existingItemIndex].vehicle = vehicleInfo
      }
    } else {
      // Otherwise add new item with vehicle info
      cart.push({ ...sensor, quantity: 1, ...(vehicleInfo && { vehicle: vehicleInfo }) })
    }

    console.log("💾 Cart after adding:", cart)

    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(cart))

    // Dispatch event to update other components
    window.dispatchEvent(new Event("cartUpdated"))

    // Update cart counter in footer
    const cartUpdateEvent = new CustomEvent("cartItemAdded", {
      detail: {
        totalItems: cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0),
      },
    })
    window.dispatchEvent(cartUpdateEvent)
  }

  // Function to remove a sensor from the cart
  const removeFromCart = (sensor: PressureSensor, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // If item not in cart, do nothing
    if (!cartCounts[sensor.id] || cartCounts[sensor.id] <= 0) return

    // Update local state
    setCartCounts((prev) => ({
      ...prev,
      [sensor.id]: Math.max(0, (prev[sensor.id] || 0) - 1),
    }))

    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Find item in cart
    const existingItemIndex = cart.findIndex((item: any) => item.id === sensor.id)

    if (existingItemIndex >= 0) {
      // Decrease quantity
      cart[existingItemIndex].quantity = Math.max(0, (cart[existingItemIndex].quantity || 1) - 1)

      // If quantity is 0, remove item from cart
      if (cart[existingItemIndex].quantity === 0) {
        cart.splice(existingItemIndex, 1)
      }
    }

    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(cart))

    // Dispatch event to update other components
    window.dispatchEvent(new Event("cartUpdated"))

    // Update cart counter in footer
    const cartUpdateEvent = new CustomEvent("cartItemAdded", {
      detail: {
        totalItems: cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0),
      },
    })
    window.dispatchEvent(cartUpdateEvent)
  }

  // Get unique brands from loaded sensors
  const availableBrands = Array.from(new Set(pressureSensors.map((sensor) => sensor.brand))).sort()

  // Get unique compatibility options from all sensors
  const allCompatibilityOptions = Array.from(new Set(pressureSensors.flatMap((sensor) => sensor.compatibility))).sort()

  // Filter sensors based on selected compatibility and brand
  const filteredSensors = pressureSensors.filter((sensor) => {
    if (selectedCompatibility && !sensor.compatibility.includes(selectedCompatibility)) {
      return false
    }
    if (selectedBrand && sensor.brand !== selectedBrand) {
      return false
    }
    return true
  })


  // Function to format price
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Function to determine stock status
  const getStockStatus = (stock: number) => {
    if (stock > 10) {
      return {
        tooltip: "Сегодня",
        className: "text-green-500",
        icon: <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />,
      }
    } else if (stock > 0) {
      return {
        tooltip: "Доставка 1-2 дня",
        className: "text-blue-500",
        icon: <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />,
      }
    } else {
      return {
        tooltip: "Доставка 3 и более дня",
        className: "text-orange-500",
        icon: <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />,
      }
    }
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
              <span className="island-text">Датчики давления</span>
            </div>
          </div>
        </div>

        {/* Global cart button - outside container */}
        <div style={{ position: "fixed", right: "16px", top: "30px", transform: "translateY(-50%)", zIndex: 100 }}>
          <CartButton />
        </div>
      </header>

      <div className="flex-1 px-4 pt-4 pb-[200px] space-y-4">
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#009CFF]"></div>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-4 text-center">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filteredSensors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Датчики давления не найдены</p>
          </div>
        )}

        {/* Sensors list */}
        <div className="space-y-4">
          {!isLoading && !error && filteredSensors.map((sensor) => {
            const stockStatus = getStockStatus(sensor.stock)
            const availableStock = sensor.stock - (cartCounts[sensor.id] || 0)
            return (
              <div key={sensor.id} className="bg-white dark:bg-[#2A2A2A] rounded-xl overflow-hidden shadow-sm flex">
                {/* Left side - Image */}
                <div className="relative p-2 sm:p-3 md:p-4 flex-shrink-0 w-[145px] sm:w-[190px] md:w-[234px] lg:w-[263px] overflow-hidden bg-white rounded-l-xl" style={{ maxHeight: "248px" }}>
                  <div
                    className="flex justify-center items-center h-full w-full relative overflow-hidden bg-transparent"
                    style={{ zIndex: 1 }}
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="w-full h-0 pb-[100%] relative">
                        <img
                          src={sensor.image || "/images/sensor-placeholder.png"}
                          alt={sensor.name || "Датчик"}
                          className="absolute inset-0 w-full h-full object-contain cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setSelectedSensorImage(sensor.image || "/images/sensor-placeholder.png")
                            setSelectedSensorName(sensor.name)
                            setImageModalOpen(true)
                          }}
                          onError={(e) => {
                            e.currentTarget.src = "/images/sensor-placeholder.png"
                          }}
                          style={{
                            filter: "drop-shadow(0 0 1px rgba(0,0,0,0.1))",
                            backgroundColor: "transparent",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Content */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  {/* Top section */}
                  <div className="flex flex-col gap-2">
                    {/* Delivery status and favorite button */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-[#3A3A3A] rounded-full">
                        <span className="flex items-center justify-center">
                          {React.cloneElement(stockStatus.icon as React.ReactElement, {
                            className: `h-4 w-4 sm:h-5 sm:w-5 ${
                              (stockStatus.icon as React.ReactElement).props.className
                            }`,
                          })}
                        </span>
                        <span className={`text-xs sm:text-sm font-medium whitespace-nowrap ${stockStatus.className}`}>
                          {stockStatus.tooltip}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* China flag for Sulit brand */}
                        {sensor.brand === "Sulit" && (
                          <img
                            src="https://flagcdn.com/w20/cn.png"
                            alt="Китай"
                            className="rounded-sm w-5 h-[14px]"
                          />
                        )}
                        {/* Germany flag for BHsens brand */}
                        {sensor.brand === "BHsens" && (
                          <img
                            src="https://flagcdn.com/w20/de.png"
                            alt="Германия"
                            className="rounded-sm w-5 h-[14px]"
                          />
                        )}

                        {/* Favorite button */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 p-0"
                          onClick={(e) => toggleFavorite(sensor, e)}
                          aria-label={favorites[sensor.id] ? "Удалить из избранного" : "Добавить в избранное"}
                        >
                          <Heart
                            className={`h-5 w-5 transition-all duration-200 ${
                              animatingFavorite === sensor.id
                                ? "scale-125 text-blue-500 fill-blue-500"
                                : favorites[sensor.id]
                                  ? "text-blue-500 fill-blue-500"
                                  : "text-gray-400 hover:text-gray-500"
                            }`}
                          />
                        </Button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-medium text-[#1F1F1F] dark:text-white line-clamp-2 text-sm sm:text-base md:text-lg leading-tight">
                      {sensor.name}
                    </h3>
                  </div>

                  {/* Bottom section - price, stock and cart */}
                  <div className="flex flex-col gap-2 mt-2">
                    {/* Price row */}
                    <div className="flex items-center justify-end">
                      <div className="flex flex-row items-end gap-2">
                        {sensor.rrc && sensor.rrc > sensor.price && (
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                            {formatPrice(sensor.rrc)}
                          </p>
                        )}
                        <p className="text-base sm:text-lg md:text-xl font-bold text-[#1F1F1F] dark:text-white">
                          {formatPrice(sensor.price)}
                        </p>
                      </div>
                    </div>

                    {/* Stock and cart buttons row */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {availableStock > 0 ? (
                          <span
                            className={`h-8 sm:h-9 md:h-10 flex items-center text-xs sm:text-sm md:text-base font-medium px-3 rounded-full ${
                              availableStock > 10 ? "bg-green-500/20 text-green-600 dark:text-green-400" :
                              availableStock > 5 ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" :
                              "bg-orange-500/20 text-orange-600 dark:text-orange-400"
                            }`}
                          >
                            {availableStock > 20 ? ">20 шт" : `${availableStock} шт`}
                          </span>
                        ) : (
                          <span className="h-8 sm:h-9 md:h-10 flex items-center text-xs sm:text-sm md:text-base font-medium px-3 rounded-full bg-red-500/20 text-red-600 dark:text-red-400">
                            Нет в наличии
                          </span>
                        )}
                      </div>
                      <CartQuantityButtons
                        count={cartCounts[sensor.id] || 0}
                        maxStock={sensor.stock}
                        onAdd={(e) => addToCart(sensor, e)}
                        onRemove={(e) => removeFromCart(sensor, e)}
                        disabled={sensor.stock <= 0}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Image Modal Dialog */}
        <Dialog open={imageModalOpen} onOpenChange={setImageModalOpen}>
          <DialogContent
            className="sm:max-w-[600px] flex items-center justify-center p-1 border-0 shadow-none bg-transparent"
            style={{ zIndex: 50 }}
            hideCloseButton={true}
          >
            <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200 dark:from-[#2a2a2a] dark:to-[#1a1a1a] rounded-lg">
              <img
                src={selectedSensorImage || "/images/sensor-placeholder.png"}
                alt={selectedSensorName || "Датчик"}
                className="object-contain max-h-[80vh]"
                style={{
                  filter: "drop-shadow(0 0 1px rgba(0,0,0,0.1))",
                  backgroundColor: "transparent",
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bottom panel - Car selection for programming */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#2A2A2A] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] px-4 pt-3 pb-6"
      >
        {/* Info text */}
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-3">
          {selectedCar
            ? `Датчики совместимы с ${selectedCar}`
            : "Выберите модель авто для программирования сенсора"
          }
        </p>

        {/* Filter content */}
        <div className="flex gap-3 items-center mb-3">
          {/* Car search input */}
          <div className="flex-1 relative">
            <div className="relative">
              <input
                type="text"
                value={carSearchInput}
                onChange={(e) => {
                  const value = e.target.value
                  setCarSearchInput(value)

                  if (carSelectorStep !== "brand" && value !== `${selectedCarBrand?.name}` && value !== `${selectedCarBrand?.name} ${selectedCarModel?.name}` && value !== selectedCar) {
                    clearCarSelection()
                    setCarSearchInput(value)
                  }

                  setSelectedGarageVehicle(null)

                  if (value.trim() && value.length >= 2) {
                    setShowCarSelector(true)
                  } else {
                    setShowCarSelector(false)
                  }
                }}
                onFocus={() => {
                  if (carSearchInput.length >= 2 || carSelectorStep !== "brand") {
                    setShowCarSelector(true)
                  }
                }}
                placeholder="Введите марку или модель"
                className="w-full h-10 px-3 pr-8 text-sm bg-gray-100 dark:bg-[#333333] border-0 rounded-lg text-[#1F1F1F] dark:text-white focus:ring-2 focus:ring-[#c4d402] focus:outline-none"
                style={{ fontSize: '16px' }}
              />
              {carSearchInput && (
                <button
                  onClick={() => {
                    clearCarSelection()
                    setSelectedGarageVehicle(null)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Search results dropdown */}
            {showCarSelector && (carSearchInput.length >= 2 || carSelectorStep !== "brand") && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white dark:bg-[#2A2A2A] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                <div className="p-2">
                  {/* Step 1: Brand search */}
                  {carSelectorStep === "brand" && (
                    <>
                      {isSearching && (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          Поиск...
                        </div>
                      )}
                      {!isSearching && carSearchInput.length >= 2 && (
                        <>
                          {searchResults.brands?.length > 0 && (
                            <div className="mb-2">
                              <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 font-semibold">
                                МАРКИ
                              </div>
                              {searchResults.brands.map((brand: any) => (
                                <div
                                  key={`brand-${brand.slug}`}
                                  className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                                  onClick={() => handleCarBrandSelect(brand)}
                                >
                                  <span className="text-sm text-[#1F1F1F] dark:text-white font-medium">{brand.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          {searchResults.models?.length > 0 && (
                            <div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 font-semibold">
                                МОДЕЛИ
                              </div>
                              {searchResults.models.map((model: any) => (
                                <div
                                  key={`model-${model.brandSlug}-${model.slug}`}
                                  className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                                  onClick={() => handleModelSelect(model)}
                                >
                                  <div className="flex flex-col">
                                    <span className="text-sm text-[#1F1F1F] dark:text-white">{model.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{model.brand || model.brandName}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {!searchResults.brands?.length && !searchResults.models?.length && (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              Ничего не найдено
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* Step 2: Model selection */}
                  {carSelectorStep === "model" && (
                    <>
                      <button
                        className="w-full text-left p-2 mb-2 text-sm text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        onClick={() => {
                          setCarSelectorStep("brand")
                          setSelectedCarBrand(null)
                          setCarModels([])
                          setCarSearchInput("")
                        }}
                      >
                        ← Назад к маркам
                      </button>
                      {loadingModels ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          Загрузка моделей...
                        </div>
                      ) : carModels.length > 0 ? (
                        carModels.map((model: any) => (
                          <div
                            key={model.slug}
                            className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                            onClick={() => handleCarModelSelect(model)}
                          >
                            <span className="text-sm text-[#1F1F1F] dark:text-white">{model.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          Нет доступных моделей
                        </div>
                      )}
                    </>
                  )}

                  {/* Step 3: Year selection */}
                  {carSelectorStep === "year" && selectedCarModel && (
                    <>
                      <button
                        className="w-full text-left p-2 mb-2 text-sm text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        onClick={() => {
                          setCarSelectorStep("model")
                          setSelectedCarModel(null)
                          setCarYears([])
                          setCarSearchInput(selectedCarBrand?.name || "")
                        }}
                      >
                        ← Назад к моделям
                      </button>
                      {loadingYears ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          Загрузка годов...
                        </div>
                      ) : carYears.length > 0 ? (
                        <div className="grid grid-cols-4 gap-1">
                          {carYears.map((year: number) => (
                            <div
                              key={year}
                              className="flex items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                              onClick={() => handleYearSelect(year)}
                            >
                              <span className="text-sm text-[#1F1F1F] dark:text-white">{year}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          Нет доступных годов
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* My Garage section */}
        <div className="relative">
          {/* Left gradient fade-out overlay */}
          <div
            className={`absolute top-0 left-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-[#2A2A2A] to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showLeftGradient ? 'opacity-100' : 'opacity-0'}`}
          ></div>
          <div
            ref={garageScrollRef}
            onScroll={handleGarageScroll}
            className="flex gap-1 overflow-x-auto scrollbar-hide px-1"
          >
            {userVehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                onClick={() => selectGarageVehicle(vehicle)}
                className={`text-xs px-2 py-0.5 rounded-xl border whitespace-nowrap flex-shrink-0 ${
                  selectedGarageVehicle === vehicle.id
                    ? "bg-[#c4d402] border-[#c4d402] text-[#1F1F1F]"
                    : "bg-white dark:bg-[#3A3A3A] border-[#D9D9DD] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white"
                }`}
              >
                {vehicle.brand} {vehicle.model}{vehicle.year ? ` ${vehicle.year}` : ""}
              </button>
            ))}
            {userVehicles.length < 2 && (
              <a
                href="/account/cars/add"
                className="text-xs px-2 py-0.5 rounded-xl border whitespace-nowrap flex-shrink-0 bg-white dark:bg-[#3A3A3A] border-[#D9D9DD] dark:border-[#3A3A3A] text-gray-500 dark:text-gray-400 hover:border-[#c4d402] hover:text-[#1F1F1F] dark:hover:text-white transition-colors"
              >
                + Добавить
              </a>
            )}
          </div>
          {/* Right gradient fade-out overlay */}
          <div
            className={`absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#2A2A2A] to-transparent pointer-events-none z-10 transition-opacity duration-200 ${showRightGradient ? 'opacity-100' : 'opacity-0'}`}
          ></div>
        </div>

      </div>
    </main>
  )
}
