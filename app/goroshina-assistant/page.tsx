"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { marked } from "marked"
import Image from "next/image"
import { MicIcon, PaperclipIcon, ChevronDown, ChevronUp } from "lucide-react"

const useHighlightJS = () => {
  const [isHighlightJSLoaded, setIsHighlightJSLoaded] = useState(false)

  useEffect(() => {
    import("highlight.js")
      .then((hljs) => {
        marked.setOptions({
          highlight: (code, lang) => {
            try {
              if (lang && hljs.default.getLanguage(lang)) {
                return hljs.default.highlight(code, { language: lang }).value
              }
              return hljs.default.highlightAuto(code).value
            } catch (e) {
              console.error("Highlight.js error:", e)
              return code
            }
          },
          breaks: true,
        })

        // Inject the highlight.js stylesheet just once
        const styleId = "hljs-theme"
        if (!document.getElementById(styleId)) {
          const link = document.createElement("link")
          link.id = styleId
          link.rel = "stylesheet"
          link.href = "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css"
          document.head.appendChild(link)
        }

        setIsHighlightJSLoaded(true)
      })
      .catch((err) => {
        console.error("Failed to load highlight.js:", err)
        marked.setOptions({
          breaks: true,
        })
      })
  }, [])

  return isHighlightJSLoaded
}

const initialMessages = [
  {
    text: "Привет! Я Горошина, твой помощник по подбору шин. Спроси меня что-нибудь!",
    isUser: false,
  },
]

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ")
}

