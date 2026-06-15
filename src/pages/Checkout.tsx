import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, CreditCard, Truck, ShieldCheck } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

type Step = 'address' | 'shipping' | 'payment' | 'confirmation'

const STEPS: { key: Step; label: string }[] = [
  { key: 'address',      label: 'Adresse' },
  { key: 'shipping',     label: 'Livraison' },
  { key: 'payment',      label: 'Paiement' },
  { key: 'confirmation', label: 'Confirmation' },
]

export function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCartStore()
  const { profile } = useAuthStore()
  const addNotification = useNotificationStore((s) => s.addNotification)
  const [step, setStep] = useState<Step>('address')
  const [address, setAddress] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: '',
    city: '',
    postal_code: '',
    country: 'France',
  })
  const [shipping, setShipping] = useState('standard')
  const [payment, setPayment] = useState({ card: '', name: '', expiry: '', cvv: '' })
  const [loading, setLoading] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const currentStepIdx = STEPS.findIndex((s) => s.key === step)
  const shippingCost = shipping === 'express' ? 9.90 : total() >= 150 ? 0 : 5.90
  const grandTotal = total() + shippingCost

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-3xl text-white mb-4">Votre panier est vide</p>
          <Link to="/boutique" className="btn-gold inline-flex">Découvrir nos collections</Link>
        </div>
      </div>
    )
  }

  const handlePlaceOrder = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    const num = `MB-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`
    setOrderNumber(num)
    clearCart()
    if (profile) {
      addNotification({
        user_id: profile.id,
        title: `Commande ${num} confirmée !`,
        message: `Votre commande de ${formatPrice(grandTotal)} a été enregistrée.`,
        type: 'order',
      })
    }
    setStep('confirmation')
    setLoading(false)
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress */}
        <div className="flex items-center justify-center gap-0 mb-16">
          {STEPS.map((s, i) => (
            <div key={s.key} className="flex items-center">
              <div className={`flex flex-col items-center gap-2 ${step === s.key ? '' : ''}`}>
                <div className={`w-9 h-9 flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i < currentStepIdx
                    ? 'border-gold bg-gold text-noir-900'
                    : step === s.key
                    ? 'border-gold text-gold'
                    : 'border-white/20 text-white/30'
                }`}>
                  {i < currentStepIdx ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs tracking-wider uppercase ${step === s.key ? 'text-gold' : 'text-white/30'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-16 sm:w-24 h-px mx-2 mb-5 ${i < currentStepIdx ? 'bg-gold' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Address */}
              {step === 'address' && (
                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="glass-card p-8">
                    <h2 className="font-display text-2xl text-white mb-6">Adresse de livraison</h2>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep('shipping') }}>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Nom complet</label>
                          <input className="input-gold" value={address.full_name} onChange={(e) => setAddress({ ...address, full_name: e.target.value })} required />
                        </div>
                        <div>
                          <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Téléphone</label>
                          <input className="input-gold" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
                        </div>
                      </div>
                      <div>
                        <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Adresse</label>
                        <input className="input-gold" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Code postal</label>
                          <input className="input-gold" value={address.postal_code} onChange={(e) => setAddress({ ...address, postal_code: e.target.value })} required />
                        </div>
                        <div>
                          <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Ville</label>
                          <input className="input-gold" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
                        </div>
                      </div>
                      <button type="submit" className="btn-gold w-full group">
                        Continuer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* Shipping */}
              {step === 'shipping' && (
                <motion.div key="shipping" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="glass-card p-8">
                    <h2 className="font-display text-2xl text-white mb-6">Mode de livraison</h2>
                    <div className="space-y-3 mb-6">
                      {[
                        { value: 'standard', label: 'Livraison standard', desc: '3-5 jours ouvrés', price: total() >= 150 ? 'Gratuite' : '5,90€' },
                        { value: 'express',  label: 'Livraison express',  desc: '24-48 heures',    price: '9,90€' },
                        { value: 'relay',    label: 'Point relais',       desc: '4-6 jours ouvrés',price: total() >= 150 ? 'Gratuite' : '3,90€' },
                      ].map((opt) => (
                        <label key={opt.value} className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${shipping === opt.value ? 'border-gold bg-gold/5' : 'border-white/10 hover:border-white/30'}`}>
                          <input type="radio" value={opt.value} checked={shipping === opt.value} onChange={(e) => setShipping(e.target.value)} className="accent-gold" />
                          <Truck className="w-5 h-5 text-gold/60" />
                          <div className="flex-1">
                            <p className="text-white text-sm font-semibold">{opt.label}</p>
                            <p className="text-white/40 text-xs">{opt.desc}</p>
                          </div>
                          <span className={`text-sm font-semibold ${opt.price.includes('ratuite') ? 'text-green-400' : 'text-gold'}`}>{opt.price}</span>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setStep('address')} className="btn-ghost border border-white/20 px-6">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => setStep('payment')} className="btn-gold flex-1 group">
                        Continuer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment */}
              {step === 'payment' && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="glass-card p-8">
                    <h2 className="font-display text-2xl text-white mb-6">Paiement sécurisé</h2>
                    <div className="flex items-center gap-2 text-green-400 text-xs mb-6">
                      <ShieldCheck className="w-4 h-4" />
                      Connexion SSL sécurisée
                    </div>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePlaceOrder() }}>
                      <div>
                        <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Numéro de carte</label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            className="input-gold pl-10"
                            placeholder="1234 5678 9012 3456"
                            value={payment.card}
                            onChange={(e) => setPayment({ ...payment, card: e.target.value })}
                            required maxLength={19}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Nom sur la carte</label>
                        <input className="input-gold" placeholder="SOPHIE MARTIN" value={payment.name} onChange={(e) => setPayment({ ...payment, name: e.target.value })} required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">Expiration</label>
                          <input className="input-gold" placeholder="MM/AA" value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} required />
                        </div>
                        <div>
                          <label className="text-white/60 text-xs tracking-widest uppercase block mb-1.5">CVV</label>
                          <input className="input-gold" placeholder="123" value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} required maxLength={4} />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setStep('shipping')} className="btn-ghost border border-white/20 px-6">
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button type="submit" disabled={loading} className="btn-gold flex-1">
                          {loading ? <span className="w-4 h-4 border-2 border-noir-900 border-t-transparent rounded-full animate-spin" /> : `Payer ${formatPrice(grandTotal)}`}
                        </button>
                      </div>
                    </form>
                    <p className="text-white/20 text-xs text-center mt-4">
                      Ceci est une démonstration — aucune transaction réelle n'est effectuée
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Confirmation */}
              {step === 'confirmation' && (
                <motion.div key="confirmation" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="glass-card p-12 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="w-20 h-20 bg-gold/10 border-2 border-gold flex items-center justify-center mx-auto mb-6"
                    >
                      <Check className="w-10 h-10 text-gold" />
                    </motion.div>
                    <h2 className="font-display text-3xl text-white mb-2">Commande confirmée !</h2>
                    <p className="text-gold text-sm mb-2">{orderNumber}</p>
                    <p className="text-white/50 text-sm mb-8">
                      Un email de confirmation vous a été envoyé. Votre commande sera expédiée sous 24-48h.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/compte" className="btn-gold">Suivre ma commande</Link>
                      <Link to="/boutique" className="btn-outline-gold">Continuer mes achats</Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order summary */}
          {step !== 'confirmation' && (
            <aside className="glass-card p-6 h-fit">
              <h3 className="font-display text-xl text-white mb-6">Récapitulatif</h3>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                    <div className="relative">
                      <img src={item.product.images[0]} alt="" className="w-14 h-16 object-cover" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-noir-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{item.product.name}</p>
                      <p className="text-white/40 text-xs">{item.size} · {item.color}</p>
                      <p className="text-gold text-sm">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/[0.06] pt-4 space-y-2">
                <div className="flex justify-between text-white/50 text-sm">
                  <span>Sous-total</span>
                  <span>{formatPrice(total())}</span>
                </div>
                <div className="flex justify-between text-white/50 text-sm">
                  <span>Livraison</span>
                  <span className={shippingCost === 0 ? 'text-green-400' : ''}>{shippingCost === 0 ? 'Gratuite' : formatPrice(shippingCost)}</span>
                </div>
                <div className="flex justify-between text-white font-semibold pt-2 border-t border-white/[0.06]">
                  <span>Total</span>
                  <span className="text-gold text-xl font-display">{formatPrice(grandTotal)}</span>
                </div>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
