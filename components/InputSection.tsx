"use client"

import type React from "react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MAX_TEXT_LENGTH } from "@/constants/masks"
import { truncateText, getCharacterCountVariant, formatCharacterCount } from "@/utils"

interface InputSectionProps {
  inputText: string
  onInputChange: (text: string) => void
}

export function InputSection({ inputText, onInputChange }: InputSectionProps) {
  const characterCount = inputText.length

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const truncatedText = truncateText(e.target.value, MAX_TEXT_LENGTH)
    onInputChange(truncatedText)
  }

  return (
    <div className="h-full">
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl shadow-gray-200/50 dark:shadow-black/25 hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-black/40 transition-all duration-500 rounded-3xl overflow-hidden h-full flex flex-col">
        <CardHeader className="pb-6 pt-8 px-8 flex-shrink-0">
          <CardTitle className="text-gray-800 dark:text-gray-200 flex items-center gap-3 text-xl font-medium animate-fade-in animation-delay-100">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-400/50 animate-pulse-soft animation-delay-200"></div>
            Input Text
          </CardTitle>
        </CardHeader>
        <CardContent className="px-8 pb-8 flex-1 flex flex-col overflow-hidden">
          <div className="relative h-[320px] animate-fade-in animation-delay-200">
            <Textarea
              value={inputText}
              onChange={handleTextChange}
              placeholder="Enter your text to transform..."
              className="absolute inset-0 w-full h-full bg-gray-50/50 dark:bg-gray-800/50 border-2 border-gray-200/50 dark:border-gray-700/50 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300 resize-none rounded-2xl text-lg leading-relaxed font-light shadow-inner overflow-y-auto p-4"
              maxLength={MAX_TEXT_LENGTH}
            />
            <div className="absolute bottom-4 right-4 animate-fade-in animation-delay-300 pointer-events-none">
              <Badge
                variant={getCharacterCountVariant(characterCount, MAX_TEXT_LENGTH)}
                className="text-xs font-medium bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 border-gray-200/50 dark:border-gray-700/50 shadow-sm"
              >
                {formatCharacterCount(characterCount, MAX_TEXT_LENGTH)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}