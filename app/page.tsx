"use client"

import { Header } from "@/components/Header"
import { InputSection } from "@/components/InputSection"
import { OutputSection } from "@/components/OutputSection"
import { TransformControls } from "@/components/TransformControls"
import { useTextTransformer } from "@/hooks/useTextTransformer"

export default function TextTransformer() {
  const { inputText, outputText, selectedMask, copied, setInputText, setSelectedMask, copyToClipboard } =
    useTextTransformer()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] [background-size:20px_20px] opacity-40 animate-fade-in"></div>

      <div className="relative">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="animate-slide-down">
            <Header />
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12 items-stretch">
            <div className="animate-slide-up animation-delay-200">
              <InputSection inputText={inputText} onInputChange={setInputText} />
            </div>
            <div className="animate-slide-up animation-delay-400">
              <OutputSection outputText={outputText} copied={copied} onCopy={copyToClipboard} />
            </div>
          </div>

          <div className="animate-slide-up animation-delay-600">
            <TransformControls selectedMask={selectedMask} onMaskChange={setSelectedMask} />
          </div>

          {/* Bottom Spacing */}
          <div className="h-20"></div>
        </div>
      </div>
    </div>
  )
}