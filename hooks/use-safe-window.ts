"use client"

import { useEffect, useState } from "react"

export function useSafeWindow() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const safeWindow = isClient ? window : undefined
  const safeDocument = isClient ? document : undefined
  const safeLocalStorage = isClient ? localStorage : undefined

  return {
    isClient,
    window: safeWindow,
    document: safeDocument,
    localStorage: safeLocalStorage,
  }
}

// Хук для безопасной работы с URL параметрами
export function useSafeUrlParams() {
  const [params, setParams] = useState<URLSearchParams | null>(null)
  const { isClient } = useSafeWindow()

  useEffect(() => {
    if (isClient && window.location) {
      setParams(new URLSearchParams(window.location.search))
    }
  }, [isClient])

  return params
}

// Хук для безопасной работы с localStorage
export function useSafeLocalStorage(key: string) {
  const [value, setValue] = useState<string | null>(null)
  const { isClient, localStorage } = useSafeWindow()

  useEffect(() => {
    if (isClient && localStorage) {
      setValue(localStorage.getItem(key))
    }
  }, [isClient, localStorage, key])

  const setStorageValue = (newValue: string) => {
    if (isClient && localStorage) {
      localStorage.setItem(key, newValue)
      setValue(newValue)
    }
  }

  return [value, setStorageValue] as const
}
