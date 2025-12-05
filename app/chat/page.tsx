"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Mic, Paperclip, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BottomNavigation } from "@/components/bottom-navigation"
import SafeAreaHeader from "@/components/safe-area-header"

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Привет! Я Горошина, ваш умный помощник по выбору шин. Как дела?",
      isUser: false,
      timestamp: new Date(Date.now() - 60000),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Спасибо за ваш вопрос! Я помогу вам найти подходящие шины. Можете рассказать больше о вашем автомобиле?",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-[#D9D9DD] dark:bg-[#121212] flex flex-col">
      <SafeAreaHeader title="Чат с Горошиной" showBackButton backUrl="/">
        <Button variant="ghost" size="icon" className="text-white">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </SafeAreaHeader>

      {/* Chat messages with top padding to account for fixed header */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto pt-[calc(60px+env(safe-area-inset-top)+1rem)] pb-20 px-4 space-y-4"
      >
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
            <div
              className={`flex items-end space-x-2 max-w-[80%] ${message.isUser ? "flex-row-reverse space-x-reverse" : ""}`}
            >
              {!message.isUser && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src="/images/iigoroshinka.png" alt="Горошина" />
                  <AvatarFallback className="bg-[#D3DF3D] text-[#1F1F1F] text-sm">Г</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-2xl px-4 py-2 ${
                  message.isUser
                    ? "bg-[#D3DF3D] text-[#1F1F1F]"
                    : "bg-white dark:bg-[#2A2A2A] text-[#1F1F1F] dark:text-white"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2 max-w-[80%]">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src="/images/iigoroshinka.png" alt="Горошина" />
                <AvatarFallback className="bg-[#D3DF3D] text-[#1F1F1F] text-sm">Г</AvatarFallback>
              </Avatar>
              <div className="bg-white dark:bg-[#2A2A2A] rounded-2xl px-4 py-2">
                <div className="flex items-center space-x-1">
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
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1F1F1F] border-t border-gray-200 dark:border-gray-700 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Button type="button" variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400">
            <Paperclip className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Напишите сообщение..."
              className="pr-12 bg-[#F5F5F5] dark:bg-[#333333] border-0 rounded-full"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="submit"
            size="icon"
            className="bg-[#D3DF3D] hover:bg-[#D3DF3D]/80 text-[#1F1F1F] rounded-full"
            disabled={!inputValue.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <BottomNavigation />
    </div>
  )
}
