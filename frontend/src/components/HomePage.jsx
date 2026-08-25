import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ArticleCard from './ArticleCard.jsx'

const API = 'http://localhost:8000'
const ALL_CATEGORIES = ['Champions League', 'Premier League', 'World Cup', 'Transfers', 'Awards', 'AFCON', 'Ligue 1']

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch(`${API}/articles?lang=${i18n.language}`)
      .then(r => r.json())
      .then(data => { setArticles(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [i18n.language])

  const filtered = activeCategory === 'all' ? articles : articles.filter(a => a.category === activeCategory)
  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div className="home-page">
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">⚽ {t('latest_news')}</div>
          <h1 className="hero-title">{t('hero_title')}</h1>
          <p className="hero-subtitle">{t('hero_subtitle')}</p>
        </div>
        <div className="hero-pattern" aria-hidden="true" />
      </section>

      <div className="category-bar">
        <div className="category-bar-inner">
          <button className={`cat-btn ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>
            {t('all_categories')}
          </button>
          {ALL_CATEGORIES.map(cat => (
            <button key={cat} className={`cat-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="container">
        {loading && <div className="loading-state"><div className="spinner" /><span>{t('loading')}</span></div>}
        {error && <div className="error-state"><span>⚠ {t('error_loading')}</span></div>}
        {!loading && !error && filtered.length > 0 && (
          <>
            {featured && (
              <section className="featured-section">
                <div className="section-label">{t('featured')}</div>
                <ArticleCard article={featured} featured={true} />
              </section>
            )}
            {rest.length > 0 && (
              <section className="articles-section">
                <div className="section-label">{t('more_news')}</div>
                <div className="articles-grid">
                  {rest.map(article => <ArticleCard key={article.id} article={article} />)}
                </div>
              </section>
            )}
          </>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="empty-state"><span>No articles found.</span></div>
        )}
      </div>
    </div>
  )
}
