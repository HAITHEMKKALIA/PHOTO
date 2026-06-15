import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, User, Search, Menu, X, Bell, MessageCircle, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useChatStore } from '@/stores/chatStore'
import { cn } from '@/lib/utils'
import { Magnetic } from '@/components/ui/Magnetic'

const NAV_LINKS = [
  { label: 'Boutique',    href: '/boutique',    mega: true },
  { label: 'Collections', href: '/collections', mega: false },
  { label: 'Nouveautés',  href: '/boutique?filter=new', mega: false },
  { label: 'À propos',    href: '/a-propos',    mega: false },
  { label: 'Contact',     href: '/contact',     mega: false },
]

const MEGA_LINKS = [
  { title: 'Robes',     items: ['Soirée','Cocktail','Casual','Longues'] },
  { title: 'Hauts',     items: ['Tops','Blouses','Chemises','Bodies'] },
  { title: 'Bas',       items: ['Jupes','Pantalons','Shorts','Combinaisons'] },
  { title: 'Accessoires',items: ['Sacs','Ceintures','Bijoux','Écharpes'] },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate  = useNavigate()
  const { scrollY } = useScroll()
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 1])

  const cartCount      = useCartStore((s) => s.count())
  const openCart       = useCartStore((s) => s.openCart)
  const { profile }    = useAuthStore()
  const unreadNotif    = useNotificationStore((s) => s.unreadCount())
  const { setOpen: setChatOpen, totalUnread } = useChatStore()

  useEffect(() => {
    const u = scrollY.on('change', (v) => setScrolled(v > 50))
    return u
  }, [scrollY])

  useEffect(() => {
    setMobileOpen(false)
    setMegaOpen(false)
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
      {/* ── Main nav ── */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-80"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Blur background */}
        <motion.div
          className="absolute inset-0 border-b border-white/[0.06]"
          style={{
            backgroundColor: `rgba(5,5,5,${bgOpacity.get()})`,
            backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <Link to="/" className="flex flex-col group z-10">
              <motion.span
                className="font-display text-xl font-black tracking-[0.35em] gold-text"
                whileHover={{ letterSpacing: '0.5em' }}
                transition={{ duration: 0.4 }}
              >
                MILLA
              </motion.span>
              <span className="text-white/20 text-[7px] tracking-[0.6em] uppercase -mt-0.5">BOUTIQUE</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => link.mega && setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <Link
                    to={link.href}
                    className={cn(
                      'nav-link flex items-center gap-1',
                      location.pathname === link.href && 'text-gold after:w-full'
                    )}
                  >
                    {link.label}
                    {link.mega && (
                      <ChevronDown className={`w-3 h-3 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
                    )}
                  </Link>

                  {/* Mega menu */}
                  {link.mega && (
                    <AnimatePresence>
                      {megaOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, clipPath: 'inset(0 0 100% 0)' }}
                          animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
                          exit={{ opacity: 0, y: 10, clipPath: 'inset(0 0 100% 0)' }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] bg-noir-800/95 backdrop-blur-xl border border-white/10 p-8 shadow-noir"
                        >
                          <div className="grid grid-cols-4 gap-6">
                            {MEGA_LINKS.map((cat) => (
                              <div key={cat.title}>
                                <p className="text-gold text-[10px] tracking-[0.3em] uppercase font-bold mb-3">{cat.title}</p>
                                <ul className="space-y-2">
                                  {cat.items.map((item) => (
                                    <li key={item}>
                                      <Link
                                        to="/boutique"
                                        className="text-white/50 hover:text-white text-xs transition-colors hover:translate-x-1 inline-block transition-transform"
                                      >
                                        {item}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                          <div className="mt-6 pt-5 border-t border-white/[0.06] flex gap-3">
                            {['Nouveautés','Soldes','Bestsellers'].map((tag) => (
                              <Link
                                key={tag}
                                to="/boutique"
                                className="text-[10px] tracking-widest uppercase border border-white/20 hover:border-gold/50 hover:text-gold text-white/40 px-3 py-1.5 transition-all"
                              >
                                {tag}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Magnetic strength={0.2}>
                <button onClick={() => setSearchOpen(true)} className="p-2 text-white/60 hover:text-gold transition-colors relative group">
                  <Search className="w-[18px] h-[18px]" />
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] tracking-widest text-white/0 group-hover:text-white/30 transition-colors whitespace-nowrap uppercase">Chercher</span>
                </button>
              </Magnetic>

              {profile && (
                <Magnetic strength={0.2}>
                  <Link to="/compte/notifications" className="relative p-2 text-white/60 hover:text-gold transition-colors">
                    <Bell className="w-[18px] h-[18px]" />
                    {unreadNotif > 0 && (
                      <motion.span key={unreadNotif} initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-gold text-noir-900 text-[9px] font-black rounded-full flex items-center justify-center">
                        {unreadNotif > 9 ? '9+' : unreadNotif}
                      </motion.span>
                    )}
                  </Link>
                </Magnetic>
              )}

              {profile && (
                <Magnetic strength={0.2}>
                  <button onClick={() => setChatOpen(true)} className="relative p-2 text-white/60 hover:text-gold transition-colors">
                    <MessageCircle className="w-[18px] h-[18px]" />
                    {totalUnread() > 0 && (
                      <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-gold text-noir-900 text-[9px] font-black rounded-full flex items-center justify-center">
                        {totalUnread()}
                      </span>
                    )}
                  </button>
                </Magnetic>
              )}

              <Magnetic strength={0.2}>
                <Link to={profile ? '/compte' : '/connexion'} className="p-2 text-white/60 hover:text-gold transition-colors">
                  <User className="w-[18px] h-[18px]" />
                </Link>
              </Magnetic>

              <Magnetic strength={0.3}>
                <button onClick={openCart} className="relative p-2 text-white/60 hover:text-gold transition-colors ml-1">
                  <ShoppingBag className="w-[18px] h-[18px]" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.span
                        key={cartCount}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                        className="absolute top-0 right-0 w-4 h-4 bg-gold text-noir-900 text-[9px] font-black rounded-full flex items-center justify-center"
                      >
                        {cartCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </Magnetic>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-white/60 hover:text-gold transition-colors ml-1"
              >
                <AnimatePresence mode="wait">
                  <motion.div key={mobileOpen ? 'x' : 'menu'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 2rem) 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 2rem) 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 2rem) 2.5rem)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-70 bg-noir-900/98 backdrop-blur-xl flex flex-col pt-24 px-6 pb-8 lg:hidden"
          >
            <div className="flex flex-col gap-1 flex-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.href}
                    className="block py-4 font-display text-3xl text-white/80 hover:text-gold transition-colors border-b border-white/[0.06]"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="space-y-3">
              <Link to={profile ? '/compte' : '/connexion'} className="text-white/40 text-sm">
                {profile ? `● ${profile.full_name}` : 'Se connecter'}
              </Link>
              {profile?.role === 'admin' && (
                <Link to="/admin" className="block text-gold text-sm">Panel Admin →</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Search overlay ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-90 bg-noir-900/96 backdrop-blur-xl flex items-start justify-center pt-32 px-4"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl"
            >
              <p className="text-white/20 text-[10px] tracking-[0.5em] uppercase text-center mb-6">Rechercher</p>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Robes, blazers, sacs..."
                  className="w-full bg-white/[0.04] border-b border-white/20 text-white placeholder-white/20 pl-14 pr-12 py-5 text-2xl font-display focus:outline-none focus:border-gold/50 bg-transparent"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </form>
              <div className="mt-6 flex gap-2 flex-wrap justify-center">
                {['Robes soirée','Blazer','Sac velours','Nouveautés'].map((s) => (
                  <button key={s} onClick={() => { setSearchQuery(s); navigate(`/boutique?q=${encodeURIComponent(s)}`); setSearchOpen(false) }}
                    className="text-[10px] tracking-widest uppercase border border-white/10 hover:border-gold/40 text-white/30 hover:text-gold px-3 py-1.5 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
