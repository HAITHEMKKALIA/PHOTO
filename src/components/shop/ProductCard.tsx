import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Eye } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [liked, setLiked] = useState(false)
  const [imgIdx, setImgIdx] = useState(0)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const size = product.sizes[0] || 'Unique'
    const color = product.colors[0] || 'Noir'
    addItem(product, size, color)
    openCart()
  }

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative"
      onMouseEnter={() => { setHovered(true); setImgIdx(1) }}
      onMouseLeave={() => { setHovered(false); setImgIdx(0) }}
    >
      <Link to={`/produit/${product.slug || product.id}`}>
        {/* Image container */}
        <div className="relative overflow-hidden bg-noir-700 aspect-[3/4]">
          {/* Main image */}
          <motion.img
            src={product.images[imgIdx] || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Badges */}
          {product.is_new && (
            <span className="badge-new">Nouveau</span>
          )}
          {discount > 0 && (
            <span className="badge-sale">-{discount}%</span>
          )}

          {/* Actions */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: hovered ? 0 : 20, opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={handleQuickAdd}
              className="btn-gold w-full py-2.5 text-[11px]"
            >
              <ShoppingBag className="w-4 h-4" />
              Ajouter au panier
            </button>
            <Link
              to={`/produit/${product.slug || product.id}`}
              className="btn-outline-gold w-full py-2.5 text-[11px] text-center bg-black/50 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Eye className="w-4 h-4" />
              Voir le produit
            </Link>
          </motion.div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
            className="absolute top-3 right-3 z-10 p-2 bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-all"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${liked ? 'fill-red-400 text-red-400' : 'text-white/70'}`}
            />
          </button>

          {/* Image dots */}
          {product.images.length > 1 && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {product.images.slice(0, 3).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setImgIdx(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    imgIdx === i ? 'bg-gold' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pt-4 pb-2">
          <p className="text-white/40 text-[10px] tracking-widest uppercase mb-1">
            {product.tags?.[0] || 'Mode'}
          </p>
          <h3 className="font-display text-white text-lg leading-tight mb-2 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="price-tag">{formatPrice(product.price)}</span>
            {product.compare_price && (
              <span className="text-white/30 text-sm line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
          {/* Size pills */}
          <div className="flex gap-1 mt-2 flex-wrap">
            {product.sizes.slice(0, 4).map((size) => (
              <span
                key={size}
                className="text-white/30 text-[10px] border border-white/10 px-1.5 py-0.5"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-white/30 text-[10px]">+{product.sizes.length - 4}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
