import { createContext, useContext, useEffect, useState } from 'react'
import { fonts, type Font, fontImports, fontClassNames } from '@/config/fonts'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const FONT_COOKIE_NAME = 'font'
const FONT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

type FontContextType = {
  font: Font
  setFont: (font: Font) => void
  resetFont: () => void
}

const FontContext = createContext<FontContextType | null>(null)

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, _setFont] = useState<Font>(() => {
    const savedFont = getCookie(FONT_COOKIE_NAME)
    return fonts.includes(savedFont as Font) ? (savedFont as Font) : fonts[0]
  })

  // Load Google Fonts when font changes
  useEffect(() => {
    const loadFont = async (font: Font) => {
      const fontImport = fontImports[font]
      
      // If it's a Google Font, load it
      if (fontImport) {
        // Check if the font is already loaded
        const existingLink = document.querySelector(`link[href="${fontImport}"]`)
        if (!existingLink) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = fontImport
          document.head.appendChild(link)
        }
      }
    }

    loadFont(font)
  }, [font])

  useEffect(() => {
    const applyFont = (font: Font) => {
      const root = document.documentElement
      
      // Remove existing font classes
      root.classList.forEach((cls) => {
        if (cls.startsWith('font-')) root.classList.remove(cls)
      })
      
      // Add new font class
      root.classList.add(fontClassNames[font])
    }

    applyFont(font)
  }, [font])

  const setFont = (font: Font) => {
    setCookie(FONT_COOKIE_NAME, font, FONT_COOKIE_MAX_AGE)
    _setFont(font)
  }

  const resetFont = () => {
    removeCookie(FONT_COOKIE_NAME)
    _setFont(fonts[0])
  }

  return (
    <FontContext.Provider value={{ font, setFont, resetFont }}>
      {children}
    </FontContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFont = () => {
  const context = useContext(FontContext)
  if (!context) {
    throw new Error('useFont must be used within a FontProvider')
  }
  return context
}