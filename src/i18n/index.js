import ru from './ru.js'
import fi from './fi.js'
import en from './en.js'

export const languages = [
  { code: 'fi', label: 'Suomi', locale: 'fi-FI' },
  { code: 'ru', label: 'Русский', locale: 'ru-RU' },
  { code: 'en', label: 'English', locale: 'en-GB' },
]
export const dictionaries = { ru, fi, en }
export const storageKey = 'dsa2-language'
export const defaultLanguage = 'ru'

export function resolveLanguage(value) {
  return Object.hasOwn(dictionaries, value) ? value : defaultLanguage
}

export function readLanguage(storage) {
  try {
    return resolveLanguage(storage.getItem(storageKey))
  } catch {
    return defaultLanguage
  }
}

export function saveLanguage(storage, language) {
  try {
    storage.setItem(storageKey, resolveLanguage(language))
  } catch {
    // Language switching remains available when browser storage is disabled.
  }
}

export function formatMessage(template, values = {}) {
  return template.replace(/\{(\w+)\}/g, (match, key) => values[key] ?? match)
}
