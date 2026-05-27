import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Eye, ChevronDown, Download } from 'lucide-react'
import { formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import { DEMO_PRODUCTS } from '@/lib/utils'
import type { OrderStatus } from '@/types'

const ORDERS = [
  { id: 'MB-2024-001', customer: 'Sophie Martin',   email: 'sophie@email.fr',  total: 420,  status: 'delivered' as OrderStatus, items: 1, date: '2024-11-15', city: 'Paris' },
  { id: 'MB-2024-002', customer: 'Camille Dubois',  email: 'camille@email.fr', total: 680,  status: 'shipped'   as OrderStatus, items: 2, date: '2024-11-14', city: 'Lyon' },
  { id: 'MB-2024-003', customer: 'Marie Laurent',   email: 'marie@email.fr',   total: 195,  status: 'preparing' as OrderStatus, items: 1, date: '2024-11-13', city: 'Bordeaux' },
  { id: 'MB-2024-004', customer: 'Léa Petit',       email: 'lea@email.fr',     total: 285,  status: 'confirmed' as OrderStatus, items: 1, date: '2024-11-12', city: 'Marseille' },
  { id: 'MB-2024-005', customer: 'Emma Rousseau',   email: 'emma@email.fr',    total: 520,  status: 'pending'   as OrderStatus, items: 1, date: '2024-11-11', city: 'Toulouse' },
  { id: 'MB-2024-006', customer: 'Clara Bernard',   email: 'clara@email.fr',   total: 340,  status: 'delivered' as OrderStatus, items: 2, date: '2024-11-10', city: 'Nantes' },
  { id: 'MB-2024-007', customer: 'Julie Moreau',    email: 'julie@email.fr',   total: 165,  status: 'cancelled' as OrderStatus, items: 1, date: '2024-11-09', city: 'Strasbourg' },
  { id: 'MB-2024-008', customer: 'Alice Leroy',     email: 'alice@email.fr',   total: 870,  status: 'shipped'   as OrderStatus, items: 3, date: '2024-11-08', city: 'Nice' },
]

const ALL_STATUSES = ['all', ...Object.keys(ORDER_STATUS_LABELS)]

export function AdminOrders() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const filtered = ORDERS.filter((o) => {
    const matchSearch = !search || o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search)
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    // In real app, would update Supabase
    console.log('Update', orderId, 'to', newStatus)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-white">Commandes</h1>
        <button className="btn-outline-gold py-2 px-4 text-xs flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par client ou numéro..."
            className="input-gold pl-10 w-full"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {ALL_STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 text-xs whitespace-nowrap border transition-all ${
                statusFilter === s ? 'border-gold bg-gold/10 text-gold' : 'border-white/20 text-white/50 hover:border-white/40'
              }`}
            >
              {s === 'all' ? 'Toutes' : ORDER_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total',      value: ORDERS.length,                    color: 'text-white' },
          { label: 'En cours',   value: ORDERS.filter(o => !['delivered','cancelled'].includes(o.status)).length, color: 'text-blue-400' },
          { label: 'Livrées',    value: ORDERS.filter(o => o.status === 'delivered').length, color: 'text-green-400' },
          { label: 'Annulées',   value: ORDERS.filter(o => o.status === 'cancelled').length, color: 'text-red-400' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className={`font-display text-2xl ${color}`}>{value}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Commande','Client','Date','Articles','Statut','Total','Action'].map((h) => (
                  <th key={h} className="text-left text-white/40 text-xs tracking-widest uppercase px-4 py-3 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="text-white text-sm font-semibold">{order.id}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-white text-sm">{order.customer}</p>
                    <p className="text-white/30 text-xs">{order.city}</p>
                  </td>
                  <td className="px-4 py-3.5 text-white/50 text-sm">{order.date}</td>
                  <td className="px-4 py-3.5 text-white/60 text-sm">{order.items}</td>
                  <td className="px-4 py-3.5">
                    <div className="relative">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`appearance-none text-xs px-3 py-1.5 pr-7 border-0 cursor-pointer focus:outline-none ${ORDER_STATUS_COLORS[order.status]}`}
                      >
                        {Object.entries(ORDER_STATUS_LABELS).map(([k, v]) => (
                          <option key={k} value={k} className="bg-noir-700 text-white">{v}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60" />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gold font-semibold">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="text-white/40 hover:text-gold transition-colors p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
