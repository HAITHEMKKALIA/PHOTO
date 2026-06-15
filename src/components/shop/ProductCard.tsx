import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Zap } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [hovered, setHovered]  = useState(false)
  const [liked, setLiked]      = useState(false)
  const [imgIdx, setImgIdx]    = useState(0)
  const [ripple, setRipple]    = useState<{ x: number; y: number } | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  // 3D tilt
  const onMove = (e: React.MouseEvent) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    el.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`
  }
  const onLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = ''
  }

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Ripple
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setTimeout(() => setRipple(null), 600)
    addItem(product, product.sizes[0] || 'Unique', product.colors[0] || 'Noir')
    openCart()
  }

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
      onMouseEnter={() => { setHovered(true); setImgIdx(1) }}
      onMouseLeave={() => { setHovered(false); setImgIdx(0) }}
    >
      <div
        ref={cardRef}
        className="transition-transform duration-300 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <Link to={`/produit/${product.slug || product.id}`}>
          {/* Image */}
          <div className="relative overflow-hidden bg-noir-700 aspect-[3/4]">
            {/* Images */}
            <motion.img
              src={product.images[imgIdx] ?? product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              animate={{ scale: hovered ? 1.06 : 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              loading="lazy"
            />

            {/* Dark overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-black/50"
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Badges */}
            {product.is_new && <span className="badge-new">Nouveau</span>}
            {discount > 0 && <span className="badge-sale">-{discount}%</span>}

            {/* Wishlist */}
            <button
              onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
              className="absolute top-3 right-3 z-10 w-9 h-9 bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-all"
            >
              <Heart className={`w-4 h-4 transition-all ${liked ? 'fill-red-400 text-red-400 scale-110' : 'text-white/70'}`} />
            </button>

            {/* Gloss reflection */}
            {hovered && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)',
                  transform: 'translateZ(10px)',
                }}
              />
            )}

            {/* Actions */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 space-y-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: hovered ? 0 : 20, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                onClick={handleQuickAdd}
                className="relative w-full btn-gold py-2.5 text-[11px] overflow-hidden group/btn"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Ajouter
                </span>
                {ripple && (
                  <span
                    className="absolute rounded-full bg-white/30 animate-ping"
                    style={{ left: ripple.x - 20, top: ripple.y - 20, width: 40, height: 40 }}
                  />
                )}
              </button>
              <button className="w-full text-[10px] text-white/50 hover:text-white transition-colors tracking-widest uppercase flex items-center justify-center gap-1">
                <Zap className="w-3 h-3" />
                Aperçu rapide
              </button>
            </motion.div>

            {/* Image dots */}
            {product.images.length > 1 && hovered && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                {product.images.slice(0, 3).map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.preventDefault(); setImgIdx(i) }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${imgIdx === i ? 'bg-gold scale-125' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pt-4">
            <p className="text-white/30 text-[9px] tracking-[0.3em] uppercase mb-1">
              {product.tags?.[0] ?? 'Mode'}
            </p>
            <h3 className="font-display text-white text-base leading-tight mb-2 group-hover:text-gold transition-colors duration-300">
              {product.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="price-tag text-base">{formatPrice(product.price)}</span>
                {product.compare_price && (
                  <span className="text-white/25 text-sm line-through">{formatPrice(product.compare_price)}</span>
                )}
              </div>
              <div className="flex gap-1">
                {product.colors.slice(0, 3).map((c) => (
                  <span key={c} className="text-[9px] text-white/20 border border-white/10 px-1 py-0.5">{c}</span>
                ))}
              </div>
            </div>

            {/* Sizes strip */}
            <motion.div
              className="flex gap-1 mt-2 overflow-hidden"
              animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {product.sizes.slice(0, 5).map((s) => (
                <span key={s} className="text-[9px] text-white/30 border border-white/10 px-1.5 py-0.5 hover:border-gold/50 hover:text-gold cursor-pointer transition-all">
                  {s}
                </span>
              ))}
            </motion.div>
          </div>
        </Link>
      </div>
    </motion.div>
  )
}
