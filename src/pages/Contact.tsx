import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Message envoyé ! Nous vous répondrons sous 24h.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="py-20 text-center border-b border-white/[0.06]">
        <p className="section-subtitle text-gold mb-4">Contactez-nous</p>
        <h1 className="font-display text-5xl md:text-6xl text-white mb-4">Nous sommes là</h1>
        <p className="text-white/40 text-sm max-w-md mx-auto">
          Une question, un conseil de style, un service personnalisé ? Notre équipe répond sous 24h.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-3xl text-white mb-8">Nos coordonnées</h2>
            <div className="space-y-6 mb-12">
              {[
                { Icon: Mail,   title: 'Email',     info: 'contact@milla-boutique.fr' },
                { Icon: Phone,  title: 'Téléphone', info: '+33 1 23 45 67 89' },
                { Icon: MapPin, title: 'Adresse',   info: '24 Rue de la Paix, 75001 Paris' },
                { Icon: Clock,  title: 'Horaires',  info: 'Lun-Ven : 9h-18h · Sam : 10h-16h' },
              ].map(({ Icon, title, info }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-gold/30 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs tracking-widest uppercase mb-1">{title}</p>
                    <p className="text-white text-sm">{info}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div>
              <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Suivez-nous</p>
              <div className="flex gap-3">
                {['Instagram', 'Facebook', 'Pinterest', 'TikTok'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="px-4 py-2 border border-white/20 text-white/50 hover:border-gold/50 hover:text-gold text-xs transition-all"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="glass-card p-8">
              <h2 className="font-display text-2xl text-white mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Nom</label>
                    <input className="input-gold" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Email</label>
                    <input type="email" className="input-gold" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                  </div>
                </div>
                <div>
                  <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Sujet</label>
                  <select
                    className="input-gold appearance-none cursor-pointer"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                  >
                    <option value="" className="bg-noir-700">Choisir un sujet</option>
                    <option value="commande" className="bg-noir-700">Question sur une commande</option>
                    <option value="produit" className="bg-noir-700">Question sur un produit</option>
                    <option value="retour" className="bg-noir-700">Retour / Échange</option>
                    <option value="taille" className="bg-noir-700">Conseil de taille</option>
                    <option value="autre" className="bg-noir-700">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Message</label>
                  <textarea
                    className="input-gold min-h-[140px] resize-none"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    placeholder="Décrivez votre demande..."
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full group">
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-noir-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4" /> Envoyer le message</>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
