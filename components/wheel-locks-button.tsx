"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function WheelLocksButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} className="bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F]">
        Купить секретки
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-center mb-4">
              <Image src="/images/wheel-locks.png" alt="Wheel Locks" width={100} height={100} />
            </div>
            <h2 className="text-xl font-bold text-[#1F1F1F] dark:text-white mb-4">Защита колес</h2>
            <p className="text-sm text-[#1F1F1F] dark:text-white mb-4">
              Защитите свои колеса от кражи с помощью надежных секреток.
            </p>
            <Button onClick={() => setIsModalOpen(false)} className="bg-[#c4d402] hover:bg-[#c4d402]/80 text-[#1F1F1F]">
              Закрыть
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
