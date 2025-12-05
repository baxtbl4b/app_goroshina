"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Sample brand data - replace with your actual data source
const availableBrands = [
  "Michelin",
  "Continental",
  "Bridgestone",
  "Pirelli",
  "Goodyear",
  "Dunlop",
  "Hankook",
  "Yokohama",
  "Nokian",
  "Toyo",
  "Kumho",
  "Falken",
  "Sailun",
  "Triangle",
  "Ikon Tyres",
]

interface BrandSelectorProps {
  onBrandsChange?: (brands: string[]) => void
  className?: string
}

export function BrandSelector({ onBrandsChange, className }: BrandSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter brands based on search query
  const filteredBrands = availableBrands.filter((brand) => brand.toLowerCase().includes(searchQuery.toLowerCase()))

  // Handle brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) => {
      const newSelection = prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]

      // Notify parent component if callback provided
      if (onBrandsChange) {
        onBrandsChange(newSelection)
      }

      return newSelection
    })
  }

  // Add brand from search input
  const addBrandFromInput = () => {
    if (!searchQuery.trim()) return

    // Check if the brand already exists (case insensitive)
    const existingBrand = availableBrands.find((brand) => brand.toLowerCase() === searchQuery.toLowerCase())

    if (existingBrand) {
      // Add the existing brand with correct casing
      if (!selectedBrands.includes(existingBrand)) {
        toggleBrand(existingBrand)
      }
    } else {
      // Add the new brand as typed
      toggleBrand(searchQuery.trim())
    }

    // Clear search after adding
    setSearchQuery("")
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle key press in search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addBrandFromInput()
    }
  }

  return (
    <div className={cn("relative w-full", className)} ref={dropdownRef}>
      {/* Main button to toggle dropdown */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between border-[#D9D9DD] dark:border-[#3A3A3A] text-[#1F1F1F] dark:text-white"
      >
        <span>Выбрать бренды ({selectedBrands.length})</span>
        {isOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
      </Button>

      {/* Selected brands badges */}
      {selectedBrands.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedBrands.map((brand) => (
            <Badge key={brand} variant="secondary" className="flex items-center gap-1">
              {brand}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleBrand(brand)
                }}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Dropdown content */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 max-h-[60vh] flex flex-col">
          {/* Search input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск брендов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-8 pr-8 h-9"
              />
              {searchQuery && (
                <X
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={addBrandFromInput}
              className="ml-1 px-2"
              disabled={!searchQuery.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Brands list */}
          <div className="overflow-y-auto p-1">
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <div
                  key={brand}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md cursor-pointer",
                    selectedBrands.includes(brand)
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700",
                  )}
                >
                  <span>{brand}</span>
                  <Button
                    size="sm"
                    variant={selectedBrands.includes(brand) ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleBrand(brand)
                    }}
                    className="h-7 w-7 p-0"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="p-2 text-center text-gray-500 dark:text-gray-400">
                Нет результатов. Нажмите + чтобы добавить "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
