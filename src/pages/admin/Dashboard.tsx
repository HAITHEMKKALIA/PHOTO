import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ShoppingBag, Users, Package, Euro, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPrice, DEMO_PRODUCTS } from '@/lib/utils'

const STATS = [
  { label: 'CA du mois',        value: '12 480€', change: +18.4, Icon: Euro,       color: 'text-gold' },
  { label: 'Commandes',         value: '87',       change: +12.1, Icon: ShoppingBag,color: 'text-blue-400' },
  { label: 'Nouveaux clients',  value: '34',       change: +5.3,  Icon: Users,      color: 'text-purple-400' },
  { label: 'Produits vendus',   value: '213',      change: +22.7, Icon: Package,    color: 'text-green-400' },
]

const RECENT_ORDERS = [
  { id: 'MB-001', customer: 'Sophie M.',  amount: 420, status: 'delivered', date: '27/11/2024' },
  { id: 'MB-002', customer: 'Camille D.', amount: 680, status: 'shipped',   date: '27/11/2024' },
  { id: 'MB-003', customer: 'Marie L.',   amount: 195, status: 'preparing', date: '26/11/2024' },
  { id: 'MB-004', customer: 'Léa P.',     amount: 285, status: 'confirmed', date: '26/11/2024' },
  { id: 'MB-005', customer: 'Emma R.',    amount: 520, status: 'pending',   date: '25/11/2024' },
]

const STATUS_COLORS: Record<string, string> = {
  pending:   'text-yellow-400 bg-yellow-400/10',
  confirmed: 'text-blue-400 bg-blue-400/10',
  preparing: 'text-orange-400 bg-orange-400/10',
  shipped:   'text-purple-400 bg-purple-400/10',
  delivered: 'text-green-400 bg-green-400/10',
}

const STATUS_LABELS: Record<string, string> = {
  pending:   'En attente',
  confirmed: 'Confirmée',
  preparing: 'Préparation',
  shipped:   'Expédiée',
  delivered: 'Livrée',
}

const TOP_PRODUCTS = DEMO_PRODUCTS.slice(0, 5).map((p, i) => ({
  ...p,
  sold: [42, 38, 31, 27, 22][i],
  revenue: [17640, 10830, 6045, 7695, 14960][i],
}))

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Bienvenue — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <Icon className={`w-5 h-5 ${color}`} />
              <span className={`flex items-center gap-1 text-xs font-semibold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(change)}%
              </span>
            </div>
            <div className="mt-3">
              <p className={`font-display text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-white/40 text-xs mt-1">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart (simplified) */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-white">Chiffre d'affaires</h2>
            <div className="flex gap-2">
              {['7J','30J','90J'].map((p) => (
                <button key={p} className={`text-xs px-3 py-1 ${p === '30J' ? 'bg-gold/10 text-gold border border-gold/30' : 'text-white/30 hover:text-white'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          {/* Simplified bar chart */}
          <div className="flex items-end gap-2 h-40">
            {[65, 85, 70, 90, 75, 95, 80, 88, 72, 92, 68, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-gold/60 to-gold/20 hover:from-gold hover:to-gold/40 transition-colors cursor-pointer"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-white/20 text-[10px]">
            {['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Top categories */}
        <div className="glass-card p-6">
          <h2 className="font-display text-xl text-white mb-6">Par catégorie</h2>
          <div className="space-y-4">
            {[
              { name: 'Robes',    pct: 42, color: 'bg-gold' },
              { name: 'Blazers',  pct: 28, color: 'bg-purple-500' },
              { name: 'Sacs',     pct: 18, color: 'bg-blue-500' },
              { name: 'Autres',   pct: 12, color: 'bg-green-500' },
            ].map(({ name, pct, color }) => (
              <div key={name}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60">{name}</span>
                  <span className="text-white/80">{pct}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-none overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-full ${color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
            <h2 className="font-display text-xl text-white">Dernières commandes</h2>
            <Link to="/admin/commandes" className="text-gold text-xs hover:text-gold-light flex items-center gap-1">
              Tout voir <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {RECENT_ORDERS.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div>
                  <p className="text-white text-sm font-semibold">{order.id}</p>
                  <p className="text-white/40 text-xs">{order.customer} · {order.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-2.5 py-1 font-semibold uppercase tracking-wider ${STATUS_COLORS[order.status]}`}>
                    {STATUS_LABELS[order.status]}
                  </span>
                  <span className="text-gold font-semibold text-sm">{formatPrice(order.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="glass-card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
            <h2 className="font-display text-xl text-white">Top Produits</h2>
            <Link to="/admin/produits" className="text-gold text-xs hover:text-gold-light flex items-center gap-1">
              Gérer <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <span className="text-white/20 font-display text-lg w-5 text-center">{i + 1}</span>
                <img src={p.images[0]} alt="" className="w-10 h-12 object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{p.name}</p>
                  <p className="text-white/30 text-xs">{p.sold} vendus</p>
                </div>
                <span className="text-gold text-sm font-semibold">{formatPrice(p.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
