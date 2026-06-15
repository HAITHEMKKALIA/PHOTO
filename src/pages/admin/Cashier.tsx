import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, CreditCard, Banknote, Building2, Receipt } from 'lucide-react'
import { DEMO_PRODUCTS, formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface CashierItem {
  product: any
  qty: number
}

const RECENT_TRANSACTIONS = [
  { id: 't1', type: 'sale', amount: 420, desc: 'Robe Étoile Noire',   method: 'card',  date: '27/11/2024 14:32' },
  { id: 't2', type: 'sale', amount: 195, desc: 'Sac Velours Minuit',  method: 'cash',  date: '27/11/2024 11:15' },
  { id: 't3', type: 'sale', amount: 680, desc: 'Perfecto Cuir Doré',  method: 'card',  date: '26/11/2024 16:48' },
  { id: 't4', type: 'refund', amount: -165, desc: 'Top Dentelle — Retour', method: 'card', date: '26/11/2024 10:20' },
]

export function AdminCashier() {
  const [cart, setCart] = useState<CashierItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [payMethod, setPayMethod] = useState<'cash' | 'card' | 'transfer'>('card')
  const [transactions, setTransactions] = useState(RECENT_TRANSACTIONS)

  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  const addProduct = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id)
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { product, qty: 1 }]
    })
  }

  const removeItem = (productId: string) => setCart((prev) => prev.filter((i) => i.product.id !== productId))

  const handleSale = () => {
    if (cart.length === 0) { toast.error('Panier vide'); return }
    const t = {
      id: crypto.randomUUID(),
      type: 'sale',
      amount: total,
      desc: cart.map((i) => i.product.name).join(', '),
      method: payMethod,
      date: new Date().toLocaleString('fr-FR'),
    }
    setTransactions((prev) => [t, ...prev])
    setCart([])
    setDiscount(0)
    toast.success(`Vente enregistrée : ${formatPrice(total)}`)
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-white">Caisse</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Products */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display text-xl text-white">Sélectionner des produits</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DEMO_PRODUCTS.slice(0, 6).map((p) => (
              <button
                key={p.id}
                onClick={() => addProduct(p)}
                className="glass-card p-3 text-left hover:border-gold/40 transition-all group"
              >
                <img src={p.images[0]} alt="" className="w-full aspect-[4/3] object-cover mb-2 group-hover:scale-105 transition-transform" />
                <p className="text-white text-xs truncate">{p.name}</p>
                <p className="text-gold text-sm font-bold mt-0.5">{formatPrice(p.price)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="space-y-4">
          <div className="glass-card p-5">
            <h3 className="font-display text-xl text-white mb-4">Panier caisse</h3>

            {cart.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-8">Aucun article</p>
            ) : (
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img src={item.product.images[0]} alt="" className="w-10 h-12 object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs truncate">{item.product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button onClick={() => setCart(p => p.map(i => i.product.id === item.product.id ? {...i, qty: Math.max(1, i.qty-1)} : i))} className="text-white/40 hover:text-white text-xs w-5 h-5 border border-white/20 flex items-center justify-center">-</button>
                        <span className="text-white text-xs w-4 text-center">{item.qty}</span>
                        <button onClick={() => setCart(p => p.map(i => i.product.id === item.product.id ? {...i, qty: i.qty+1} : i))} className="text-white/40 hover:text-white text-xs w-5 h-5 border border-white/20 flex items-center justify-center">+</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gold text-sm font-bold">{formatPrice(item.product.price * item.qty)}</p>
                      <button onClick={() => removeItem(item.product.id)} className="text-red-400/50 hover:text-red-400 mt-1">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Discount */}
            <div className="flex items-center gap-2 mb-4">
              <label className="text-white/40 text-xs whitespace-nowrap">Remise %</label>
              <input
                type="number" min={0} max={100} value={discount}
                onChange={(e) => setDiscount(Math.min(100, Math.max(0, +e.target.value)))}
                className="input-gold flex-1 py-1.5 text-sm"
              />
            </div>

            {/* Totals */}
            <div className="border-t border-white/[0.06] pt-3 space-y-1.5 mb-4">
              <div className="flex justify-between text-white/40 text-sm">
                <span>Sous-total</span><span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-400 text-sm">
                  <span>Remise ({discount}%)</span><span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-bold pt-1 border-t border-white/[0.06]">
                <span>Total</span><span className="text-gold text-lg font-display">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment method */}
            <div className="flex gap-2 mb-4">
              {([
                { value: 'card',     Icon: CreditCard, label: 'Carte' },
                { value: 'cash',     Icon: Banknote,   label: 'Espèces' },
                { value: 'transfer', Icon: Building2,  label: 'Virement' },
              ] as const).map(({ value, Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setPayMethod(value)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2 border text-xs transition-all ${payMethod === value ? 'border-gold bg-gold/10 text-gold' : 'border-white/20 text-white/40 hover:border-white/40'}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <button onClick={handleSale} disabled={cart.length === 0} className="btn-gold w-full">
              <Receipt className="w-4 h-4" />
              Encaisser {cart.length > 0 && formatPrice(total)}
            </button>
          </div>

          {/* Recent transactions */}
          <div className="glass-card overflow-hidden">
            <div className="p-4 border-b border-white/[0.06]">
              <h3 className="font-display text-lg text-white">Transactions récentes</h3>
            </div>
            <div className="divide-y divide-white/[0.04] max-h-64 overflow-y-auto no-scrollbar">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-white text-xs truncate max-w-[150px]">{t.desc}</p>
                    <p className="text-white/30 text-[10px] mt-0.5">{t.date}</p>
                  </div>
                  <span className={`text-sm font-bold ${t.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {t.amount > 0 ? '+' : ''}{formatPrice(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
