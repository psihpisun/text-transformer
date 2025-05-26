import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Text Transformer",
  description: "Beautiful text transformation app with unique character masks"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  
                  // Если темы нет в localStorage, устанавливаем темную
                  if (!theme) {
                    theme = 'dark';
                    localStorage.setItem('theme', 'dark');
                  }
                  
                  // Применяем тему
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  try {
                    localStorage.setItem('theme', 'dark');
                  } catch (storageError) {}
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} transition-colors duration-300`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
