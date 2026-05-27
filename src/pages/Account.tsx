import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Package, Bell, MessageCircle, LogOut, Settings, ChevronRight, ShoppingBag, MapPin, CreditCard } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { DEMO_PRODUCTS, formatPrice, formatDate, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

// Demo orders
const DEMO_ORDERS: Order[] = [
  {
    id: 'order-1',
    order_number: 'MB-2024-001',
    user_id: 'user-1',
    status: 'delivered',
    items: [
      {
        id: 'i1', order_id: 'order-1',
        product_id: '1', product_name: 'Robe Étoile Noire',
        product_image: DEMO_PRODUCTS[0].images[0],
        size: 'M', color: 'Noir', quantity: 1,
        unit_price: 420, total_price: 420,
      },
    ],
    subtotal: 420, shipping_cost: 0, discount: 0, total: 420,
    shipping_address: { full_name: 'Sophie Martin', phone: '0612345678', address: '12 rue de la Paix', city: 'Paris', postal_code: '75001', country: 'France' },
    created_at: '2024-10-15T10:30:00Z',
    updated_at: '2024-10-20T14:00:00Z',
    tracking_number: 'FR123456789',
  },
  {
    id: 'order-2',
    order_number: 'MB-2024-002',
    user_id: 'user-1',
    status: 'shipped',
    items: [
      {
        id: 'i2', order_id: 'order-2',
        product_id: '2', product_name: 'Blazer Or & Nuit',
        product_image: DEMO_PRODUCTS[1].images[0],
        size: 'S', color: 'Noir', quantity: 1,
        unit_price: 285, total_price: 285,
      },
      {
        id: 'i3', order_id: 'order-2',
        product_id: '3', product_name: 'Sac Velours Minuit',
        product_image: DEMO_PRODUCTS[2].images[0],
        size: 'Unique', color: 'Noir', quantity: 1,
        unit_price: 195, total_price: 195,
      },
    ],
    subtotal: 480, shipping_cost: 0, discount: 0, total: 480,
    shipping_address: { full_name: 'Sophie Martin', phone: '0612345678', address: '12 rue de la Paix', city: 'Paris', postal_code: '75001', country: 'France' },
    created_at: '2024-11-02T09:00:00Z',
    updated_at: '2024-11-04T11:00:00Z',
    tracking_number: 'FR987654321',
    estimated_delivery: '2024-11-07',
  },
]

const ORDER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending',          label: 'Commande reçue' },
  { key: 'confirmed',        label: 'Confirmée' },
  { key: 'preparing',        label: 'En préparation' },
  { key: 'shipped',          label: 'Expédiée' },
  { key: 'out_for_delivery', label: 'En livraison' },
  { key: 'delivered',        label: 'Livrée' },
]

