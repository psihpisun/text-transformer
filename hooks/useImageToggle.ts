"use client"

import { useState } from "react"

export function useImageToggle() {
  const [isImageVisible, setIsImageVisible] = useState(false)

  const toggleImage = () => {
    setIsImageVisible((prev) => !prev)
  }

  return { isImageVisible, toggleImage }
}