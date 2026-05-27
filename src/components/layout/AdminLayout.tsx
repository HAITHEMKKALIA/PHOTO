import { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, ShoppingBag, Package, Users, BarChart3,
  Archive, CreditCard, FileText, MessageCircle, Settings,
  LogOut, Menu, X, Bell, ChevronRight, Store
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useChatStore } from '@/stores/chatStore'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin',           label: 'Dashboard',  Icon: LayoutDashboard, exact: true },
  { href: '/admin/commandes', label: 'Commandes',  Icon: ShoppingBag },
  { href: '/admin/ventes',    label: 'Ventes',     Icon: BarChart3 },
  { href: '/admin/produits',  label: 'Produits',   Icon: Package },
  { href: '/admin/clients',   label: 'Clients',    Icon: Users },
  { href: '/admin/stock',     label: 'Stock',      Icon: Archive },
  { href: '/admin/caisse',    label: 'Caisse',     Icon: CreditCard },
  { href: '/admin/cms',       label: 'CMS',        Icon: FileText },
  { href: '/admin/chat',      label: 'Chat',       Icon: MessageCircle },
  { href: '/admin/settings',  label: 'Paramètres', Icon: Settings },
]

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, logout } = useAuthStore()
  const { totalUnread } = useChatStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!profile || profile.role !== 'admin') {
    navigate('/connexion')
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
        <Link to="/" className="flex flex-col">
          <span className="font-display text-lg gold-text">MILLA</span>
          <span className="text-white/20 text-[8px] tracking-[0.4em] uppercase">ADMIN</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-white/40 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map(({ href, label, Icon, exact }) => {
          const active = exact ? location.pathname === href : location.pathname.startsWith(href) && href !== '/admin'
          const isExactAdmin = href === '/admin' && location.pathname === '/admin'
          return (
            <Link
              key={href}
              to={href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                'admin-sidebar-link',
                (active || isExactAdmin) && 'active'
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="flex-1">{label}</span>
              {label === 'Chat' && totalUnread() > 0 && (
                <span className="bg-gold text-noir-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalUnread()}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.06]">
        <Link
          to="/"
          className="flex items-center gap-2 text-white/40 hover:text-white text-xs mb-3 transition-colors"
        >
          <Store className="w-4 h-4" />
          Voir le site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400/60 hover:text-red-400 text-xs transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-noir-900 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0 bg-noir-800 border-r border-white/[0.06]">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-80 bg-black/70 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed left-0 top-0 bottom-0 z-90 w-56 bg-noir-800 border-r border-white/[0.06] lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-noir-800/80 border-b border-white/[0.06] backdrop-blur-sm flex items-center justify-between px-4 sm:px-6 h-14 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white/60 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-white/30 text-xs">
              <span>Admin</span>
              {location.pathname !== '/admin' && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-white/60 capitalize">
                    {location.pathname.split('/').pop()}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-white/40 hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gold/20 border border-gold/30 flex items-center justify-center">
                <span className="font-display text-gold text-sm">
                  {profile.full_name[0]}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-white text-xs font-semibold">{profile.full_name}</p>
                <p className="text-white/30 text-[10px]">Administrateur</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
