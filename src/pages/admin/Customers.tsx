import { useState } from 'react'
import { Search, Mail, Phone, ShoppingBag } from 'lucide-react'
import { formatDate, formatPrice } from '@/lib/utils'

const CUSTOMERS = [
  { id: '1', name: 'Sophie Martin',   email: 'sophie@email.fr',   phone: '+33 6 12 34 56 78', city: 'Paris',      orders: 5, spent: 1840, lastOrder: '2024-11-15', since: '2023-03-01' },
  { id: '2', name: 'Camille Dubois',  email: 'camille@email.fr',  phone: '+33 6 23 45 67 89', city: 'Lyon',       orders: 3, spent: 920,  lastOrder: '2024-11-14', since: '2023-06-15' },
  { id: '3', name: 'Marie Laurent',   email: 'marie@email.fr',    phone: '+33 6 34 56 78 90', city: 'Bordeaux',   orders: 7, spent: 3250, lastOrder: '2024-11-13', since: '2023-01-20' },
  { id: '4', name: 'Léa Petit',       email: 'lea@email.fr',      phone: '+33 6 45 67 89 01', city: 'Marseille',  orders: 2, spent: 480,  lastOrder: '2024-11-12', since: '2024-02-08' },
  { id: '5', name: 'Emma Rousseau',   email: 'emma@email.fr',     phone: '+33 6 56 78 90 12', city: 'Toulouse',   orders: 4, spent: 1560, lastOrder: '2024-11-11', since: '2023-09-12' },
  { id: '6', name: 'Clara Bernard',   email: 'clara@email.fr',    phone: '+33 6 67 89 01 23', city: 'Nantes',     orders: 6, spent: 2100, lastOrder: '2024-11-10', since: '2023-04-05' },
  { id: '7', name: 'Julie Moreau',    email: 'julie@email.fr',    phone: '+33 6 78 90 12 34', city: 'Strasbourg', orders: 1, spent: 165,  lastOrder: '2024-11-09', since: '2024-09-20' },
  { id: '8', name: 'Alice Leroy',     email: 'alice@email.fr',    phone: '+33 6 89 01 23 45', city: 'Nice',       orders: 9, spent: 4280, lastOrder: '2024-11-08', since: '2022-11-30' },
]

export function AdminCustomers() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = CUSTOMERS.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.includes(search)
  )

  const selectedCustomer = CUSTOMERS.find((c) => c.id === selected)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-white">Clients ({CUSTOMERS.length})</h1>
        <div className="text-white/40 text-sm">CA total : {formatPrice(CUSTOMERS.reduce((s, c) => s + c.spent, 0))}</div>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total clients',   value: CUSTOMERS.length },
          { label: 'Clients actifs',  value: CUSTOMERS.filter(c => c.orders > 0).length },
          { label: 'CA moyen',        value: formatPrice(Math.round(CUSTOMERS.reduce((s,c)=>s+c.spent,0)/CUSTOMERS.length)) },
          { label: 'Commandes/client',value: (CUSTOMERS.reduce((s,c)=>s+c.orders,0)/CUSTOMERS.length).toFixed(1) },
        ].map(({ label, value }) => (
          <div key={label} className="glass-card p-4 text-center">
            <p className="font-display text-xl text-gold">{value}</p>
            <p className="text-white/40 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* List */}
        <div className="flex-1">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un client..." className="input-gold pl-10 w-full" />
          </div>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {['Client','Ville','Commandes','Dépenses','Depuis'].map((h) => (
                      <th key={h} className="text-left text-white/40 text-xs tracking-widest uppercase px-4 py-3 font-normal">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {filtered.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelected(c.id === selected ? null : c.id)}
                      className={`cursor-pointer transition-colors ${selected === c.id ? 'bg-gold/5' : 'hover:bg-white/[0.02]'}`}
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 text-gold text-xs font-bold">
                            {c.name[0]}
                          </div>
                          <div>
                            <p className="text-white text-sm">{c.name}</p>
                            <p className="text-white/30 text-xs">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-white/50 text-sm">{c.city}</td>
                      <td className="px-4 py-3.5 text-white/60 text-sm">{c.orders}</td>
                      <td className="px-4 py-3.5 text-gold font-semibold text-sm">{formatPrice(c.spent)}</td>
                      <td className="px-4 py-3.5 text-white/30 text-xs">{formatDate(c.since)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail */}
        {selectedCustomer && (
          <div className="lg:w-72 flex-shrink-0">
            <div className="glass-card p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-3 text-gold font-display text-2xl">
                  {selectedCustomer.name[0]}
                </div>
                <h3 className="font-display text-xl text-white">{selectedCustomer.name}</h3>
                <p className="text-white/40 text-xs mt-1">Client depuis {formatDate(selectedCustomer.since)}</p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gold/60" />
                  <span className="text-white/60 text-xs">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gold/60" />
                  <span className="text-white/60 text-xs">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ShoppingBag className="w-4 h-4 text-gold/60" />
                  <span className="text-white/60 text-xs">{selectedCustomer.orders} commandes</span>
                </div>
              </div>
              <div className="border-t border-white/[0.06] pt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center glass-card p-3">
                    <p className="text-gold font-display text-lg">{selectedCustomer.orders}</p>
                    <p className="text-white/30 text-xs">Commandes</p>
                  </div>
                  <div className="text-center glass-card p-3">
                    <p className="text-gold font-display text-lg">{formatPrice(selectedCustomer.spent)}</p>
                    <p className="text-white/30 text-xs">Dépensé</p>
                  </div>
                </div>
              </div>
              <button className="btn-outline-gold w-full mt-4 py-2 text-xs">Envoyer un email</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
