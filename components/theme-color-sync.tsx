'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'

export function ThemeColorSync() {
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    // Определяем текущую тему
    const currentTheme = theme === 'system' ? resolvedTheme : theme

    // Цвета для разных тем (совпадают с цветом хеддера)
    const colors = {
      light: '#ffffff',
      dark: '#1f1f1f'
    }

    // Получаем цвет для текущей темы
    const themeColor = currentTheme === 'light' ? colors.light : colors.dark

    // Обновляем meta теги theme-color
    const metaTags = document.querySelectorAll('meta[name="theme-color"]')
    metaTags.forEach(tag => {
      tag.setAttribute('content', themeColor)
    })

    // Обновляем для iOS status bar (если есть)
    const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    if (statusBarMeta) {
      // Используем 'default' для светлой темы и 'black' для темной
      statusBarMeta.setAttribute('content', currentTheme === 'light' ? 'default' : 'black')
    }
  }, [theme, resolvedTheme])

  return null
}
