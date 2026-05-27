import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Heart, Share2, ChevronLeft, ChevronRight, Minus, Plus, Star, Truck, Shield, RotateCcw } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { DEMO_PRODUCTS, formatPrice } from '@/lib/utils'
import { ProductCard } from '@/components/shop/ProductCard'
import toast from 'react-hot-toast'

export function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const product = DEMO_PRODUCTS.find((p) => p.slug === slug || p.id === slug) as any
  const [imgIdx, setImgIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty] = useState(1)
  const [liked, setLiked] = useState(false)
  const [tab, setTab] = useState<'desc' | 'care' | 'delivery'>('desc')
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const addNotification = useNotificationStore((s) => s.addNotification)

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-3xl text-white mb-4">Produit introuvable</p>
          <Link to="/boutique" className="btn-gold inline-flex">Retour à la boutique</Link>
        </div>
      </div>
    )
  }

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  const handleAddToCart = () => {
    if (!selectedSize) { toast.error('Veuillez choisir une taille'); return }
    if (!selectedColor) { toast.error('Veuillez choisir une couleur'); return }
    addItem(product, selectedSize, selectedColor, qty)
    openCart()
    addNotification({
      user_id: 'me',
      title: 'Ajouté au panier',
      message: `${product.name} — ${selectedSize} ${selectedColor}`,
      type: 'system',
    })
  }

  const related = DEMO_PRODUCTS.filter((p) => p.id !== product.id && p.tags?.some((t: string) => product.tags?.includes(t))).slice(0, 4) as any[]

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-white/30 text-xs">
          <Link to="/" className="hover:text-white">Accueil</Link>
          <span>/</span>
          <Link to="/boutique" className="hover:text-white">Boutique</Link>
          <span>/</span>
          <span className="text-white/60">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative overflow-hidden aspect-[3/4] bg-noir-700">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imgIdx}
                  src={product.images[imgIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>
              {product.is_new && <span className="badge-new">Nouveau</span>}
              {discount > 0 && <span className="badge-sale">-{discount}%</span>}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImgIdx((i) => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setImgIdx((i) => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`w-20 h-24 flex-shrink-0 overflow-hidden border-2 transition-all ${
                    imgIdx === i ? 'border-gold' : 'border-transparent opacity-50 hover:opacity-75'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <p className="section-subtitle text-gold mb-2">{product.tags?.[0] || 'Mode'}</p>
            <h1 className="font-display text-4xl md:text-5xl text-white leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 fill-gold text-gold" />)}
              </div>
              <span className="text-white/40 text-sm">(24 avis)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              <span className="font-display text-4xl text-gold">{formatPrice(product.price)}</span>
              {product.compare_price && (
                <span className="text-white/30 text-xl line-through">{formatPrice(product.compare_price)}</span>
              )}
              {discount > 0 && (
                <span className="bg-red-600/20 text-red-400 text-sm px-3 py-1 border border-red-500/30">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Colors */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/60 text-xs tracking-widest uppercase">Couleur</span>
                {selectedColor && <span className="text-white/80 text-sm">{selectedColor}</span>}
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c: string) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-4 py-2 text-xs border transition-all font-body ${
                      selectedColor === c
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/60 text-xs tracking-widest uppercase">Taille</span>
                <button className="text-gold/70 text-xs hover:text-gold transition-colors">Guide des tailles</button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[48px] py-2.5 px-3 text-xs border transition-all font-body text-center ${
                      selectedSize === s
                        ? 'border-gold bg-gold/10 text-gold'
                        : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + Add to cart */}
            <div className="flex gap-3 mb-6">
              <div className="flex border border-white/20">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-3 text-white text-sm flex items-center justify-center min-w-[60px]">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-gold"
              >
                <ShoppingBag className="w-4 h-4" />
                Ajouter au panier
              </button>
            </div>

            {/* Secondary actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex-1 btn-outline-gold flex items-center justify-center gap-2 py-3 ${liked ? 'text-red-400 border-red-400/50' : ''}`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-red-400' : ''}`} />
                {liked ? 'Sauvegardé' : 'Wishlist'}
              </button>
              <button className="btn-ghost border border-white/20 px-4 py-3">
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Stock */}
            {product.stock <= 5 && (
              <div className="mb-6 flex items-center gap-2 text-orange-400 text-sm">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                Plus que {product.stock} en stock
              </div>
            )}

            {/* Promises */}
            <div className="border-t border-white/[0.06] pt-6 grid grid-cols-3 gap-4">
              {[
                { Icon: Truck,     text: 'Livraison 3-5j' },
                { Icon: RotateCcw, text: 'Retours 14j' },
                { Icon: Shield,    text: 'Paiement sécurisé' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 text-center">
                  <Icon className="w-5 h-5 text-gold/60" />
                  <span className="text-white/40 text-xs">{text}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-t border-white/[0.06] mt-8 pt-6">
              <div className="flex gap-6 border-b border-white/[0.06] mb-6">
                {(['desc', 'care', 'delivery'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`pb-3 text-xs tracking-widest uppercase border-b-2 transition-all -mb-px ${
                      tab === t ? 'border-gold text-gold' : 'border-transparent text-white/40 hover:text-white'
                    }`}
                  >
                    {t === 'desc' ? 'Description' : t === 'care' ? 'Entretien' : 'Livraison'}
                  </button>
                ))}
              </div>
              <div className="text-white/50 text-sm leading-relaxed">
                {tab === 'desc' && <p>{product.description}</p>}
                {tab === 'care' && (
                  <ul className="space-y-1">
                    <li>• Lavage en machine à 30°C, programme délicat</li>
                    <li>• Ne pas utiliser de sèche-linge</li>
                    <li>• Repassage sur l'envers à basse température</li>
                    <li>• Nettoyage à sec recommandé pour pièces délicates</li>
                  </ul>
                )}
                {tab === 'delivery' && (
                  <ul className="space-y-1">
                    <li>• Livraison standard : 3-5 jours ouvrés</li>
                    <li>• Livraison express : 24-48h (+9,90€)</li>
                    <li>• Livraison gratuite dès 150€ d'achat</li>
                    <li>• Retours gratuits sous 14 jours</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display text-3xl text-white mb-2 text-center">Vous pourriez aussi aimer</h2>
            <div className="gold-divider mb-12" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
