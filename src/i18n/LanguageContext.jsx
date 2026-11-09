import { createContext, useContext, useEffect, useState } from 'react'
import { defaultLanguage, dictionaries, formatMessage, languages, readLanguage, resolveLanguage, saveLanguage } from './index.js'

const LanguageContext = createContext(null)

function initialLanguage() {
  try { return readLanguage(window.localStorage) } catch { return defaultLanguage }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(initialLanguage)
  const text = dictionaries[language]
  const locale = languages.find(item => item.code === language).locale

  useEffect(() => {
    document.documentElement.lang = language
    document.querySelector('meta[name="description"]')?.setAttribute('content', text.ui.description)
    try { saveLanguage(window.localStorage, language) } catch { /* Keep the in-memory choice. */ }
  }, [language, text])

  function message(key, values) {
    return formatMessage(text.messages[key], values)
  }

  return (
    <LanguageContext.Provider value={{ language, locale, text, message, setLanguage: value => setLanguage(resolveLanguage(value)) }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
