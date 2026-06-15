import { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit, Save, Eye, EyeOff, Globe } from 'lucide-react'
import toast from 'react-hot-toast'

const INITIAL_SECTIONS = [
  { id: '1', key: 'hero_title',     title: 'Titre Hero',          content: 'La mode comme art de vivre',    is_active: true,  updated_at: '2024-11-15' },
  { id: '2', key: 'hero_subtitle',  title: 'Sous-titre Hero',     content: 'Découvrez nos collections exclusives automne-hiver 2024', is_active: true, updated_at: '2024-11-15' },
  { id: '3', key: 'banner_text',    title: 'Bandeau promotionnel',content: 'Livraison gratuite dès 150€ d\'achat — Code : MILLA15 pour -15% sur votre 1ère commande', is_active: true, updated_at: '2024-11-10' },
  { id: '4', key: 'about_text',     title: 'À propos (extrait)',  content: 'MILLA BOUTIQUE est née d\'une passion pour la mode féminine haut de gamme. Depuis 2019, nous sélectionnons les plus belles créations pour la femme moderne.', is_active: true, updated_at: '2024-11-08' },
  { id: '5', key: 'footer_slogan',  title: 'Slogan footer',       content: 'L\'élégance à portée de main', is_active: true,  updated_at: '2024-11-01' },
  { id: '6', key: 'promo_banner',   title: 'Bannière promo',      content: 'Black Friday : -30% sur toute la boutique !', is_active: false, updated_at: '2024-10-28' },
]

export function AdminCMS() {
  const [sections, setSections] = useState(INITIAL_SECTIONS)
  const [editing, setEditing] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  const startEdit = (section: any) => {
    setEditing(section.id)
    setEditContent(section.content)
  }

  const saveEdit = (id: string) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, content: editContent, updated_at: new Date().toLocaleDateString('fr-FR') } : s))
    setEditing(null)
    toast.success('Section mise à jour')
  }

  const toggleActive = (id: string) => {
    setSections((prev) => prev.map((s) => s.id === id ? { ...s, is_active: !s.is_active } : s))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-white">Gestion du contenu</h1>
        <div className="flex items-center gap-2 text-green-400 text-xs">
          <Globe className="w-4 h-4" />
          Site en ligne
        </div>
      </div>

      <p className="text-white/40 text-sm">
        Modifiez les textes et contenus du site sans toucher au code.
      </p>

      <div className="space-y-4">
        {sections.map((section) => (
          <motion.div
            key={section.id}
            layout
            className={`glass-card p-5 ${!section.is_active ? 'opacity-50' : ''}`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-white font-semibold text-sm">{section.title}</h3>
                <p className="text-white/30 text-[10px] font-mono mt-0.5">{section.key}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-white/20 text-xs">{section.updated_at}</span>
                <button
                  onClick={() => toggleActive(section.id)}
                  className={`transition-colors ${section.is_active ? 'text-green-400 hover:text-red-400' : 'text-white/30 hover:text-green-400'}`}
                  title={section.is_active ? 'Désactiver' : 'Activer'}
                >
                  {section.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                {editing !== section.id && (
                  <button
                    onClick={() => startEdit(section)}
                    className="text-white/40 hover:text-gold transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {editing === section.id ? (
              <div className="space-y-3">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="input-gold w-full min-h-[80px] resize-none"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={() => setEditing(null)} className="btn-ghost border border-white/20 px-4 py-2 text-xs">Annuler</button>
                  <button onClick={() => saveEdit(section.id)} className="btn-gold px-6 py-2 text-xs flex items-center gap-2">
                    <Save className="w-3 h-3" /> Sauvegarder
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-white/60 text-sm leading-relaxed">{section.content}</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
