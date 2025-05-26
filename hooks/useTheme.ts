"use client"

import { useState, useEffect } from "react"

export type Theme = "light" | "dark"

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark")
    const savedTheme = localStorage.getItem("theme") as Theme

    let actualTheme: Theme

    if (savedTheme) {
      actualTheme = savedTheme
    } else {
      actualTheme = "dark"
      localStorage.setItem("theme", "dark")
    }

    setTheme(actualTheme)

    if (actualTheme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
    }
  }, [])

  const updateTheme = (newTheme: Theme) => {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
    }
    localStorage.setItem("theme", newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    updateTheme(newTheme)
  }

  return { theme, toggleTheme }
}