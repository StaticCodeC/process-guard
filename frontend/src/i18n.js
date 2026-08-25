import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      nav: { home: 'Home', latest: 'Latest', leagues: 'Leagues', transfers: 'Transfers' },
      site_name: 'GoalPost',
      site_tagline: 'Your #1 Source for Football News',
      latest_news: 'Latest News',
      read_more: 'Read More',
      back_to_home: 'Back to Home',
      category: 'Category',
      published: 'Published',
      share: 'Share',
      comments: 'Comments',
      no_comments: 'Be the first to comment!',
      comment_placeholder: 'Write your comment...',
      name_placeholder: 'Your name',
      post_comment: 'Post Comment',
      comment_success: 'Comment posted!',
      loading: 'Loading...',
      error_loading: 'Failed to load. Please try again.',
      all_categories: 'All',
      hero_title: 'Stay Ahead of the Game',
      hero_subtitle: 'Breaking football news, transfer updates, and match analysis — in three languages.',
      featured: 'Featured',
      more_news: 'More News',
      footer_rights: 'All rights reserved.',
    }
  },
  fr: {
    translation: {
      nav: { home: 'Accueil', latest: 'Actualités', leagues: 'Ligues', transfers: 'Transferts' },
      site_name: 'GoalPost',
      site_tagline: "Votre source n°1 d'actualités footballistiques",
      latest_news: 'Dernières nouvelles',
      read_more: 'Lire la suite',
      back_to_home: "Retour à l'accueil",
      category: 'Catégorie',
      published: 'Publié le',
      share: 'Partager',
      comments: 'Commentaires',
      no_comments: 'Soyez le premier à commenter !',
      comment_placeholder: 'Écrivez votre commentaire...',
      name_placeholder: 'Votre nom',
      post_comment: 'Publier',
      comment_success: 'Commentaire publié !',
      loading: 'Chargement...',
      error_loading: 'Impossible de charger. Veuillez réessayer.',
      all_categories: 'Tout',
      hero_title: 'Restez en avance sur le jeu',
      hero_subtitle: 'Actualités en direct, transferts et analyses de matchs — en trois langues.',
      featured: 'À la une',
      more_news: "Plus d'actualités",
      footer_rights: 'Tous droits réservés.',
    }
  },
  ar: {
    translation: {
      nav: { home: 'الرئيسية', latest: 'أحدث الأخبار', leagues: 'الدوريات', transfers: 'الانتقالات' },
      site_name: 'GoalPost',
      site_tagline: 'مصدرك الأول لأخبار كرة القدم',
      latest_news: 'آخر الأخبار',
      read_more: 'اقرأ المزيد',
      back_to_home: 'العودة للرئيسية',
      category: 'الفئة',
      published: 'نُشر في',
      share: 'مشاركة',
      comments: 'التعليقات',
      no_comments: 'كن أول من يعلّق!',
      comment_placeholder: 'اكتب تعليقك...',
      name_placeholder: 'اسمك',
      post_comment: 'نشر التعليق',
      comment_success: 'تم نشر تعليقك!',
      loading: 'جاري التحميل...',
      error_loading: 'فشل التحميل. الرجاء المحاولة مرة أخرى.',
      all_categories: 'الكل',
      hero_title: 'ابقَ في صدارة اللعبة',
      hero_subtitle: 'أخبار كرة القدم العاجلة وتحديثات الانتقالات والتحليلات — بثلاث لغات.',
      featured: 'مميز',
      more_news: 'المزيد من الأخبار',
      footer_rights: 'جميع الحقوق محفوظة.',
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})

export default i18n
