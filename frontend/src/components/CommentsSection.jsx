import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const API = 'http://localhost:8000'

function formatDate(dateStr, lang) {
  try {
    return new Date(dateStr).toLocaleDateString(
      lang === 'ar' ? 'ar-SA' : lang === 'fr' ? 'fr-FR' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    )
  } catch { return dateStr }
}

const AVATAR_COLORS = ['#1d6ef5','#dc2626','#047857','#b45309','#6b21a8','#065f46']
function avatarColor(name) {
  let h = 0; for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}
function getInitials(name) { return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) }

export default function CommentsSection({ articleId }) {
  const { t, i18n } = useTranslation()
  const [comments, setComments] = useState([])
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/articles/${articleId}/comments`).then(r => r.json()).then(setComments).catch(() => {})
  }, [articleId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!author.trim() || !content.trim()) return
    setSubmitting(true); setError('')
    try {
      const res = await fetch(`${API}/articles/${articleId}/comments`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: author.trim(), content: content.trim() })
      })
      if (!res.ok) throw new Error()
      const c = await res.json()
      setComments(prev => [...prev, c]); setContent(''); setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch { setError('Failed to post comment.') } finally { setSubmitting(false) }
  }

  return (
    <section className="comments-section">
      <h2 className="comments-title">{t('comments')}<span className="comments-count">{comments.length}</span></h2>
      <form className="comment-form" onSubmit={handleSubmit}>
        <input className="comment-input" type="text" placeholder={t('name_placeholder')} value={author} onChange={e => setAuthor(e.target.value)} required maxLength={80} />
        <textarea className="comment-textarea" placeholder={t('comment_placeholder')} value={content} onChange={e => setContent(e.target.value)} required maxLength={1000} rows={4} />
        {error && <p className="comment-error">{error}</p>}
        {success && <p className="comment-success">{t('comment_success')}</p>}
        <button type="submit" className="comment-submit" disabled={submitting || !author.trim() || !content.trim()}>
          {submitting ? '...' : t('post_comment')}
        </button>
      </form>
      <div className="comments-list">
        {comments.length === 0 ? <p className="no-comments">{t('no_comments')}</p> : comments.map(c => (
          <div key={c.id} className="comment-item">
            <div className="comment-avatar" style={{ background: avatarColor(c.author) }}>{getInitials(c.author)}</div>
            <div className="comment-body">
              <div className="comment-header">
                <span className="comment-author">{c.author}</span>
                <span className="comment-date">{formatDate(c.created_at, i18n.language)}</span>
              </div>
              <p className="comment-content">{c.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
