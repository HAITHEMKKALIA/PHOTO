import { Link } from 'react-router-dom'
import { Instagram, Facebook, Youtube, Heart } from 'lucide-react'
import { motion } from 'framer-motion'

export function Footer() {
  return (
    <footer className="bg-noir-900 border-t border-white/[0.06] mt-20">
      {/* Newsletter strip */}
      <div className="bg-gradient-to-r from-transparent via-gold/10 to-transparent border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="section-subtitle mb-2">Newsletter exclusive</p>
            <h3 className="font-display text-2xl text-white">
              Rejoignez le cercle <span className="gold-text">MILLA</span>
            </h3>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-0 w-full md:w-auto"
          >
            <input
              type="email"
              placeholder="votre@email.com"
              className="input-gold flex-1 md:w-72"
            />
            <button
              type="submit"
              className="btn-gold px-6 py-3 text-xs whitespace-nowrap"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <span className="font-display text-2xl font-bold gold-text">MILLA</span>
              <br />
              <span className="text-white/30 text-[10px] tracking-[0.5em] uppercase">BOUTIQUE</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Mode féminine haut de gamme. Chaque pièce est sélectionnée avec soin pour
              la femme moderne qui ose affirmer son style.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Facebook, href: '#', label: 'Facebook' },
                { Icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-white/20 hover:border-gold/60 flex items-center justify-center text-white/40 hover:text-gold transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-white/80 font-body text-xs tracking-[0.3em] uppercase mb-6">Collections</h4>
            <ul className="space-y-3">
              {['Robes de soirée','Blazers & Tailleurs','Sacs & Accessoires','Nouvelles Arrivées','Soldes'].map((item) => (
                <li key={item}>
                  <Link
                    to="/boutique"
                    className="text-white/40 hover:text-gold text-sm transition-colors duration-200"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white/80 font-body text-xs tracking-[0.3em] uppercase mb-6">Informations</h4>
            <ul className="space-y-3">
              {[
                { label: 'À propos', href: '/a-propos' },
                { label: 'Contact', href: '/contact' },
                { label: 'Suivi de commande', href: '/suivi-commande' },
                { label: 'Livraison & retours', href: '/contact' },
                { label: 'Guide des tailles', href: '/boutique' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    to={href}
                    className="text-white/40 hover:text-gold text-sm transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-white/80 font-body text-xs tracking-[0.3em] uppercase mb-6">Légal</h4>
            <ul className="space-y-3">
              {['Mentions légales','CGV','Politique de confidentialité','Cookies'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-white/40 hover:text-gold text-sm transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs font-body">
            © {new Date().getFullYear()} MILLA BOUTIQUE. Tous droits réservés.
          </p>
          <p className="text-white/20 text-xs flex items-center gap-1">
            Créé avec <Heart className="w-3 h-3 text-gold fill-gold" /> pour la femme moderne
          </p>
        </div>
      </div>
    </footer>
  )
}
