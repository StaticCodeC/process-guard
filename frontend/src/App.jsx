import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './components/HomePage.jsx'
import ArticlePage from './components/ArticlePage.jsx'

export default function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const isArabic = i18n.language === 'ar'
    document.documentElement.lang = i18n.language
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr'
    document.body.className = isArabic ? 'rtl' : 'ltr'
  }, [i18n.language])

  return (
    <div className="app-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
