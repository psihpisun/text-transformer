"use client"

import { Copy, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OutputSectionProps {
  outputText: string
  copied: boolean
  onCopy: () => void
}

export function OutputSection({ outputText, copied, onCopy }: OutputSectionProps) {
  return (
    <div className="h-full">
      <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl shadow-gray-200/50 dark:shadow-black/25 hover:shadow-2xl hover:shadow-gray-300/50 dark:hover:shadow-black/40 transition-all duration-500 rounded-3xl overflow-hidden h-full flex flex-col">
        <CardHeader className="pb-6 pt-8 px-8 flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-800 dark:text-gray-200 flex items-center gap-3 text-xl font-medium animate-fade-in animation-delay-100">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full shadow-lg shadow-blue-400/50 animate-pulse-soft animation-delay-200"></div>
              Output Text
            </CardTitle>
            <div className="animate-slide-left animation-delay-200">
              <Button
                onClick={onCopy}
                variant="ghost"
                size="sm"
                disabled={!outputText}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 rounded-xl h-9 px-3"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    <span className="text-green-600 dark:text-green-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-8 flex-1 flex flex-col overflow-hidden">
          <div className="relative h-[320px] animate-fade-in animation-delay-200">
            <div className="absolute inset-0 w-full h-full p-6 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-inner overflow-y-auto">
              {outputText ? (
                <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words leading-relaxed font-light text-lg animate-fade-in">
                  {outputText}
                </div>
              ) : (
                <div className="text-gray-400 dark:text-gray-500 flex items-center justify-center h-full font-light">
                  Your transformed text will appear here...
                </div>
              )}
            </div>

            {outputText && (
              <div className="absolute top-3 right-3 animate-scale-in pointer-events-none">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-soft shadow-lg shadow-green-400/50"></div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}