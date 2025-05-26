"use client"

import { Settings, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { MaskType } from "@/types"
import { maskOptions } from "@/constants/masks"

interface TransformControlsProps {
  selectedMask: MaskType
  onMaskChange: (mask: MaskType) => void
}

export function TransformControls({ selectedMask, onMaskChange }: TransformControlsProps) {
  const selectedMaskOption = maskOptions.find((option) => option.id === selectedMask)

  return (
    <div className="flex items-center justify-center">
      <div className="animate-scale-in animation-delay-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 rounded-2xl p-4 shadow-lg shadow-gray-200/50 dark:shadow-black/25 hover:shadow-xl hover:shadow-gray-300/50 dark:hover:shadow-black/40 hover:scale-105 active:scale-95"
              title={`Current mask: ${selectedMaskOption?.name} (${selectedMaskOption?.letterCount} letters)`}
            >
              <Settings className="w-5 h-5 transition-transform duration-300 hover:rotate-90" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="center"
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 shadow-2xl shadow-gray-300/50 dark:shadow-black/50 min-w-[320px] rounded-2xl p-2 mt-2 animate-slide-up"
          >
            <div className="p-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 px-3 font-light animate-fade-in animation-delay-100">
                Choose a mask:
              </div>
              {maskOptions.map((option, index) => (
                <div key={option.id} className="animate-fade-in" style={{ animationDelay: `${(index + 1) * 100}ms` }}>
                  <DropdownMenuItem
                    onClick={() => onMaskChange(option.id)}
                    className="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-800/80 transition-all duration-200 border-0"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono bg-gray-100/50 dark:bg-gray-800/50 px-2 py-0.5 rounded">
                          {option.letterCount}
                        </span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{option.name}</span>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-100/50 dark:bg-gray-800/50 px-3 py-1 rounded-lg">
                        {option.preview}
                      </div>
                    </div>
                    {selectedMask === option.id && (
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-scale-in">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </DropdownMenuItem>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 animate-fade-in animation-delay-400">
                <div className="text-xs text-gray-500 dark:text-gray-400 px-3 font-light">
                  Active:{" "}
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    {selectedMaskOption?.name} ({selectedMaskOption?.letterCount} letters)
                  </span>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}