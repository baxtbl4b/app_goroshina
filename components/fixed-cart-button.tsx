"use client"
import { useEffect, useState } from "react"

function FixedCartButton() {
  const [cartItemCount, setCartItemCount] = useState(0)

  useEffect(() => {
    const loadCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const count = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0)
      setCartItemCount(count)
    }

    loadCartCount()

    const handleCartUpdate = () => {
      loadCartCount()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
    }
  }, [])

  return null
}

export default FixedCartButton
