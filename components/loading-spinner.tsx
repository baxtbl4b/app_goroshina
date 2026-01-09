import React from "react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  color?: string
  text?: string
  className?: string
}

/**
 * LoadingSpinner - универсальный компонент для отображения индикатора загрузки
 *
 * @param size - размер спиннера: "sm" (24px), "md" (32px), "lg" (48px), "xl" (64px)
 * @param color - цвет границы спиннера (по умолчанию #009CFF)
 * @param text - опциональный текст под спиннером
 * @param className - дополнительные CSS классы
 */
export default function LoadingSpinner({
  size = "lg",
  color = "#009CFF",
  text,
  className = ""
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-b-2",
    xl: "h-16 w-16 border-b-2"
  }

  return (
    <div className={`flex items-center justify-center py-20 ${className}`}>
      <div className="text-center">
        <div
          className={`inline-block animate-spin rounded-full ${sizeClasses[size]}`}
          style={{ borderColor: color }}
        />
        {text && (
          <p className="mt-4 text-gray-600 dark:text-gray-400">{text}</p>
        )}
      </div>
    </div>
  )
}