export default function GoroshinaAssistant() {
  const isHighlightJSLoaded = useHighlightJS()

  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>(initialMessages)
  const [input, setInput] = useState("")
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isBlockVisible, setIsBlockVisible] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim()) return

    const userMessage = { text: messageText, isUser: true }
    setMessages((prevMessages) => [...prevMessages, userMessage])
    setInput("")

    try {
      const response = await fetch("/api/goroshina", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const botMessage = { text: data.response, isUser: false }
      setMessages((prevMessages) => [...prevMessages, botMessage])
    } catch (error) {
      console.error("Failed to send message:", error)
      const errorMessage = {
        text: "Произошла ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.",
        isUser: false,
      }
      setMessages((prevMessages) => [...prevMessages, errorMessage])
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
      <header className="bg-gray-100 dark:bg-[#1E1E1E] p-4 flex justify-between items-center transition-colors duration-300">
        <div className="flex items-center gap-2">
          <Image src="/images/iigoroshinka.png" alt="Горошина" width={40} height={40} className="rounded-full" />
          <span className="font-medium text-[#1F1F1F] dark:text-white">Умная помошница Горошина</span>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 ${message.isUser ? "text-right" : "text-left"}`}>
            <div
              className={classNames(
                message.isUser
                  ? "bg-[#D3DF3D] text-[#1F1F1F] ml-auto"
                  : "bg-gray-200 dark:bg-[#2D2D2D] text-[#1F1F1F] dark:text-white mr-auto",
                "inline-block p-3 rounded-2xl max-w-2xl break-words shadow-sm transition-colors duration-300",
              )}
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{ __html: marked(message.text) }}
            />
          </div>
        ))}
      </main>

      <div className="p-4 bg-gray-100 dark:bg-[#1E1E1E] transition-colors duration-300">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-[#1F1F1F] dark:text-white">Что может Горошина</h3>
          <button
            onClick={() => setIsBlockVisible(!isBlockVisible)}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-[#3A3A3A] transition-colors duration-300"
            aria-label={isBlockVisible ? "Скрыть блок" : "Показать блок"}
          >
            {isBlockVisible ? (
              <ChevronDown className="w-5 h-5 text-[#1F1F1F] dark:text-white" />
            ) : (
              <ChevronUp className="w-5 h-5 text-[#1F1F1F] dark:text-white" />
            )}
          </button>
        </div>
        <div
          className={classNames(
            "grid grid-cols-3 gap-2 overflow-hidden transition-all duration-300 ease-in-out",
            isBlockVisible ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <button
            onClick={() => sendMessage("Подобрать шины")}
            className="relative bg-black/30 hover:bg-black/20 text-white p-2 rounded-lg text-center font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm flex flex-col items-center justify-center aspect-square overflow-hidden"
          >
            <Image src="/images/tires1237.png" alt="Подобрать шины" fill className="object-cover rounded-lg" />
            <div className="absolute inset-0 flex flex-col items-center justify-end z-10 pb-2">
              <span className="text-xs font-bold text-white bg-black/70 px-1 rounded">Подобрать шины</span>
            </div>
          </button>

          <button
            onClick={() => sendMessage("Напомни мне о моих записях на обслуживание")}
            className="relative bg-black/30 hover:bg-black/20 text-white p-2 rounded-lg text-center font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm flex flex-col items-center justify-center aspect-square overflow-hidden"
          >
            <Image src="/images/ring12346.png" alt="Напомнить о записи" fill className="object-cover rounded-lg" />
            <div className="absolute inset-0 flex flex-col items-center justify-end z-10 pb-2">
              <span className="text-xs font-bold text-white bg-black/70 px-1 rounded">Напомнить о записи</span>
            </div>
          </button>

          <button
            onClick={() => sendMessage("Подобрать диски")}
            className="relative bg-black/30 hover:bg-black/20 text-white p-2 rounded-lg text-center font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm flex flex-col items-center justify-center aspect-square overflow-hidden"
          >
            <Image src="/images/diski5445.png" alt="Подобрать диски" fill className="object-cover rounded-lg" />
            <div className="absolute inset-0 flex flex-col items-center justify-end z-10 pb-2">
              <span className="text-xs font-bold text-white bg-black/70 px-1 rounded">Подобрать диски</span>
            </div>
          </button>

          <button
            onClick={() => sendMessage("Построить маршрут до ближайшего шинного центра")}
            className="relative bg-black/30 hover:bg-black/20 text-white p-2 rounded-lg text-center font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm flex flex-col items-center justify-center aspect-square overflow-hidden"
          >
            <Image src="/images/logistika1.png" alt="Построить маршрут" fill className="object-cover rounded-lg" />
            <div className="absolute inset-0 flex flex-col items-center justify-end z-10 pb-2">
              <span className="text-xs font-bold text-white bg-black/70 px-1 rounded">Построить маршрут</span>
            </div>
          </button>

          <button
            onClick={() => sendMessage("Записать меня на обслуживание")}
            className="relative bg-black/30 hover:bg-black/20 text-white p-2 rounded-lg text-center font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm flex flex-col items-center justify-end aspect-square overflow-hidden"
          >
            <Image src="/images/call1244.png" alt="Записаться" fill className="object-cover rounded-lg" />
            <div className="absolute inset-0 flex flex-col items-center justify-end z-10 pb-2">
              <span className="text-xs font-bold text-white bg-black/70 px-1 rounded">Записаться</span>
            </div>
          </button>

          <button
            onClick={() => sendMessage("Расскажи про мое хранение шин")}
            className="relative bg-black/30 hover:bg-black/20 text-white p-2 rounded-lg text-center font-medium transition-all duration-200 hover:scale-[1.02] shadow-sm flex flex-col items-center justify-center aspect-square overflow-hidden"
          >
            <Image src="/images/hranenie124.png" alt="Мое хранение" fill className="object-cover rounded-lg" />
            <div className="absolute inset-0 flex flex-col items-center justify-end z-10 pb-2">
              <span className="text-xs font-bold text-white bg-black/70 px-1 rounded">Мое хранение</span>
            </div>
          </button>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button className="p-2 rounded-full bg-gray-200 dark:bg-[#2D2D2D] text-[#1F1F1F] dark:text-white hover:bg-gray-300 dark:hover:bg-[#3A3A3A] transition-colors duration-300">
            <PaperclipIcon className="w-5 h-5" />
          </button>
          <textarea
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Задайте вопрос Горошине..."
            className="flex-1 p-3 rounded-2xl border-gray-300 dark:border-gray-700 bg-white dark:bg-[#2D2D2D] text-[#1F1F1F] dark:text-white transition-colors duration-300 focus:outline-none focus:ring-[#D3DF3D] resize-none"
          />
          <button className="p-2 rounded-full bg-gray-200 dark:bg-[#2D2D2D] text-[#1F1F1F] dark:text-white hover:bg-gray-300 dark:hover:bg-[#3A3A3A] transition-colors duration-300">
            <MicIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
