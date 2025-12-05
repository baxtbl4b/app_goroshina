"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Send, Mic, MicOff, Camera, ImageIcon, Settings } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function SmartAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Привет! Я ваш умный помощник по шинам и автомобильны�� услугам. Чем могу помочь?",
      isUser: false,
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("шин") || input.includes("покрышк")) {
      return "Я помогу вам подобрать шины! Какой у вас автомобиль и какой тип шин вас интересует: летние, зимние или всесезонные?"
    }

    if (input.includes("запись") || input.includes("записать")) {
      return "Конечно! Я могу записать вас на шиномонтаж, балансировку, хранение шин или другие услуги. На какую услугу хотите записаться?"
    }

    if (input.includes("цен") || input.includes("стоимость")) {
      return "Цены зависят от размера шин и типа услуги. Шиномонтаж от 500₽ за колесо, балансировка от 300₽. Хотите узнать точную стоимость для вашего автомобиля?"
    }

    if (input.includes("диск") || input.includes("литые")) {
      return "У нас большой выбор дисков: литые, кованые, штампованные. Какой размер и стиль вас интересует?"
    }

    return "Понял вас! Могу помочь с подбором шин, записью на услуги, консультацией по ценам и многим другим. Задайте более конкретный вопрос."
  }

  const handleVoiceToggle = () => {
    setIsListening(!isListening)
    // Here you would implement actual voice recognition
  }

  const quickActions = [
    { text: "Подобрать шины", icon: "🚗" },
    { text: "Записаться на шиномонтаж", icon: "🔧" },
    { text: "Узнать цены", icon: "💰" },
    { text: "Выбрать диски", icon: "⚙️" },
    { text: "Хранение шин", icon: "📦" },
    { text: "Консультация", icon: "💬" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold">Умный помощник</h1>
              <p className="text-sm text-gray-500">Всегда готов помочь</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Быстрые действия</h2>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-3 justify-start text-left"
              onClick={() => setInputText(action.text)}
            >
              <span className="mr-2 text-lg">{action.icon}</span>
              <span className="text-sm">{action.text}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 pb-32">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
              <Card
                className={`max-w-[80%] ${message.isUser ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-800"}`}
              >
                <CardContent className="p-3">
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <Card className="bg-white dark:bg-gray-800">
                <CardContent className="p-3">
                  <div className="flex space-x-1">
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
                </CardContent>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t p-4 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleVoiceToggle}
            className={isListening ? "bg-red-100 text-red-600" : ""}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <Button variant="outline" size="icon">
            <Camera className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon">
            <ImageIcon className="h-4 w-4" />
          </Button>

          <div className="flex-1 flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Напишите ваш вопрос..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isListening && (
          <div className="mt-2 text-center">
            <p className="text-sm text-red-600 animate-pulse">🎤 Слушаю...</p>
          </div>
        )}
      </div>
    </div>
  )
}