function OrderTrackingTimeline({ order }: { order: Order }) {
  const steps = ORDER_STEPS
  const currentIdx = steps.findIndex((s) => s.key === order.status)

  return (
    <div className="relative">
      <div className="flex items-start justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/10" />
        <div
          className="absolute top-5 left-5 h-0.5 bg-gold transition-all duration-1000"
          style={{ width: `${(currentIdx / (steps.length - 1)) * (100 - (10 / steps.length * 2))}%` }}
        />

        {steps.map((step, i) => {
          const done = i <= currentIdx
          const active = i === currentIdx
          return (
            <div key={step.key} className="order-step flex-1">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={`order-step-dot ${
                  done
                    ? active
                      ? 'border-gold bg-gold shadow-gold'
                      : 'border-gold/60 bg-gold/20'
                    : 'border-white/20 bg-transparent'
                }`}
              >
                {done && !active && <span className="text-gold text-xs">✓</span>}
                {active && <span className="w-3 h-3 rounded-full bg-gold animate-pulse" />}
              </motion.div>
              <p className={`text-[10px] text-center mt-2 leading-tight ${done ? 'text-white/70' : 'text-white/20'}`}>
                {step.label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function Account() {
  const navigate = useNavigate()
  const { profile, logout } = useAuthStore()
  const { notifications, markRead, markAllRead } = useNotificationStore()
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'notifications'>('orders')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  if (!profile) {
    navigate('/connexion')
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const tabs = [
    { key: 'orders' as const,        label: 'Mes commandes', Icon: Package },
    { key: 'profile' as const,       label: 'Mon profil',    Icon: User },
    { key: 'notifications' as const, label: 'Notifications', Icon: Bell },
  ]

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gold/10 border border-gold/30 flex items-center justify-center overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="font-display text-2xl text-gold">
                  {profile.full_name[0]}
                </span>
              )}
            </div>
            <div>
              <p className="section-subtitle text-gold mb-1">Mon espace</p>
              <h1 className="font-display text-3xl text-white">{profile.full_name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {profile.role === 'admin' && (
              <Link to="/admin" className="btn-outline-gold py-2 px-4 text-xs">
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
            <button onClick={handleLogout} className="btn-ghost text-red-400 hover:text-red-300">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="glass-card divide-y divide-white/[0.06]">
              {tabs.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-sm transition-all ${
                    activeTab === key
                      ? 'text-gold bg-gold/5'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </button>
              ))}
              <Link
                to="/boutique"
                className="w-full flex items-center gap-3 px-5 py-4 text-white/60 hover:text-gold transition-colors text-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                Boutique
              </Link>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl text-white mb-6">Mes commandes</h2>
                {DEMO_ORDERS.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card overflow-hidden"
                  >
                    {/* Order header */}
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-4 hover:bg-white/[0.02] transition-colors text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-14 overflow-hidden bg-noir-600 flex-shrink-0">
                          <img src={order.items[0].product_image} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{order.order_number}</p>
                          <p className="text-white/40 text-xs mt-0.5">{formatDate(order.created_at)}</p>
                          <p className="text-white/30 text-xs mt-0.5">
                            {order.items.length} article{order.items.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:gap-8">
                        <span className={`text-xs px-3 py-1.5 font-semibold tracking-wider uppercase rounded-none ${ORDER_STATUS_COLORS[order.status]}`}>
                          {ORDER_STATUS_LABELS[order.status]}
                        </span>
                        <span className="text-gold font-display text-lg">{formatPrice(order.total)}</span>
                        <ChevronRight className={`w-4 h-4 text-white/30 transition-transform ${expandedOrder === order.id ? 'rotate-90' : ''}`} />
                      </div>
                    </button>

                    {/* Expanded order */}
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/[0.06]"
                      >
                        {/* Timeline */}
                        <div className="p-6 border-b border-white/[0.06]">
                          <p className="text-white/40 text-xs tracking-widest uppercase mb-6">Suivi de commande</p>
                          <OrderTrackingTimeline order={order} />
                        </div>

                        {/* Items */}
                        <div className="p-6 border-b border-white/[0.06]">
                          <p className="text-white/40 text-xs tracking-widest uppercase mb-4">Articles</p>
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 py-3 border-b border-white/[0.04] last:border-0">
                              <img src={item.product_image} alt="" className="w-14 h-16 object-cover" />
                              <div className="flex-1">
                                <p className="text-white text-sm font-semibold">{item.product_name}</p>
                                <p className="text-white/40 text-xs mt-1">{item.size} · {item.color} · ×{item.quantity}</p>
                              </div>
                              <span className="text-gold font-semibold">{formatPrice(item.total_price)}</span>
                            </div>
                          ))}
                        </div>

                        {/* Delivery */}
                        <div className="p-6 grid sm:grid-cols-2 gap-6">
                          <div>
                            <p className="text-white/40 text-xs tracking-widest uppercase mb-2 flex items-center gap-2">
                              <MapPin className="w-3 h-3" /> Adresse de livraison
                            </p>
                            <p className="text-white/70 text-sm">
                              {order.shipping_address.full_name}<br />
                              {order.shipping_address.address}<br />
                              {order.shipping_address.postal_code} {order.shipping_address.city}<br />
                              {order.shipping_address.country}
                            </p>
                          </div>
                          {order.tracking_number && (
                            <div>
                              <p className="text-white/40 text-xs tracking-widest uppercase mb-2">N° de suivi</p>
                              <p className="text-gold font-mono text-sm">{order.tracking_number}</p>
                              {order.estimated_delivery && (
                                <p className="text-white/40 text-xs mt-1">
                                  Livraison estimée : {formatDate(order.estimated_delivery)}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Profile */}
            {activeTab === 'profile' && (
              <div className="glass-card p-8">
                <h2 className="font-display text-2xl text-white mb-8">Mes informations</h2>
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-white/60 text-xs tracking-widest uppercase">Prénom & Nom</label>
                      <input type="text" defaultValue={profile.full_name} className="input-gold" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-white/60 text-xs tracking-widest uppercase">Email</label>
                      <input type="email" defaultValue={profile.email} className="input-gold" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-white/60 text-xs tracking-widest uppercase">Téléphone</label>
                      <input type="tel" defaultValue={profile.phone || ''} className="input-gold" placeholder="+33 6 XX XX XX XX" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-white/60 text-xs tracking-widest uppercase">Adresse de livraison</label>
                    <input type="text" className="input-gold" placeholder="12 rue de la Paix" />
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <input type="text" className="input-gold" placeholder="Code postal" />
                      <input type="text" className="input-gold" placeholder="Ville" />
                    </div>
                  </div>
                  <button type="submit" className="btn-gold">Sauvegarder</button>
                </form>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-white">Notifications</h2>
                  <button onClick={markAllRead} className="text-white/40 hover:text-gold text-xs transition-colors">
                    Tout marquer comme lu
                  </button>
                </div>
                {notifications.length === 0 ? (
                  <div className="glass-card p-12 text-center">
                    <Bell className="w-10 h-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">Aucune notification</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {notifications.map((notif) => (
                      <motion.button
                        key={notif.id}
                        onClick={() => markRead(notif.id)}
                        className={`w-full glass-card p-4 text-left transition-all hover:border-gold/30 ${
                          !notif.read ? 'border-gold/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-gold mt-1.5 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="text-white text-sm font-semibold">{notif.title}</p>
                            <p className="text-white/40 text-xs mt-0.5">{notif.message}</p>
                            <p className="text-white/20 text-xs mt-1">{formatDate(notif.created_at)}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
