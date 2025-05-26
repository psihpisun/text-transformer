"use client"

import { useState, useEffect } from "react"
import type { MaskType, TransformState } from "@/types"
import { lite, medium, hard, COPY_FEEDBACK_DELAY } from "@/constants/masks"

export function useTextTransformer() {
  const [state, setState] = useState<Omit<TransformState, "isTransforming">>({
    inputText: "",
    outputText: "",
    selectedMask: "lite",
    copied: false,
  })

  const setInputText = (text: string) => {
    setState((prev) => ({ ...prev, inputText: text }))
  }

  const setSelectedMask = (mask: MaskType) => {
    setState((prev) => ({ ...prev, selectedMask: mask }))
  }

  // Real-time transformation
  useEffect(() => {
    let mask: Record<string, string>

    switch (state.selectedMask) {
      case "lite":
        mask = lite
        break
      case "medium":
        mask = medium
        break
      case "hard":
        mask = hard
        break
      default:
        mask = lite
    }

    const result = state.inputText
      .split("")
      .map((char) => mask[char as keyof typeof mask] || char)
      .join("")

    setState((prev) => ({
      ...prev,
      outputText: result,
    }))
  }, [state.inputText, state.selectedMask])

  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(state.outputText)
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = state.outputText
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand("copy")
        textArea.remove()
      }

      setState((prev) => ({ ...prev, copied: true }))
      setTimeout(() => {
        setState((prev) => ({ ...prev, copied: false }))
      }, COPY_FEEDBACK_DELAY)
    } catch (err) {
      console.error("Failed to copy text: ", err)
      setState((prev) => ({ ...prev, copied: false }))
    }
  }

  return {
    ...state,
    setInputText,
    setSelectedMask,
    copyToClipboard,
  }
}