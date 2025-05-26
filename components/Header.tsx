"use client"

import { Type, Sparkles, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/useTheme"
import { useImageToggle } from "@/hooks/useImageToggle"
import Image from "next/image"

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { isImageVisible, toggleImage } = useImageToggle()

  return (
    <div className="text-center mb-12 pt-12">
      <div className="flex items-center justify-center gap-4 mb-6 relative">
        <div className="relative">
          <button
            onClick={toggleImage}
            className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg shadow-blue-500/25 dark:shadow-blue-500/40 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 animate-scale-in animation-delay-100 z-0"
          >
            <Type className="w-8 h-8 text-white" />
          </button>

          {/* Hidden Image */}
          <div
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              isImageVisible ? "opacity-100 scale-100 z-10" : "opacity-0 scale-90 z-0 pointer-events-none"
            }`}
          >
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-black/50">
              <Image src="/images/1488.jpg" alt="Hidden image" fill className="object-cover" sizes="64px" />
              <button
                onClick={toggleImage}
                className="absolute inset-0 w-full h-full bg-transparent z-30"
                aria-label="Toggle back to logo"
              />
            </div>
          </div>

          {/* Sparkles - positioned above everything */}
          <div className="absolute -top-1 -right-1 animate-bounce-in animation-delay-300 z-20">
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="absolute right-0 top-0 animate-fade-in animation-delay-500">
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-300 rounded-xl"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      <div className="animate-fade-in animation-delay-200">
        <h1 className="text-5xl font-light bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-gray-100 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3 tracking-tight">
          Text Transformer
        </h1>
      </div>
    </div>
  )
}