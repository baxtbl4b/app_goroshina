"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  Award,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Search,
  CheckCircle,
  Menu,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useRouter } from "next/navigation"
import { useState, useEffect, useRef } from "react"
import LoadingScreen from "@/components/loading-screen"
import TireCard from "@/components/tire-card"
import CartButton from "@/components/cart-button"
import type { Tire } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

// Компонент для отображения избранных товаров
function FavoritesList() {
  const [favorites, setFavorites] = useState<Tire[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Загружаем избранное из localStorage
    const loadFavorites = () => {
      const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
      setFavorites(storedFavorites)
      setLoading(false)
    }

    // Загружаем при монтировании
    loadFavorites()

    // Обновляем при изменении избранного
    const handleFavoritesUpdated = () => {
      loadFavorites()
    }

    // Подписываемся на событие обновления избранного
    window.addEventListener("favoritesUpdated", handleFavoritesUpdated)

    // Отписываемся при размонтировании
    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated)
    }
  }, [])

  if (loading) {
    return <div className="text-center py-8">Загрузка</div>
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-white dark:bg-[#2A2A2A] rounded-xl p-8 text-center">
        <p className="text-[#1F1F1F] dark:text-white mb-4">У вас пока нет избранных товаров</p>
        <Link href="/category/summer">
          <Button className="bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F]">Перейти в каталог</Button>
        </Link>
        <BottomNavigation />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favorites.map((tire) => (
        <TireCard key={tire.id} tire={tire} />
      ))}
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [isLoyaltyVisible, setIsLoyaltyVisible] = useState(false)
  const [isStatusBlockVisible, setIsStatusBlockVisible] = useState(true)
  const [isTooltipVisible, setIsTooltipVisible] = useState(false)
  // Add a new state for loading
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if this is the first launch
    const hasLaunchedBefore = localStorage.getItem("hasLaunchedBefore")

    if (!hasLaunchedBefore) {
      // First launch - show loading screen
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
        // Mark that the app has been launched before
        localStorage.setItem("hasLaunchedBefore", "true")
      }, 1500) // 1.5 second delay

      return () => clearTimeout(timer)
    }
    // If not first launch, don't show loading screen
  }, [])
  const [isLoyaltyConfirmed, setIsLoyaltyConfirmed] = useState(false)
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false)
  const [boltImageLoaded, setBoltImageLoaded] = useState(false)
  const [boltImageError, setBoltImageError] = useState(false)

  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; text: string; isUser: boolean; timestamp: Date }>
  >([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatSessionId, setChatSessionId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const toggleLoyaltyVisibility = () => {
    setIsLoyaltyVisible(!isLoyaltyVisible)
  }

  const toggleStatusBlockVisibility = () => {
    setIsStatusBlockVisible(!isStatusBlockVisible)
  }

  const handleMenuClick = () => {
    router.push("/settings")
  }

  // Function to handle when loading is complete
  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  const sendChatMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setChatInput("")
    setIsChatLoading(true)

    try {
      const response = await fetch("https://syncflow.ru/webhook/goroshina-bot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          session_id: chatSessionId || "", // Передаем session_id в заголовках
        },
        body: JSON.stringify({
          query: message,
          // Убираем session_id из тела запроса, так как теперь он в заголовках
        }),
      })

      const data = await response.json()

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: data.output || "Извините, произошла ошибка при обработке вашго запроса.",
        isUser: false,
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Извините, не удалось связаться с помощником. Попробуйте позже.",
        isUser: false,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsChatLoading(false)
    }
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (chatInput.trim() && !isChatLoading) {
      sendChatMessage(chatInput)
    }
  }

  const renderMarkdown = (value: unknown) => {
    // Always coerce to a safe string first
    const text =
      typeof value === "string"
        ? value
        : value == null
          ? ""
          : (() => {
              try {
                return String(value)
              } catch {
                return ""
              }
            })()

    const html = text
      // **bold**
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // *italic*
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // `code`
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1 rounded text-sm">$1</code>')
      // 245/55R19, 225/60 R16, etc.
      .replace(
        /(\d{3}\/\d{2}\s?R\d{2})/g,
        '<a href="#" class="text-blue-500 underline hover:text-blue-700 font-medium tire-size-link" data-tire-size="$1">$1</a>',
      )
      // [2010–2014]$$years:2010-2014$$  ➜  years button
      .replace(
        /\[([^\]]+)\]\$\$years:([^)]+)\$\$/g,
        '<button class="inline-block bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] px-3 py-1 rounded-lg text-sm font-medium mx-1 my-1 years-button" data-years="$2">$1</button>',
      )
      // [2010–2014] plain – make button
      .replace(
        /\[(\d{4}–\d{4})\]/g,
        '<button class="inline-block bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] px-3 py-1 rounded-lg text-sm font-medium mx-1 my-1 years-button" data-years="$1">$1</button>',
      )
      // [label]$$link$$  ➜  anchor
      .replace(
        /\[([^\]]+)\]\$\$([^)]+)\$\$/g,
        '<a href="$2" class="text-blue-500 underline" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      // line breaks
      .replace(/\n/g, "<br>")

    return { __html: html }
  }

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  useEffect(() => {
    // Generate a unique session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    setChatSessionId(newSessionId)
  }, [])

  return (
    <main className="flex flex-col min-h-screen bg-[#D9D9DD] dark:bg-[#121212] pt-[60px]">
      {/* Show loading screen if isLoading is true */}
      {isLoading ? (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      ) : (
        <>
          <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1F1F1F] shadow-sm h-[60px]">
            <style jsx>{`
              @keyframes shine {
                0% {
                  transform: translateX(-100%) skewX(12deg);
                }
                100% {
                  transform: translateX(200%) skewX(12deg);
                }
              }
            `}</style>
            <div className="h-full px-4 relative flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative overflow-hidden rounded-lg">
                  <Image
                    src="/images/no_signature.svg"
                    alt="Tire Shop"
                    width={335}
                    height={64}
                    className="h-8 w-auto dark:invert relative z-10"
                    priority
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4">
                  <Link href="/favorites" className="flex items-center gap-2 text-[#1F1F1F] dark:text-white">
                    <Heart className="h-6 w-6" />
                  </Link>
                  <CartButton />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-[#1F1F1F] dark:text-white relative transform scale-[1.44]"
                  onClick={handleMenuClick}
                >
                  <Menu className="h-7 w-7" />
                </Button>
              </div>
            </div>
          </header>
          <div className="px-4 pb-4">
            {/* Chat Interface */}
            {isChatOpen && (
              <div className="mt-4 bg-white dark:bg-[#2A2A2A] rounded-xl shadow-lg max-h-96 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iigoroshinka-M5zsniFgDNwE8gLN0L31XKwnIESS1a.png"
                      alt="Горошина"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="font-medium text-[#1F1F1F] dark:text-white">Умная помошница Горошина</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsChatOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ✕
                  </Button>
                </div>

                <div ref={chatContainerRef} className="h-64 overflow-y-auto p-3 space-y-3 flex-grow">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <p className="text-sm">Привет! Я Горошина, ваш умный помощник.</p>
                      <p className="text-xs mt-1">Задайте мне любой вопрос о шинах и автомобилях!</p>
                    </div>
                  )}

                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.isUser
                            ? "bg-[#D3DF3D] text-[#1F1F1F]"
                            : "bg-gray-100 dark:bg-[#333333] text-[#1F1F1F] dark:text-white"
                        }`}
                      >
                        <div
                          className={`text-sm prose prose-sm max-w-none ${
                            message.isUser ? "text-black dark:text-black" : "dark:prose-invert"
                          }`}
                          dangerouslySetInnerHTML={renderMarkdown(message.text)}
                          onClick={(e) => {
                            const target = e.target as HTMLElement
                            if (target.classList.contains("tire-size-link")) {
                              e.preventDefault()
                              const tireSize = target.getAttribute("data-tire-size")
                              if (tireSize) {
                                // Парсим размер шин: 215/55R17 или 215/55 R17
                                const match = tireSize.match(/(\d{3})\/(\d{2})\s?R(\d{2})/)
                                if (match) {
                                  const [, width, profile, diameter] = match
                                  router.push(`/category/summer?width=${width}&profile=${profile}&diameter=${diameter}`)
                                }
                              }
                            }
                            if (target.classList.contains("years-button")) {
                              e.preventDefault()
                              const years = target.getAttribute("data-years")
                              if (years) {
                                sendChatMessage(years)
                              }
                            }
                          }}
                        />
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString("ru-RU", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-[#333333] p-3 rounded-lg">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                  <form onSubmit={handleChatSubmit} className="relative w-full">
                    <input
                      type="text"
                      placeholder="Введите ваш вопрос..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="w-full bg-[#F5F5F5] dark:bg-[#333333] rounded-xl py-3 px-10 text-[#1F1F1F] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#009CFF]"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#d3df3d] pointer-events-none" />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isChatLoading}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#009CFF] disabled:text-gray-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {!isChatOpen && (
              <div className="relative w-full mt-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (chatInput.trim() && !isChatLoading) {
                      setIsChatOpen(true)
                      sendChatMessage(chatInput)
                    } else {
                      setIsChatOpen(true)
                    }
                  }}
                  className="relative w-full"
                >
                  <input
                    type="text"
                    placeholder="задай мне вопрос"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="w-full bg-[#F5F5F5] dark:bg-[#333333] rounded-xl py-3 px-10 text-[#1F1F1F] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#009CFF]"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#d3df3d] pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => {
                      if (chatInput.trim()) {
                        setIsChatOpen(true)
                        sendChatMessage(chatInput)
                      } else {
                        setIsChatOpen(true)
                      }
                    }}
                    disabled={isChatLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#009CFF] disabled:text-gray-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="flex-1 px-4 pb-28 space-y-4">
            {/* Rest of the content remains the same */}
            {/* Loyalty System Information */}
            <div className="relative">
              <div onClick={() => toggleLoyaltyVisibility()} className="cursor-pointer">
                <div
                  className={`bg-white dark:bg-[#2A2A2A] rounded-xl p-4 shadow-sm overflow-hidden transition-all duration-300 ease-in-out ${isLoyaltyVisible ? "max-h-[300px] opacity-100" : "max-h-[40px] opacity-70 py-2 px-4"}`}
                  aria-expanded={isLoyaltyVisible}
                  role="region"
                  aria-label="Информация о программе лояльности"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-[#D3DF3D]" />
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-[#D3DF3D]">350 баллов</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#1F1F1F] dark:text-white">Серебрянный</span>
                      {isLoyaltyVisible ? (
                        <ChevronUp className="h-4 w-4 text-[#1F1F1F] dark:text-white" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[#1F1F1F] dark:text-white" />
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <Progress
                      value={35}
                      className="h-2 bg-[#D9D9DD] dark:bg-[#3A3A3A]"
                      indicatorClassName="bg-gradient-to-r from-[#D3DF3D] to-[#009CFF]"
                    />
                  </div>

                  {isStatusBlockVisible && (
                    <div className="mt-3 flex justify-between items-center">
                      <div
                        className={`flex items-center gap-2 ${
                          isLoyaltyConfirmed ? "bg-green-500/30 dark:bg-green-500/20" : "bg-[#FFF3E0] dark:bg-[#3A3A2A]"
                        } p-2 rounded-lg relative cursor-pointer`}
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsLoyaltyModalOpen(true)
                        }}
                      >
                        {isLoyaltyConfirmed ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        )}
                        <p className="text-xs text-[#1F1F1F] dark:text-white flex items-center">
                          <span className="font-medium flex items-center">Система лояльности</span>
                        </p>
                        {isTooltipVisible && (
                          <div className="absolute top-full left-0 mt-1 bg-white dark:bg-[#1F1F1F] p-2 rounded shadow-md text-xs z-10">
                            сгорят через 80 дней
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-auto">
                        <button
                          className="flex items-center justify-center gap-2 bg-[#FFF3E0] dark:bg-[#3A3A2A] p-2 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push("/loyalty/earn")
                          }}
                        >
                          <span className="text-xs font-medium text-[#1F1F1F] dark:text-white">получить</span>
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push("/loyalty/transfer")
                          }}
                          className="bg-green-500/30 dark:bg-green-500/20 p-2 rounded-lg flex items-center gap-1 justify-center h-auto"
                          aria-label="Перевести баллы другому клиенту"
                        >
                          <span className="text-xs font-medium text-[#1F1F1F] dark:text-white">подарить</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Category Buttons - Moved here from TabsContent */}
            <div className="grid grid-cols-3 gap-5 overflow-hidden">
              <Link href="/category/all-season">
                <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-lg overflow-hidden group transition-all hover:shadow-md h-[160px]">
                  <Image
                    src="/images/allseason2-new.png"
                    alt="Всесезонные шины"
                    width={300}
                    height={200}
                    className="w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
                  />
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                    <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                      ALLSEASON
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/category/winter">
                <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-lg overflow-hidden group transition-all hover:shadow-md h-[160px]">
                  <Image
                    src="/images/winter-tire-new.png"
                    alt="Зимние шины"
                    width={300}
                    height={200}
                    className="w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
                    onError={(e) => {
                      // Fallback to local image if blob URL fails
                      ;(e.target as HTMLImageElement).src = "/images/winter-tire-new.png"
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                    <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                      ЗИМНИЕ
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/category/summer">
                <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-lg overflow-hidden group transition-all hover:shadow-md h-[160px]">
                  <Image
                    src="/images/summer-tire-new.png"
                    alt="Летние шины"
                    width={300}
                    height={200}
                    className="w-full h-full object-cover transition-transform group-hover:scale-[1.03]"
                    onError={(e) => {
                      // Fallback to local image if blob URL fails
                      ;(e.target as HTMLImageElement).src = "/images/summer-tire-new.png"
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                    <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                      ЛЕТНИЕ
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            <Tabs defaultValue="popular" className="w-full">
              <TabsList className="w-full bg-[#1F1F1F] rounded-xl p-2 h-14">
                <TabsTrigger
                  value="popular"
                  className="rounded-lg text-white transition-all duration-300 ease-in-out data-[state=active]:bg-[#d3df3d] data-[state=active]:text-[#1F1F1F] data-[state=active]:scale-105 data-[state=active]:shadow-lg data-[state=active]:shadow-[#d3df3d]/30 data-[state=active]:transform data-[state=active]:font-bold h-10 px-6 text-base font-medium hover:scale-102 hover:bg-white/10"
                >
                  Товары
                </TabsTrigger>
                <TabsTrigger
                  value="sale"
                  className="rounded-lg text-white transition-all duration-300 ease-in-out data-[state=active]:bg-[#d3df3d] data-[state=active]:text-[#1F1F1F] h-10 px-6 text-base font-medium"
                >
                  Услуги
                </TabsTrigger>
              </TabsList>

              <TabsContent value="popular" className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-5">
                  <Link href="/diski">
                    <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-xl overflow-hidden group transition-all hover:shadow-md h-[160px]">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IFG42-Black-ltLo8DgOgWmvAv9qn8DDRw1n1598ox.pnghttps://hebbkx1anhila5yf.public.blob.vercel-storage.com/IFG42-Black-ltLo8DgOgWmvAv9qn8DDRw1n1598ox.png"
                        alt="Диски"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to local image if blob URL fails
                          ;(e.target as HTMLImageElement).src = "/images/black-wheel.png"
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                          ДИСКИ
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/krepezh/">
                    <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-xl overflow-hidden group transition-all hover:shadow-md h-[160px]">
                      <div className="w-full h-full flex items-center justify-center">
                        <Image
                          src="/images/wheel-bolts-new.png"
                          alt="Крепеж"
                          width={140}
                          height={140}
                          className="object-contain transition-transform group-hover:scale-110 scale-[1.33]"
                          onLoad={() => setBoltImageLoaded(true)}
                          onError={(e) => {
                            console.error("Failed to load bolt image:", e.currentTarget.src)
                            setBoltImageError(true)
                            // Fallback to a placeholder
                            e.currentTarget.src = "/placeholder.svg?height=120&width=120&text=Крепеж"
                          }}
                        />

                        {/* Debug info - will show if image fails to load */}
                        {boltImageError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-100/80 text-red-600 text-xs p-2 text-center">
                            Image failed to load
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                          КРЕПЕЖ
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/pressure-sensors">
                    <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-xl overflow-hidden group transition-all hover:shadow-md h-[160px]">
                      <Image
                        src="/images/pressure-sensor-new.png"
                        alt="Датчики давления"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                          ДАТЧИКИ
                        </p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/dokatki">
                    <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-xl overflow-hidden group transition-all hover:shadow-md h-[160px]">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dokatka-p9ER4iAPFpGuRa3gPnEFh7qm8gm4j7.png"
                        alt="Докатки"
                        width={400}
                        height={400}
                        className="w-full h-full object-contain p-0 transition-transform group-hover:scale-105 scale-[1.5]"
                        priority
                      />
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                          ДОКАТКИ
                        </p>
                      </div>
                    </div>
                  </Link>
                  <Link href="/autochemistry">
                    <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-xl overflow-hidden group transition-all hover:shadow-md h-[160px]">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/himia-HS0SUmhH9HVHBIzvxlCW9aZZLSFIFT.png"
                        alt="Автохимия"
                        width={300}
                        height={200}
                        className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105 scale-[1.46]"
                      />
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                          АВТОХИМИЯ{" "}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/accessories">
                    <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-xl overflow-hidden group transition-all hover:shadow-md h-[160px]">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%2016%20%D0%BC%D0%B0%D1%8F%202025%20%D0%B3.%2C%2017_31_22-dXXB7d63vDqZ9AcOR0YlUWQgjuyiz3.png"
                        alt="Вентиля"
                        width={400}
                        height={400}
                        className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105 scale-[1.35]"
                        priority
                        onError={(e) => {
                          console.error("Failed to load valve image:", e.currentTarget.src)
                          // Fallback to a placeholder
                          e.currentTarget.src = "/images/ventili2_matte.png"
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                          ВЕНТИЛЯ
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="sale" className="mt-4 space-y-4">
                <div className="grid grid-cols-3 gap-5">
                  <Link href="/tire-mounting">
                    <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-xl overflow-hidden group transition-all hover:shadow-md h-[160px]">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shinka-8z0uipBDWUgTg0RjFwZOJsm6c7YGN8.png"
                        alt="Шиномонтаж"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to alternative image if main image fails to load
                          ;(e.target as HTMLImageElement).src = "/images/sivik-tire-machine-updated.png"
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -10%
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                          ШИНОМОНТАЖ
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/painting">
                    <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-xl overflow-hidden group transition-all hover:shadow-md h-[160px]">
                      <Image
                        src="/images/pokraska-2.png"
                        alt="Покраска дисков"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to local image if blob URL fails
                          ;(e.target as HTMLImageElement).src =
                            "/placeholder.svg?height=300&width=300&text=Покраска%20дисков"
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -25%
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                          ПОКРАСКА
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/soundproofing">
                    <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-xl overflow-hidden group transition-all hover:shadow-md h-[160px]">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/paralon3-T8UffRFUWXyCauyhYFBiLdMKrsVWuC.png"
                        alt="Шумоизоляция шин"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to local image if blob URL fails
                          ;(e.target as HTMLImageElement).src = "/images/tire-noise-reduction.png"
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                          ШУМОИЗОЛЯЦИЯ
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/studding">
                    <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-xl overflow-hidden group transition-all hover:shadow-md h-[160px]">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/doship%20%282%29-qrnzmJFcuSX8O7jB6KuI7HC3HzNKJa.png"
                        alt="Дошиповка шин"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to local image if blob URL fails
                          ;(e.target as HTMLImageElement).src = "/images/tire-studding-process.png"
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -10%
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                          ДОШИПОВКА
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/tire-storage">
                    <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-xl overflow-hidden group transition-all hover:shadow-md h-[160px]">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HRAN2%20%282%29-ntreb2IoYiojvgZqL3IylaowalWxR4.png"
                        alt="Хранение шин"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to local image if blob URL fails
                          ;(e.target as HTMLImageElement).src = "/images/tire-storage-bags.png"
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -20%
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                          ХРАНЕНИЕ ШИН
                        </p>
                      </div>
                    </div>
                  </Link>

                  <Link href="/book-online">
                    <div className="relative bg-[#1F1F1F]/70 dark:bg-[#2A2A2A]/70 rounded-xl overflow-hidden group transition-all hover:shadow-md h-[160px]">
                      <Image
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/zapis-NxYQIfl9BCSbft5pV6f4DPj9mGTOat.png"
                        alt="Запись онлайн"
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onError={(e) => {
                          // Fallback to local image if blob URL fails
                          ;(e.target as HTMLImageElement).src = "/images/zapis.png"
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -60%
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-3 bg-black/50">
                        <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-tight">
                          ЗАПИСАТЬСЯ ОНЛАЙН
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </TabsContent>
            </Tabs>

            {/* Services with Cashback Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#1F1F1F] dark:text-white opacity-70">Сервисы с кешбеком</h2>
              </div>
              <div className="flex overflow-x-auto gap-4 pb-3 -mx-4 px-4 scrollbar-hide">
                <Link
                  href="/services/insurance"
                  className="min-w-[220px] bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex flex-col items-start text-left">
                    <h3 className="font-medium text-xs text-[#1F1F1F] dark:text-white mb-1">Оформить каско</h3>
                    <p className="text-[10px] text-[#d3df3d] flex items-center">
                      +500 <span className="ml-1">баллов</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/med-NQ3mJ3E3Yps8ojhMFzoPeyMH2uxI0E.png"
                      alt="Insurance"
                      width={60}
                      height={60}
                      className="object-contain rounded-lg"
                    />
                  </div>
                </Link>

                <Link
                  href="/services/car-history"
                  className="min-w-[220px] bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex flex-col items-start text-left">
                    <h3 className="font-medium text-xs text-[#1F1F1F] dark:text-white mb-1">История авто</h3>
                    <p className="text-[10px] text-[#d3df3d] flex items-center">
                      +100 <span className="ml-1">баллов</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/story-MoFHiG7ethBQo90ofhzc6iyeabPTcI.png"
                      alt="Car History"
                      width={60}
                      height={60}
                      className="object-contain rounded-lg"
                    />
                  </div>
                </Link>

                <Link
                  href="/services/fines"
                  className="min-w-[220px] bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex flex-col items-start text-left">
                    <h3 className="font-medium text-xs text-[#1F1F1F] dark:text-white mb-1">Проверить штрафы</h3>
                    <p className="text-[10px] text-[#d3df3d] flex items-center">
                      +50 <span className="ml-1">баллов</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <Image src="/images/police.png" alt="Fines" width={60} height={60} className="object-contain" />
                  </div>
                </Link>

                <Link
                  href="/services/car-wash"
                  className="min-w-[220px] bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex flex-col items-start text-left">
                    <h3 className="font-medium text-xs text-[#1F1F1F] dark:text-white mb-1">Помыть авто</h3>
                    <p className="text-[10px] text-[#d3df3d] flex items-center">
                      +150 <span className="ml-1">баллов</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <Image src="/images/moika.png" alt="Car Wash" width={60} height={60} className="object-contain" />
                  </div>
                </Link>

                <Link
                  href="/services/lawyers"
                  className="min-w-[220px] bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex flex-col items-start text-left">
                    <h3 className="font-medium text-xs text-[#1F1F1F] dark:text-white mb-1">Автоюристы</h3>
                    <p className="text-[10px] text-[#d3df3d] flex items-center">
                      +300 <span className="ml-1">баллов</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/urist-S8ooC0NKlOlwMTTUkdDvKQcZ4M2URM.png"
                      alt="Lawyers"
                      width={60}
                      height={60}
                      className="object-contain rounded-lg"
                    />
                  </div>
                </Link>
              </div>
            </div>

            {/* Discounted Products Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#1F1F1F] dark:text-white opacity-70">Товары со скидкой</h2>
              </div>
              <div className="flex overflow-x-auto gap-4 pb-3 -mx-4 px-4 scrollbar-hide">
                <Link
                  href="/product/1"
                  className="min-w-[220px] bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex flex-col items-start text-left">
                    <h3 className="font-medium text-xs text-[#1F1F1F] dark:text-white mb-1">Michelin Pilot Sport 4</h3>
                    <p className="text-[10px] text-green-500 flex items-center">
                      12 500 ₽ <span className="ml-1 line-through text-gray-400">15 000 ₽</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <Image
                      src="/images/michelin-pilot-sport-4.png"
                      alt="Michelin Pilot Sport 4"
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                </Link>

                <Link
                  href="/product/2"
                  className="min-w-[220px] bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex flex-col items-start text-left">
                    <h3 className="font-medium text-xs text-[#1F1F1F] dark:text-white mb-1">
                      Continental PremiumContact 6
                    </h3>
                    <p className="text-[10px] text-green-500 flex items-center">
                      10 800 ₽ <span className="ml-1 line-through text-gray-400">12 000 ₽</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <Image
                      src="/images/continental-premiumcontact-6.png"
                      alt="Continental PremiumContact 6"
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                </Link>

                <Link
                  href="/product/3"
                  className="min-w-[220px] bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex flex-col items-start text-left">
                    <h3 className="font-medium text-xs text-[#1F1F1F] dark:text-white mb-1">Alutec Monstr R18</h3>
                    <p className="text-[10px] text-green-500 flex items-center">
                      8 500 ₽ <span className="ml-1 line-through text-gray-400">10 000 ₽</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <Image
                      src="/images/alutec-wheel-1.png"
                      alt="Alutec Monstr R18"
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                </Link>

                <Link
                  href="/product/4"
                  className="min-w-[220px] bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex flex-col items-start text-left">
                    <h3 className="font-medium text-xs text-[#1F1F1F] dark:text-white mb-1">TPMS Sensor Huf</h3>
                    <p className="text-[10px] text-green-500 flex items-center">
                      2 200 ₽ <span className="ml-1 line-through text-gray-400">2 500 ₽</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <Image
                      src="/images/huf.png"
                      alt="TPMS Sensor Huf"
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                </Link>

                <Link
                  href="/product/5"
                  className="min-w-[220px] bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden"
                >
                  <div className="flex flex-col items-start text-left">
                    <h3 className="font-medium text-xs text-[#1F1F1F] dark:text-white mb-1">
                      Pirelli Cinturato All Season
                    </h3>
                    <p className="text-[10px] text-green-500 flex items-center">
                      9 800 ₽ <span className="ml-1 line-through text-gray-400">11 000 ₽</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <Image
                      src="/images/pirelli-tire.png"
                      alt="Pirelli Cinturato All Season"
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-end">
                <Link href="/brands" className="text-[#009CFF] flex items-center text-sm">
                  Все бренды <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              {/* Updated link to the registration page */}
              <div className="flex items-center justify-center hidden">
                <Link href="/register">
                  <Button variant="outline" className="bg-black text-white">
                    Зарегистрироваться
                  </Button>
                </Link>
              </div>
              <div className="flex overflow-x-auto gap-3 pb-2 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory">
                <Link
                  href="/brands/triangle"
                  className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-center h-16 min-w-[160px] flex-shrink-0 hover:shadow-md transition-shadow hover:bg-gray-50 dark:hover:bg-[#333333] snap-start"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <Image
                      src="/images/triangle-logo.png"
                      alt="Triangle"
                      width={120}
                      height={40}
                      className="object-contain max-h-10"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=100&width=200&text=Triangle"
                      }}
                    />
                  </div>
                </Link>
                <Link
                  href="/brands/pirelli"
                  className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-center h-16 min-w-[160px] flex-shrink-0 hover:shadow-md transition-shadow hover:bg-gray-50 dark:hover:bg-[#333333] snap-start"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <Image
                      src="/images/pirelli-logo.png"
                      alt="Pirelli"
                      width={120}
                      height={40}
                      className="object-contain max-h-10"
                    />
                  </div>
                </Link>
                <Link
                  href="/brands/ikon-tyres"
                  className="bg-[#75af41] dark:bg-[#2A2A2A] rounded-xl p-3 flex items-center justify-center h-16 min-w-[160px] flex-shrink-0 hover:shadow-md transition-shadow hover:bg-[#75af41]/90 dark:hover:bg-[#333333] overflow-hidden snap-start"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <Image
                      src="/images/ikon-tyres-logo.jpeg"
                      alt="IKON TYRES"
                      width={120}
                      height={40}
                      className="object-contain max-h-10"
                    />
                  </div>
                </Link>
                <Link
                  href="/brands/continental"
                  className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-center h-16 min-w-[160px] flex-shrink-0 hover:shadow-md transition-shadow hover:bg-gray-50 dark:hover:bg-[#333333] snap-start"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <Image
                      src="/images/continental-logo.svg"
                      alt="Continental"
                      width={120}
                      height={40}
                      className="object-contain max-h-10"
                    />
                  </div>
                </Link>
                <Link
                  href="/brands/michelin"
                  className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-center h-16 min-w-[160px] flex-shrink-0 hover:shadow-md transition-shadow hover:bg-gray-50 dark:hover:bg-[#333333] snap-start"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <Image
                      src="/images/michelin-text-logo.png"
                      alt="Michelin"
                      width={120}
                      height={40}
                      className="object-contain max-h-10"
                    />
                  </div>
                </Link>
                <Link
                  href="/brands/bridgestone"
                  className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-center h-16 min-w-[160px] flex-shrink-0 hover:shadow-md transition-shadow hover:bg-gray-50 dark:hover:bg-[#333333] snap-start"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <Image
                      src="/images/bridgestone-logo.png"
                      alt="Bridgestone"
                      width={120}
                      height={40}
                      className="object-contain max-h-10"
                    />
                  </div>
                </Link>
                <Link
                  href="/brands/sailun"
                  className="bg-white dark:bg-[#2A2A2A] rounded-xl p-4 flex items-center justify-center h-16 min-w-[160px] flex-shrink-0 hover:shadow-md transition-shadow hover:bg-gray-50 dark:hover:bg-[#333333] snap-start"
                >
                  <div className="flex items-center justify-center w-full h-full">
                    <Image
                      src="/images/sailun-logo.png"
                      alt="Sailun"
                      width={120}
                      height={40}
                      className="object-contain max-h-10"
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>

          <BottomNavigation />
        </>
      )}
      {isLoyaltyModalOpen && (
        <Dialog open={isLoyaltyModalOpen} onOpenChange={setIsLoyaltyModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Правила программы лояльности</DialogTitle>
              <DialogDescription>Добро пожаловать в программу лояльности нашего магазина шин!</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 text-sm text-[#1F1F1F] dark:text-gray-200">
              <p>
                Участвуя в программе, вы получаете возможность накапливать баллы и обменивать их на скидки и подарки.
              </p>
              <h3 className="font-bold text-lg">Основные правила:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>За каждые 1000 рублей покупки вы получаете 10 баллов</li>
                <li>Дополнительные баллы начисляются за использование сервисов</li>
                <li>100 баллов = скидка 10 рублей</li>
                <li>Баллы сгорают через год после начисления</li>
              </ul>
              <h3 className="font-bold text-lg">Как получить баллы:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Совершайте покупки в нашем магазине</li>
                <li>Пользуйтесь услугами наших партнеров</li>
                <li>Участвуйте в акциях и конкурсах</li>
              </ul>
              <h3 className="font-bold text-lg">Как использовать баллы:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Оплачивайте баллами до 50% стоимости покупки</li>
                <li>Обменивайте баллы на подарки</li>
                <li>Получайте скидки на услуги</li>
              </ul>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsLoyaltyModalOpen(false)}>
                Закрыть
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </main>
  )
}
