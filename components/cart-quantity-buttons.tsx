"use client"

import React, { forwardRef } from "react"
import { Plus, Minus } from "lucide-react"

interface CartQuantityButtonsProps {
  count: number
  maxStock?: number
  onAdd: (e: React.MouseEvent) => void
  onRemove: (e: React.MouseEvent) => void
  disabled?: boolean
  size?: "xs" | "sm" | "md" | "lg"
  variant?: "default" | "inline"
  showBorder?: boolean
  showUnit?: boolean
}

const CartQuantityButtons = forwardRef<HTMLButtonElement, CartQuantityButtonsProps>(
  ({
    count,
    maxStock = 999,
    onAdd,
    onRemove,
    disabled = false,
    size = "md",
    variant = "default",
    showBorder = false,
    showUnit = false
  }, ref) => {

    // Inline вариант для корзины (компактный стиль)
    if (variant === "inline") {
      return (
        <div className="flex items-center bg-muted dark:bg-[#3A3A3A] rounded">
          <button
            onClick={onRemove}
            disabled={disabled || count <= 0}
            className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            aria-label="Уменьшить количество"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="text-sm px-2">{count}{showUnit ? " шт." : ""}</span>
          <button
            ref={ref}
            onClick={onAdd}
            disabled={disabled || count >= maxStock}
            className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            aria-label="Увеличить количество"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      )
    }

    // Default вариант с цветными кнопками
    const sizeClasses = {
      xs: {
        button: "w-7 h-7",
        icon: "w-3.5 h-3.5",
        text: "text-xs"
      },
      sm: {
        button: "w-8 h-8 sm:w-9 sm:h-9",
        icon: "w-4 h-4 sm:w-5 sm:h-5",
        text: "text-sm sm:text-base"
      },
      md: {
        button: "w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12",
        icon: "w-5 h-5 sm:w-6 sm:h-6",
        text: "text-base sm:text-lg"
      },
      lg: {
        button: "w-12 h-12 sm:w-14 sm:h-14",
        icon: "w-6 h-6 sm:w-7 sm:h-7",
        text: "text-lg sm:text-xl"
      }
    }

    const currentSize = sizeClasses[size]
    const counterBorderClass = showBorder ? "border border-[#3A3A3A]" : ""

    return (
      <div className="flex items-center gap-1">
        {/* Кнопка минус */}
        <button
          onClick={onRemove}
          disabled={disabled || count <= 0 || maxStock <= 0}
          className={`${currentSize.button} bg-[#484b51] text-white rounded-lg flex items-center justify-center hover:bg-[#5A5D63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Уменьшить количество"
        >
          <Minus className={currentSize.icon} />
        </button>

        {/* Счетчик количества */}
        <div className={`${currentSize.button} bg-[#1A1A1A] ${counterBorderClass} text-white rounded-lg flex items-center justify-center`}>
          <span className={`${currentSize.text} font-medium`}>{count}</span>
        </div>

        {/* Кнопка плюс */}
        <button
          ref={ref}
          onClick={onAdd}
          disabled={disabled || maxStock <= 0 || count >= maxStock}
          className={`${currentSize.button} bg-[#d3df3d] text-black rounded-lg flex items-center justify-center hover:bg-[#c5d135] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label="Увеличить количество"
        >
          <Plus className={currentSize.icon} />
        </button>
      </div>
    )
  }
)

CartQuantityButtons.displayName = "CartQuantityButtons"

export default CartQuantityButtons
