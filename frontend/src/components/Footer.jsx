import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-icon">⚽</span>
          <span className="footer-name">{t('site_name')}</span>
        </div>
        <p className="footer-tagline">{t('site_tagline')}</p>
        <p className="footer-copy">© {new Date().getFullYear()} {t('site_name')}. {t('footer_rights')}</p>
      </div>
    </footer>
  )
}
