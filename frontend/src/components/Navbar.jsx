import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const LANGUAGES = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'ar', label: 'ع', flag: '🇸🇦' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  const switchLang = (code) => { i18n.changeLanguage(code); setMenuOpen(false) }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">⚽</span>
          <span className="brand-name">{t('site_name')}</span>
        </Link>
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>{t('nav.leagues')}</Link>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>{t('nav.transfers')}</Link>
        </div>
        <div className="navbar-actions">
          <div className="lang-switcher">
            {LANGUAGES.map((lang) => (
              <button key={lang.code} className={`lang-btn ${i18n.language === lang.code ? 'active' : ''}`} onClick={() => switchLang(lang.code)}>
                <span className="lang-flag">{lang.flag}</span>
                <span className="lang-label">{lang.label}</span>
              </button>
            ))}
          </div>
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  )
}
