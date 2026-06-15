import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Euro, ShoppingBag, Users, Package } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const MONTHLY_DATA = [
  { month: 'Jan', revenue: 8200,  orders: 52, customers: 28 },
  { month: 'Fév', revenue: 9100,  orders: 58, customers: 31 },
  { month: 'Mar', revenue: 11500, orders: 74, customers: 42 },
  { month: 'Avr', revenue: 10200, orders: 65, customers: 38 },
  { month: 'Mai', revenue: 12800, orders: 82, customers: 45 },
  { month: 'Jun', revenue: 13500, orders: 87, customers: 48 },
  { month: 'Jul', revenue: 9800,  orders: 63, customers: 35 },
  { month: 'Aoû', revenue: 8900,  orders: 57, customers: 30 },
  { month: 'Sep', revenue: 11200, orders: 72, customers: 40 },
  { month: 'Oct', revenue: 13900, orders: 89, customers: 50 },
  { month: 'Nov', revenue: 12480, orders: 87, customers: 34 },
  { month: 'Déc', revenue: 0,     orders: 0,  customers: 0 },
]

const maxRevenue = Math.max(...MONTHLY_DATA.map((d) => d.revenue))

export function AdminSales() {
  const totalRevenue = MONTHLY_DATA.reduce((s, d) => s + d.revenue, 0)
  const totalOrders  = MONTHLY_DATA.reduce((s, d) => s + d.orders, 0)
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-white">Ventes</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'CA annuel',          value: formatPrice(totalRevenue),         Icon: Euro,       change: +18 },
          { label: 'Commandes totales',  value: totalOrders,                        Icon: ShoppingBag,change: +12 },
          { label: 'Panier moyen',       value: formatPrice(Math.round(avgOrder)),  Icon: Package,    change: +5 },
          { label: 'Clients actifs',     value: '156',                              Icon: Users,      change: +22 },
        ].map(({ label, value, Icon, change }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="stat-card"
          >
            <div className="flex items-center justify-between">
              <Icon className="w-5 h-5 text-gold" />
              <span className={`flex items-center gap-1 text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(change)}%
              </span>
            </div>
            <p className="font-display text-2xl text-gold mt-3">{value}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="glass-card p-6">
        <h2 className="font-display text-xl text-white mb-6">Évolution mensuelle du CA</h2>
        <div className="flex items-end gap-2 h-48">
          {MONTHLY_DATA.map((d, i) => {
            const h = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full">
                  {d.revenue > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-noir-600 text-gold text-[10px] px-2 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {formatPrice(d.revenue)}
                    </div>
                  )}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: i * 0.04, duration: 0.5 }}
                    className={`w-full transition-colors ${d.revenue > 0 ? 'bg-gradient-to-t from-gold/80 to-gold/30 group-hover:from-gold group-hover:to-gold/50 cursor-pointer' : 'bg-white/5'}`}
                    style={{ minHeight: d.revenue > 0 ? '4px' : '0' }}
                  />
                </div>
                <span className="text-white/30 text-[10px]">{d.month}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Monthly breakdown */}
      <div className="glass-card overflow-hidden">
        <div className="p-5 border-b border-white/[0.06]">
          <h2 className="font-display text-xl text-white">Détail par mois</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Mois','CA','Commandes','Clients','Panier moy.','Progression'].map((h) => (
                  <th key={h} className="text-left text-white/40 text-xs tracking-widest uppercase px-4 py-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {MONTHLY_DATA.filter((d) => d.revenue > 0).map((d, i, arr) => {
                const prev = arr[i - 1]
                const change = prev ? ((d.revenue - prev.revenue) / prev.revenue) * 100 : 0
                return (
                  <tr key={d.month} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-white font-semibold">{d.month}</td>
                    <td className="px-4 py-3 text-gold font-bold">{formatPrice(d.revenue)}</td>
                    <td className="px-4 py-3 text-white/60">{d.orders}</td>
                    <td className="px-4 py-3 text-white/60">{d.customers}</td>
                    <td className="px-4 py-3 text-white/60">{formatPrice(Math.round(d.revenue / d.orders))}</td>
                    <td className="px-4 py-3">
                      {i > 0 && (
                        <span className={`flex items-center gap-1 text-xs ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(change).toFixed(1)}%
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
