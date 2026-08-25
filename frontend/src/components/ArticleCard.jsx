import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const CATEGORY_COLORS = {
  'Champions League': '#1d6ef5', 'Premier League': '#6b21a8',
  'Ligue 1': '#dc2626', 'World Cup': '#b45309',
  'Transfers': '#047857', 'Awards': '#b45309', 'AFCON': '#065f46', 'La Liga': '#d97706',
}

function formatDate(dateStr, lang) {
  try {
    return new Date(dateStr).toLocaleDateString(
      lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    )
  } catch { return dateStr }
}

export default function ArticleCard({ article, featured = false }) {
  const { t, i18n } = useTranslation()
  const color = CATEGORY_COLORS[article.category] || '#1d6ef5'
  return (
    <Link to={`/article/${article.id}`} className={`article-card ${featured ? 'featured' : ''}`}>
      <div className="card-image-wrap">
        <img src={article.image_url} alt={article.title} className="card-image" loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1508098682722-e99c643e7f0b?w=800&auto=format' }} />
        <span className="card-category" style={{ background: color }}>{article.category}</span>
      </div>
      <div className="card-body">
        <h3 className="card-title">{article.title}</h3>
        <p className="card-summary">{article.summary}</p>
        <div className="card-footer">
          <span className="card-date">{formatDate(article.created_at, i18n.language)}</span>
          <span className="card-read-more">{t('read_more')} →</span>
        </div>
      </div>
    </Link>
  )
}
