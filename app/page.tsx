"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoreHorizontal, Send } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface Message {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [isChatMode, setIsChatMode] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isThinking])

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      setIsChatMode(true)
      const userMessage: Message = {
        id: Date.now(),
        text: inputValue,
        isUser: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setInputValue("")
      setIsThinking(true)

      try {
       {/*} {const res = await fetch("http://localhost:8000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage.text }),
        })*/}

        const res = await fetch("https://abc123.ngrok.io/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
    })


        const data = await res.json()
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: data.reply,
          isUser: false,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setIsThinking(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (inputContainerRef.current) {
      const rect = inputContainerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const StarlightBackground = () => {
    const [stars, setStars] = useState<
      Array<{ id: number; x: number; y: number; size: number; opacity: number; speed: number }>
    >([])

    useEffect(() => {
      const generateStars = () => {
        const newStars = Array.from({ length: 100 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 0.5 + 0.1,
        }))
        setStars(newStars)
      }

      generateStars()

      const animateStars = () => {
        setStars((prevStars) =>
          prevStars.map((star) => ({
            ...star,
            x: (star.x + star.speed) % 100,
            opacity: 0.2 + Math.sin(Date.now() * 0.001 + star.id) * 0.3,
          })),
        )
      }

      const interval = setInterval(animateStars, 50)
      return () => clearInterval(interval)
    }, [])

    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity * 0.5})`,
            }}
          />
        ))}
      </div>
    )
  }

  const ThinkingIndicator = () => (
    <div className="flex justify-start">
      <div className="max-w-[70%] rounded-2xl px-4 py-3 text-gray-400">
        <div className="flex items-center gap-1">
          <span className="text-sm">Iris is thinking</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white relative flex flex-col">
      <StarlightBackground />

      {/* Browser Header */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {isChatMode && (
            <div className="flex items-center gap-3 ml-4">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <img src="/images/aether-eye-logo.png" alt="IRIS Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-sm font-medium text-gray-200">IRIS</span>
            </div>
          )}
          {!isChatMode && <div className="ml-4 text-sm text-gray-300">iris.com</div>}
        </div>
        <Button variant="secondary" size="sm" className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
          ⭐ Upgrade
        </Button>
      </div>

      {!isChatMode ? (
        // Welcome Screen
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-60px)] px-4 relative z-10 pt-16">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-2xl flex items-center justify-center mb-8 overflow-hidden">
            <img src="/images/aether-eye-logo.png" alt="IRIS Logo" className="w-full h-full object-contain" />
          </div>

          {/* Greeting */}
          <h1 className="text-2xl font-medium text-gray-200 mb-2 text-center">Good to See You!</h1>
          <h2 className="text-xl text-gray-300 mb-4 text-center">How Can I be an Assistance?</h2>
          <p className="text-gray-400 text-sm mb-12 text-center">I'm available 24/7 for you, ask me anything.</p>

          {/* Input Area */}
          <div className="w-full max-w-2xl relative mb-8">
            <div
              ref={inputContainerRef}
              className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-3 border border-gray-700 relative overflow-hidden transition-all duration-300"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                background: isHovered
                  ? `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 70%), rgb(31, 41, 55)`
                  : "rgb(31, 41, 55)",
              }}
            >
              <Input
                placeholder="Ask anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none p-0 relative z-10"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSendMessage}
                className="p-1 h-auto relative z-10 hover:bg-transparent transition-transform duration-200 hover:scale-125"
              >
                <Send className="h-5 w-[20] text-slate-300 shadow-none" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-1 relative z-10 pt-16">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-24">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-3 ${message.isUser ? "bg-blue-600 text-white" : "text-gray-200"}`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            {isThinking && <ThinkingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Input Area */}
          <div className="fixed bottom-0 left-0 right-0 border-t border-gray-700 bg-gray-900 px-4 py-4 z-30">
            <div className="max-w-4xl mx-auto">
              <div
                ref={inputContainerRef}
                className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-3 border border-gray-700 relative overflow-hidden transition-all duration-300"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                  background: isHovered
                    ? `radial-gradient(circle 120px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 70%), rgb(31, 41, 55)`
                    : "rgb(31, 41, 55)",
                }}
              >
                <Input
                  placeholder="Ask anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 bg-transparent border-none text-white placeholder-gray-400 focus:ring-0 focus:outline-none p-0 relative z-10"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSendMessage}
                  className="p-1 h-auto relative z-10 hover:bg-transparent transition-transform duration-200 hover:scale-125"
                >
                  <Send className="h-5 w-[20] text-slate-300 shadow-none" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
