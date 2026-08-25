import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import CommentsSection from './CommentsSection.jsx'

const API = 'http://localhost:8000'

const CATEGORY_COLORS = {
  'Champions League': '#1d6ef5', 'Premier League': '#6b21a8',
  'Ligue 1': '#dc2626', 'World Cup': '#b45309',
  'Transfers': '#047857', 'Awards': '#b45309', 'AFCON': '#065f46',
}

function formatDate(dateStr, lang) {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString(
      lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : 'en-US',
      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    )
  } catch { return dateStr }
}

export default function ArticlePage() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true); setError(false)
    fetch(`${API}/articles/${id}?lang=${i18n.language}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(data => { setArticle(data); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [id, i18n.language])

  if (loading) return <div className="container loading-state"><div className="spinner" /><span>{t('loading')}</span></div>
  if (error || !article) return <div className="container error-state"><span>⚠ {t('error_loading')}</span><Link to="/" className="back-link">{t('back_to_home')}</Link></div>

  const catColor = CATEGORY_COLORS[article.category] || '#1d6ef5'

  return (
    <div className="article-page">
      <div className="article-hero">
        <img src={article.image_url} alt={article.title} className="article-hero-img"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=1200&auto=format' }} />
        <div className="article-hero-overlay" />
        <div className="article-hero-content">
          <span className="article-category-badge" style={{ background: catColor }}>{article.category}</span>
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <span className="article-date">{t('published')}: {formatDate(article.created_at, i18n.language)}</span>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="article-layout">
          <article className="article-content-wrap">
            <Link to="/" className="back-link">← {t('back_to_home')}</Link>
            <p className="article-summary">{article.summary}</p>
            <div className="article-body">
              {article.content.split('\n').map((para, i) => para.trim() ? <p key={i}>{para}</p> : null)}
            </div>
            <CommentsSection articleId={Number(id)} />
          </article>

          <aside className="article-sidebar">
            <div className="sidebar-card">
              <div className="sidebar-label">{t('category')}</div>
              <span className="sidebar-category" style={{ background: `${catColor}22`, color: catColor, border: `1px solid ${catColor}44` }}>
                {article.category}
              </span>
            </div>
            <div className="sidebar-card">
              <div className="sidebar-label">{t('share')}</div>
              <div className="share-buttons">
                <button className="share-btn share-tw" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}`)}>
                  𝕏 Twitter
                </button>
                <button className="share-btn share-fb" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`)}>
                  Facebook
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
