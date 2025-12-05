"use client"

// This file creates a compatibility layer for useEffectEvent
import { useCallback } from "react"

// Simple implementation that mimics useEffectEvent behavior
export function useEffectEvent(fn) {
  return useCallback(fn, [])
}
