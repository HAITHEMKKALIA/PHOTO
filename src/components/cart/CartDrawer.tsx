import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-80 bg-black/70 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 bottom-0 z-90 w-full max-w-md bg-noir-700 border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <span className="font-display text-xl text-white">Mon Panier</span>
                {items.length > 0 && (
                  <span className="bg-gold text-noir-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    {items.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-white/40 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-6 px-6"
                  >
                    <div className="w-20 h-20 border border-white/10 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-white/20" />
                    </div>
                    <div className="text-center">
                      <p className="font-display text-xl text-white mb-2">Panier vide</p>
                      <p className="text-white/40 text-sm">Découvrez nos collections exclusives</p>
                    </div>
                    <Link to="/boutique" onClick={closeCart} className="btn-gold">
                      Explorer la boutique
                    </Link>
                  </motion.div>
                ) : (
                  <div className="py-4">
                    {items.map((item, idx) => (
                      <motion.div
                        key={`${item.product.id}-${item.size}-${item.color}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex gap-4 px-6 py-4 border-b border-white/[0.06] hover:bg-white/[0.02] transition-colors"
                      >
                        <Link
                          to={`/produit/${item.product.slug || item.product.id}`}
                          onClick={closeCart}
                          className="w-20 h-24 flex-shrink-0 overflow-hidden bg-noir-600"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/produit/${item.product.slug || item.product.id}`}
                            onClick={closeCart}
                            className="font-display text-white hover:text-gold transition-colors text-sm leading-snug block mb-1"
                          >
                            {item.product.name}
                          </Link>
                          <div className="flex gap-2 text-white/40 text-xs mb-3">
                            <span>{item.size}</span>
                            <span>·</span>
                            <span>{item.color}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            {/* Qty */}
                            <div className="flex items-center gap-2 border border-white/20">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                                className="p-1.5 hover:bg-white/10 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-white text-sm w-6 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                                className="p-1.5 hover:bg-white/10 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-gold font-semibold text-sm">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                              <button
                                onClick={() => removeItem(item.product.id, item.size, item.color)}
                                className="text-white/30 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-white/50 text-sm">
                    <span>Sous-total</span>
                    <span>{formatPrice(total())}</span>
                  </div>
                  <div className="flex justify-between text-white/50 text-sm">
                    <span>Livraison</span>
                    <span className="text-green-400">Gratuite dès 150€</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold pt-2 border-t border-white/10">
                    <span className="font-display">Total</span>
                    <span className="text-gold text-lg">{formatPrice(total())}</span>
                  </div>
                </div>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn-gold w-full group"
                >
                  Commander
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/boutique"
                  onClick={closeCart}
                  className="block text-center text-white/40 hover:text-white text-sm transition-colors"
                >
                  Continuer mes achats
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
