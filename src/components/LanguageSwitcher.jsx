import { useLanguage } from '../i18n/LanguageContext.jsx'
import { languages } from '../i18n/index.js'

export default function LanguageSwitcher() {
  const { language, setLanguage, text } = useLanguage()
  return (
    <div className="language-switcher" role="group" aria-label={text.ui.language}>
      <span className="language-label">{text.ui.language}</span>
      <div className="language-options">
        {languages.map(item => (
          <button key={item.code} type="button" lang={item.code} aria-pressed={language === item.code}
            onClick={() => setLanguage(item.code)}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}
