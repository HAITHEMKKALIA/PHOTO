import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Search, Menu, X, Bell, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useChatStore } from '@/stores/chatStore'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Boutique', href: '/boutique' },
  { label: 'Collections', href: '/collections' },
  { label: 'Nouveautés', href: '/boutique?filter=new' },
  { label: 'À propos', href: '/a-propos' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const cartCount = useCartStore((s) => s.count())
  const openCart = useCartStore((s) => s.openCart)
  const { profile } = useAuthStore()
  const unreadNotif = useNotificationStore((s) => s.unreadCount())
  const { setOpen: setChatOpen, totalUnread } = useChatStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/boutique?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-80 transition-all duration-500',
          scrolled
            ? 'bg-noir-900/95 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        )}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex flex-col items-start group">
              <span className="font-display text-xl font-bold tracking-[0.3em] gold-text group-hover:text-shadow-gold transition-all duration-300">
                MILLA
              </span>
              <span className="text-white/30 text-[8px] tracking-[0.5em] uppercase -mt-1">
                BOUTIQUE
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'nav-link',
                    location.pathname === link.href && 'text-gold after:w-full'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-white/60 hover:text-gold transition-colors"
                aria-label="Rechercher"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              {profile && (
                <Link
                  to="/compte/notifications"
                  className="relative p-2 text-white/60 hover:text-gold transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotif > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-noir-900 text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unreadNotif > 9 ? '9+' : unreadNotif}
                    </span>
                  )}
                </Link>
              )}

              {/* Chat */}
              {profile && (
                <button
                  onClick={() => setChatOpen(true)}
                  className="relative p-2 text-white/60 hover:text-gold transition-colors"
                  aria-label="Chat"
                >
                  <MessageCircle className="w-5 h-5" />
                  {totalUnread() > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-noir-900 text-[9px] font-bold rounded-full flex items-center justify-center">
                      {totalUnread()}
                    </span>
                  )}
                </button>
              )}

              {/* Account */}
              <Link
                to={profile ? '/compte' : '/connexion'}
                className="p-2 text-white/60 hover:text-gold transition-colors"
                aria-label="Compte"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-white/60 hover:text-gold transition-colors"
                aria-label="Panier"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    className="absolute top-0 right-0 w-4 h-4 bg-gold text-noir-900 text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-white/60 hover:text-gold transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-70 bg-noir-900 flex flex-col pt-20 px-6 pb-6 lg:hidden"
          >
            <div className="flex flex-col gap-6 mt-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className="font-display text-2xl text-white hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto flex flex-col gap-4">
              <div className="h-px bg-white/10" />
              <Link to={profile ? '/compte' : '/connexion'} className="text-white/60 text-sm">
                {profile ? `Mon compte — ${profile.full_name}` : 'Se connecter'}
              </Link>
              {profile?.role === 'admin' && (
                <Link to="/admin" className="text-gold text-sm">Panel Admin →</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-90 bg-black/90 backdrop-blur-xl flex items-start justify-center pt-32 px-4"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-2xl"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher robes, blazers, sacs..."
                  className="w-full bg-white/[0.06] border border-white/20 text-white placeholder-white/30 pl-12 pr-4 py-5 text-lg font-body focus:outline-none focus:border-gold/50"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
              <p className="text-white/30 text-xs mt-3 text-center">
                Appuyez sur Entrée pour rechercher · Échap pour fermer
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
