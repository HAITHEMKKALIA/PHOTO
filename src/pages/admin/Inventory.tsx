import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Package, TrendingDown, Search } from 'lucide-react'
import { DEMO_PRODUCTS, formatPrice } from '@/lib/utils'

export function AdminInventory() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'low' | 'out'>('all')
  const [products, setProducts] = useState(
    DEMO_PRODUCTS.map((p) => ({ ...p, threshold: 5 })) as any[]
  )

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter =
      filter === 'all' ? true :
      filter === 'low' ? p.stock <= p.threshold && p.stock > 0 :
      p.stock === 0
    return matchSearch && matchFilter
  })

  const outOfStock  = products.filter((p) => p.stock === 0).length
  const lowStock    = products.filter((p) => p.stock > 0 && p.stock <= 5).length
  const totalValue  = products.reduce((s, p) => s + p.stock * p.price, 0)

  const updateStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-white">Stock</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total produits',    value: products.length,           color: 'text-white',      Icon: Package },
          { label: 'En rupture',        value: outOfStock,                color: 'text-red-400',    Icon: AlertTriangle },
          { label: 'Stock bas (≤5)',    value: lowStock,                  color: 'text-yellow-400', Icon: TrendingDown },
          { label: 'Valeur du stock',   value: formatPrice(totalValue),   color: 'text-gold',       Icon: Package },
        ].map(({ label, value, color, Icon }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="stat-card">
            <Icon className={`w-5 h-5 ${color}`} />
            <p className={`font-display text-2xl mt-3 ${color}`}>{value}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="input-gold pl-10 w-full" />
        </div>
        <div className="flex gap-2">
          {(['all','low','out'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-xs border transition-all ${filter === f ? 'border-gold bg-gold/10 text-gold' : 'border-white/20 text-white/50 hover:border-white/40'}`}
            >
              {f === 'all' ? 'Tous' : f === 'low' ? 'Stock bas' : 'Rupture'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Produit','Prix','Stock actuel','Valeur stock','Statut','Action'].map((h) => (
                  <th key={h} className="text-left text-white/40 text-xs tracking-widest uppercase px-4 py-3 font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((p) => {
                const status = p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : 'ok'
                return (
                  <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt="" className="w-10 h-12 object-cover flex-shrink-0" />
                        <p className="text-white text-sm">{p.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-gold text-sm">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateStock(p.id, -1)} className="w-6 h-6 border border-white/20 hover:border-red-400 text-white/50 hover:text-red-400 text-xs flex items-center justify-center transition-all">-</button>
                        <span className={`text-sm font-bold w-8 text-center ${p.stock === 0 ? 'text-red-400' : p.stock <= 5 ? 'text-yellow-400' : 'text-white'}`}>{p.stock}</span>
                        <button onClick={() => updateStock(p.id, 1)} className="w-6 h-6 border border-white/20 hover:border-green-400 text-white/50 hover:text-green-400 text-xs flex items-center justify-center transition-all">+</button>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-white/50 text-sm">{formatPrice(p.stock * p.price)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs px-2.5 py-1 font-semibold uppercase tracking-wider ${
                        status === 'out' ? 'bg-red-400/10 text-red-400' :
                        status === 'low' ? 'bg-yellow-400/10 text-yellow-400' :
                        'bg-green-400/10 text-green-400'
                      }`}>
                        {status === 'out' ? 'Rupture' : status === 'low' ? 'Bas' : 'OK'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => updateStock(p.id, 10)}
                        className="text-xs text-white/40 hover:text-gold transition-colors border border-white/10 hover:border-gold/40 px-3 py-1"
                      >
                        +10
                      </button>
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
